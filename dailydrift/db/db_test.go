package db_test

import (
	"context"
	"database/sql"
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
	_, err := d.Insert(ctx, db.Builder.Insert("widgets").
		Columns("id", "name", "qty").Values(id, name, qty))
	if err != nil {
		t.Fatalf("insert %q: %v", id, err)
	}
}

func countRows(t *testing.T, ctx context.Context, d *db.DB) int {
	t.Helper()
	row, err := d.FindOne(ctx, db.Builder.Select("COUNT(*)").From("widgets"))
	if err != nil {
		t.Fatalf("count: %v", err)
	}
	var n int
	if err := row.Scan(&n); err != nil {
		t.Fatalf("count scan: %v", err)
	}
	return n
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

func TestDB_Insert(t *testing.T) {
	ctx, d := setup(t)
	insertRow(t, ctx, d, "w1", "sprocket", 10)
	if n := countRows(t, ctx, d); n != 1 {
		t.Errorf("got %d rows, want 1", n)
	}
}

func TestDB_InsertMany(t *testing.T) {
	ctx, d := setup(t)
	stmts := []sq.InsertBuilder{
		db.Builder.Insert("widgets").Columns("id", "name", "qty").Values("w1", "a", 1),
		db.Builder.Insert("widgets").Columns("id", "name", "qty").Values("w2", "b", 2),
		db.Builder.Insert("widgets").Columns("id", "name", "qty").Values("w3", "c", 3),
	}
	if err := d.InsertMany(ctx, stmts); err != nil {
		t.Fatalf("InsertMany: %v", err)
	}
	if n := countRows(t, ctx, d); n != 3 {
		t.Errorf("got %d rows, want 3", n)
	}
}

func TestDB_FindOne(t *testing.T) {
	ctx, d := setup(t)
	insertRow(t, ctx, d, "w1", "sprocket", 10)

	row, err := d.FindOne(ctx, db.Builder.Select("name", "qty").From("widgets").Where(sq.Eq{"id": "w1"}))
	if err != nil {
		t.Fatalf("FindOne: %v", err)
	}
	var name string
	var qty int
	if err := row.Scan(&name, &qty); err != nil {
		t.Fatalf("Scan: %v", err)
	}
	if name != "sprocket" || qty != 10 {
		t.Errorf("got (%q, %d), want (sprocket, 10)", name, qty)
	}
}

func TestDB_FindOne_NotFound(t *testing.T) {
	ctx, d := setup(t)
	row, err := d.FindOne(ctx, db.Builder.Select("name").From("widgets").Where(sq.Eq{"id": "nope"}))
	if err != nil {
		t.Fatalf("FindOne: %v", err)
	}
	if err := row.Scan(new(string)); !errors.Is(err, sql.ErrNoRows) {
		t.Errorf("got %v, want sql.ErrNoRows", err)
	}
}

func TestDB_FindAll(t *testing.T) {
	ctx, d := setup(t)
	insertRow(t, ctx, d, "w1", "a", 1)
	insertRow(t, ctx, d, "w2", "b", 2)
	insertRow(t, ctx, d, "w3", "c", 3)

	rows, err := d.FindAll(ctx, db.Builder.Select("id").From("widgets").OrderBy("id"))
	if err != nil {
		t.Fatalf("FindAll: %v", err)
	}
	defer rows.Close()

	var ids []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			t.Fatalf("Scan: %v", err)
		}
		ids = append(ids, id)
	}
	if err := rows.Err(); err != nil {
		t.Fatalf("rows.Err: %v", err)
	}
	if len(ids) != 3 || ids[0] != "w1" || ids[2] != "w3" {
		t.Errorf("got %v, want [w1 w2 w3]", ids)
	}
}

func TestDB_FindAll_Empty(t *testing.T) {
	ctx, d := setup(t)
	rows, err := d.FindAll(ctx, db.Builder.Select("id").From("widgets"))
	if err != nil {
		t.Fatalf("FindAll: %v", err)
	}
	defer rows.Close()
	if rows.Next() {
		t.Error("expected no rows, got at least one")
	}
}

func TestDB_Update(t *testing.T) {
	ctx, d := setup(t)
	insertRow(t, ctx, d, "w1", "sprocket", 10)

	if _, err := d.Update(ctx, db.Builder.Update("widgets").Set("qty", 99).Where(sq.Eq{"id": "w1"})); err != nil {
		t.Fatalf("Update: %v", err)
	}

	row, err := d.FindOne(ctx, db.Builder.Select("qty").From("widgets").Where(sq.Eq{"id": "w1"}))
	if err != nil {
		t.Fatalf("FindOne: %v", err)
	}
	var qty int
	if err := row.Scan(&qty); err != nil {
		t.Fatalf("Scan: %v", err)
	}
	if qty != 99 {
		t.Errorf("got qty %d after Update, want 99", qty)
	}
}

func TestDB_Delete(t *testing.T) {
	ctx, d := setup(t)
	insertRow(t, ctx, d, "w1", "sprocket", 10)

	if err := d.Delete(ctx, db.Builder.Delete("widgets").Where(sq.Eq{"id": "w1"})); err != nil {
		t.Fatalf("Delete: %v", err)
	}
	if n := countRows(t, ctx, d); n != 0 {
		t.Errorf("got %d rows after Delete, want 0", n)
	}
}

func TestDB_DeleteBy(t *testing.T) {
	ctx, d := setup(t)
	insertRow(t, ctx, d, "w1", "sprocket", 10)

	if err := d.DeleteBy(ctx, "widgets", "id", "w1"); err != nil {
		t.Fatalf("DeleteBy: %v", err)
	}
	if n := countRows(t, ctx, d); n != 0 {
		t.Errorf("got %d rows after DeleteBy, want 0", n)
	}
}

func TestTx_Commit(t *testing.T) {
	ctx, d := setup(t)

	tx, err := d.Begin(ctx)
	if err != nil {
		t.Fatalf("Begin: %v", err)
	}
	if _, err := tx.Insert(ctx, db.Builder.Insert("widgets").Columns("id", "name").Values("w1", "bolt")); err != nil {
		tx.Rollback()
		t.Fatalf("tx.Insert: %v", err)
	}
	if err := tx.Commit(); err != nil {
		t.Fatalf("Commit: %v", err)
	}

	if n := countRows(t, ctx, d); n != 1 {
		t.Errorf("got %d rows after Commit, want 1", n)
	}
}

func TestTx_Rollback(t *testing.T) {
	ctx, d := setup(t)

	tx, err := d.Begin(ctx)
	if err != nil {
		t.Fatalf("Begin: %v", err)
	}
	if _, err := tx.Insert(ctx, db.Builder.Insert("widgets").Columns("id", "name").Values("w1", "bolt")); err != nil {
		tx.Rollback()
		t.Fatalf("tx.Insert: %v", err)
	}
	if err := tx.Rollback(); err != nil {
		t.Fatalf("Rollback: %v", err)
	}

	if n := countRows(t, ctx, d); n != 0 {
		t.Errorf("got %d rows after Rollback, want 0", n)
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
