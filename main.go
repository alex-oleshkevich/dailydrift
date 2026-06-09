package main

import (
	"context"
	"embed"
	"log"
	"os"
	"os/signal"
	"syscall"

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

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	if err := cmd.Run(ctx, os.Args); err != nil {
		log.Fatal(err)
	}
}
