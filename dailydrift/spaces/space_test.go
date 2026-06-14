package spaces_test

import (
	"context"
	"errors"
	"path/filepath"
	"strings"
	"testing"

	"github.com/starfrontventures/dailydrift/dailydrift/db"
	"github.com/starfrontventures/dailydrift/dailydrift/spaces"
)

func setup(t *testing.T) (context.Context, *spaces.SpaceRepo) {
	t.Helper()
	ctx := context.Background()
	d, err := db.Open(filepath.Join(t.TempDir(), "test.db"))
	if err != nil {
		t.Fatalf("db.Open: %v", err)
	}
	t.Cleanup(func() { d.Close() })
	if err := d.Migrate(ctx); err != nil {
		t.Fatalf("Migrate: %v", err)
	}
	return ctx, spaces.NewSpaceRepo(d)
}

func TestCreate_Root(t *testing.T) {
	ctx, repo := setup(t)
	s, err := repo.Create(ctx, nil, "Global")
	if err != nil {
		t.Fatalf("Create: %v", err)
	}
	if !strings.HasPrefix(s.ID, "space_") {
		t.Errorf("id %q: want space_ prefix", s.ID)
	}
	if s.ParentID != nil {
		t.Errorf("expected nil parent_id, got %v", s.ParentID)
	}
	if s.Status != "active" {
		t.Errorf("status: got %q, want active", s.Status)
	}
}

func TestCreate_Child(t *testing.T) {
	ctx, repo := setup(t)
	root, _ := repo.Create(ctx, nil, "Global")
	child, err := repo.Create(ctx, &root.ID, "Business")
	if err != nil {
		t.Fatalf("Create child: %v", err)
	}
	if child.ParentID == nil || *child.ParentID != root.ID {
		t.Errorf("parent_id: got %v, want %s", child.ParentID, root.ID)
	}
}

func TestGet_NotFound(t *testing.T) {
	ctx, repo := setup(t)
	_, err := repo.Get(ctx, "space_NOTEXIST")
	if !db.IsNotFound(err) {
		t.Errorf("expected not-found error, got %v", err)
	}
}

func TestList(t *testing.T) {
	ctx, repo := setup(t)
	repo.Create(ctx, nil, "A")
	repo.Create(ctx, nil, "B")
	list, err := repo.List(ctx)
	if err != nil {
		t.Fatalf("List: %v", err)
	}
	if len(list) != 2 {
		t.Errorf("got %d spaces, want 2", len(list))
	}
}

func TestChildren(t *testing.T) {
	ctx, repo := setup(t)
	root, _ := repo.Create(ctx, nil, "Global")
	repo.Create(ctx, &root.ID, "Business")
	repo.Create(ctx, &root.ID, "Personal")
	children, err := repo.Children(ctx, root.ID)
	if err != nil {
		t.Fatalf("Children: %v", err)
	}
	if len(children) != 2 {
		t.Errorf("got %d children, want 2", len(children))
	}
}

func TestUpdate(t *testing.T) {
	ctx, repo := setup(t)
	s, _ := repo.Create(ctx, nil, "Global")
	s.Name = "Renamed"
	if err := repo.Update(ctx, s); err != nil {
		t.Fatalf("Update: %v", err)
	}
	got, _ := repo.Get(ctx, s.ID)
	if got.Name != "Renamed" {
		t.Errorf("name: got %q, want Renamed", got.Name)
	}
}

func TestArchive_Single(t *testing.T) {
	ctx, repo := setup(t)
	s, _ := repo.Create(ctx, nil, "Global")
	if err := repo.Archive(ctx, s.ID); err != nil {
		t.Fatalf("Archive: %v", err)
	}
	got, _ := repo.Get(ctx, s.ID)
	if got.Status != "archived" {
		t.Errorf("status: got %q, want archived", got.Status)
	}
}

func TestArchive_Subtree(t *testing.T) {
	ctx, repo := setup(t)
	root, _ := repo.Create(ctx, nil, "Root")
	child, _ := repo.Create(ctx, &root.ID, "Child")
	grandchild, _ := repo.Create(ctx, &child.ID, "Grandchild")

	if err := repo.Archive(ctx, root.ID); err != nil {
		t.Fatalf("Archive: %v", err)
	}
	for _, id := range []string{root.ID, child.ID, grandchild.ID} {
		got, _ := repo.Get(ctx, id)
		if got.Status != "archived" {
			t.Errorf("space %s: status %q, want archived", id, got.Status)
		}
	}
}

func TestMove(t *testing.T) {
	ctx, repo := setup(t)
	a, _ := repo.Create(ctx, nil, "A")
	b, _ := repo.Create(ctx, nil, "B")

	if err := repo.Move(ctx, b.ID, &a.ID); err != nil {
		t.Fatalf("Move: %v", err)
	}
	got, _ := repo.Get(ctx, b.ID)
	if got.ParentID == nil || *got.ParentID != a.ID {
		t.Errorf("parent_id: got %v, want %s", got.ParentID, a.ID)
	}
}

func TestMove_ToRoot(t *testing.T) {
	ctx, repo := setup(t)
	root, _ := repo.Create(ctx, nil, "Root")
	child, _ := repo.Create(ctx, &root.ID, "Child")

	if err := repo.Move(ctx, child.ID, nil); err != nil {
		t.Fatalf("Move to root: %v", err)
	}
	got, _ := repo.Get(ctx, child.ID)
	if got.ParentID != nil {
		t.Errorf("expected nil parent_id after move to root, got %v", got.ParentID)
	}
}

func TestMove_CycleRejected(t *testing.T) {
	ctx, repo := setup(t)
	root, _ := repo.Create(ctx, nil, "Root")
	child, _ := repo.Create(ctx, &root.ID, "Child")

	err := repo.Move(ctx, root.ID, &child.ID)
	if !errors.Is(err, spaces.ErrCycle) {
		t.Errorf("expected ErrCycle, got %v", err)
	}
}

func TestMove_SelfCycleRejected(t *testing.T) {
	ctx, repo := setup(t)
	s, _ := repo.Create(ctx, nil, "Solo")

	err := repo.Move(ctx, s.ID, &s.ID)
	if !errors.Is(err, spaces.ErrCycle) {
		t.Errorf("expected ErrCycle on self-move, got %v", err)
	}
}
