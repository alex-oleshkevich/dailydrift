package types

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
)

type JSON[T any] struct {
	V     T
	Valid bool
}

func (j *JSON[T]) Scan(src any) error {
	if src == nil {
		j.Valid = false
		return nil
	}
	var b []byte
	switch v := src.(type) {
	case []byte:
		b = v
	case string:
		b = []byte(v)
	default:
		return fmt.Errorf("JSON: unsupported type %T", src)
	}
	if err := json.Unmarshal(b, &j.V); err != nil {
		return err
	}
	j.Valid = true
	return nil
}

func (j JSON[T]) Value() (driver.Value, error) {
	if !j.Valid {
		return nil, nil
	}
	b, err := json.Marshal(j.V)
	if err != nil {
		return nil, err
	}
	return string(b), nil
}
