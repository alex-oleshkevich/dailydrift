# Concepts

> **Status:** In Review
>
> **Version:** 0.1   ·   **Last updated:** 2026-05-29
>
> **Purpose:** The canonical glossary — the shared vocabulary every other spec uses. Each term gets one authoritative definition, a cast example, and how it relates to the others; full mechanics live in each term's dedicated spec.
>
> **Load this when:** A domain term is unclear, or you're about to define/use a term in another spec (check it matches here first).
>
> **Depends on:** [[constitution]]   ·   **Related:** [[spaces]], [[space-sharing]], [[signals]], [[insights]], [[memory]], [[entities]], [[data-model]]

> Requirement tag: **CON**

---

## 1. Purpose & Scope

This is the **dictionary** for the System. It fixes what each term *means* and how the terms relate, so 38 specs stay consistent. For each term it gives: a **definition**, an **example** from the cast ([[constitution]] §7), and a **→ pointer** to the dedicated spec that owns the full mechanics.

It is intentionally a **glossary, not a manual**: it does not explain *how* anything works (that's the dedicated specs) or *how data is stored* (that's [[data-model]]). When a definition here and a dedicated spec disagree, the dedicated spec wins for mechanics, but the **term's meaning here is canonical** — update both together.

## 2. Non-Goals

- Not the mechanics of any subsystem (see the dedicated specs).
- Not the data schema / persistence ([[data-model]], [[app-architecture]]).
- Not an exhaustive UI vocabulary (surfaces are defined in their own specs).

## 3. Background & Rationale

A system that "remembers, connects, and continues" needs a stable, shared language. If "Storyline" means one thing in `home-and-briefings` and another in `insights`, the product fractures. One glossary, owned here, keeps every spec — and the eventual code — speaking the same words.

## 4. How to read this glossary

Each entry: **Term** (`id-prefix`) — definition. *Example:* … · *Relates to:* … · *→ spec.* Domain terms are always capitalized when they denote the concept ([[constitution]] §6.2). The **knowledge pipeline** (§5.3) is the spine; read it first.

## 5. The vocabulary

### 5.1 The container

- **Space** (`space_`) — the **only primitive** and universal organizing container: a node in one hierarchy, with **downstream inheritance** (children inherit a parent's config/context). A Space may be private or **shared with a Person**. Everything else lives inside a Space. *Example:* `Business/Framework`. *→ [[spaces]], [[space-sharing]].* (Constitution P11)
- **Person** — someone a Space is **shared** with; they see the shared Space in their own menu and can extend it. There are **no roles** — sharing is the whole model. *Example:* you share `Family` with **Sam Rivera**. *→ [[space-sharing]].*

### 5.2 The narrative layer

- **Storyline** (`story_`) — a long-running **narrative thread** of related work and events inside a Space; carries Momentum, Status, Open questions, Evidence, and related Entities. *Example:* the *Framework UI direction* Storyline, looping for months. *Relates to:* draws on Evidence; spawns Insights; summarized in the Narrative.
- **Situation** (`sit_`) — an **operational state that needs awareness now**; carries an Attention score, Status, Evidence, and suggested actions; usually tied to a Storyline. *Example:* *Stripe automation blocked by expired login.* *Relates to:* surfaced in Home → Attention-Needed ([[home-and-briefings]]).
- **Momentum** — how a Storyline is **moving**: *advancing · steady · stalled · looping.* Drives "what's progressing vs stuck." *Example:* the Framework UI direction's Momentum = *looping* (revisited four times, no RFC).
- **Attention score** — how much a Situation **needs the user now**; ranks the briefing. *Example:* an overdue reply to Talia scores higher each day it slips.
- **Open question** — an **unresolved question** attached to a Storyline that the System keeps surfacing until answered. *Example:* "What's the container-isolation strategy?"
- **Promise** — a **commitment** (made by you, or to you) the System tracks to *fulfilled* or *overdue*. *Example:* you promised Devin the Brightmoor portal estimate by Friday.
- **Status** — the lifecycle state of a Storyline or Situation (*active · blocked · resolved · dormant*).

### 5.3 The knowledge pipeline (the spine)

> **REQ-CON-01.** Knowledge flows **Signal → Evidence → (Storyline / Situation) → Insight**, and is summarized in the **Narrative**. **REQ-CON-02.** Every Insight and surfaced claim must cite the Evidence behind it (Constitution P3).

- **Signal** (`sig_`) — a **meaningful change entering the System** from a source: a message, file change, web/page change, Note, Bookmark, browser activity, a Monitor firing, or an external connector. The raw input unit. *Example:* the competitor's release-notes page changed overnight. *→ [[signals]].*
- **Evidence** (`ev_`) — a **normalized, attributable fact** distilled from one or more Signals, carrying provenance (where it came from, when). The citable substance behind everything. *Example:* "Northwind raised the Pro tier 18% on 2026-05-28 (source: pricing page diff)."
- **Insight** (`ins_`) — a **synthesized observation** that is evidence-backed and actionable. Categories: *contradiction · opportunity · risk · stale work · dependency · anomaly · repetition · synthesis · promise-tracking.* *Example:* a *repetition* Insight: "You've revisited the Framework routing decision four times without an RFC." *→ [[insights]].*
- **Narrative** — the **editable per-Space summary**: current state, active Storylines, open questions, risks. It is both human-editable memory *and* the System's context-compression layer. One Narrative per Space. *Example:* the `Framework` Space's Narrative opens with "Converging on component model; routing still unresolved." *→ [[memory]].*
- **Memory** (`mem_`) — **durable distilled knowledge** the System retains and retrieves (facts, preferences, summaries), subject to retention/decay. *Example:* it remembers you prefer terse briefings. *→ [[memory]].*
- **Entity** (`ent_`) — a **real-world thing** tracked in a knowledge graph (person, company, product, repo), linking Storylines, Evidence, and Notes. *Example:* `Stripe`, `Talia Brandt`, the `framework` repo. *→ [[entities]].*

### 5.4 Work & automation

- **Task** (`task_`) — a **unit of work** with a lifecycle and events; created by the user, an Agent, a Signal/Insight, or from chat. *Example:* "Draft the Framework RFC skeleton." *→ [[tasks]].*
- **Periodic Task** (`ptask_`) — a **recurring/scheduled** Task. *Example:* nightly Memory distillation; the weekly Digest. *→ [[periodic-tasks]].*
- **Monitor** (`mon_`) — a **continuous watcher** of a source that emits Signals on meaningful change; attaches to Storylines/Situations. *Example:* a Monitor on Northwind's pricing page. *→ [[monitors]].*

### 5.5 Capability

- **Agent** (`agent_`) — a **scoped, role-based actor** (Executive · Research · Browser · Memory Curator · Ops), observable and bounded by Always/Ask-first/Never. *→ [[agents]], [[agent-orchestration]].*
- **Skill** (`skill_`) — a **packaged capability**: a bundle of Tools, prompts, permissions, and a sandbox policy that an Agent receives and a Space constrains. *Example:* a "release-watcher" Skill. *→ [[skills]].*
- **Tool** — a **single callable capability** with a typed input/output contract and a declared risk tier; the unit a Skill bundles and an Agent invokes. *Example:* `fetch_page`, `send_email`. *→ [[tools]].*

### 5.6 Surfaces & I/O

- **Conversation** (`conv_`) / **Message** (`msg_`) — a **chat thread** scoped to a Space/Storyline, and its typed messages (user, assistant, Insight card, permission request, artifact, task-progress embed, …). *→ [[conversation]].*
- **Note** (`note_`) / **Bookmark** (`bm_`) — **first-class knowledge objects** the user captures; they can become Evidence and spawn Monitors. *→ [[notes-bookmarks]].*
- **Digest** — a **periodic roll-up briefing** (daily · weekly · space · monitor · blocked-work · insight). *→ [[home-and-briefings]].*

## 6. Visualizations

### 6.1 The knowledge pipeline

```mermaid
flowchart LR
    SRC["Source / Monitor"] --> SIG["Signal"]
    SIG --> EV["Evidence"]
    EV --> ST["Storyline"]
    EV --> SI["Situation"]
    ST --> INS["Insight"]
    SI --> INS
    EV --> INS
    ST --> NAR["Narrative (per Space)"]
    SI --> NAR
```

*Everything above lives inside a **Space**. **Entities** link across Storylines/Evidence/Notes; **Memory** retains the distilled result; **Agents/Monitors/Tasks** drive the flow on the server.*

### 6.2 Where each term is owned

| Layer | Terms | Owned by |
|------|-------|----------|
| Container | Space, Person | [[spaces]], [[space-sharing]] |
| Narrative | Storyline, Situation, Momentum, Attention score, Open question, Promise, Status | [[concepts]] (here) + surfaced in [[home-and-briefings]] |
| Pipeline | Signal, Evidence, Insight, Narrative, Memory, Entity | [[signals]], [[insights]], [[memory]], [[entities]] |
| Work | Task, Periodic Task, Monitor | [[tasks]], [[periodic-tasks]], [[monitors]] |
| Capability | Agent, Skill, Tool | [[agents]], [[skills]], [[tools]] |
| Surfaces | Conversation, Message, Note, Bookmark, Digest | [[conversation]], [[notes-bookmarks]], [[home-and-briefings]] |

## 7. Data Shapes

*(Not here — the conceptual entity-relationship model is [[data-model]]; this glossary only names and defines.)*

## 8. Examples & Use Cases

### Example A — a change becomes understanding (narrative)
The Monitor on the competitor's release-notes page fires → a **Signal**. The System normalizes it into **Evidence** ("competitor shipped feature X, 2026-05-28"). That Evidence attaches to the *Framework UI direction* **Storyline** and, combined with three prior revisits, produces a *repetition* **Insight** ("you keep circling routing without deciding"). The `Framework` Space's **Narrative** is updated to reflect the unresolved decision, and its **Momentum** stays *looping*.

### Example B — a promise becomes a situation (Given/When/Then)
- **Given** a **Promise** captured from chat: "send Devin the portal estimate by Friday."
- **When** Friday passes with no send.
- **Then** the System raises a **Situation** ("portal estimate to Devin overdue") with a rising **Attention score**, surfaced in the next briefing — tracked as a *promise-tracking* **Insight**, evidence-backed by the original message.

## 9. Open Questions & Decisions

- **OQ-CON-1** — Is there exactly one **Narrative** per Space, or can large Spaces have sub-Narratives? (Resolve in [[memory]]/[[spaces]].)
- **OQ-CON-2** — Does **Evidence** dedupe/merge across multiple Signals, and where does that live? (Resolve in [[signals]]/[[memory]].)
- **OQ-CON-3** — Is **Status** a shared enum across Storyline and Situation, or per-type? (Resolve in [[data-model]].)

## 10. Review & Acceptance Checklist

- [ ] Every core term has a one-line canonical definition, a cast example, and a pointer to its owning spec.
- [ ] The knowledge pipeline (Signal → Evidence → Storyline/Situation → Insight → Narrative) is stated as an invariant (REQ-CON-01) with evidence-backing (REQ-CON-02).
- [ ] The four supporting attributes (Momentum, Attention score, Promise, Open question) are defined as first-class.
- [ ] No mechanics or data-schema detail leaked in; no placeholders.
- [ ] Term capitalization matches [[constitution]] §6.2.

## 11. Cross-References

- [[constitution]] — capitalization rules (§6.2) and the example cast (§7).
- [[spaces]] / [[space-sharing]] — Space and Person.
- [[signals]] / [[insights]] / [[memory]] / [[entities]] — the pipeline terms in depth.
- [[data-model]] — how these entities relate and are identified.

## 12. Changelog

- **2026-05-29 — v0.1** — Initial glossary: container, narrative layer (with Momentum/Attention/Promise/Open question), knowledge pipeline, work & automation, capability, surfaces; pipeline diagram + ownership table; Storyline/Narrative naming.
