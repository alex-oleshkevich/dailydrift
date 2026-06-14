package app

import (
	"context"
	"errors"

	"github.com/starfrontventures/dailydrift/dailydrift/config"
	"github.com/starfrontventures/dailydrift/dailydrift/curator"
	"github.com/starfrontventures/dailydrift/dailydrift/db"
	"github.com/starfrontventures/dailydrift/dailydrift/inbox"
	"golang.org/x/sync/errgroup"
)

type App struct {
	db      db.DBTX
	Inbox   *inbox.Inbox
	Curator *curator.Curator
}

func (a *App) Run(ctx context.Context) error {
	g, ctx := errgroup.WithContext(ctx)
	g.Go(func() error {
		return a.Curator.Run(ctx)
	})
	if err := g.Wait(); err != nil && !errors.Is(err, context.Canceled) {
		return err
	}
	return nil
}

func NewApp(cfg *config.Config, db db.DBTX) *App {
	curator := curator.NewCurator()
	inbox := inbox.NewInbox(db)

	return &App{
		Inbox:   inbox,
		Curator: curator,
	}
}
