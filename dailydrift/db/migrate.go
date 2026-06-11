package db

import (
	"context"
	"embed"
	"fmt"
	"log/slog"

	"github.com/pressly/goose/v3"
)

//go:embed migrations/*.sql
var migrationsFS embed.FS

func (d *DB) Migrate(ctx context.Context) error {
	goose.SetBaseFS(migrationsFS)
	goose.SetLogger(goose.NopLogger())
	if err := goose.SetDialect("sqlite3"); err != nil {
		return fmt.Errorf("db.Migrate dialect: %w", err)
	}
	before, err := goose.GetDBVersionContext(ctx, d.writer)
	if err != nil {
		return fmt.Errorf("db.Migrate version: %w", err)
	}
	if err := goose.UpContext(ctx, d.writer, "migrations"); err != nil {
		return fmt.Errorf("db.Migrate: %w", err)
	}
	after, err := goose.GetDBVersionContext(ctx, d.writer)
	if err != nil {
		return fmt.Errorf("db.Migrate version: %w", err)
	}
	slog.Info("db migrations applied", "dsn", d.dsn, "from", before, "to", after)
	return nil
}
