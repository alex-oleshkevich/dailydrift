package db_test

import (
	"context"
	"errors"
	"path/filepath"
	"testing"

	sq "github.com/Masterminds/squirrel"
	"github.com/starfrontventures/dailydrift/dailydrift/db"
)

const schema = `CREATE TABLE widgets (
	id   TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	qty  INTEGER NOT NULL DEFAULT 0
)`

type widget struct {
	ID   string `db:"id"`
	Name string `db:"name"`
	Qty  int    `db:"qty"`
}

func openDB(t *testing.T) *db.DB {
	t.Helper()
	d, err := db.Open(filepath.Join(t.TempDir(), "test.db"))
	if err != nil {
		t.Fatalf("Open: %v", err)
	}
	t.Cleanup(func() { d.Close() })
	return d
}

func setup(t *testing.T) (context.Context, *db.DB) {
	t.Helper()
	ctx := context.Background()
	d := openDB(t)
	if _, err := d.Exec(ctx, sq.Expr(schema)); err != nil {
		t.Fatalf("create table: %v", err)
	}
	return ctx, d
}

func insertRow(t *testing.T, ctx context.Context, d *db.DB, id, name string, qty int) {
	t.Helper()
	stmt := db.Builder.Insert("widgets").Columns("id", "name", "qty").Values(id, name, qty)
	if _, err := d.Exec(ctx, stmt); err != nil {
		t.Fatalf("insert %q: %v", id, err)
	}
}

func countRows(t *testing.T, ctx context.Context, d *db.DB) int {
	t.Helper()
	var row struct {
		N int `db:"n"`
	}
	if err := d.FindOne(ctx, &row, db.Builder.Select("COUNT(*) AS n").From("widgets")); err != nil {
		t.Fatalf("count: %v", err)
	}
	return row.N
}

func TestOpen(t *testing.T) {
	openDB(t)
}

func TestDB_Exec(t *testing.T) {
	ctx, d := setup(t)
	if _, err := d.Exec(ctx, sq.Expr("INSERT INTO widgets (id, name) VALUES ('w1', 'bolt')")); err != nil {
		t.Fatalf("Exec: %v", err)
	}
	if n := countRows(t, ctx, d); n != 1 {
		t.Errorf("got %d rows, want 1", n)
	}
}

func TestDB_FindOne(t *testing.T) {
	ctx, d := setup(t)
	insertRow(t, ctx, d, "w1", "sprocket", 10)

	var w widget
	if err := d.FindOne(ctx, &w, db.Builder.Select("id", "name", "qty").From("widgets").Where(sq.Eq{"id": "w1"})); err != nil {
		t.Fatalf("FindOne: %v", err)
	}
	if w.Name != "sprocket" || w.Qty != 10 {
		t.Errorf("got (%q, %d), want (sprocket, 10)", w.Name, w.Qty)
	}
}

func TestDB_FindOne_NotFound(t *testing.T) {
	ctx, d := setup(t)
	var w widget
	err := d.FindOne(ctx, &w, db.Builder.Select("id", "name", "qty").From("widgets").Where(sq.Eq{"id": "nope"}))
	if !db.IsNotFound(err) {
		t.Errorf("got %v, want not-found error", err)
	}
}

func TestDB_FindAll(t *testing.T) {
	ctx, d := setup(t)
	insertRow(t, ctx, d, "w1", "a", 1)
	insertRow(t, ctx, d, "w2", "b", 2)
	insertRow(t, ctx, d, "w3", "c", 3)

	var widgets []widget
	if err := d.FindAll(ctx, &widgets, db.Builder.Select("id", "name", "qty").From("widgets").OrderBy("id")); err != nil {
		t.Fatalf("FindAll: %v", err)
	}
	if len(widgets) != 3 || widgets[0].ID != "w1" || widgets[2].ID != "w3" {
		t.Errorf("got %v, want [w1 w2 w3]", widgets)
	}
}

func TestDB_FindAll_Empty(t *testing.T) {
	ctx, d := setup(t)
	var widgets []widget
	if err := d.FindAll(ctx, &widgets, db.Builder.Select("id", "name", "qty").From("widgets")); err != nil {
		t.Fatalf("FindAll: %v", err)
	}
	if len(widgets) != 0 {
		t.Errorf("expected no rows, got %d", len(widgets))
	}
}

func TestDB_RunInTx_Commit(t *testing.T) {
	ctx, d := setup(t)
	err := d.RunInTx(ctx, func(tx *db.Tx) error {
		_, err := tx.Exec(ctx, db.Builder.Insert("widgets").Columns("id", "name").Values("w1", "bolt"))
		return err
	})
	if err != nil {
		t.Fatalf("RunInTx: %v", err)
	}
	if n := countRows(t, ctx, d); n != 1 {
		t.Errorf("got %d rows after commit, want 1", n)
	}
}

func TestDB_RunInTx_Rollback(t *testing.T) {
	ctx, d := setup(t)
	insertRow(t, ctx, d, "w1", "sprocket", 10)

	_ = d.RunInTx(ctx, func(tx *db.Tx) error {
		if _, err := tx.Exec(ctx, db.Builder.Insert("widgets").Columns("id", "name").Values("w2", "bolt")); err != nil {
			return err
		}
		return errors.New("forced rollback")
	})

	if n := countRows(t, ctx, d); n != 1 {
		t.Errorf("got %d rows after rollback, want 1", n)
	}
}

func TestDB_ExecContext(t *testing.T) {
	ctx, d := setup(t)
	if _, err := d.ExecContext(ctx, "INSERT INTO widgets (id, name) VALUES (?, ?)", "w1", "bolt"); err != nil {
		t.Fatalf("ExecContext: %v", err)
	}
	if n := countRows(t, ctx, d); n != 1 {
		t.Errorf("got %d rows, want 1", n)
	}
}

func TestDB_QueryContext(t *testing.T) {
	ctx, d := setup(t)
	insertRow(t, ctx, d, "w1", "sprocket", 10)

	rows, err := d.QueryContext(ctx, "SELECT name, qty FROM widgets WHERE id = ?", "w1")
	if err != nil {
		t.Fatalf("QueryContext: %v", err)
	}
	defer rows.Close()
	if !rows.Next() {
		t.Fatal("expected one row")
	}
	var name string
	var qty int
	if err := rows.Scan(&name, &qty); err != nil {
		t.Fatalf("Scan: %v", err)
	}
	if name != "sprocket" || qty != 10 {
		t.Errorf("got (%q, %d), want (sprocket, 10)", name, qty)
	}
}

func TestDB_QueryRowContext(t *testing.T) {
	ctx, d := setup(t)
	insertRow(t, ctx, d, "w1", "sprocket", 10)

	var qty int
	if err := d.QueryRowContext(ctx, "SELECT qty FROM widgets WHERE id = ?", "w1").Scan(&qty); err != nil {
		t.Fatalf("QueryRowContext: %v", err)
	}
	if qty != 10 {
		t.Errorf("got qty %d, want 10", qty)
	}
}

func TestDB_PrepareContext(t *testing.T) {
	ctx, d := setup(t)
	stmt, err := d.PrepareContext(ctx, "INSERT INTO widgets (id, name) VALUES (?, ?)")
	if err != nil {
		t.Fatalf("PrepareContext: %v", err)
	}
	defer stmt.Close()
	if _, err := stmt.ExecContext(ctx, "w1", "bolt"); err != nil {
		t.Fatalf("stmt.ExecContext: %v", err)
	}
	if n := countRows(t, ctx, d); n != 1 {
		t.Errorf("got %d rows, want 1", n)
	}
}

func TestTx_ImplementsDBTX(t *testing.T) {
	ctx, d := setup(t)
	tx, err := d.Begin(ctx)
	if err != nil {
		t.Fatalf("Begin: %v", err)
	}
	defer tx.Rollback()

	var _ db.DBTX = tx
}
