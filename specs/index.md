# Spec Index — Loading Guide

> **Status:** Living (continuously maintained)
>
> **Version:** —   ·   **Last updated:** 2026-05-29
>
> **Purpose:** The map of the whole specification suite. For each spec: its path, what it defines, *when to load it*, and its current status. This is the **extended table of contents** — read it first, then load only the specs a task actually needs (per [[constitution]] §6.3).
>
> **Load this when:** Always read first; it tells you which other specs to open.

The product is a **local-first operational intelligence system** — a persistent chief-of-staff / research assistant / operations dashboard. Specs are organized in tiers; reading order ≈ build order of understanding. Read [[constitution]] before any spec.

**Status legend:** ✅ Approved · 📝 In Review · ⬜ Planned (not yet drafted) · ♻ Deprecated

## Tier 0 — Meta

| Spec | Purpose | Load this when | Status |
|------|---------|----------------|--------|
| [[constitution]] | Governing principles, the Always/Ask-first/Never autonomy model, authoring conventions, the example cast | Before **any** spec; for any cross-cutting decision | ✅ Approved |
| [[index]] | This loading guide | First, always | Living |

## Tier 1 — Product & domain (no tech)

| Spec | Purpose | Load this when | Status |
|------|---------|----------------|--------|
| [[overview]] | Vision, goals, non-goals, audience, use cases, philosophy | Onboarding; aligning on what/why | ✅ Approved |
| [[concepts]] | Glossary: Arc, Situation, Signal, Evidence, Insight, Narrative Markdown, … | Whenever a domain term is unclear | ⬜ Planned |
| [[spaces]] | Spaces + downstream inheritance (precedence, overrides, isolation) | Working on hierarchy, scoping, or inheritance | ⬜ Planned |
| [[space-sharing]] | Sharing a Space with a person (shows in their menu; they extend it); downstream-only | Working on sharing / collaboration | ⬜ Planned |
| [[data-model]] | Canonical conceptual entity-relationship map | Checking how entities relate / IDs | ⬜ Planned |

## Tier 2 — Surfaces / experience (no tech)

| Spec | Purpose | Load this when | Status |
|------|---------|----------------|--------|
| [[ui-shell]] | Global app shell: nav, command palette, search, layout, keyboard | Building navigation or overall layout | ⬜ Planned |
| [[settings]] | Global + per-space configuration & preferences | Working on settings / configuration | ⬜ Planned |
| [[home-and-briefings]] | Operational-briefing homepage + Digest system | Building the home surface or digests | ⬜ Planned |
| [[proactivity]] | When/how the System initiates; channels, urgency, quiet hours, anti-spam | Deciding notification/initiation behavior | ⬜ Planned |
| [[conversation]] | Chat surface: message types, bg-task spawn+embed, threads, streaming | Building chat or message handling | ⬜ Planned |
| [[calendar]] | Calendar of tasks, periodic tasks, monitor runs, deadlines, events | Building the calendar surface | ⬜ Planned |

## Tier 3 — Functional architecture (no tech)

| Spec | Purpose | Load this when | Status |
|------|---------|----------------|--------|
| [[how-it-works]] | End-to-end operating loop: ingest → process → remember → surface → act | Understanding how subsystems interlock | ⬜ Planned |

## Tier 4 — Intelligence & capabilities

| Spec | Purpose | Load this when | Status |
|------|---------|----------------|--------|
| [[memory]] | Capture, distillation, retention/decay, retrieval, semantic search | Working on memory/recall | ⬜ Planned |
| [[entities]] | Entity & relationship knowledge graph | Working on entities/relationships | ⬜ Planned |
| [[insights]] | Insight detection & generation; detector catalog; anti-spam | Working on insight generation | ⬜ Planned |
| [[agents]] | Agent philosophy, types, personality-through-continuity | Working on agents | ⬜ Planned |
| [[agent-orchestration]] | How agents coordinate: delegation, hand-offs, approval routing | Working on multi-agent coordination | ⬜ Planned |
| [[tools]] | Tool layer: tool model, tool-call lifecycle, secure invocation | Working on tools or tool calls | ⬜ Planned |
| [[skills]] | Skills as packaged capabilities (bundles of tools) | Working on skills | ⬜ Planned |

## Tier 5 — Inputs & automation

| Spec | Purpose | Load this when | Status |
|------|---------|----------------|--------|
| [[signals]] | Signal sources, ingestion API, normalization → evidence | Working on intake/extensibility | ⬜ Planned |
| [[monitors]] | Continuous watchers; change detection; meaningful-only filtering | Working on monitoring | ⬜ Planned |
| [[tasks]] | Task model/lifecycle, creation sources, task events, approvals | Working on tasks | ⬜ Planned |
| [[periodic-tasks]] | Recurring/scheduled automation; catch-up; distillation jobs | Working on scheduling | ⬜ Planned |

## Tier 6 — Capabilities & integrations

| Spec | Purpose | Load this when | Status |
|------|---------|----------------|--------|
| [[browser-automation]] | Playwright workers, isolated browser profiles, approval-gating | Working on browser automation | ⬜ Planned |
| [[notes-bookmarks]] | Notes & bookmarks as first-class knowledge objects | Working on notes/bookmarks | ⬜ Planned |
| [[filesystem]] | Local filesystem access: scoped mounts, indexing, file→signal | Working on file access | ⬜ Planned |
| [[mcp]] | MCP integration: client/server, tools→skills, scoping | Working on MCP/connectors | ⬜ Planned |

## Tier 7 — Trust, security & models

| Spec | Purpose | Load this when | Status |
|------|---------|----------------|--------|
| [[privacy-security]] | Security posture, isolation, 3-layer auth, local models | Any security-sensitive decision | ⬜ Planned |
| [[secrets]] | Secret management; password-manager integration | Working on credential storage | ⬜ Planned |
| [[permissions]] | Approval & permission system on Always/Ask-first/Never | Working on permissions/approvals | ⬜ Planned |
| [[sandboxing]] | Execution isolation substrate for tools/skills/code | Working on sandboxed execution | ⬜ Planned |
| [[prompt-injection]] | Untrusted-content / prompt-injection defense (P12): data-not-instructions, detection, backstops | Any ingestion or agent-security decision | ⬜ Planned |
| [[activity-log]] | Audit/observability trail of agent/automation actions | Working on auditing/transparency | ⬜ Planned |
| [[ai-models]] | Supported models, provider abstraction, routing | Working on model selection/routing | ⬜ Planned |

## Tier 8 — Technical implementation

| Spec | Purpose | Load this when | Status |
|------|---------|----------------|--------|
| [[app-architecture]] | Data flow, models, actors, orchestration, workers, Wails↔frontend | Implementing the backend/architecture | ⬜ Planned |
| [[stack]] | shadcn + Wails + Golang: structure, build, libraries, rationale | Setting up the project / build | ⬜ Planned |

---

**Maintenance rule ([[constitution]] §6.3):** when a spec is approved, flip its status here and refine its "load this when" note. The index must always reflect reality.

## Changelog
- **2026-05-29** — Created; all 36 specs listed; `constitution` marked Approved.
- **2026-05-29** — `overview` approved; added `space-sharing` and `prompt-injection` (now 38 specs); header format fixed.
