package server

import (
	"context"
	"errors"
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
		return err
	case <-ctx.Done():
		slog.Info("server shutting down")
		sctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		return s.http.Shutdown(sctx)
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
