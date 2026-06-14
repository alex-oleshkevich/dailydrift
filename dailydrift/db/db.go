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
	"github.com/georgysavva/scany/v2/sqlscan"
	sqlite "modernc.org/sqlite"
)

var Builder = sq.StatementBuilder.PlaceholderFormat(sq.Question)

type DBTX interface {
	ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error)
	QueryContext(ctx context.Context, query string, args ...any) (*sql.Rows, error)
	QueryRowContext(ctx context.Context, query string, args ...any) *sql.Row
	PrepareContext(ctx context.Context, query string) (*sql.Stmt, error)
	ExecStmtContext(ctx context.Context, stmt sq.Sqlizer) (sql.Result, error)
	QueryStmtContext(ctx context.Context, stmt sq.Sqlizer) (*sql.Rows, error)
	QueryRowStmtContext(ctx context.Context, stmt sq.Sqlizer) (*sql.Row, error)
	PrepareStmtContext(ctx context.Context, stmt sq.Sqlizer) (*sql.Stmt, error)
	Exec(ctx context.Context, stmt sq.Sqlizer) (sql.Result, error)
	FindAll(ctx context.Context, dst any, stmt sq.Sqlizer) error
	FindOne(ctx context.Context, dst any, stmt sq.Sqlizer) error
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

func (c *connector) Connect(ctx context.Context) (driver.Conn, error) {
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
		if _, err := ec.ExecContext(ctx, p, nil); err != nil {
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
	if werr != nil && rerr != nil {
		return fmt.Errorf("db.Close: %w", errors.Join(werr, rerr))
	}
	if werr != nil {
		return fmt.Errorf("db.Close writer: %w", werr)
	}
	if rerr != nil {
		return fmt.Errorf("db.Close reader: %w", rerr)
	}
	slog.Debug("db closed", "dsn", d.dsn)
	return nil
}

func (d *DB) ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error) {
	return d.writer.ExecContext(ctx, query, args...)
}

func (d *DB) QueryContext(ctx context.Context, query string, args ...any) (*sql.Rows, error) {
	return d.reader.QueryContext(ctx, query, args...)
}

func (d *DB) QueryRowContext(ctx context.Context, query string, args ...any) *sql.Row {
	return d.reader.QueryRowContext(ctx, query, args...)
}

func (d *DB) PrepareContext(ctx context.Context, query string) (*sql.Stmt, error) {
	return d.writer.PrepareContext(ctx, query)
}

func (d *DB) ExecStmtContext(ctx context.Context, stmt sq.Sqlizer) (sql.Result, error) {
	q, args, err := stmt.ToSql()
	if err != nil {
		return nil, fmt.Errorf("db.ExecStmtContext build: %w", err)
	}
	res, err := d.writer.ExecContext(ctx, q, args...)
	if err != nil {
		return nil, fmt.Errorf("db.ExecStmtContext: %w", err)
	}
	return res, nil
}

func (d *DB) QueryStmtContext(ctx context.Context, stmt sq.Sqlizer) (*sql.Rows, error) {
	q, args, err := stmt.ToSql()
	if err != nil {
		return nil, fmt.Errorf("db.QueryStmtContext build: %w", err)
	}
	rows, err := d.reader.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, fmt.Errorf("db.QueryStmtContext: %w", err)
	}
	return rows, nil
}

func (d *DB) QueryRowStmtContext(ctx context.Context, stmt sq.Sqlizer) (*sql.Row, error) {
	q, args, err := stmt.ToSql()
	if err != nil {
		return nil, fmt.Errorf("db.QueryRowStmtContext build: %w", err)
	}
	return d.reader.QueryRowContext(ctx, q, args...), nil
}

func (d *DB) PrepareStmtContext(ctx context.Context, stmt sq.Sqlizer) (*sql.Stmt, error) {
	q, _, err := stmt.ToSql()
	if err != nil {
		return nil, fmt.Errorf("db.PrepareStmtContext build: %w", err)
	}
	s, err := d.writer.PrepareContext(ctx, q)
	if err != nil {
		return nil, fmt.Errorf("db.PrepareStmtContext: %w", err)
	}
	return s, nil
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

func (d *DB) FindAll(ctx context.Context, dst any, stmt sq.Sqlizer) error {
	q, args, err := stmt.ToSql()
	if err != nil {
		return fmt.Errorf("db.FindAll build: %w", err)
	}
	rows, err := d.reader.QueryContext(ctx, q, args...)
	if err != nil {
		return fmt.Errorf("db.FindAll: %w", err)
	}
	if err := sqlscan.ScanAll(dst, rows); err != nil {
		return fmt.Errorf("db.FindAll scan: %w", err)
	}
	return nil
}

func (d *DB) FindOne(ctx context.Context, dst any, stmt sq.Sqlizer) error {
	q, args, err := stmt.ToSql()
	if err != nil {
		return fmt.Errorf("db.FindOne build: %w", err)
	}
	rows, err := d.reader.QueryContext(ctx, q, args...)
	if err != nil {
		return fmt.Errorf("db.FindOne: %w", err)
	}
	if err := sqlscan.ScanOne(dst, rows); err != nil {
		return fmt.Errorf("db.FindOne scan: %w", err)
	}
	return nil
}

func (d *DB) RunInTx(ctx context.Context, fn func(*Tx) error) error {
	tx, err := d.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	if err := fn(tx); err != nil {
		return err
	}
	return tx.Commit()
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

func (t *Tx) ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error) {
	return t.raw.ExecContext(ctx, query, args...)
}

func (t *Tx) QueryContext(ctx context.Context, query string, args ...any) (*sql.Rows, error) {
	return t.raw.QueryContext(ctx, query, args...)
}

func (t *Tx) QueryRowContext(ctx context.Context, query string, args ...any) *sql.Row {
	return t.raw.QueryRowContext(ctx, query, args...)
}

func (t *Tx) PrepareContext(ctx context.Context, query string) (*sql.Stmt, error) {
	return t.raw.PrepareContext(ctx, query)
}

func (t *Tx) ExecStmtContext(ctx context.Context, stmt sq.Sqlizer) (sql.Result, error) {
	q, args, err := stmt.ToSql()
	if err != nil {
		return nil, fmt.Errorf("tx.ExecStmtContext build: %w", err)
	}
	res, err := t.raw.ExecContext(ctx, q, args...)
	if err != nil {
		return nil, fmt.Errorf("tx.ExecStmtContext: %w", err)
	}
	return res, nil
}

func (t *Tx) QueryStmtContext(ctx context.Context, stmt sq.Sqlizer) (*sql.Rows, error) {
	q, args, err := stmt.ToSql()
	if err != nil {
		return nil, fmt.Errorf("tx.QueryStmtContext build: %w", err)
	}
	rows, err := t.raw.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, fmt.Errorf("tx.QueryStmtContext: %w", err)
	}
	return rows, nil
}

func (t *Tx) QueryRowStmtContext(ctx context.Context, stmt sq.Sqlizer) (*sql.Row, error) {
	q, args, err := stmt.ToSql()
	if err != nil {
		return nil, fmt.Errorf("tx.QueryRowStmtContext build: %w", err)
	}
	return t.raw.QueryRowContext(ctx, q, args...), nil
}

func (t *Tx) PrepareStmtContext(ctx context.Context, stmt sq.Sqlizer) (*sql.Stmt, error) {
	q, _, err := stmt.ToSql()
	if err != nil {
		return nil, fmt.Errorf("tx.PrepareStmtContext build: %w", err)
	}
	s, err := t.raw.PrepareContext(ctx, q)
	if err != nil {
		return nil, fmt.Errorf("tx.PrepareStmtContext: %w", err)
	}
	return s, nil
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

func (t *Tx) FindAll(ctx context.Context, dst any, stmt sq.Sqlizer) error {
	q, args, err := stmt.ToSql()
	if err != nil {
		return fmt.Errorf("tx.FindAll build: %w", err)
	}
	rows, err := t.raw.QueryContext(ctx, q, args...)
	if err != nil {
		return fmt.Errorf("tx.FindAll: %w", err)
	}
	if err := sqlscan.ScanAll(dst, rows); err != nil {
		return fmt.Errorf("tx.FindAll scan: %w", err)
	}
	return nil
}

func (t *Tx) FindOne(ctx context.Context, dst any, stmt sq.Sqlizer) error {
	q, args, err := stmt.ToSql()
	if err != nil {
		return fmt.Errorf("tx.FindOne build: %w", err)
	}
	rows, err := t.raw.QueryContext(ctx, q, args...)
	if err != nil {
		return fmt.Errorf("tx.FindOne: %w", err)
	}
	if err := sqlscan.ScanOne(dst, rows); err != nil {
		return fmt.Errorf("tx.FindOne scan: %w", err)
	}
	return nil
}

func IsNotFound(err error) bool {
	return sqlscan.NotFound(err)
}
