package server

import (
	"context"
	"errors"
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

	errc := make(chan error, 1)
	go func() { errc <- s.http.ListenAndServe() }()

	select {
	case err := <-errc:
		if errors.Is(err, http.ErrServerClosed) {
			return nil
		}
		return err
	case <-ctx.Done():
		sctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		return s.http.Shutdown(sctx)
	}
}

type Deps struct {
	Config *config.Config
}

func NewServer(deps Deps) *Server {
	mux := http.NewServeMux()

	return &Server{
		http: &http.Server{
			Addr:              deps.Config.Addr(),
			Handler:           mux,
			ReadHeaderTimeout: 10 * time.Second,
			IdleTimeout:       120 * time.Second,
		},
	}
}
