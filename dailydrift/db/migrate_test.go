package db_test

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/starfrontventures/dailydrift/dailydrift/db"
)

func TestMigrate(t *testing.T) {
	ctx := context.Background()
	dsn := filepath.Join(t.TempDir(), "migrate.db")

	d, err := db.Open(dsn)
	if err != nil {
		t.Fatalf("Open: %v", err)
	}
	t.Cleanup(func() { d.Close() })

	if err := d.Migrate(ctx); err != nil {
		t.Fatalf("Migrate: %v", err)
	}

	version := func() int64 {
		t.Helper()
		var v int64
		row := d.QueryRowContext(ctx,
			"SELECT MAX(version_id) FROM goose_db_version WHERE is_applied = 1")
		if err := row.Scan(&v); err != nil {
			t.Fatalf("read goose version: %v", err)
		}
		return v
	}

	v1 := version()
	if v1 == 0 {
		t.Fatal("expected migrations to run, version is 0")
	}

	if err := d.Migrate(ctx); err != nil {
		t.Fatalf("Migrate (rerun): %v", err)
	}
	if v2 := version(); v2 != v1 {
		t.Fatalf("idempotent rerun changed version: %d → %d", v1, v2)
	}
}
