-- +goose Up

CREATE TABLE spaces (
    id         TEXT PRIMARY KEY,
    parent_id  TEXT REFERENCES spaces(id),
    name       TEXT NOT NULL,
    status     TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    prompt     TEXT,
    mounts     TEXT,
    created_at DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX spaces_parent_id ON spaces(parent_id);

-- +goose Down

DROP TABLE spaces;
