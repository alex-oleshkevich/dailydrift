package config

import (
	"net"
	"strconv"

	"github.com/creasty/defaults"
)

type Config struct {
	Host     string `default:"127.0.0.1"`
	Port     int    `default:"8080"`
	LogLevel string `default:"info"`
	DBPath   string `default:"dailydrift.db"`
}

func (c *Config) Addr() string {
	return net.JoinHostPort(c.Host, strconv.Itoa(c.Port))
}

type Setter func(c *Config)

func New(setters ...Setter) *Config {
	cfg := &Config{}
	defaults.MustSet(cfg)
	for _, setter := range setters {
		setter(cfg)
	}
	return cfg
}
