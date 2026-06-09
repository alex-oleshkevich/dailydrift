package logger

import (
	"fmt"
	"log/slog"
	"os"

	"github.com/lmittmann/tint"
)

func Setup(level string) error {
	var l slog.Level
	switch level {
	case "debug":
		l = slog.LevelDebug
	case "info":
		l = slog.LevelInfo
	case "warn":
		l = slog.LevelWarn
	case "error":
		l = slog.LevelError
	default:
		return fmt.Errorf("unknown log level %q", level)
	}

	slog.SetDefault(slog.New(tint.NewHandler(os.Stderr, &tint.Options{Level: l})))
	return nil
}
