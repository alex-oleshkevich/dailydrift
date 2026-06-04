# Spec Index — Loading Guide

> **Status:** Living (continuously maintained)
>
> **Version:** —   ·   **Last updated:** 2026-05-29
>
> **Purpose:** The map of the whole specification suite. For each spec: its path, what it defines, *when to load it*, and its current status. This is the **extended table of contents** — read it first, then load only the specs a task actually needs (per [constitution](constitution.md) §6.3).
>
> **Load this when:** Always read first; it tells you which other specs to open.

The product is a **self-hosted operational intelligence system** — a persistent chief-of-staff / research assistant / operations dashboard. **Only approved specs are placed in a structure below; every unapproved spec is an untiered backlog** pending drafting/approval (the tier taxonomy is being reworked). Read [constitution](constitution.md) before any spec.

**Status legend:** ✅ Approved · 📝 In Review · ⬜ Planned (not yet drafted) · ♻ Deprecated

## Approved & meta

### Tier 1: Meta

| Spec | Purpose | Load this when | Status |
|------|---------|----------------|--------|
| [constitution](constitution.md) | Governing principles, the Always/Ask-first/Never autonomy model, authoring conventions, the example cast | Before **any** spec; for any cross-cutting decision | ✅ Approved |
| [index](index.md) | This loading guide | First, always | Living |

### Tier 2: Product overview

Product and feature overview without technical and implementation details.

| Spec | Purpose | Load this when | Status |
|------|---------|----------------|--------|
| [overview](overview.md) | Vision, goals, non-goals, audience, use cases, philosophy | Onboarding; aligning on what/why | ✅ Approved |
| [glossary](glossary.md) | Glossary: Storyline, Situation, Signal, Evidence, Insight, Narrative, … | Whenever a domain term is unclear | ✅ Approved |
| [how-it-works](how-it-works.md) | End-to-end feature tour: signals/ingestion, the knowledge pipeline, tasks/tools/grants, agents, periodic tasks & watchers, chat as a living channel, calendar, surfacing, trust — at product altitude | Onboarding; pitching; understanding how features connect | 📝 In Review |

### Tier 3: Features

Specs for every feature with overview, purpose, description, implementation details, interfaces, api, structures, enums, file layouts and other.

| Spec | Purpose | Load this when | Status |
|------|---------|----------------|--------|
| [data-model](data-model.md) | Canonical conceptual entity-relationship model for the narrative layer (Space, Storyline, Situation, Insight, Evidence, Narrative); the Situation↔Insight boundary; the capture-and-retrieve Insight | Checking how entities relate / IDs, or before changing any narrative-layer primitive | ✅ Approved |
| [insights](insights.md) | Insight capture-and-retrieve mechanics: capture path, `kind` catalog, embedding/semantic recall, dedup/reinforcement, lifecycle, surfacing & anti-spam | Working on Insight capture, recall, or surfacing | ✅ Approved |
| [storylines](storylines.md) | Storyline mechanics: scarcity, creation (enough Evidence on one topic, any source), Status lifecycle, Momentum, merging, the Storyline summary, surfacing | Working on Storyline creation, lifecycle, or surfacing | ✅ Approved |
| [situations](situations.md) | Situation mechanics: category catalog, detection, Attention score, Status lifecycle, suggested actions, escalation from an Insight, surfacing | Working on Situation detection, scoring, or surfacing | ✅ Approved |
| [signals](signals.md) | Signal mechanics: source catalog, normalization, fingerprint/dedup, two-axis scoring, lifecycle, ingestion API, distillation to Evidence | Working on ingestion, scoring, or how raw input becomes Evidence | 📝 In Review |
| [evidence](evidence.md) | Evidence mechanics: the type catalog, immutability/append-only, creation from Signals, provenance, the evidence graph, explainability, visibility | Working on how facts are recorded, typed, linked, or cited | 📝 In Review |
| [inbox](inbox.md) | Signal Inbox: the `InboxItem` state machine, the batch→dedup→noise→resolve→extract→propose→reduce→commit pipeline, the LLM extraction contract, processor tiers, retention | Working on the ingestion pipeline that turns Signals into Evidence | 📝 In Review |
| [narrative](narrative.md) | Narrative mechanics: Space + Storyline scope, the section structure, Curator generation, update cadence, editability, Evidence-backing, surfacing as the briefing | Working on Narrative synthesis, generation, or surfacing | 📝 In Review |


## Untiered — unapproved backlog

Not yet placed in a structure: these are drafted/in-review or planned, and will be organized once written and approved.

| Spec | Purpose | Load this when | Status |
|------|---------|----------------|--------|
| [spaces](spaces.md) | Space hierarchy + downstream inheritance (precedence, overrides, isolation) | Working on hierarchy, scoping, or inheritance | ⬜ Planned |
| [ui-shell](ui-shell.md) | Global app shell: nav, command palette, search, layout, keyboard | Building navigation or overall layout | ⬜ Planned |
| [settings](settings.md) | Global + per-space configuration & preferences | Working on settings / configuration | ⬜ Planned |
| [home-and-briefings](home-and-briefings.md) | Operational-briefing homepage + Digest system | Building the home surface or digests | ⬜ Planned |
| [proactivity](proactivity.md) | When/how the System initiates; channels, urgency, quiet hours, anti-spam | Deciding notification/initiation behavior | ⬜ Planned |
| [conversation](conversation.md) | Chat surface: message types, bg-task spawn+embed, threads, streaming | Building chat or message handling | ⬜ Planned |
| [calendar](calendar.md) | Calendar of tasks, periodic tasks, watcher runs, deadlines, events | Building the calendar surface | ⬜ Planned |
| [memory](memory.md) | Capture, distillation, retention/decay, retrieval, semantic search | Working on memory/recall | ⬜ Planned |
| [entities](entities.md) | Entity & relationship knowledge graph | Working on entities/relationships | ⬜ Planned |
| [agents](agents.md) | Agent philosophy, types, personality-through-continuity | Working on agents | ⬜ Planned |
| [agent-orchestration](agent-orchestration.md) | How agents coordinate: delegation, hand-offs, approval routing | Working on multi-agent coordination | ⬜ Planned |
| [tools](tools.md) | Tool layer: tool model, tool-call lifecycle, secure invocation | Working on tools or tool calls | ⬜ Planned |
| [skills](skills.md) | Skills as packaged capabilities (bundles of tools) | Working on skills | ⬜ Planned |
| [tasks](tasks.md) | Task model/lifecycle, creation sources, task events, approvals | Working on tasks | ⬜ Planned |
| [periodic-tasks](periodic-tasks.md) | Recurring/scheduled automation incl. source watchers (change detection); catch-up; distillation jobs | Working on scheduling or watching | ⬜ Planned |
| [browser-automation](browser-automation.md) | Playwright workers, isolated browser profiles, approval-gating | Working on browser automation | ⬜ Planned |
| [filesystem](filesystem.md) | Local filesystem access: scoped mounts, indexing, file→signal | Working on file access | ⬜ Planned |
| [mcp](mcp.md) | MCP integration: client/server, tools→skills, scoping | Working on MCP/connectors | ⬜ Planned |
| [privacy-security](privacy-security.md) | Security posture, isolation, 3-layer auth, local models | Any security-sensitive decision | ⬜ Planned |
| [secrets](secrets.md) | Secret management; password-manager integration | Working on credential storage | ⬜ Planned |
| [permissions](permissions.md) | Approval & permission system on Always/Ask-first/Never | Working on permissions/approvals | ⬜ Planned |
| [sandboxing](sandboxing.md) | Execution isolation substrate for tools/skills/code | Working on sandboxed execution | ⬜ Planned |
| [prompt-injection](prompt-injection.md) | Untrusted-content / prompt-injection defense (P12): data-not-instructions, detection, backstops | Any ingestion or agent-security decision | ⬜ Planned |
| [activity-log](activity-log.md) | Audit/observability trail of agent/automation actions | Working on auditing/transparency | ⬜ Planned |
| [ai-models](ai-models.md) | Supported models, provider abstraction, routing | Working on model selection/routing | ⬜ Planned |
| [app-architecture](app-architecture.md) | Data flow, models, actors, orchestration, workers, server↔clients | Implementing the backend/architecture | ⬜ Planned |
| [stack](stack.md) | Go server + native clients: structure, build, libraries, rationale | Setting up the project / build | ⬜ Planned |

---

**Maintenance rule ([constitution](constitution.md) §6.3):** when a spec is approved, move it from the untiered backlog into the structured section and refine its "load this when" note. The index must always reflect reality.

## Changelog
- **2026-05-29** — Created; all 36 specs listed; `constitution` marked Approved.
- **2026-05-29** — `overview` approved; added `space-sharing` and `prompt-injection` (now 38 specs); header format fixed.
- **2026-05-29** — Sharing **deferred**: removed `space-sharing` from the tier roadmap (postponed, out of scope for the current suite). [[spaces]] covers hierarchy/inheritance/isolation only and is designed so sharing can layer on later. Retargeted former `[[space-sharing]]` links to `[[spaces]]`.
- **2026-05-29** — Renamed `concepts` → [[glossary]] and flattened its §5 vocabulary (removed thematic subsections). Retargeted all `[[concepts]]` links.
- **2026-05-29** — **Untiered all unapproved specs**: only ✅ Approved specs stay placed (`constitution`, `overview`); the rest moved to a flat untiered backlog pending the tiering rework (Product / Functional / Technical bands under discussion). Fixed stale facts: `local-first` → self-hosted; dropped `Wails` from the `app-architecture`/`stack` rows (architecture decided — Go server + native clients).
- **2026-05-29** — Drafted [how-it-works](how-it-works.md) (product-altitude feature tour) and moved it from the backlog into **Tier 2: Product overview** (📝 In Review).
- **2026-06-04** — Approved [situations](situations.md). Drafted and moved into **Tier 3** (📝 In Review): [signals](signals.md), [evidence](evidence.md), [inbox](inbox.md), [narrative](narrative.md). Extended the canonical model: Evidence typed/append-only ([data-model](data-model.md) v1.2, [glossary](glossary.md) v1.3) and Narrative at Space+Storyline scope ([storylines](storylines.md) v1.1). Created **stub files** (⬜ Planned, with intended-scope notes) for all remaining backlog specs so links resolve and intent is captured.
- **2026-05-29** — Converted all live spec links from `[[wiki-style]]` to standard Markdown `[name](name.md)` (constitution §6.3 updated); changelog references kept verbatim as historical record.
- **2026-06-03** — Drafted [data-model](data-model.md) (narrative-layer concept model + capture-and-retrieve Insight) and placed it in **Tier 3: Features** (📝 In Review). Set the [insights](insights.md) row to the capture-and-retrieve scope. Registered feature specs [storylines](storylines.md) and [situations](situations.md) in the backlog. Drafted [insights](insights.md) (capture-and-retrieve mechanics) into **Tier 3** (📝 In Review).
- **2026-06-03** — [data-model](data-model.md) **approved** (v1.0).
- **2026-06-03** — Drafted [storylines](storylines.md) (continuity-container mechanics) into **Tier 3** (📝 In Review).
- **2026-06-03** — [insights](insights.md) **approved** (v1.0).
- **2026-06-03** — [storylines](storylines.md) **approved** (v1.0); creation model = enough Evidence on one coherent topic, any source.
- **2026-06-03** — Drafted [situations](situations.md) (operational-condition mechanics) into **Tier 3** (📝 In Review); aligned the data-model Situation `category` examples to its action-shaped catalog.
