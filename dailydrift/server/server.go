package server

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"time"

	"github.com/starfrontventures/dailydrift/dailydrift/config"
)

type Server struct {
	http *http.Server
}

func (s *Server) Run(ctx context.Context) error {
	s.http.BaseContext = func(net.Listener) context.Context { return ctx }

	slog.Info("server starting", "addr", s.http.Addr)
	errc := make(chan error, 1)
	go func() { errc <- s.http.ListenAndServe() }()

	select {
	case err := <-errc:
		if errors.Is(err, http.ErrServerClosed) {
			return nil
		}
		return fmt.Errorf("server: %w", err)
	case <-ctx.Done():
		slog.Info("server shutting down")
		sctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := s.http.Shutdown(sctx); err != nil {
			return fmt.Errorf("server.Shutdown: %w", err)
		}
		return nil
	}
}

type Deps struct {
	Config  *config.Config
	Handler http.Handler
}

func NewServer(deps Deps) *Server {
	return &Server{
		http: &http.Server{
			Addr:              deps.Config.Addr(),
			Handler:           deps.Handler,
			ReadHeaderTimeout: 10 * time.Second,
			IdleTimeout:       120 * time.Second,
		},
	}
}
