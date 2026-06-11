package ident

import (
	"crypto/rand"
	"fmt"

	"github.com/oklog/ulid/v2"
)

const (
	Space       = "space"
	Storyline   = "story"
	Situation   = "sit"
	Insight     = "ins"
	Evidence    = "ev"
	Narrative   = "nar"
	Signal      = "sig"
	Entity      = "ent"
	EntityType  = "etype"
	Rel         = "rel"
	RelType     = "rtype"
	Task        = "task"
	PTask       = "ptask"
	Agent       = "agent"
	Skill       = "skill"
	Tool        = "tool"
	Grant       = "grant"
	Auth        = "auth"
	Secret      = "secret"
	MCP         = "mcp"
	Conv        = "conv"
	Msg         = "msg"
	Notif       = "notif"
	CuratorJob  = "cjob"
	Integration = "int"
	Workflow    = "wf"
	WorkflowRun = "wfr"
	Memory      = "mem"
	InboxItem   = "ibx"
)

func New(prefix string) string {
	return fmt.Sprintf("%s_%s", prefix, ulid.MustNew(ulid.Now(), rand.Reader).String())
}
