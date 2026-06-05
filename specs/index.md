# Spec Index — Loading Guide

> **Status:** Living (continuously maintained)
>
> **Version:** —   ·   **Last updated:** 2026-05-29
>
> **Purpose:** The map of the whole specification suite. For each spec: its path, what it defines, *when to load it*, and its current status. This is the **extended table of contents** — read it first, then load only the specs a task actually needs (per [constitution](constitution.md) §6.3).

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
| [signals](signals.md) | Signal mechanics: source catalog, normalization, fingerprint/dedup, two-axis scoring, lifecycle, ingestion API, distillation to Evidence | Working on ingestion, scoring, or how raw input becomes Evidence | ✅ Approved |
| [evidence](evidence.md) | Evidence mechanics: the type catalog, immutability/append-only, creation from Signals, provenance, the evidence graph, explainability, visibility | Working on how facts are recorded, typed, linked, or cited | ✅ Approved |
| [inbox](inbox.md) | Signal Inbox: the `InboxItem` state machine, the batch→dedup→noise→resolve→extract→propose→reduce→commit pipeline, the LLM extraction contract, processor tiers, retention | Working on the ingestion pipeline that turns Signals into Evidence | ✅ Approved |
| [narrative](narrative.md) | Narrative mechanics: Space + Storyline scope, the section structure, Curator generation, update cadence, editability, Evidence-backing, surfacing as the briefing | Working on Narrative synthesis, generation, or surfacing | ✅ Approved |
| [memory](memory.md) | Memory mechanics: durable knowledge (`mem_`) + the shared semantic index, recall + scoring, decay/forgetting, distillation, and the extract/update/reflect LLM contracts | Working on memory, recall, decay, or the embedding substrate | ✅ Approved |
| [curator](curator.md) | The background state-maintenance engine: triggers, the 7-job catalog, the reconciliation/patch transaction, the mutation boundary, hybrid rules+LLM reasoning, and the merge-split / insight-evaluation / cleanup prompts | Working on background maintenance, jobs, triggers, or the reconciliation engine | ✅ Approved |
| [tasks](tasks.md) | Tasks: the **agentic, recursive** `task_` (a goal) — plan→route→execute→review, the 8-state lifecycle incl. `awaiting_approval`, decomposition into subtasks, cancellation (`cancel_reason` + cascade), and the separate reviewer-quality vs user-permission gates | Working on tasks, decomposition, execution, review, approval, or cancellation | ✅ Approved |
| [periodic-tasks](periodic-tasks.md) | Periodic Tasks (`ptask_`): a UTC cron schedule that **enqueues a Task** — no watcher, no runs (watching = a Task that emits a Signal) | Working on scheduling | ✅ Approved |
| [agents](agents.md) | Agents: the production-grade Agent definition (name/role/when-to-use/system_prompt/personality/skills/tools+policy/model/mode/sandbox/depth) + the built-in & user-definable roster | Working on agents, the agent definition, or the roster | 📝 In Review |
| [agent-orchestration](agent-orchestration.md) | The task-execution loop: plan → route → dispatch isolated workers → synthesize → review → replan/escalate, with the plan/route/review/replan LLM prompts; depth-1 | Working on planning, routing, dispatch, review, or replanning | 📝 In Review |
| [prompt-injection](prompt-injection.md) | System-wide injection defense (P12): the lethal-trifecta threat model, defense-in-depth, the canonical untrusted-content envelope, quarantine/reader-agent, detection→`statement` Evidence + `security` Situation, and the §5 gate backstop | Hardening any path that feeds external content into a model, or designing an LLM prompt contract | ✅ Approved |
| [sandboxing](sandboxing.md) | Execution isolation (no-root, userspace, latest-OS): the per-agent sandbox profile (fs/network/exec/resources) + pluggable backends — native (Linux Landlock+seccomp, macOS Seatbelt, Windows restricted-token), systemd (`systemd-run --user`), and rootless containers (Podman, Apple `container`; Docker optional); best-effort + warn; the L4 containment layer | Confining tool/code execution, or setting an agent's `sandbox` profile | ✅ Approved |
| [secrets](secrets.md) | Credential substrate: the opaque `secret_` handle (`secret://provider/path#field`), pluggable providers (local default · env · keychain · Vault · AWS/GCP/Azure · Bitwarden/1Password/Doppler/Infisical · OneCLI Agent Vault), the broker that resolves + injects **outside the worker** (proxy preferred), lifecycle/leases/rotation, audit, redaction | Credential storage/use, or wiring a provider | ✅ Approved |
| [ai-models](ai-models.md) | The inference layer: model **cards** + **tiers** (Fast/Standard/Strong), **task→requirement** + deterministic-then-semantic **selection/routing**, fallback≠escalation, local-by-default (P1), the embedding model, structured-output/caching/tokens, keys-as-secret-handles, and a researched **purpose→models catalog** (snapshot) | Choosing/routing models, or setting an agent's `model` | 📝 In Review |


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
| [entities](entities.md) | Entity & relationship knowledge graph | Working on entities/relationships | ⬜ Planned |
| [tools](tools.md) | Tool layer: tool model, tool-call lifecycle, secure invocation | Working on tools or tool calls | ⬜ Planned |
| [skills](skills.md) | Skills as packaged capabilities (bundles of tools) | Working on skills | ⬜ Planned |
| [browser-automation](browser-automation.md) | Playwright workers, isolated browser profiles, approval-gating | Working on browser automation | ⬜ Planned |
| [filesystem](filesystem.md) | Local filesystem access: scoped mounts, indexing, file→signal | Working on file access | ⬜ Planned |
| [mcp](mcp.md) | MCP integration: client/server, tools→skills, scoping | Working on MCP/connectors | ⬜ Planned |
| [privacy-security](privacy-security.md) | Security posture, isolation, 3-layer auth, local models | Any security-sensitive decision | ⬜ Planned |
| [permissions](permissions.md) | Approval & permission system on Always/Ask-first/Never | Working on permissions/approvals | ⬜ Planned |
| [activity-log](activity-log.md) | Audit/observability trail of agent/automation actions | Working on auditing/transparency | ⬜ Planned |
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
- **2026-06-04** — Approved [situations](situations.md). Drafted and moved into **Tier 3** (📝 In Review): [signals](signals.md), [evidence](evidence.md), [inbox](inbox.md), [narrative](narrative.md). Extended the canonical model: Evidence typed/append-only ([data-model](data-model.md) v1.2, [glossary](glossary.md) v1.3) and Narrative at Space+Storyline scope ([storylines](storylines.md) v1.1). Created **stub drafts** (⬜ Planned, with intended-scope notes) only for the backlog specs that carry concrete ideas from this session — `memory`, `agents`, `entities`, `proactivity`, `home-and-briefings`, `ai-models`, `prompt-injection` (and later `app-architecture`, given the memory-subsystem stack); the rest stay ⬜ Planned (tracked here + in beads) without an empty file.
- **2026-06-04** — **Approved** [signals](signals.md), [evidence](evidence.md), [inbox](inbox.md), [narrative](narrative.md), [memory](memory.md) (all v1.0). The full ingestion → knowledge → synthesis pipeline is now approved.
- **2026-06-04** — Drafted [curator](curator.md) (📝 In Review) — the background state-maintenance engine. Renamed the "Memory Curator" agent role → the **Curator** engine across [glossary](glossary.md), [agents](agents.md), and the approved primitive specs.
- **2026-06-04** — Drafted [tasks](tasks.md) + [periodic-tasks](periodic-tasks.md) (📝 In Review) — a **deliberately simple** task queue (no retries/idempotency/DLQ/engine); mid-task approval modeled via the `approval` Situation, not a task status. Captured the shared queue/scheduler runtime in [app-architecture](app-architecture.md).
- **2026-06-04** — Reframed Tasks as **agentic** (recursive plan-and-execute, `awaiting_approval` status, `depends_on`, emit-Signal); drafted [agents](agents.md) + [agent-orchestration](agent-orchestration.md) (📝 In Review, **code-grounded** in OpenClaw/opencode/Claude Code/Anthropic/CrewAI/Hermes); **gutted** periodic-tasks to "schedule enqueues a Task" (no watcher/runs).
- **2026-06-05** — Authored [prompt-injection](prompt-injection.md) (📝 In Review, v0.1) — the System-wide injection-defense spec (P12's home): lethal-trifecta threat model + OWASP LLM01/LLM06, defense-in-depth, the **canonical untrusted-content envelope** as the normative house standard, quarantine/reader-agent, advisory detection → `statement` Evidence + a quiet `security` Situation, and the §5 gates as the deterministic backstop. Code-grounded in OpenClaw (`external-content.ts`/`pi-tools.policy.ts`/security docs) + Willison's lethal trifecta. Promoted from the Planned backlog into **Tier 3**. Also extended [agent-orchestration](agent-orchestration.md) → v0.4 (Go interface/struct reference + Mermaid example flows).
- **2026-06-05** — Authored [sandboxing](sandboxing.md) (📝 In Review, v0.1) — execution isolation under a **no-root / userspace** constraint: a **per-agent declarative profile** (filesystem/network/exec/resources) enforced by **pluggable native backends** — Linux **Landlock + seccomp-bpf + `no_new_privs`**, macOS **Seatbelt** (`sandbox-exec`), Windows **restricted-token + ACLs + Firewall + Job Object** — with **Docker optional** (never default). **Best-effort + warn** (surface residual gaps, never claim full containment); secrets never enter the sandbox (broker injects at request time); the L4 containment layer of [prompt-injection](prompt-injection.md). Code-grounded: OpenClaw `types.sandbox.ts`/`docker.ts` (verbatim), nanoclaw's whole-agent principle (web-sourced), native primitives (Codex/nono/OWASP). Promoted into **Tier 3**.
- **2026-06-05** — **Approved** [prompt-injection](prompt-injection.md) (v1.0); added §7.2 Go reference implementation to [secrets](secrets.md) (v0.2) and **Approved** it (v1.0).
- **2026-06-05** — Authored [ai-models](ai-models.md) (📝 In Review, v0.1) — the inference layer: model **cards** + **tiers** (Fast/Standard/Strong + reasoning/vision/embedding flags), a **task→requirement** registry + **deterministic-then-semantic selection** (L1 tier-match → L2 cheap classifier → agent override) answering *how to detect the right model*, **fallback≠escalation**, **local-by-default** (P1) with opt-in remote, the single dimension-locked **embedding model**, structured-output/caching/token-budgeting/thinking, **keys as secret handles**, fitness/evals, and a researched **purpose→models catalog snapshot** (Opus 4.8/4.7 · GPT-5.5 · Gemini 3.5 Flash · MiniMax M3/GLM-5.1/Kimi K2.6/DeepSeek V4 · BGE-M3/Voyage/OpenAI-3). §7 Go enums/structs/interfaces. Code-grounded: OpenClaw `types.models.ts`/`model-fallback.ts` (verbatim) + RouteLLM/semantic-router. Promoted into **Tier 3**.
- **2026-06-05** — Extended [sandboxing](sandboxing.md) → v0.2 (container backends: rootless **Podman** + **Apple `container`**, Docker optional; **systemd** backend; target current OS releases) and **Approved** it (v1.0).
- **2026-06-05** — Authored [secrets](secrets.md) (📝 In Review, v0.1) — the credential substrate explaining REQ-SBX-13: the opaque **`secret_` handle** (`secret://provider/path#field`), a **pluggable provider catalog** (local default · env/.env · keychain · HashiCorp Vault · AWS/GCP/Azure · Bitwarden/1Password/Doppler/Infisical · **OneCLI Agent Vault**), the **broker** that resolves + **injects outside the worker** (egress proxy preferred), lifecycle/leases/rotation/revocation, value-free audit, redaction, and OAuth auto-refresh. §7 gives Go enums/structs/interfaces. Code-grounded: OpenClaw `auth-profiles`/`redact.ts` (verbatim), nanoclaw Agent Vault, 1Password `op://`, OWASP. Promoted into **Tier 3**.
- **2026-06-04** — **Approved** [curator](curator.md), [tasks](tasks.md), [periodic-tasks](periodic-tasks.md) (all v1.0). Self-review of the agent layer: dropped the `memory_scope` + `builtin` fields, **collapsed the roster** to `Executive`/`Research`/`Ops`/`Reviewer` (`Browser` → a user-defined `Ops` specialization), and made **agents memory-stateless** — the orchestrator injects recalled Memory ([memory](memory.md) v1.1, REQ-MEM-16). Added **inline verbatim "◆ Source pattern" call-outs** from the grounding projects (OpenClaw/opencode/Claude Code/Anthropic/mem0) to [agents](agents.md) v0.3, [agent-orchestration](agent-orchestration.md) v0.3, [memory](memory.md) v1.2.
- **2026-05-29** — Converted all live spec links from `[[wiki-style]]` to standard Markdown `[name](name.md)` (constitution §6.3 updated); changelog references kept verbatim as historical record.
- **2026-06-03** — Drafted [data-model](data-model.md) (narrative-layer concept model + capture-and-retrieve Insight) and placed it in **Tier 3: Features** (📝 In Review). Set the [insights](insights.md) row to the capture-and-retrieve scope. Registered feature specs [storylines](storylines.md) and [situations](situations.md) in the backlog. Drafted [insights](insights.md) (capture-and-retrieve mechanics) into **Tier 3** (📝 In Review).
- **2026-06-03** — [data-model](data-model.md) **approved** (v1.0).
- **2026-06-03** — Drafted [storylines](storylines.md) (continuity-container mechanics) into **Tier 3** (📝 In Review).
- **2026-06-03** — [insights](insights.md) **approved** (v1.0).
- **2026-06-03** — [storylines](storylines.md) **approved** (v1.0); creation model = enough Evidence on one coherent topic, any source.
- **2026-06-03** — Drafted [situations](situations.md) (operational-condition mechanics) into **Tier 3** (📝 In Review); aligned the data-model Situation `category` examples to its action-shaped catalog.
