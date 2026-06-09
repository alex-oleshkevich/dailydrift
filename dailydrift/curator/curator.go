package curator

import "context"

type Curator struct{}

func (c *Curator) Run(ctx context.Context) error {
	select {
	case <-ctx.Done():
		return ctx.Err()
	}
}

func NewCurator() *Curator {
	return &Curator{}
}
