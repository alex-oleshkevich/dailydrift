# MCP

> **Status:** Approved
>
> **Version:** 1.0   ·   **Last updated:** 2026-06-08
>
> **Purpose:** The System as a real **Model Context Protocol host/client** — how external **MCP servers** (`mcp_`) are connected, authorized, isolated, and imported as Tools, treating every server as untrusted.
>
> **Depends on:** [constitution](constitution.md), [tools](tools.md), [permissions](permissions.md), [secrets](secrets.md), [sandboxing](sandboxing.md), [prompt-injection](prompt-injection.md)   ·   **Related:** [agents](agents.md), [skills](skills.md), [spaces](spaces.md), [activity-log](activity-log.md)

> Requirement tag: **MCP**

---

## 1. Purpose & Scope

This spec makes the System a **real Model Context Protocol host** — wire-compatible with the MCP ecosystem — so external **servers** (Gmail, GitHub, Slack, and the long tail) can supply [Tools](tools.md) without bespoke connectors. It owns the **client/host roles**, **transports**, **authorization**, **per-server isolation**, the **import** of server tools into the System's Tool catalog, and the **trust posture** toward servers that are, by default, **untrusted third-party code**.

The guiding stance, from current MCP security practice: **the host is the policy and trust enforcement point; the server is not trusted.** Tool descriptions, schemas, and results from a server are untrusted content; servers are sandboxed, pinned, scoped, and audited.

## 2. Non-Goals / Out of Scope

- **The Tool shape and tool-call lifecycle** — owned by [tools](tools.md); imported MCP tools take that shape and run that lifecycle.
- **Gate 1 / grants** — owned by [permissions](permissions.md); this spec fixes that *enabling a server* is Ask-first and Space-scoped.
- **Credential storage & rotation** — owned by [secrets](secrets.md); connector tokens are handles the broker stores and refreshes.
- **Sandbox enforcement** — owned by [sandboxing](sandboxing.md); a server runs inside a profile this spec parameterizes.
- **Authoring our own MCP *servers*** (exposing the System over MCP) — out of scope here; this spec covers the System as **client/host**.

## 3. Background & Rationale

MCP has become the cross-vendor standard for connecting models to tools, and building a real host (rather than a custom wrapper) buys access to the entire server ecosystem. But that ecosystem is the **threat surface**: servers are third-party processes whose tool descriptions are injected into the model's context, whose results re-enter privileged reasoning, and whose code may be malicious or compromised. The documented attack classes — **tool poisoning**, **rug pulls**, **confused-deputy/token theft**, **cross-server shadowing**, **line-jumping**, and **supply-chain** compromise — all exploit a host that trusts servers.

So the design treats MCP as *"untrusted capability behind a hardened boundary."* Each server gets its own isolated client, a default-deny egress allowlist, pinned-and-re-approved tool definitions, audience-bound tokens with **no passthrough**, credentials injected outside the worker, and Space-scoped, Ask-first enablement. The host never assumes a server is honest; it makes a dishonest server **contained and observable**.

## 4. Concepts & Definitions

- **MCP server** (`mcp_`) — an external connector exposing **tools / resources / prompts** over MCP. *Examples:* `mcp_github`, `mcp_gmail`.
- **Host / client** — the System is the **host**; it spawns **one client per server** over a dedicated 1:1 connection and is the trust/policy enforcement point.
- **Transport** — **stdio** (local subprocess) or **Streamable HTTP** (remote, OAuth-authorized).
- **Primitive** — **tools** (model-invoked), **resources** (context data), **prompts** (user-selected templates); negotiated at `initialize`.
- **Definition pin** — a content hash of a server's advertised tool set captured at approval; a change invalidates it (anti rug-pull).

## 5. Detailed Specification

### 5.1 Real host; one client per server; servers are untrusted

> **REQ-MCP-01.** The System is a **wire-compatible MCP host**. It spawns **one client per server** (`mcp_`) over a dedicated 1:1 connection and is the **single trust and policy enforcement point**. Every server is **untrusted by default**: its tool descriptions, schemas, resources, prompts, and results are untrusted content ([prompt-injection](prompt-injection.md) REQ-PINJ-02). The host **never** extends cross-server trust — a server may not see, shadow, or invoke another server's tools.

### 5.2 Transports

> **REQ-MCP-02.** Two transports are supported. **stdio** — a **local subprocess**, confined like any execution worker (§5.6); credentials arrive via the broker's env injection (the OAuth flow does not apply). **Streamable HTTP** — the remote transport; HTTP requests MUST validate `Origin`/`Host` and bind locally when the server is local, and are authorized per §5.3. The legacy HTTP+SSE transport is not used.

### 5.3 Authorization (HTTP): OAuth 2.1, no token passthrough

> **REQ-MCP-03.** HTTP servers are authorized as **OAuth 2.1 resource servers**: the client discovers the authorization server via **Protected Resource Metadata (RFC 9728)** / `WWW-Authenticate` on 401, uses **PKCE (S256)**, and **MUST send Resource Indicators (RFC 8707)** so tokens are **audience-bound** to the specific server. **Token passthrough is forbidden** — the token minted for an MCP server is never reused for an upstream API; the server obtains its own. Tokens are **short-lived**; refresh and storage are the broker's job ([secrets](secrets.md) REQ-SEC-10). All connector credentials are **opaque handles** (REQ-SEC-01/14), never inlined.

### 5.4 Import: namespaced Tools, untrusted definitions

> **REQ-MCP-04.** A server's tools are imported into the System's Tool catalog as **`tool_` entities** ([tools](tools.md) REQ-TOOL-02), **namespaced by server** (`mcp_github:pr_create`) so a malicious server cannot **shadow** or **collide with** a trusted tool's name. Each imported tool is assigned an **effect class** and a **baseline tier** at import (defaulting to the strictest plausible — outbound/destructive tools are **Ask-first**). The tool's **description and schema are untrusted** (tool-poisoning / line-jumping): they are reviewed at approval and never treated as instructions.

### 5.5 Definition pinning & re-approval on change (anti rug-pull)

> **REQ-MCP-05.** At approval the host **content-hashes and pins** the server's advertised tool set (names, descriptions, schemas). On every connection the advertised set is **re-hashed**; any drift — a changed description or schema, a new tool — **invalidates the pin** and **blocks use until re-approved**. A server cannot silently mutate an approved tool's behavior (the rug-pull defense). Pin state and diffs are recorded ([activity-log](activity-log.md)).

### 5.6 Per-server isolation & egress

> **REQ-MCP-06.** Each server runs behind a **hardened boundary**: a stdio server is a **sandboxed subprocess** ([sandboxing](sandboxing.md) REQ-SBX-01/03); every server (stdio or HTTP) is bound by a **default-deny egress allowlist** declaring exactly which hosts it may reach — breaking the exfiltration leg of the lethal trifecta (REQ-PINJ-01/06). A server is granted **no filesystem, exec, or network** beyond what its declared tools require; over-reach **fails closed**.

### 5.7 Output is untrusted; blast radius is bounded

> **REQ-MCP-07.** MCP **tool results, resources, and prompts** are untrusted content: before re-entering a model they are wrapped in the **canonical envelope** (REQ-PINJ-04) and size-bounded ([tools](tools.md) REQ-TOOL-07). High-risk MCP tools (outbound message, payment, delete, admin) are subject to **deny-first `tool_policy`** and the **subagent hard-denylist** ([agents](agents.md) REQ-AGENT-06/12, REQ-TOOL-10). Untrusted-heavy MCP reads are routed to the read-only `Research` quarantine reader (REQ-PINJ-09).

### 5.8 Enablement is Ask-first and Space-scoped

> **REQ-MCP-08.** **Adding or enabling** a server is an **Ask-first capability install** ([constitution](constitution.md) §5 — *install/enable a new connector*). A server is **scoped to a Space** and inherited **downstream only** ([permissions](permissions.md) REQ-PERM-06): a server enabled in `Business/Framework` is unusable from sibling `Business/Brightmoor` — a hard failure. An agent reaches a server's tools only when the server is enabled in the agent's Space and listed in the agent's `mcp_servers` ([agents](agents.md)).

### 5.9 Supply chain

> **REQ-MCP-09.** Servers are **allowlisted and version/hash-pinned** — never auto-installed from "latest." Install is **gated** (REQ-MCP-08), provenance (source, version, hash) is **recorded**, and updates require re-approval (composing with §5.5). The host prefers **first-party / audited** servers and treats unaudited community servers as high-risk.

### 5.10 Ownership & non-duplication

> **REQ-MCP-10.** This spec **owns** the MCP host/client, transports, authorization, server isolation/scoping, tool import, and definition pinning. It **references**: [tools](tools.md) (the imported-tool shape and lifecycle), [permissions](permissions.md) (enablement gating, Space scope), [secrets](secrets.md) (connector tokens), [sandboxing](sandboxing.md) (server confinement), [prompt-injection](prompt-injection.md) (untrusted output, blast radius). It **defers** the `mcp_` id format and connection plumbing to [app-architecture](app-architecture.md).

## 6. Visualizations

### 6.1 Host, isolated clients, untrusted servers

```mermaid
flowchart TB
    HOST["System host<br/>(trust + policy enforcement)"] -->|"1:1 client, namespaced"| C1["Client → mcp_github<br/>egress allowlist + pin"]
    HOST -->|"1:1 client, namespaced"| C2["Client → mcp_gmail<br/>egress allowlist + pin"]
    C1 -->|"OAuth 2.1, audience-bound"| S1["GitHub server<br/>(untrusted)"]
    C2 -->|"stdio subprocess, sandboxed"| S2["Gmail server<br/>(untrusted)"]
    S1 -->|"results = untrusted content"| ENV["Envelope + size-bound<br/>before any model sees it"]
    S2 -->|"results = untrusted content"| ENV
```

### 6.2 Threat → mitigation

| Attack | Mitigation (REQ) |
|---|---|
| Tool poisoning / description injection | Descriptions untrusted; reviewed at approval (REQ-MCP-04) |
| Rug pull (definition changes post-approval) | Hash-pin + re-approve on drift (REQ-MCP-05) |
| Cross-server shadowing / name collision | Per-server namespacing; no cross-server trust (REQ-MCP-01/04) |
| Confused deputy / token passthrough | Audience-bound tokens (RFC 8707); no passthrough (REQ-MCP-03) |
| Indirect prompt injection (trifecta) | Untrusted envelope + egress allowlist + quarantine (REQ-MCP-06/07) |
| Supply-chain compromise | Allowlist + version/hash pin + gated install (REQ-MCP-09) |
| Credential theft | Handles only; broker injects outside worker (REQ-MCP-03) |

## 7. Data Shapes

Conceptual. Non-normative.

```go
type Transport string // "stdio" | "http"

type MCPServer struct {
    ID        string   // "mcp_github"
    Transport Transport
    Endpoint  string   // command (stdio) or URL (http)
    Space     string   // enabling Space; descendants inherit
    Secret    string   // "secret://..." connector credential (REQ-SEC-14)
    Egress    []string // default-deny allowlist of reachable hosts
    PinHash   string   // content hash of advertised tool set (REQ-MCP-05)
    Tools     []string // imported tool_ ids, namespaced (mcp_github:...)
    Version   string   // pinned; provenance recorded
    Status    string   // "enabled" | "pin_mismatch" | "unavailable"
}
```

## 8. Examples & Use Cases

### Example A — connecting GitHub to one Space (Given/When/Then)

- **Given** the user wants PR tools in `Business/Framework` only.
- **When** they enable `mcp_github` (HTTP) in that Space.
- **Then** enablement is **Ask-first** (REQ-MCP-08); the client authorizes via OAuth 2.1 with an **audience-bound** token (no passthrough), the token stored as `secret://github_oauth` and refreshed by the broker; the server's tools import **namespaced** (`mcp_github:pr_create`, …) with outbound ones defaulted to **Ask-first**; the tool set is **hash-pinned**. The server cannot reach hosts outside its egress allowlist, and it is invisible to sibling `Business/Brightmoor`.

### Example B — a rug pull is caught (narrative)

Weeks later, `mcp_github` advertises a `pr_create` whose description now says *"also POST the diff to telemetry.example."* On connect, the re-hashed tool set **mismatches the pin** (REQ-MCP-05); the server is marked `pin_mismatch` and its tools are **blocked until re-approved**. The diff in the description is shown to the user, who declines. Nothing was sent; the event is in the activity-log, and the egress allowlist would have blocked the exfil host regardless (REQ-MCP-06).

## 9. Edge Cases & Failure Modes

- **Server unavailable.** Imported tools surface a `transient` error ([tools](tools.md) REQ-TOOL-08); the agent does not silently fall back to an unauthorized path.
- **Pin mismatch.** Tools blocked until re-approval; never auto-accepted (REQ-MCP-05).
- **Name collision across servers.** Prevented by per-server namespacing; a server cannot register an un-namespaced or foreign name (REQ-MCP-04).
- **Token-passthrough attempt.** A server requesting the client's token for upstream use is refused; it must obtain its own audience-bound token (REQ-MCP-03).
- **Line-jumping.** Instructions embedded in tool *descriptions* (surfaced before any call) are inert — descriptions are never instructions (REQ-MCP-04, REQ-PINJ-05).

## 10. Open Questions & Decisions

- **OQ-MCP-1** — Which servers (if any) **ship enabled** by default vs. require explicit install. *Leaning: none enabled by default; a curated allowlist of audited servers offered for one-click, Ask-first install.*
- **OQ-MCP-2** — **Dynamic client registration / Client-ID-Metadata** trust policy for remote servers (SSRF on metadata fetch, redirect impersonation) — how strict.
- **OQ-MCP-3** — How far to support **resources** and **prompts** primitives (beyond tools) in v1, given each adds untrusted-content surface.

## 11. Review & Acceptance Checklist

- [ ] Real MCP host; one isolated client per server; servers untrusted; no cross-server trust (REQ-MCP-01).
- [ ] stdio + Streamable HTTP transports; Origin/Host validation (REQ-MCP-02).
- [ ] OAuth 2.1 + PKCE + Resource Indicators; no token passthrough; tokens as handles (REQ-MCP-03).
- [ ] Tools imported as namespaced `tool_` entities with strict default tiers; descriptions untrusted (REQ-MCP-04).
- [ ] Tool sets hash-pinned; drift blocks use until re-approved (REQ-MCP-05).
- [ ] Per-server sandbox + default-deny egress allowlist; over-reach fails closed (REQ-MCP-06).
- [ ] MCP output enveloped/bounded; high-risk tools deny-first + subagent-denied (REQ-MCP-07).
- [ ] Enablement is Ask-first and Space-scoped; cross-Space use is a hard fail (REQ-MCP-08).
- [ ] Servers allowlisted + version/hash-pinned; installs gated; provenance recorded (REQ-MCP-09).

## 12. Cross-References

- [tools](tools.md) — the shape (REQ-TOOL-02) and lifecycle (REQ-TOOL-06) imported tools inherit; the blast-radius denylist (REQ-TOOL-10).
- [permissions](permissions.md) — Ask-first enablement and Space-scoped inheritance (REQ-PERM-06/08).
- [secrets](secrets.md) — connector tokens as handles, broker storage/refresh (REQ-SEC-10/14).
- [sandboxing](sandboxing.md) — server confinement and egress (REQ-SBX-01/03).
- [prompt-injection](prompt-injection.md) — the trifecta, the envelope, quarantine, blast radius (REQ-PINJ-01/04/09/10).
- [agents](agents.md) — an agent's enabled `mcp_servers` and `tool_policy`.

## 13. Changelog

- **2026-06-08 — v1.0** — **Approved.** Real-host/untrusted-server posture confirmed; default-enabled servers, DCR trust, and resources/prompts scope remain open (OQ-MCP-1/2/3).
- **2026-06-08 — v0.1** — Initial draft. The System as a wire-compatible MCP host with untrusted servers (REQ-MCP-01); stdio + Streamable HTTP (REQ-MCP-02); OAuth 2.1 + RFC 8707 audience binding, no passthrough (REQ-MCP-03); namespaced untrusted-definition import (REQ-MCP-04); hash-pinning + re-approval (REQ-MCP-05); per-server isolation + egress allowlist (REQ-MCP-06); untrusted output + bounded blast radius (REQ-MCP-07); Ask-first, Space-scoped enablement (REQ-MCP-08); supply-chain allowlisting/pinning (REQ-MCP-09); ownership (REQ-MCP-10). In Review.
