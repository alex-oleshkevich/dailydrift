package spaces

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log/slog"

	sq "github.com/Masterminds/squirrel"
	"github.com/starfrontventures/dailydrift/dailydrift/db"
	"github.com/starfrontventures/dailydrift/dailydrift/ident"
)

type SpaceRepo struct {
	db.Repo[Space]
}

func NewSpaceRepo(d db.DBTX) *SpaceRepo {
	return &SpaceRepo{db.NewRepo[Space](d)}
}

func (r *SpaceRepo) Children(ctx context.Context, parentID string) ([]*Space, error) {
	return r.FindAll(ctx, sq.Eq{"parent_id": parentID})
}

func (r *SpaceRepo) Create(ctx context.Context, parentID *string, name string) (*Space, error) {
	id := ident.New(ident.Space)
	stmt := db.Builder.Insert("spaces").
		Columns("id", "parent_id", "name").
		Values(id, parentID, name)
	if _, err := r.DB.Exec(ctx, stmt); err != nil {
		return nil, fmt.Errorf("spaces.Create: %w", err)
	}
	slog.Info("space created", "id", id, "name", name, "parent_id", parentID)
	return r.Get(ctx, id)
}

func (r *SpaceRepo) Update(ctx context.Context, s *Space) error {
	stmt := db.Builder.Update("spaces").
		Set("name", s.Name).
		Set("prompt", s.Prompt).
		Set("mounts", s.Mounts).
		Where(sq.Eq{"id": s.ID, "status": "active"})
	res, err := r.DB.Exec(ctx, stmt)
	if err != nil {
		return fmt.Errorf("spaces.Update %s: %w", s.ID, err)
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return fmt.Errorf("spaces.Update %s: not found or archived", s.ID)
	}
	slog.Info("space updated", "id", s.ID)
	return nil
}

// Archive sets the space and all its descendants to archived status.
func (r *SpaceRepo) Archive(ctx context.Context, id string) error {
	query := `
		WITH RECURSIVE subtree(id) AS (
			SELECT id FROM spaces WHERE id = ?
			UNION ALL
			SELECT s.id FROM spaces s JOIN subtree t ON s.parent_id = t.id
		)
		UPDATE spaces SET status = 'archived'
		WHERE id IN (SELECT id FROM subtree) AND status = 'active'`
	if _, err := r.DB.ExecContext(ctx, query, id); err != nil {
		return fmt.Errorf("spaces.Archive %s: %w", id, err)
	}
	slog.Info("space archived", "id", id)
	return nil
}

// Move re-parents space id under newParentID. Pass nil to make it a root space.
// Returns ErrCycle if newParentID is a descendant of id.
func (r *SpaceRepo) Move(ctx context.Context, id string, newParentID *string) error {
	if newParentID != nil {
		query := `
			WITH RECURSIVE subtree(id) AS (
				SELECT id FROM spaces WHERE id = ?
				UNION ALL
				SELECT s.id FROM spaces s JOIN subtree t ON s.parent_id = t.id
			)
			SELECT 1 FROM subtree WHERE id = ? LIMIT 1`
		var found int
		err := r.DB.QueryRowContext(ctx, query, id, *newParentID).Scan(&found)
		if err != nil && !errors.Is(err, sql.ErrNoRows) {
			return fmt.Errorf("spaces.Move cycle check: %w", err)
		}
		if found == 1 {
			return ErrCycle
		}
	}
	stmt := db.Builder.Update("spaces").Set("parent_id", newParentID).Where(sq.Eq{"id": id})
	if _, err := r.DB.Exec(ctx, stmt); err != nil {
		return fmt.Errorf("spaces.Move %s: %w", id, err)
	}
	slog.Info("space moved", "id", id, "new_parent_id", newParentID)
	return nil
}
