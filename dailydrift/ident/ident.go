package ident

import (
	"crypto/rand"
	"fmt"

	"github.com/oklog/ulid/v2"
)

func New(prefix string) string {
	return fmt.Sprintf("%s_%s", prefix, ulid.MustNew(ulid.Now(), rand.Reader).String())
}
