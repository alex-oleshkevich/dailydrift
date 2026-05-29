# Spec Index — Loading Guide

> **Status:** Living (continuously maintained)
>
> **Version:** —   ·   **Last updated:** 2026-05-29
>
> **Purpose:** The map of the whole specification suite. For each spec: its path, what it defines, *when to load it*, and its current status. This is the **extended table of contents** — read it first, then load only the specs a task actually needs (per [[constitution]] §6.3).
>
> **Load this when:** Always read first; it tells you which other specs to open.

The product is a **self-hosted operational intelligence system** — a persistent chief-of-staff / research assistant / operations dashboard. **Only approved specs are placed in a structure below; every unapproved spec is an untiered backlog** pending drafting/approval (the tier taxonomy is being reworked). Read [[constitution]] before any spec.

**Status legend:** ✅ Approved · 📝 In Review · ⬜ Planned (not yet drafted) · ♻ Deprecated

## Approved & meta

### Tier 1: Meta

| Spec | Purpose | Load this when | Status |
|------|---------|----------------|--------|
| [[constitution]] | Governing principles, the Always/Ask-first/Never autonomy model, authoring conventions, the example cast | Before **any** spec; for any cross-cutting decision | ✅ Approved |
| [[index]] | This loading guide | First, always | Living |

### Tier 2: Product overview

Product and feature overview without technical and implementation details.

| Spec | Purpose | Load this when | Status |
|------|---------|----------------|--------|
| [[overview]] | Vision, goals, non-goals, audience, use cases, philosophy | Onboarding; aligning on what/why | ✅ Approved |
| [[glossary]] | Glossary: Storyline, Situation, Signal, Evidence, Insight, Narrative, … | Whenever a domain term is unclear | ✅ Approved |

### Tier 3: Features

Specs for every feature with overview, purpose, description, implementation details, interfaces, api, structures, enums, file layouts and other.

| Spec | Purpose | Load this when | Status |
|------|---------|----------------|--------|


## Untiered — unapproved backlog

Not yet placed in a structure: these are drafted/in-review or planned, and will be organized once written and approved.

| Spec | Purpose | Load this when | Status |
|------|---------|----------------|--------|
| [[spaces]] | Space hierarchy + downstream inheritance (precedence, overrides, isolation) | Working on hierarchy, scoping, or inheritance | ⬜ Planned |
| [[data-model]] | Canonical conceptual entity-relationship map | Checking how entities relate / IDs | ⬜ Planned |
| [[ui-shell]] | Global app shell: nav, command palette, search, layout, keyboard | Building navigation or overall layout | ⬜ Planned |
| [[settings]] | Global + per-space configuration & preferences | Working on settings / configuration | ⬜ Planned |
| [[home-and-briefings]] | Operational-briefing homepage + Digest system | Building the home surface or digests | ⬜ Planned |
| [[proactivity]] | When/how the System initiates; channels, urgency, quiet hours, anti-spam | Deciding notification/initiation behavior | ⬜ Planned |
| [[conversation]] | Chat surface: message types, bg-task spawn+embed, threads, streaming | Building chat or message handling | ⬜ Planned |
| [[calendar]] | Calendar of tasks, periodic tasks, watcher runs, deadlines, events | Building the calendar surface | ⬜ Planned |
| [[how-it-works]] | End-to-end operating loop: ingest → process → remember → surface → act | Understanding how subsystems interlock | ⬜ Planned |
| [[memory]] | Capture, distillation, retention/decay, retrieval, semantic search | Working on memory/recall | ⬜ Planned |
| [[entities]] | Entity & relationship knowledge graph | Working on entities/relationships | ⬜ Planned |
| [[insights]] | Insight detection & generation; detector catalog; anti-spam | Working on insight generation | ⬜ Planned |
| [[agents]] | Agent philosophy, types, personality-through-continuity | Working on agents | ⬜ Planned |
| [[agent-orchestration]] | How agents coordinate: delegation, hand-offs, approval routing | Working on multi-agent coordination | ⬜ Planned |
| [[tools]] | Tool layer: tool model, tool-call lifecycle, secure invocation | Working on tools or tool calls | ⬜ Planned |
| [[skills]] | Skills as packaged capabilities (bundles of tools) | Working on skills | ⬜ Planned |
| [[signals]] | Signal sources, ingestion API, normalization → evidence | Working on intake/extensibility | ⬜ Planned |
| [[tasks]] | Task model/lifecycle, creation sources, task events, approvals | Working on tasks | ⬜ Planned |
| [[periodic-tasks]] | Recurring/scheduled automation incl. source watchers (change detection); catch-up; distillation jobs | Working on scheduling or watching | ⬜ Planned |
| [[browser-automation]] | Playwright workers, isolated browser profiles, approval-gating | Working on browser automation | ⬜ Planned |
| [[filesystem]] | Local filesystem access: scoped mounts, indexing, file→signal | Working on file access | ⬜ Planned |
| [[mcp]] | MCP integration: client/server, tools→skills, scoping | Working on MCP/connectors | ⬜ Planned |
| [[privacy-security]] | Security posture, isolation, 3-layer auth, local models | Any security-sensitive decision | ⬜ Planned |
| [[secrets]] | Secret management; password-manager integration | Working on credential storage | ⬜ Planned |
| [[permissions]] | Approval & permission system on Always/Ask-first/Never | Working on permissions/approvals | ⬜ Planned |
| [[sandboxing]] | Execution isolation substrate for tools/skills/code | Working on sandboxed execution | ⬜ Planned |
| [[prompt-injection]] | Untrusted-content / prompt-injection defense (P12): data-not-instructions, detection, backstops | Any ingestion or agent-security decision | ⬜ Planned |
| [[activity-log]] | Audit/observability trail of agent/automation actions | Working on auditing/transparency | ⬜ Planned |
| [[ai-models]] | Supported models, provider abstraction, routing | Working on model selection/routing | ⬜ Planned |
| [[app-architecture]] | Data flow, models, actors, orchestration, workers, server↔clients | Implementing the backend/architecture | ⬜ Planned |
| [[stack]] | Go server + native clients: structure, build, libraries, rationale | Setting up the project / build | ⬜ Planned |

---

**Maintenance rule ([[constitution]] §6.3):** when a spec is approved, move it from the untiered backlog into the structured section and refine its "load this when" note. The index must always reflect reality.

## Changelog
- **2026-05-29** — Created; all 36 specs listed; `constitution` marked Approved.
- **2026-05-29** — `overview` approved; added `space-sharing` and `prompt-injection` (now 38 specs); header format fixed.
- **2026-05-29** — Sharing **deferred**: removed `space-sharing` from the tier roadmap (postponed, out of scope for the current suite). [[spaces]] covers hierarchy/inheritance/isolation only and is designed so sharing can layer on later. Retargeted former `[[space-sharing]]` links to `[[spaces]]`.
- **2026-05-29** — Renamed `concepts` → [[glossary]] and flattened its §5 vocabulary (removed thematic subsections). Retargeted all `[[concepts]]` links.
- **2026-05-29** — **Untiered all unapproved specs**: only ✅ Approved specs stay placed (`constitution`, `overview`); the rest moved to a flat untiered backlog pending the tiering rework (Product / Functional / Technical bands under discussion). Fixed stale facts: `local-first` → self-hosted; dropped `Wails` from the `app-architecture`/`stack` rows (architecture decided — Go server + native clients).
