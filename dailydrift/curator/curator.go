package curator

import (
	"context"
	"fmt"
)

type Curator struct{}

func (c *Curator) Run(ctx context.Context) error {
	<-ctx.Done()
	return fmt.Errorf("curator: %w", ctx.Err())
}

func NewCurator() *Curator {
	return &Curator{}
}
