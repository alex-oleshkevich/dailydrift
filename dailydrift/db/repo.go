package db

import (
	"context"
	"fmt"

	sq "github.com/Masterminds/squirrel"
)

type Tabler interface {
	Table() string
	TableColumns() []string
}

type Repo[T Tabler] struct {
	DB    DBTX
	table string
	cols  []string
}

func NewRepo[T Tabler](d DBTX) Repo[T] {
	var zero T
	return Repo[T]{DB: d, table: zero.Table(), cols: zero.TableColumns()}
}

func (r *Repo[T]) Get(ctx context.Context, id string) (*T, error) {
	var v T
	stmt := Builder.Select(r.cols...).From(r.table).Where(sq.Eq{"id": id})
	if err := r.DB.FindOne(ctx, &v, stmt); err != nil {
		return nil, fmt.Errorf("%s.Get %s: %w", r.table, id, err)
	}
	return &v, nil
}

func (r *Repo[T]) List(ctx context.Context) ([]*T, error) {
	var list []*T
	stmt := Builder.Select(r.cols...).From(r.table).OrderBy("created_at")
	if err := r.DB.FindAll(ctx, &list, stmt); err != nil {
		return nil, fmt.Errorf("%s.List: %w", r.table, err)
	}
	return list, nil
}

func (r *Repo[T]) FindOne(ctx context.Context, where sq.Sqlizer) (*T, error) {
	var v T
	stmt := Builder.Select(r.cols...).From(r.table).Where(where)
	if err := r.DB.FindOne(ctx, &v, stmt); err != nil {
		return nil, fmt.Errorf("%s.FindOne: %w", r.table, err)
	}
	return &v, nil
}

func (r *Repo[T]) FindAll(ctx context.Context, where sq.Sqlizer) ([]*T, error) {
	var list []*T
	stmt := Builder.Select(r.cols...).From(r.table).Where(where).OrderBy("created_at")
	if err := r.DB.FindAll(ctx, &list, stmt); err != nil {
		return nil, fmt.Errorf("%s.FindAll: %w", r.table, err)
	}
	return list, nil
}
