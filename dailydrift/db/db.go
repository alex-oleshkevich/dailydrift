package db

import (
	"context"
	"database/sql"
	"database/sql/driver"
	"errors"
	"fmt"
	"log/slog"
	"runtime"

	sq "github.com/Masterminds/squirrel"
	sqlite "modernc.org/sqlite"
)

var Builder = sq.StatementBuilder.PlaceholderFormat(sq.Question)

type DBTX interface {
	Exec(ctx context.Context, stmt sq.Sqlizer) (sql.Result, error)
	FindAll(ctx context.Context, stmt sq.Sqlizer) (*sql.Rows, error)
	FindOne(ctx context.Context, stmt sq.Sqlizer) (*sql.Row, error)
	Delete(ctx context.Context, stmt sq.Sqlizer) error
	DeleteBy(ctx context.Context, table, column string, value any) error
	Insert(ctx context.Context, stmt sq.InsertBuilder) (sql.Result, error)
	InsertMany(ctx context.Context, stmts []sq.InsertBuilder) error
	Update(ctx context.Context, stmt sq.Sqlizer) (sql.Result, error)
}

type DB struct {
	dsn    string
	writer *sql.DB // max 1 conn — serialises writes
	reader *sql.DB // N conns   — concurrent reads (WAL-safe)
}

// connector applies pragmas to every new connection, not just the first.
type connector struct {
	dsn     string
	pragmas []string
}

func (c *connector) Connect(_ context.Context) (driver.Conn, error) {
	conn, err := (&sqlite.Driver{}).Open(c.dsn)
	if err != nil {
		return nil, fmt.Errorf("connector: %w", err)
	}
	ec, ok := conn.(driver.ExecerContext)
	if !ok {
		conn.Close()
		return nil, fmt.Errorf("connector: sqlite driver does not implement ExecerContext")
	}
	for _, p := range c.pragmas {
		if _, err := ec.ExecContext(context.Background(), p, nil); err != nil {
			conn.Close()
			return nil, fmt.Errorf("pragma %q: %w", p, err)
		}
	}
	return conn, nil
}

func (c *connector) Driver() driver.Driver { return &sqlite.Driver{} }

var writerPragmas = []string{
	"PRAGMA journal_mode=WAL",    // enables concurrent reader/writer
	"PRAGMA synchronous=NORMAL",  // safe with WAL; skips redundant full-fsync
	"PRAGMA foreign_keys=ON",     // enforce FK constraints
	"PRAGMA busy_timeout=5000",   // wait up to 5 s instead of SQLITE_BUSY
	"PRAGMA cache_size=-32000",   // 32 MB page cache (negative = KiB)
	"PRAGMA temp_store=MEMORY",   // temp tables and indices in RAM
	"PRAGMA mmap_size=134217728", // 128 MB memory-mapped I/O
}

var readerPragmas = []string{
	"PRAGMA busy_timeout=5000",
	"PRAGMA cache_size=-32000",
	"PRAGMA temp_store=MEMORY",
	"PRAGMA mmap_size=134217728",
}

func open(dsn string, pragmas []string, maxConns int) (*sql.DB, error) {
	db := sql.OpenDB(&connector{dsn: dsn, pragmas: pragmas})
	db.SetMaxOpenConns(maxConns)
	db.SetMaxIdleConns(maxConns)
	if err := db.Ping(); err != nil {
		db.Close()
		return nil, fmt.Errorf("db.Ping: %w", err)
	}
	return db, nil
}

func Open(dsn string) (*DB, error) {
	writer, err := open(dsn, writerPragmas, 1)
	if err != nil {
		return nil, fmt.Errorf("db.Open writer: %w", err)
	}
	reader, err := open(dsn, readerPragmas, runtime.NumCPU())
	if err != nil {
		writer.Close()
		return nil, fmt.Errorf("db.Open reader: %w", err)
	}
	slog.Debug("db opened", "dsn", dsn)
	return &DB{dsn: dsn, writer: writer, reader: reader}, nil
}

func (d *DB) Close() error {
	werr := d.writer.Close()
	rerr := d.reader.Close()
	if werr != nil {
		return fmt.Errorf("db.Close writer: %w", werr)
	}
	if rerr != nil {
		return fmt.Errorf("db.Close reader: %w", rerr)
	}
	slog.Debug("db closed", "dsn", d.dsn)
	return nil
}

func (d *DB) Exec(ctx context.Context, stmt sq.Sqlizer) (sql.Result, error) {
	q, args, err := stmt.ToSql()
	if err != nil {
		return nil, fmt.Errorf("db.Exec build: %w", err)
	}
	res, err := d.writer.ExecContext(ctx, q, args...)
	if err != nil {
		return nil, fmt.Errorf("db.Exec: %w", err)
	}
	return res, nil
}

func (d *DB) FindAll(ctx context.Context, stmt sq.Sqlizer) (*sql.Rows, error) {
	q, args, err := stmt.ToSql()
	if err != nil {
		return nil, fmt.Errorf("db.FindAll build: %w", err)
	}
	rows, err := d.reader.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, fmt.Errorf("db.FindAll: %w", err)
	}
	return rows, nil
}

func (d *DB) FindOne(ctx context.Context, stmt sq.Sqlizer) (*sql.Row, error) {
	q, args, err := stmt.ToSql()
	if err != nil {
		return nil, fmt.Errorf("db.FindOne build: %w", err)
	}
	return d.reader.QueryRowContext(ctx, q, args...), nil
}

func (d *DB) Delete(ctx context.Context, stmt sq.Sqlizer) error {
	_, err := d.Exec(ctx, stmt)
	return err
}

func (d *DB) DeleteBy(ctx context.Context, table, column string, value any) error {
	if err := d.Delete(ctx, Builder.Delete(table).Where(sq.Eq{column: value})); err != nil {
		return fmt.Errorf("db.DeleteBy %s.%s: %w", table, column, err)
	}
	return nil
}

func (d *DB) Insert(ctx context.Context, stmt sq.InsertBuilder) (sql.Result, error) {
	return d.Exec(ctx, stmt)
}

// InsertMany executes all inserts atomically inside an implicit transaction.
func (d *DB) InsertMany(ctx context.Context, stmts []sq.InsertBuilder) error {
	tx, err := d.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	for i, stmt := range stmts {
		if _, err := tx.Insert(ctx, stmt); err != nil {
			return fmt.Errorf("db.InsertMany[%d]: %w", i, err)
		}
	}
	return tx.Commit()
}

func (d *DB) Update(ctx context.Context, stmt sq.Sqlizer) (sql.Result, error) {
	return d.Exec(ctx, stmt)
}

// Tx wraps *sql.Tx and implements DBTX.
type Tx struct {
	raw *sql.Tx
}

func (d *DB) Begin(ctx context.Context) (*Tx, error) {
	tx, err := d.writer.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("db.Begin: %w", err)
	}
	return &Tx{raw: tx}, nil
}

func (t *Tx) Commit() error {
	if err := t.raw.Commit(); err != nil {
		return fmt.Errorf("tx.Commit: %w", err)
	}
	return nil
}

// Rollback rolls back the transaction. sql.ErrTxDone is silently ignored so
// that deferred Rollback calls are safe after a successful Commit.
func (t *Tx) Rollback() error {
	if err := t.raw.Rollback(); err != nil && !errors.Is(err, sql.ErrTxDone) {
		return fmt.Errorf("tx.Rollback: %w", err)
	}
	return nil
}

func (t *Tx) Exec(ctx context.Context, stmt sq.Sqlizer) (sql.Result, error) {
	q, args, err := stmt.ToSql()
	if err != nil {
		return nil, fmt.Errorf("tx.Exec build: %w", err)
	}
	res, err := t.raw.ExecContext(ctx, q, args...)
	if err != nil {
		return nil, fmt.Errorf("tx.Exec: %w", err)
	}
	return res, nil
}

func (t *Tx) FindAll(ctx context.Context, stmt sq.Sqlizer) (*sql.Rows, error) {
	q, args, err := stmt.ToSql()
	if err != nil {
		return nil, fmt.Errorf("tx.FindAll build: %w", err)
	}
	rows, err := t.raw.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, fmt.Errorf("tx.FindAll: %w", err)
	}
	return rows, nil
}

func (t *Tx) FindOne(ctx context.Context, stmt sq.Sqlizer) (*sql.Row, error) {
	q, args, err := stmt.ToSql()
	if err != nil {
		return nil, fmt.Errorf("tx.FindOne build: %w", err)
	}
	return t.raw.QueryRowContext(ctx, q, args...), nil
}

func (t *Tx) Delete(ctx context.Context, stmt sq.Sqlizer) error {
	_, err := t.Exec(ctx, stmt)
	return err
}

func (t *Tx) DeleteBy(ctx context.Context, table, column string, value any) error {
	if err := t.Delete(ctx, Builder.Delete(table).Where(sq.Eq{column: value})); err != nil {
		return fmt.Errorf("tx.DeleteBy %s.%s: %w", table, column, err)
	}
	return nil
}

func (t *Tx) Insert(ctx context.Context, stmt sq.InsertBuilder) (sql.Result, error) {
	return t.Exec(ctx, stmt)
}

func (t *Tx) InsertMany(ctx context.Context, stmts []sq.InsertBuilder) error {
	for i, stmt := range stmts {
		if _, err := t.Insert(ctx, stmt); err != nil {
			return fmt.Errorf("tx.InsertMany[%d]: %w", i, err)
		}
	}
	return nil
}

func (t *Tx) Update(ctx context.Context, stmt sq.Sqlizer) (sql.Result, error) {
	return t.Exec(ctx, stmt)
}
