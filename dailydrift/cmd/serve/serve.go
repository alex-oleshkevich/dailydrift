package serve

import (
	"context"

	"github.com/starfrontventures/dailydrift/dailydrift/app"
	"github.com/starfrontventures/dailydrift/dailydrift/config"
	"github.com/starfrontventures/dailydrift/dailydrift/logger"
	"github.com/urfave/cli/v3"
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
		},
		Action: func(ctx context.Context, cmd *cli.Command) error {
			cfg := &config.Config{
				Host:     cmd.String("host"),
				Port:     cmd.Int("port"),
				LogLevel: cmd.String("log-level"),
			}
			if err := logger.Setup(cfg.LogLevel); err != nil {
				return err
			}
			return app.NewApp(cfg).Run(ctx)
		},
	}
}
