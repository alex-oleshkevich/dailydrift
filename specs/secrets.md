# Secrets

> **Status:** Approved
>
> **Version:** 1.0   ·   **Last updated:** 2026-06-05
>
> **Purpose:** The credential substrate — how the System **stores, references, and uses** secrets without ever placing a value in a prompt or a sandboxed worker. Owns the **secret handle** (`secret_`), the **pluggable providers** (local · env/.env · OS keychain · HashiCorp Vault · cloud KV · Bitwarden/1Password/Doppler/Infisical · OneCLI Agent Vault), the **broker** that resolves + injects at point-of-use, and the **lifecycle/audit**. This is the credential broker that [prompt-injection](prompt-injection.md) REQ-PINJ-08 and [sandboxing](sandboxing.md) REQ-SBX-13 defer to.
>
> **Depends on:** [constitution](constitution.md), [sandboxing](sandboxing.md), [prompt-injection](prompt-injection.md), [agents](agents.md)   ·   **Defers mechanics to:** [privacy-security](privacy-security.md), [permissions](permissions.md), [mcp](mcp.md), [tools](tools.md), [app-architecture](app-architecture.md), [spaces](spaces.md)

> Requirement tag: **SEC**

---

## 1. Purpose & Scope

This spec owns **credential handling end-to-end**:

- the **secret handle** (`secret_`) — an opaque reference that is the *only* form a secret takes anywhere the System can see it;
- the **providers** — pluggable backends that actually hold the value (local default + the password managers / vaults the user asked for);
- the **broker** — the single component that turns a handle into a value, **at the moment of use**, and **injects it outside the worker**;
- the **lifecycle** (TTL, leases, rotation, revocation), **audit**, and **redaction** backstop.

It is the concrete home of the constitution's *"secrets travel as opaque handles only"* and *"secrets are never shown in prompts"* (§5).

## 2. Non-Goals / Out of Scope

- **Not the auth/login system or at-rest crypto** — how the user authenticates and how the local store encrypts is [privacy-security](privacy-security.md).
- **Not the permission gate** — the Ask-first approval *mechanism* is [permissions](permissions.md); this spec says credential use **is** Ask-first.
- **Not the connector catalog** — what a connector is and which exist is [mcp](mcp.md); this spec stores its tokens.
- **Not the third-party vaults themselves** — Vault/AWS/1Password internals are the provider's; this spec defines the **interface** to them.
- **Not the sandbox** — containment is [sandboxing](sandboxing.md); this spec explains the credential half of REQ-SBX-13.

## 3. Background & Rationale

Secrets are the highest-value target in the System and the third leg of the lethal trifecta ([prompt-injection](prompt-injection.md)). The discipline (OWASP *Secrets Management*): **never hardcode**, **least privilege per-secret**, **rotate**, **audit** (who/when/which), and **encrypt at rest**. The architectural move that makes this tractable for an agent system is **indirection**: the System manipulates a **handle**, never a value, and a **broker** resolves the handle only at the instant a real outbound call needs it — *outside* the model context and *outside* the sandboxed worker.

Two of the mentioned apps frame the design:
- **OpenClaw** (local source) already has most of the pieces — a typed credential store (`api_key`/`token`/`oauth`), `${VAR}` references, OAuth auto-refresh, comprehensive log **redaction**, and the rule that **secrets stay on the host, never in the sandbox**. What it *lacks* is a **central broker** — credentials are resolved per call by whatever component needs them. We close that gap.
- **nanoclaw's OneCLI Agent Vault** is exactly that broker: *credentials never enter the container; outbound requests route through the vault, which injects authentication at the proxy level.* We adopt that as the **preferred injection mode** and support OneCLI as a provider.

## 4. Concepts & Definitions

- **Secret** — a credential value (API key, token, OAuth pair, password, certificate). Held only transiently, only by the broker.
- **Handle** (`secret_`) — an opaque, non-sensitive **reference** to a secret (§5.2). The only secret-shaped thing the System stores, logs, prompts, or recalls.
- **Provider** — a backend that holds values and resolves handles (§5.3).
- **Broker** — the single chokepoint that resolves a handle → value at point-of-use and injects it (§5.4–§5.5).
- **Injection** — placing the credential into an outbound request, **outside** the worker (proxy / restricted env / in-host header).
- **Lease** — a time-bounded grant on a dynamic secret (Vault `LeaseID` + `LeaseDuration`), renewed/revoked by the broker.
- **Redaction** — the backstop that masks secret-shaped values from logs/output/model-bound text.

## 5. Detailed Specification

### 5.1 The secret handle

> **REQ-SEC-01.** A secret is referenced by an opaque **handle** (`secret_`) — never inlined as a value. The handle is **non-sensitive**: it may appear in configs, agent definitions, connector settings, prompts, [Memory](memory.md), and logs. The **value** exists only transiently, resolved by the broker at the point of use (§5.4). This makes concrete the constitution's *"secrets travel as opaque handles only"* (§5).

### 5.2 Handle URI

> **REQ-SEC-02.** A handle is a URI — **`secret://<provider>/<path>[#<field>]`** — provider-prefixed, after 1Password's `op://…` convention. `provider` selects a backend (§5.3); `path` locates the item; optional `#field` picks a field. Examples: `secret://vault/kv/stripe#api_key` · `secret://onepassword/Prod/Stripe/credential` · `secret://aws/prod/stripe` · `secret://env/STRIPE_API_KEY` · `secret://local/stripe#key`. Only the broker can resolve a handle; the URI itself reveals nothing.

### 5.3 Provider catalog (pluggable)

> **REQ-SEC-03.** The broker resolves handles through **pluggable providers**, each implementing the `Provider` interface (§7). The catalog:
> - **`local`** — the built-in encrypted store (**default**, §5.12);
> - **`env`** / **`.env`** — process environment / dotenv (local dev);
> - **`keychain`** — OS store (macOS Keychain, Windows Credential Manager, Linux Secret Service);
> - **`vault`** — **HashiCorp Vault** (KV + **dynamic secrets / leases**);
> - **`aws`** / **`gcp`** / **`azure`** — **cloud KV** (Secrets Manager / SSM · Secret Manager · Key Vault);
> - **`bitwarden`** — Bitwarden Secrets Manager;
> - **`onepassword`** — 1Password (`op://`);
> - **`doppler`** / **`infisical`** — env-style secret platforms;
> - **`onecli`** — **OneCLI Agent Vault** (§5.13).
>
> New providers are added without touching consumers — the handle is the contract.

### 5.4 The broker

> **REQ-SEC-04.** A single **broker** is the **only** component that dereferences a handle to a value, and only **at the moment of use**. No agent, tool, prompt, or config ever holds a value — they hold handles and ask the broker to *act*. The broker caches with a short TTL, renews leases, redacts, and audits every access (§5.10/§5.11).

### 5.5 Injection outside the worker (the mechanism REQ-SBX-13 defers to)

> **REQ-SEC-05.** The broker injects a credential **outside the sandboxed worker**, by `InjectionMode`:
> - **`proxy`** *(preferred)* — the worker's outbound request carries only the **handle** (or a placeholder); a broker-controlled **egress proxy** at the network boundary swaps it for the real credential, so the value **never enters the worker's memory** — the OneCLI Agent Vault model.
> - **`env`** *(fallback)* — the broker spawns the specific tool subprocess with the secret in its env, **short-lived** and **outside the sandbox-visible env** ([sandboxing](sandboxing.md) REQ-SBX-13).
> - **`header`** — for the **trusted in-host** caller (the orchestrator's own model/connector requests), the broker builds the request header directly.
>
> This is the full credential half of [sandboxing](sandboxing.md) REQ-SBX-13: *secrets never enter the sandbox; the broker injects at request time.*

### 5.6 Never in prompts

> **REQ-SEC-06.** A secret value **never enters a model-visible context** — not a system prompt, a tool result fed back to the model, nor [Memory](memory.md) ([prompt-injection](prompt-injection.md) REQ-PINJ-08). Only **handles** are model-visible: the model may *ask* to use `secret://…/stripe`; it can never read it.

### 5.7 Never exfiltrated + redaction

> **REQ-SEC-07.** Sending a **raw secret to any model or remote is a Never action** ([constitution](constitution.md) §5 — hard stop). As defense-in-depth against accidental leakage, the System **redacts** secret-shaped values from logs, tool output, activity records, and any text headed for the model — matching key/token/password assignments, `Authorization: Bearer …`, known token prefixes (`sk-`, `ghp_`, …), and PEM blocks, masking to a short `prefix…suffix`. Redaction is a **backstop**, not the primary control — the handle + broker are.

### 5.8 Ask-first to use

> **REQ-SEC-08.** **Using** a stored credential is an **Ask-first** action ([constitution](constitution.md) §5): the first use of a handle in a scope surfaces an approval, after which a **standing grant** may promote it to Always within that scope ([permissions](permissions.md)). A poisoned context cannot silently spend a credential — the deterministic gate authorizes, not the model.

### 5.9 Least-privilege scoping

> **REQ-SEC-09.** Handles are **scoped** — to a Space, an agent role, and/or specific providers/paths — and resolvable only within their grant (P6 least-privilege). A handle granted to the `Business` Space is **not** usable from a sibling or private-ancestor Space (P10); cross-Space credential use is a **hard failure**. An agent receives only the handles its Task needs (orchestrator-injected, like Memory — [agents](agents.md) REQ-AGENT-13).

### 5.10 Lifecycle — TTL, leases, rotation, revocation

> **REQ-SEC-10.** The broker owns the secret lifecycle: a short-TTL **cache**; **leases / dynamic secrets** (HashiCorp Vault returns a `LeaseID` + `LeaseDuration`; the broker renews via a lifetime-watcher and **revokes** at Task end); **rotation** (provider-side or broker-triggered, invalidating the cache); and **revocation** (a compromised or task-scoped credential is revoked immediately). **Short-lived / dynamic** credentials are preferred over long-lived static keys.

### 5.11 Audit

> **REQ-SEC-11.** Every broker action — **resolve / inject / rotate / revoke / deny** — is recorded to the [activity-log](activity-log.md): *who* (agent/Task/Space), *when*, **which handle**, and the outcome — **never the value** (OWASP audit-metadata). Unusual or denied access feeds the same telemetry path as detected injection ([prompt-injection](prompt-injection.md) REQ-PINJ-14).

### 5.12 Local encrypted store (default)

> **REQ-SEC-12.** The System ships a built-in **`local` provider** — **encrypted at rest** (OS keychain where available, else an age/passphrase-encrypted file, [privacy-security](privacy-security.md)) — so it works **with no external dependency**. It holds typed credentials (`api_key` / `token` / `oauth`, after OpenClaw's auth-profile store). External providers (Vault, cloud KV, Bitwarden, …) are opt-in for teams that centralize secrets.

### 5.13 OneCLI Agent Vault

> **REQ-SEC-13.** **OneCLI's Agent Vault** is supported as both a **provider** (`secret://onecli/…`) and the **proxy-injection backend** (§5.5, `proxy` mode): authed outbound requests route through it and it **injects authentication at the proxy level**, so credentials never reach the worker (nanoclaw's model). It is the reference implementation of the preferred injection mode.

### 5.14 Connector & OAuth tokens

> **REQ-SEC-14.** Connector credentials and **OAuth tokens** (Gmail, Slack, …) are secrets under this spec: stored via a provider, referenced by handle, and **auto-refreshed** by the broker before expiry (the `access`/`refresh`/`expires` triple, refresh-with-lock, after OpenClaw's `oauth.ts`). A connector ([mcp](mcp.md)) names a handle; the broker performs the refresh transparently — the worker never sees the token.

### 5.15 Typed, redact-by-construction values

> **REQ-SEC-15.** The handle, provider, broker, resolved secret, and audit record have the typed shapes in §7. A **`Sensitive`** value type **redacts by construction** — its `String()` and JSON marshalling yield `***` — so a value cannot be logged or serialized by accident even if mishandled.

### 5.16 Ownership & non-duplication

> **REQ-SEC-16.** This spec **owns** the handle, the broker, the providers, and the lifecycle/audit. It **references**: [constitution](constitution.md) §5 (Ask-first/Never gates), [prompt-injection](prompt-injection.md) REQ-PINJ-08 (never in prompts), [sandboxing](sandboxing.md) REQ-SBX-13 (never in the worker). It **defers**: auth/login + at-rest crypto to [privacy-security](privacy-security.md); the approval gate to [permissions](permissions.md); connector definitions to [mcp](mcp.md); tool wiring to [tools](tools.md); the worker runtime to [app-architecture](app-architecture.md); scoping to [spaces](spaces.md).

## 6. Visualizations

### 6.1 The broker flow — the worker never sees the value

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'fontSize': '13px'}}}%%
flowchart LR
    classDef box fill:#F8D7DA,stroke:#C0392B,color:#721C24
    classDef trust fill:#D4EDDA,stroke:#27AE60,color:#155724

    subgraph SB["sandbox"]
        W["worker\nholds: secret://vault/kv/stripe#api_key"]:::box
    end
    BR["Broker (trusted)\nresolve · gate (Ask-first) · audit"]:::trust
    PR["Provider\n(Vault / cloud KV / 1Password / OneCLI / local)"]:::trust
    PX["Egress proxy\nswaps handle → credential"]:::trust

    W -->|request carrying the handle| PX
    PX -->|resolve handle| BR
    BR -->|fetch value| PR
    PR -->|value (lease)| BR
    BR -->|credential| PX
    PX -->|authed request| API["external API"]
```

## 7. Data Shapes

Conceptual ([app-architecture](app-architecture.md) owns persistence).

### 7.1 Types

```go
// Provider backends (REQ-SEC-03).
type ProviderKind string

const (
    ProviderLocal       ProviderKind = "local" // built-in encrypted store (default)
    ProviderEnv         ProviderKind = "env"   // process env / .env
    ProviderKeychain    ProviderKind = "keychain"
    ProviderVault       ProviderKind = "vault" // HashiCorp Vault (leases/dynamic)
    ProviderAWS         ProviderKind = "aws"   // Secrets Manager / SSM
    ProviderGCP         ProviderKind = "gcp"   // Secret Manager
    ProviderAzure       ProviderKind = "azure" // Key Vault
    ProviderBitwarden   ProviderKind = "bitwarden"
    ProviderOnePassword ProviderKind = "onepassword"
    ProviderDoppler     ProviderKind = "doppler"
    ProviderInfisical   ProviderKind = "infisical"
    ProviderOneCLI      ProviderKind = "onecli" // OneCLI Agent Vault (also the proxy backend)
)

type CredentialType string

const (
    CredAPIKey CredentialType = "api_key"
    CredToken  CredentialType = "token"
    CredOAuth  CredentialType = "oauth"
    CredBasic  CredentialType = "basic"
    CredCert   CredentialType = "cert"
)

type InjectionMode string

const (
    InjectProxy  InjectionMode = "proxy"  // swap handle→credential at the egress proxy (preferred)
    InjectEnv    InjectionMode = "env"    // short-lived restricted subprocess env
    InjectHeader InjectionMode = "header" // build the request header for a trusted in-host caller
)

// SecretHandle is the opaque, non-sensitive reference (REQ-SEC-01/02).
type SecretHandle struct {
    Provider ProviderKind
    Path     string
    Field    string // optional (#field)
    Raw      string // the original "secret://…" string
}

// Sensitive redacts by construction (REQ-SEC-15): it never renders its bytes.
type Sensitive []byte

func (Sensitive) String() string             { return "***" }
func (Sensitive) MarshalJSON() ([]byte, error) { return []byte(`"***"`), nil }

// ResolvedSecret lives only transiently, inside the broker (REQ-SEC-04/10).
type ResolvedSecret struct {
    Value     Sensitive
    Type      CredentialType
    LeaseID   string    // dynamic secrets (Vault)
    ExpiresAt time.Time // cache / lease / oauth expiry
    Renewable bool
}

// A Provider is one backend in the catalog (REQ-SEC-03).
type Provider interface {
    Kind() ProviderKind
    Resolve(ctx context.Context, h SecretHandle) (ResolvedSecret, error)
    Rotate(ctx context.Context, h SecretHandle) error // optional; ErrUnsupported if not
    Revoke(ctx context.Context, leaseID string) error // optional
}

type AgentRef struct{ Space, Agent, Task string }

// The Broker is the single chokepoint (REQ-SEC-04): Resolve is gated + audited; Inject keeps the
// value out of the worker (REQ-SEC-05); Redact is the leakage backstop (REQ-SEC-07).
type Broker interface {
    Resolve(ctx context.Context, by AgentRef, h SecretHandle) (ResolvedSecret, error)
    Inject(ctx context.Context, by AgentRef, req *http.Request, h SecretHandle, mode InjectionMode) error
    Redact(text string) string
}

// AuditEntry never carries the value (REQ-SEC-11).
type AuditEntry struct {
    When    time.Time
    Ref     AgentRef
    Handle  string // the secret://… reference, not the value
    Action  string // resolve | inject | rotate | revoke | deny
    Outcome string // ok | denied | error
}
```

### 7.2 Reference implementation (non-normative)

The §5 REQs are the source of truth; these sketches show the shape (imports / error-wrapping elided).

**Parse a handle** (REQ-SEC-02):
```go
// secret://<provider>/<path>[#field]
func ParseHandle(raw string) (SecretHandle, error) {
    u, err := url.Parse(raw)
    if err != nil || u.Scheme != "secret" {
        return SecretHandle{}, fmt.Errorf("not a secret handle: %q", raw)
    }
    return SecretHandle{
        Provider: ProviderKind(u.Host),
        Path:     strings.TrimPrefix(u.Path, "/"),
        Field:    u.Fragment,
        Raw:      raw,
    }, nil
}
```

**A provider** — `env` (static) and `vault` (dynamic, surfacing a lease so the broker can renew/revoke; REQ-SEC-03/10):
```go
var ErrUnsupported = errors.New("operation not supported by provider")

type envProvider struct{}

func (envProvider) Kind() ProviderKind { return ProviderEnv }
func (envProvider) Resolve(_ context.Context, h SecretHandle) (ResolvedSecret, error) {
    v, ok := os.LookupEnv(h.Path)
    if !ok {
        return ResolvedSecret{}, fmt.Errorf("env secret %q not set", h.Path)
    }
    return ResolvedSecret{Value: Sensitive(v), Type: CredAPIKey}, nil
}
func (envProvider) Rotate(context.Context, SecretHandle) error { return ErrUnsupported }
func (envProvider) Revoke(context.Context, string) error       { return ErrUnsupported }

type vaultProvider struct{ c *vault.Client }

func (vaultProvider) Kind() ProviderKind { return ProviderVault }
func (p vaultProvider) Resolve(ctx context.Context, h SecretHandle) (ResolvedSecret, error) {
    s, err := p.c.Logical().ReadWithContext(ctx, h.Path) // KV path or a dynamic engine
    if err != nil {
        return ResolvedSecret{}, err
    }
    return ResolvedSecret{
        Value:     Sensitive(pick(s.Data, h.Field)), // walk KV-v2 data.data / dynamic creds
        Type:      CredAPIKey,
        LeaseID:   s.LeaseID, // lease lifecycle (REQ-SEC-10)
        ExpiresAt: time.Now().Add(time.Duration(s.LeaseDuration) * time.Second),
        Renewable: s.Renewable,
    }, nil
}
```

**The broker** — the single chokepoint: scope → cache → Ask-first → provider → audit (REQ-SEC-04/08/09/11):
```go
func (b *broker) Resolve(ctx context.Context, by AgentRef, h SecretHandle) (ResolvedSecret, error) {
    if !inScope(by, h) { // least-privilege, no cross-Space (REQ-SEC-09)
        b.audit.Log(entry(by, h, "deny", "denied"))
        return ResolvedSecret{}, ErrCrossScope
    }
    if rs, ok := b.cache.Get(h.Raw); ok {
        return rs, nil
    }
    if !b.grants.Allows(by, h) { // first use in scope → Ask-first (REQ-SEC-08)
        if err := b.gate.AskFirst(ctx, by, h); err != nil {
            b.audit.Log(entry(by, h, "deny", "denied"))
            return ResolvedSecret{}, err
        }
    }
    p, ok := b.providers[h.Provider]
    if !ok {
        return ResolvedSecret{}, fmt.Errorf("unknown provider %q", h.Provider)
    }
    rs, err := p.Resolve(ctx, h)
    b.audit.Log(entry(by, h, "resolve", outcome(err)))
    if err != nil {
        return ResolvedSecret{}, err
    }
    b.cache.SetUntil(h.Raw, rs, rs.ExpiresAt) // bounded by lease / TTL
    return rs, nil
}
```

**Injection** — the value leaves the broker *only here*, never to the worker (REQ-SEC-05). `string(rs.Value)` reads the real bytes (only inside the trusted broker/proxy); logging `rs.Value` yields `***`:
```go
func (b *broker) Inject(ctx context.Context, by AgentRef, req *http.Request, h SecretHandle, mode InjectionMode) error {
    rs, err := b.Resolve(ctx, by, h)
    if err != nil {
        return err
    }
    switch mode {
    case InjectProxy, InjectHeader: // proxy mode runs INSIDE the egress proxy, not the worker
        req.Header.Set("Authorization", "Bearer "+string(rs.Value))
    case InjectEnv:
        return ErrUseSpawnEnv // env injection happens at subprocess spawn (sandboxing), not on a request
    default:
        return fmt.Errorf("unknown injection mode %q", mode)
    }
    b.audit.Log(entry(by, h, "inject", "ok"))
    return nil
}
```

**Redaction** — the leakage backstop on anything bound for logs or the model (REQ-SEC-07):
```go
var redactPatterns = []*regexp.Regexp{
    regexp.MustCompile(`(?i)\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD)\b\s*[=:]\s*(\S+)`),
    regexp.MustCompile(`(?i)Authorization\s*[:=]\s*Bearer\s+([A-Za-z0-9._\-+=]+)`),
    regexp.MustCompile(`\b(sk-[A-Za-z0-9]{8,}|ghp_[A-Za-z0-9]+|AIza[A-Za-z0-9_\-]+)\b`),
}

func Redact(text string) string {
    for _, re := range redactPatterns {
        text = re.ReplaceAllStringFunc(text, mask)
    }
    return text
}

func mask(s string) string {
    if len(s) < 12 {
        return "***"
    }
    return s[:6] + "…" + s[len(s)-4:]
}
```

## 8. Examples & Use Cases

Cast per [constitution](constitution.md) §7.

### Example A — Stripe key from Vault, proxy-injected (the trifecta leg broken)

An `Ops` worker runs the Q2 billing step. Its config names `secret://vault/kv/stripe#api_key` — a handle, not a key. The worker (sandboxed, `egress: allowlist`) issues the Stripe request carrying the **handle**; the broker's **egress proxy** swaps it for the real key at the boundary (§5.5 `proxy`). The value never enters the worker, never the prompt, never Memory. First use is **Ask-first**; Devin chooses *"Allow always for Business"*, a standing grant (REQ-SEC-08). Vault returns a lease; the broker revokes it when the Task ends (REQ-SEC-10).

### Example B — Gmail OAuth, auto-refreshed

The Gmail connector names `secret://local/gmail#oauth`. When a Task needs to read mail, the broker finds the access token expired, refreshes it with the stored refresh token (refresh-with-lock), and proxy-injects the new token — all transparently; the worker only ever held the handle (REQ-SEC-14).

### Example C — local dev with `.env`

A developer runs locally with `secret://env/OPENAI_API_KEY` resolving from `.env`. The key flows only into the model client's request header (in-host, `header` mode); if it ever appears in a log line or tool output, **redaction** masks it to `sk-abc…wxyz` (REQ-SEC-07).

## 9. Edge Cases & Failure Modes

- **Provider unreachable** — the *authed action* fails (surfaced to the user), not the whole Task; the broker retries with backoff.
- **Lease expires mid-call** — the broker renews via the lifetime-watcher; if revoked, it re-resolves or fails the action (REQ-SEC-10).
- **Handle resolves cross-Space** — denied; cross-Space credential use is a hard failure (REQ-SEC-09).
- **Secret in a tool's stdout** — redacted before it reaches logs or the model (REQ-SEC-07); downstream steps receive the **handle**, never the value.
- **Rotated credential still cached** — TTL bounds staleness; rotation invalidates the cache entry.
- **Redaction false-miss** — handles + broker are the primary control; redaction is a backstop, not relied upon to catch everything.
- **Misconfigured handle** (`#field` missing / wrong provider) — resolve fails loudly at first use, surfaced for the user to fix; no silent fallback to a different secret.

## 10. Open Questions & Decisions

- **OQ-SEC-1** — Concrete Go libraries per provider (`hashicorp/vault/api`; `aws-sdk-go-v2`; `cloud.google.com/go/secretmanager`; `azure-sdk-for-go/.../azsecrets`; `bitwarden/sdk-sm`; 1Password SDK; `joho/godotenv`; an OS-keychain lib). Owned by [app-architecture](app-architecture.md).
- **OQ-SEC-2** — Default injection per platform: `proxy` everywhere, or `env`/`header` where a proxy is impractical.
- **OQ-SEC-3** — `local` store crypto: OS keychain vs an age/passphrase-encrypted file; key derivation and unlock UX ([privacy-security](privacy-security.md)).
- **OQ-SEC-4** — Whether the **egress proxy** here is the *same* component as the sandbox egress allowlist ([sandboxing](sandboxing.md) REQ-SBX-10) — likely unified into one boundary.
- **OQ-SEC-5** — Whether handles get a managed `secret_` registry entity (for listing/rotation UI) or remain pure inline references.
- **OQ-SEC-6** — The concrete `proxy`-mode mechanism for **HTTPS**: the broker proxy must **originate the TLS connection** to the upstream (a forwarding/MITM proxy that the worker's HTTP client is configured to route through, replacing a placeholder `Authorization` header) — a transparent `CONNECT` proxy cannot edit headers inside an opaque TLS stream. Confirm the worker-client wiring with [app-architecture](app-architecture.md) (likely the same boundary as [sandboxing](sandboxing.md) REQ-SBX-10, per OQ-SEC-4).

## 11. Review & Acceptance Checklist

- [ ] A secret is only ever a **handle** (`secret_`, `secret://…` URI) outside the broker; the value is transient (REQ-SEC-01/02).
- [ ] The **provider catalog** includes local(default)/env/keychain/vault/aws/gcp/azure/bitwarden/1password/doppler/infisical/**onecli**, behind one `Provider` interface (REQ-SEC-03, §7).
- [ ] The **broker** is the single chokepoint (REQ-SEC-04); it **injects outside the worker** (proxy preferred) — fully explaining [sandboxing](sandboxing.md) REQ-SBX-13 (REQ-SEC-05).
- [ ] Secrets never in prompts (REQ-SEC-06 ↔ REQ-PINJ-08); raw exfiltration is Never + redaction backstop (REQ-SEC-07); using a credential is Ask-first (REQ-SEC-08); scoping is least-privilege, no cross-Space (REQ-SEC-09).
- [ ] Lifecycle (TTL/leases/rotation/revocation, REQ-SEC-10), audit without values (REQ-SEC-11), the local default store (REQ-SEC-12), **OneCLI Agent Vault** (REQ-SEC-13), and OAuth auto-refresh (REQ-SEC-14) are specified.
- [ ] §7 gives Go **enums/structs/interfaces**, incl. a redact-by-construction `Sensitive` (REQ-SEC-15). Examples use the [constitution](constitution.md) §7 cast.

## 12. Cross-References

- [constitution](constitution.md) §5 — *"use a stored credential" = Ask-first*; *"exfiltrate raw secrets = Never; opaque handles only"*; §6.2 the `secret_` handle ID.
- [prompt-injection](prompt-injection.md) REQ-PINJ-08 (secrets never in prompts) · [sandboxing](sandboxing.md) REQ-SBX-13 (secrets never in the worker — explained here) · REQ-SBX-10 (the egress boundary).
- [agents](agents.md) (an agent's handles are orchestrator-injected) · [mcp](mcp.md) (connectors name handles) · [tools](tools.md) (tools receive injected creds, never values) · [activity-log](activity-log.md) (audit).
- **Mechanics:** [permissions](permissions.md) (the Ask-first grant) · [privacy-security](privacy-security.md) (auth + at-rest crypto) · [app-architecture](app-architecture.md) (provider libs, the proxy) · [spaces](spaces.md) (scoping).

**Design lineage.** Code-grounded + OWASP + the mentioned apps (read this session):

**◆ Source pattern — OpenClaw, typed credential store** (local: `src/agents/auth-profiles/`). The credential types our `local` provider + `CredentialType` follow:
```text
type ApiKeyCredential = { type: "api_key"; provider: string; key: string; … };
type OAuthCredential  = OAuthCredentials & { type: "oauth"; provider: string; … }; // access/refresh/expires
// stored at ~/.openclaw/auth-profiles.json; OAuth auto-refreshed under a file lock
```

**◆ Source pattern — OpenClaw, redaction backstop** (local: `src/logging/redact.ts`). The leakage backstop our REQ-SEC-07 adopts:
```text
const DEFAULT_REDACT_PATTERNS = [
  /\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD)\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/,
  /"(?:apiKey|token|secret|password|accessToken|refreshToken)"\s*:\s*"([^"]+)"/,
  /Authorization\s*[:=]\s*Bearer\s+([A-Za-z0-9._\-+=]+)/, …  // + sk-, ghp_, PEM blocks
];
function maskToken(t) { return t.length < MIN ? "***" : `${t.slice(0,6)}…${t.slice(-4)}`; }
```
Plus OpenClaw's rule that **secrets stay on the host, never injected into the sandbox** — the basis of REQ-SEC-05.

**◆ Source pattern — nanoclaw OneCLI Agent Vault** (`github.com/nanocoai/nanoclaw`). The broker/proxy model (REQ-SEC-05/13):
> "Credentials never enter the container — outbound API requests route through OneCLI's Agent Vault, which injects authentication at the proxy level."

**◆ Source pattern — 1Password secret references** (`developer.1password.com`). The handle URI convention (REQ-SEC-02):
> "A secret reference is a unique URI that points to a specific field in an item" — `op://vault/item/field`.

Also: **OWASP Secrets Management Cheat Sheet** (lifecycle, least-privilege, rotation, audit metadata) and the provider Go SDKs — HashiCorp **Vault** (`vault/api`; leases `LeaseID`/`LeaseDuration`/`Renewable`), AWS/GCP/Azure secret managers, Bitwarden Secrets Manager SDK, `joho/godotenv`.

## 13. Changelog

- **2026-06-05 — v0.1** — Initial draft, replacing the backlog stub. The opaque **handle** (`secret_`, REQ-SEC-01) and its **`secret://<provider>/<path>#field` URI** (REQ-SEC-02); the **pluggable provider catalog** — local/env/keychain/Vault/AWS/GCP/Azure/Bitwarden/1Password/Doppler/Infisical/**OneCLI** (REQ-SEC-03); the **broker** chokepoint (REQ-SEC-04) and **injection outside the worker** explaining [sandboxing](sandboxing.md) REQ-SBX-13 (REQ-SEC-05); never-in-prompts (REQ-SEC-06), never-exfiltrated + redaction (REQ-SEC-07), Ask-first-to-use (REQ-SEC-08), least-privilege scoping (REQ-SEC-09); lifecycle — TTL/leases/rotation/revocation (REQ-SEC-10), value-free audit (REQ-SEC-11); the **local encrypted default** (REQ-SEC-12), **OneCLI Agent Vault** (REQ-SEC-13), OAuth auto-refresh (REQ-SEC-14), redact-by-construction types (REQ-SEC-15), ownership (REQ-SEC-16). §7 gives Go enums/structs/interfaces. Code-grounded in OpenClaw (`auth-profiles`, `redact.ts`) + nanoclaw Agent Vault + 1Password `op://` with verbatim ◆ Source-patterns; OWASP + provider SDKs cited. In Review.
- **2026-06-05 — v0.2** — Added **§7.2 reference implementation** (non-normative, Go): handle parsing (`ParseHandle`), an `env` + `vault` (lease-bearing) `Provider`, the `broker.Resolve` chokepoint (scope → cache → Ask-first → provider → audit), `broker.Inject` (the value leaves only here, never to the worker), and `Redact`. Labeled the existing types §7.1.
- **2026-06-05 — v1.0** — Approved.
