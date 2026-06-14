package spaces

import (
	"errors"
	"time"

	"github.com/starfrontventures/dailydrift/dailydrift/types"
)

var ErrCycle = errors.New("spaces: move would create a cycle")

type Space struct {
	ID        string               `db:"id"`
	ParentID  *string              `db:"parent_id"`
	Name      string               `db:"name"`
	Prompt    *string              `db:"prompt"`
	Status    string               `db:"status"`
	Mounts    types.JSON[[]string] `db:"mounts"`
	CreatedAt time.Time            `db:"created_at"`
}

func (Space) Table() string { return "spaces" }
func (Space) TableColumns() []string {
	return []string{"id", "parent_id", "name", "prompt", "status", "mounts", "created_at"}
}
