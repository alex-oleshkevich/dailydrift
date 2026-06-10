package app

import (
	"context"
	"errors"

	"github.com/starfrontventures/dailydrift/dailydrift/config"
	"github.com/starfrontventures/dailydrift/dailydrift/curator"
	"golang.org/x/sync/errgroup"
)

type App struct {
	curator *curator.Curator
}

func (a *App) Run(ctx context.Context) error {
	g, ctx := errgroup.WithContext(ctx)
	g.Go(func() error {
		return a.curator.Run(ctx)
	})
	if err := g.Wait(); err != nil && !errors.Is(err, context.Canceled) {
		return err
	}
	return nil
}

func NewApp(cfg *config.Config) *App {
	curator := curator.NewCurator()

	return &App{
		curator: curator,
	}
}
