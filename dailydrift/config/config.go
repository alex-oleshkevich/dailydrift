package config

import (
	"net"
	"strconv"
)

const (
	DefaultHost     = "127.0.0.1"
	DefaultPort     = 8080
	DefaultLogLevel = "info"
)

type Config struct {
	Host     string
	Port     int
	LogLevel string
}

func (c *Config) Addr() string {
	return net.JoinHostPort(c.Host, strconv.Itoa(c.Port))
}
