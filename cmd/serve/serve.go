// Package serve provides the `serve` subcommand: run the always-on server
// (the brain). Stub for now — see specs/app-architecture.md.
package serve

import (
	"context"
	"fmt"

	"github.com/urfave/cli/v3"
)

// Command returns the `serve` subcommand.
func Command() *cli.Command {
	return &cli.Command{
		Name:  "serve",
		Usage: "Run the dailydrift server (the always-on brain)",
		Action: func(_ context.Context, _ *cli.Command) error {
			fmt.Println("serve: not implemented yet")
			return nil
		},
	}
}
