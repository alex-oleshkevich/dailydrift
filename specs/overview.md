# Overview

> **Status:** Approved
>
> **Version:** 1.0   ·   **Last updated:** 2026-05-29
>
> **Purpose:** The product north-star — what the System is, who it's for, what it deliberately is *not*, the goals, the headline use cases, and what success feels like. The no-tech vision every other spec deepens.
>
> **Load this when:** Onboarding to the project, aligning on what/why, or sanity-checking that a feature serves the vision.
>
> **Depends on:** [[constitution]]   ·   **Related:** [[glossary]], [[spaces]], [[how-it-works]], [[home-and-briefings]]

> Requirement tag: **OVR**

---

## 1. Purpose & Scope

This spec defines the **product**, not its mechanics: the vision, audience, goals, positioning, and success criteria. Where it states a product-level requirement (self-hosted, client-server, share-with-anyone), that requirement binds the suite; *how* each is realized lives downstream.

It covers: vision · audience · goals · non-goals · how it's deployed (at a product level) · headline use cases · product philosophy · what success feels like · onboarding at a glance.

It does **not** cover: domain definitions ([[glossary]]), how the System operates ([[how-it-works]]), or any implementation ([[app-architecture]], [[stack]]).

## 2. Non-Goals

- **REQ-OVR-01 — No vendor cloud / not multi-tenant SaaS.** The System is **self-hosted**: it runs on a server the user controls, and there is no provider holding their data. One deployment serves one user-or-group, not many tenants.
- **REQ-OVR-02 — No roles / orgs / teams / RBAC / SSO.** Collaboration is **sharing a Space with a person** ([[spaces]]). There is deliberately no permission-role system, no org/team objects — everything is a Space + inheritance ([[constitution]] P11).
- **Not a general coding assistant.** It can *work with* code/repos as context, but it is not an IDE copilot.
- **Multi-device is via multiple clients to one server**, not peer-to-peer sync between devices. (A manual export/import for backup/migration is a possible future addition — see §10.)

## 3. Background & Rationale

A working person's context is scattered across chat logs, files, browser tabs, notes, dashboards, and their own memory. Tools capture **events** — messages, commits, notifications, tasks — but events are not understanding. People are left to reassemble "where does this stand?", "what's blocking me?", and "what changed since I last looked?" by hand, repeatedly, across every project and every part of life.

Meanwhile, LLMs made conversational assistance cheap — but most products stopped at *chat-with-tools*: reactive, forgetful between sessions, and silent the moment you close the window. They don't *maintain* anything.

The opportunity: treat **ongoing context as the product**. Continuously observe the sources you point it at — turning their changes into **Signals** — distill those into durable understanding, surface only what matters, and keep working while you're away.

**Why this requires a server.** "Keeps thinking while you're away" is impossible on a client alone — a desktop or phone can't run background work when the machine is off or asleep. So the System is **client-server**: an **always-on, self-hosted server** is the brain (it runs the Periodic Tasks, Agents, Signal ingestion, and Memory distillation, plus the AI calls, 24/7), and **clients are views and controls** that connect when available. The server keeps working whether or not anyone's looking.

## 4. Concepts & Definitions

This spec uses domain terms (Space, Storyline, Situation, Signal, Evidence, Insight, Narrative, Memory, Digest, sharing) at an intuitive level. Canonical definitions live in [[glossary]]; the example world (you, the `Framework` product, Brightmoor, Talia, Sam, …) is fixed in [[constitution]] §7.

## 5. Detailed Specification

### 5.1 Vision

> **The System is a self-hosted operational intelligence that maintains continuous contextual awareness across your work, research, and life — and keeps thinking while you're away.** It models work as living *Situations and Storylines*, not feeds of events; it surfaces what changed, what matters, and what's blocked; and it acts on your behalf under explicit, approval-gated control. Any Space can be **shared with anyone**, so the same system serves one person or many. It should feel like a sharp **chief-of-staff + research assistant + operations dashboard** — alive, aware, proactive — without ever being creepy, spammy, or fake.

### 5.2 What it is / What it is not

| It looks like… | …but it actually is | Why the difference matters |
|---|---|---|
| A chatbot with tools | An always-on context engine running on a server, without you in the loop | **REQ-OVR-03** — value persists between sessions and survives closing every client |
| A notes app (Notion/Obsidian) | A system that *generates and maintains* its own knowledge from the Signals it ingests | You don't hand-file everything; it distills and connects automatically |
| A task manager (Todoist/Linear) | A model of *situations & momentum*, where tasks are one signal among many | It tracks "the investor reply is overdue," not just a checkbox |
| A dashboard / analytics | An *operational briefing* — what to pay attention to | It answers "what matters now?", not "here are 40 charts" |
| A team/enterprise SaaS (roles, orgs, admin) | A self-hosted system where collaboration is just *sharing a Space* | No roles/permissions matrices — you own the deployment and share by space |

### 5.3 Who it's for

Anyone who has to hold many moving contexts together — projects, clients, research, life admin — and the people they share that work with. It's used **standalone or shared**: one person, or several people sharing Spaces, with no assumption about size or "solo." It rewards technical users (repo/folder mounts, browser automation) but doesn't require them. There is **no "personal vs business" tier** — it's the same Spaces-and-sharing model either way: share `Family` with a partner or a whole `Company` space with colleagues using the identical mechanism.

### 5.4 How it's deployed (at a product level)

```mermaid
flowchart LR
    subgraph Clients["Clients (views & controls)"]
      D["Desktop client"]
      M["Mobile companion"]
    end
    D <--> S
    M <--> S
    S["Self-hosted server — always on<br/>Agents · Tasks · Memory · AI calls"]
    S --> SP["Spaces<br/>(private & shared)"]
```

- **One self-hosted server**, deployed anywhere the user controls. It is the always-on brain.
- **Desktop and mobile clients** connect to it. The **mobile client is a companion** — notifications, approving/denying permission requests on the go, quick capture, and viewing briefings/situations — which fits naturally because the *server* does the heavy, long-running work.
- Mechanics (deployment, sync, offline) live in [[app-architecture]] / [[stack]].

### 5.5 Goals

- **G1 — Maintain awareness.** Continuously turn raw Signals into durable, queryable understanding across all contexts.
- **G2 — Surface signal, suppress noise.** Tell the user what changed, what matters, what's blocked — and stay silent otherwise (P4).
- **G3 — Keep working while away.** Run research, monitoring, and automation autonomously on the always-on server, within approved bounds ([[constitution]] §5).
- **G4 — Be trustworthy.** Self-hosted, evidence-first, approval-gated, fully auditable, injection-resistant (P1, P3, P8, P9, P12).
- **G5 — Feel alive through continuity, not theater.** Earn the sense of an aware partner via Memory, timing, and judgment — never fake emotion (P7).
- **G6 — Collaborate by sharing.** Let people work in the same context by sharing Spaces with anyone — no roles, no setup ceremony (P11, [[spaces]]).

### 5.6 Headline use cases

1. **Project & work continuity.** Across `Framework`, `Brightmoor`, and research Spaces, the System keeps Storylines and Situations current — "the *Framework UI direction* has looped four times with no RFC," "the Brightmoor portal is blocked on Devin's sign-off."
2. **Autonomous research.** You point it at a question (e.g. consensus approaches with Dr. Belov); it keeps searching, reading, and synthesizing on the server, returning evidence-backed findings rather than a one-shot answer.
3. **Browser automation.** In isolated profiles it logs in, fills forms, extracts data, and watches pages — e.g. detecting that the *Stripe automation is blocked by an expired login* and flagging it.
4. **Watching & Digests.** A periodic task watches a competitor's release notes, the `framework`'s key npm dependency, Northwind Cloud's pricing, and flight prices for the family trip — rolling only meaningful changes into a morning briefing and a weekly Digest.
5. **Sharing a context.** Share the `Brightmoor` space with Devin, or `Family` with Sam — it appears in their menu and they extend it. The same mechanism covers a client, a contractor, or a partner.

### 5.7 Product philosophy

The System is **narrative-driven, not event-driven** (P2): it models stories and operational states, not logs. Its "personality" is **continuity, timing, and judgment** (P7) — it notices recurring patterns, references prior context, continues investigations, challenges weak ideas, and surfaces contradictions, always **evidence-first** (P3) and never psychoanalyzing (P5). It is **proactive but quiet** (P4): silence is the default. And it is **trustworthy by construction** — self-hosted, least-privilege, space/person-isolated, approval-gated, auditable, and resistant to prompt injection (P1, P6, P8–P12). These are the constitution's binding principles applied to the product.

### 5.8 What success feels like

- You open any client and, in three sentences, know exactly where everything stands.
- You feel it **kept thinking while you were away** — research advanced, a price dropped, a doc changed, a promise came due — and it tells you only the parts worth knowing.
- It **catches what you'd miss**: a looping decision, an overdue reply, a blocked automation, a contradiction between two notes.
- You **trust it with autonomy** because every consequential action is gated and every past action is inspectable.
- **Sharing just works**: a space you share shows up for the other person and they can build on it — no roles to configure.
- It never makes you feel **watched, nagged, or managed**. When it's quiet, that's correct.

### 5.9 Onboarding at a glance

First use is about **establishing scope, not configuration**: stand up the server (self-host it wherever you like), connect a desktop or mobile client, create your first Spaces, optionally mount a folder, connect a browser profile, or share a Space with someone — and state a few things you care about. From there the server begins observing and briefing. The principle is **incremental, visible reach** (P6): nothing is assumed. Full flows live in [[ui-shell]], [[spaces]], [[filesystem]], [[settings]].

## 6. Visualizations

### 6.1 The System at a glance

```mermaid
flowchart LR
    SIG["Signals<br/>messages · files · web · browser"] --> CORE
    AUTO["Server workers<br/>Agents · Tasks"] --> CORE
    CORE["Contextual core (server)<br/>Memory · Storylines · Situations · Insights"] --> SURF["Surfaces (clients)<br/>Briefing · Conversation · Calendar"]
```

### 6.2 A morning, on a timeline

| Time | What the server did while away | What a client surfaces |
|------|--------------------------------|------------------------|
| overnight | npm dep for `framework` shipped a major; competitor posted release notes | "Two release changes touch your roadmap — 1 may be a breaking upgrade." |
| overnight | Stripe automation run hit an expired login | Attention-Needed: "Stripe automation blocked — reconnect login to resume." |
| 06:00 | research agent advanced the consensus question | "3 new sources on consensus; one contradicts Dr. Belov's assumption." |
| 07:10 | a permission request was parked (outbound email to Devin) | Push to your phone: "Approve sending the cost-impact note to Devin?" |
| 08:30 | you open a client | A 3-sentence briefing + the items above, nothing else. |

## 7. Data Shapes

*(Not applicable — overview defines no data. See [[data-model]].)*

## 8. Examples & Use Cases

### Example A — "Re-entering a looping decision" (narrative)
You haven't touched the `Framework` Space in two weeks. You open a client. The System: *"The Framework UI direction is looping again — you've revisited the component approach four times since March, each time without writing the RFC you said you'd write. Three notes contradict each other on routing. Want me to draft the RFC skeleton from those notes?"* This is P2 (narrative), P3 (evidence), and P7 (continuity, gentle challenge) at once.

### Example B — "Autonomy with a guardrail" (Given/When/Then)
- **Given** a periodic task watching Northwind Cloud's pricing page, no standing grant to act on changes, and your desktop is **closed**.
- **When** the page changes overnight and the server's follow-up would *email Devin to flag the cost impact*.
- **Then** the server does the Always parts autonomously (detect, summarize, attach Evidence to the *Operations* Storyline) but **parks** the outbound email as an Ask-first request and **pushes it to your phone** — you approve from the mobile companion, and the server resumes. (Per [[constitution]] §5.2.)

### Example C — "Quiet is correct" (Given/When/Then)
- **Given** a normal day with no meaningful changes across any Space.
- **When** the user opens a client.
- **Then** the briefing says so plainly ("Nothing needs you this morning; consensus research is continuing") rather than manufacturing activity (P4).

### Example D — "Sharing a Space" (Given/When/Then)
- **Given** you own the `Brightmoor` space and want Devin involved.
- **When** you share `Brightmoor` with Devin.
- **Then** it appears in **Devin's** menu; he can open and **extend** it (add child Spaces, Evidence), and you both work the same context — while your private ancestor spaces (`Personal`, `Finance`) remain invisible to him (downstream-only, P10). No roles were configured.

## 9. Edge Cases & Failure Modes

- **Nothing to say.** The System reports "no change worth your attention" rather than padding briefings.
- **All clients offline.** The server keeps working and queues briefings, results, and **parked approvals**; they appear when a client reconnects (push where possible).
- **Over-reach temptation.** If a use case seems to need broad machine access or unattended outbound action, narrow scope or add an approval — don't loosen P6/P8.
- **Shared-space privacy.** Sharing must never expose the owner's private ancestor spaces (P10); if a feature can't honor that, it's wrong.

## 10. Open Questions & Decisions

- **OQ-1 — Product name.** Deferred; no suitable domain is free. Specs use "the System" ([[constitution]] §1).
- **OQ-2 — Export/import.** Peer sync is a non-goal, but a manual export/import for backup/migration is likely desirable. Deferred ([[privacy-security]] / [[app-architecture]]).
- **OQ-3 — Mobile parity.** Companion-first is decided; whether mobile later grows toward parity is open.
- **OQ-4 — Onboarding depth.** How far to simplify for non-technical users without diluting the power-user core. Revisit with [[ui-shell]].

## 11. Review & Acceptance Checklist

- [ ] The vision (§5.1) states the product in one quotable paragraph, not solo-bound.
- [ ] "What it is / is not" distinguishes the System from chatbot, notes app, task manager, dashboard, and team SaaS.
- [ ] Audience (§5.3) makes no solo/one-person assumption and states standalone-or-shared with no personal/business tier.
- [ ] Goals (G1–G6) and non-goals (no vendor cloud, no roles/orgs, not a coding assistant) are explicit.
- [ ] The client-server / always-on-server rationale is stated (why a client alone can't deliver "keeps thinking while away").
- [ ] All five hero use cases (incl. sharing) are present and grounded in the cast.
- [ ] Philosophy ties back to the constitution's principles (P1–P12).
- [ ] At least two end-to-end examples, with behavioral ones in Given/When/Then, incl. a sharing example.
- [ ] No tech detail leaks in (no Go/Wails specifics); no placeholders/TODOs.

## 12. Cross-References

- [[constitution]] — the principles (P1–P12) and example cast this spec applies.
- [[spaces]] — the hierarchy and sharing behind the multi-context and collaboration use cases.
- [[glossary]] — definitions used loosely here.
- [[how-it-works]] — the operating loop that realizes this vision.
- [[home-and-briefings]] — the briefing experience in §5.8/§6.2.

## 13. Changelog

- **2026-05-29 — v0.1** — Initial draft: vision, anti-positioning, audience, goals/non-goals, four hero use cases, philosophy, success, onboarding, concept map + timeline + three examples.
- **2026-05-29 — v0.2** — Reframed to the settled architecture: client-server / self-hosted always-on server (with rationale), desktop + mobile companion clients, share-with-anyone (no roles/orgs/tiers), prompt-injection resilience (P12). Removed solo/one-person framing and the no-mobile/no-multi-device/no-team non-goals; added G6 (collaborate by sharing), use case #5, Example D (sharing), and a deployment diagram.
- **2026-05-29 — v1.0** — Terminology pass (Signals, canonical capitalization); approved.
- **2026-05-29 — v1.1** — Removed **Monitor** (folded into Periodic Task), **Note**, and **Bookmark**: reworked use case #4 (Monitoring → Watching), the deployment/at-a-glance diagrams, the Signals sources, the term list, and the sharing example accordingly.
