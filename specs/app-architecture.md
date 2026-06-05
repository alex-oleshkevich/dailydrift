# App Architecture

> **Status:** Planned
>
> **Version:** 0.0   ·   **Last updated:** 2026-06-04
>
> **Purpose:** The concrete system architecture — the self-hosted server (the brain) and native clients, persistence, the ID format, queues, the vector store, and the model/embedding runtime that the conceptual specs abstract over.
>
> **Depends on:** [constitution](constitution.md), [data-model](data-model.md)

> Requirement tag: **ARCH**

---

> **STUB — not yet drafted.** Placeholder so the concept isn't forgotten and cross-links resolve; to be authored to the [constitution](constitution.md) §6 house format when picked up. Tracked in beads.

## Notes — intended scope

- The **always-on self-hosted server** (the brain) + **native clients** (views & controls).
- **Persistence/storage** and the concrete **ID format** (ULID vs slug) that [data-model](data-model.md) §5.1 abstracts over.
- **Queues** for the [inbox](inbox.md) pipeline; the **model/embedding runtime** ([ai-models](ai-models.md)).
- Relationship to the current Wails client scaffold; see [stack](stack.md).

## The shared semantic index / vector store — captured for the memory subsystem

The shared semantic index ([memory](memory.md) REQ-MEM-03) — the substrate behind Insight recall, Signal novelty, Storyline resolution, and Evidence reinforcement — is realized as a **`sqlite-vec` `vec0` virtual table over SQLite** (single `.db` file, fits the Wails single-binary):

- **Library:** `asg017/sqlite-vec` (+ `asg017/sqlite-vec-go-bindings`) with the `mattn/go-sqlite3` driver (CGO). Zero-CGO fallback: `philippgille/chromem-go` (pure-Go, exhaustive search, fine under ~1M items) or `modernc.org/sqlite`.
- **Sketch** (embedding dimension must match the [ai-models](ai-models.md) model — 384 for `all-MiniLM-L6-v2`):
  ```sql
  CREATE VIRTUAL TABLE mem_index USING vec0(
      memory_id   TEXT PRIMARY KEY,   -- mem_ / ins_ / story_ / ev_
      space_id    TEXT,
      kind        TEXT,
      embedding   float[384]
  );
  -- item rows (content, importance, salience, last_used_at, superseded_by, …) live in a sibling table
  ```
- **Recall** = KNN `MATCH` query, re-ranked in Go by the [memory](memory.md) REQ-MEM-10 score (relevance + recency + importance).
- **Support:** `langchaingo/textsplitter` (chunking), `pkoukk/tiktoken-go` (token budgeting).

## Background runtime — queue & scheduler — captured for tasks / periodic-tasks

One **shared, simple background runtime** carries the System's deferred work: [Tasks](tasks.md), CuratorJobs ([curator](curator.md)), [Inbox](inbox.md) processing, and [Periodic Tasks](periodic-tasks.md).

- **Task queue:** a **SQLite `tasks` table polled by a worker** (claim a `pending` row → `running` → run → `done`/`failed`), or `maragudk/goqite` for convenience. Deliberately simple — **no** retries / leases / dead-letter / backoff / priority ([tasks](tasks.md) §2).
- **Scheduler:** `go-co-op/gocron` (or `robfig/cron/v3`), or a SQLite schedule table + poller. UTC; skip-on-overlap; no catch-up replay ([periodic-tasks](periodic-tasks.md) REQ-PTASK-06).
- **Mid-task approval needs no engine:** an Ask-first step raises an `approval` [Situation](situations.md); the Task stays `running` (a persisted row), and a worker continues it on grant. **No workflow / durable-execution engine** ([tasks](tasks.md) REQ-TASK-06).
- Single-binary; survives restart because all state is plain SQLite rows.

## 13. Changelog

- **2026-06-04 — v0.0** — Stub created (Planned).
- **2026-06-04 — v0.0 (note)** — Captured the **vector store** decision for the [memory](memory.md) subsystem: `sqlite-vec` vec0 over SQLite (`mattn/go-sqlite3`), with the `mem_index` schema sketch and the pure-Go fallback. Still Planned.
- **2026-06-04 — v0.0 (note)** — Captured the **shared background runtime** (queue + scheduler) for [tasks](tasks.md)/[periodic-tasks](periodic-tasks.md): a SQLite `tasks` table + worker (or `goqite`) and `gocron`, deliberately simple (no engine). Still Planned.