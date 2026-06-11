package serve

import (
	"context"
	"errors"
	"log/slog"

	"github.com/starfrontventures/dailydrift/dailydrift/app"
	"github.com/starfrontventures/dailydrift/dailydrift/config"
	"github.com/starfrontventures/dailydrift/dailydrift/db"
	"github.com/starfrontventures/dailydrift/dailydrift/logger"
	"github.com/starfrontventures/dailydrift/dailydrift/server"
	"github.com/starfrontventures/dailydrift/dailydrift/server/router"
	"github.com/urfave/cli/v3"
	"golang.org/x/sync/errgroup"
)

func Command() *cli.Command {
	return &cli.Command{
		Name:  "serve",
		Usage: "Run the dailydrift server (the always-on brain)",
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:    "host",
				Value:   config.DefaultHost,
				Usage:   "host/interface to bind the server to",
				Sources: cli.EnvVars("DAILYDRIFT_HOST"),
			},
			&cli.IntFlag{
				Name:    "port",
				Value:   config.DefaultPort,
				Usage:   "port to listen on",
				Sources: cli.EnvVars("DAILYDRIFT_PORT"),
			},
			&cli.StringFlag{
				Name:    "log-level",
				Value:   config.DefaultLogLevel,
				Usage:   "log level (debug, info, warn, error)",
				Sources: cli.EnvVars("DAILYDRIFT_LOG_LEVEL"),
			},
			&cli.StringFlag{
				Name:    "db",
				Value:   config.DefaultDBPath,
				Usage:   "path to the SQLite database file",
				Sources: cli.EnvVars("DAILYDRIFT_DB"),
			},
		},
		Action: func(ctx context.Context, cmd *cli.Command) error {
			cfg := &config.Config{
				Host:     cmd.String("host"),
				Port:     cmd.Int("port"),
				LogLevel: cmd.String("log-level"),
				DBPath:   cmd.String("db"),
			}
			if err := logger.Setup(cfg.LogLevel); err != nil {
				return err
			}
			database, err := db.Open(cfg.DBPath)
			if err != nil {
				return err
			}
			defer func() {
				if err := database.Close(); err != nil {
					slog.Error("db close failed", "err", err)
				}
			}()
			if err := database.Migrate(ctx); err != nil {
				return err
			}
			app := app.NewApp(cfg)
			server := server.NewServer(server.Deps{
				Config:  cfg,
				Handler: router.NewRouter(app),
			})
			g, ctx := errgroup.WithContext(ctx)
			g.Go(func() error {
				return server.Run(ctx)
			})
			g.Go(func() error {
				return app.Run(ctx)
			})

			if err := g.Wait(); err != nil && !errors.Is(err, context.Canceled) {
				return err
			}
			return nil
		},
	}
}
