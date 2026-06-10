package curator

import (
	"context"
	"log/slog"
)

type Curator struct{}

func (c *Curator) Run(ctx context.Context) error {
	slog.Info("curator starting")
	<-ctx.Done()
	slog.Info("curator stopped")
	return ctx.Err()
}

func NewCurator() *Curator {
	return &Curator{}
}
