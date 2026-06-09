package main

import (
	"context"
	"embed"
	"log"
	"os"

	"github.com/starfrontventures/dailydrift/dailydrift/cmd/serve"
	"github.com/starfrontventures/dailydrift/dailydrift/desktop"

	"github.com/urfave/cli/v3"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	cmd := &cli.Command{
		Name:  "dailydrift",
		Usage: "Self-hosted operational intelligence",
		Commands: []*cli.Command{
			serve.Command(),
		},
		Action: func(_ context.Context, _ *cli.Command) error {
			return desktop.RunWails(assets)
		},
	}

	if err := cmd.Run(context.Background(), os.Args); err != nil {
		log.Fatal(err)
	}
}
