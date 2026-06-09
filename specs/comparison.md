# Competitive Comparison — dailydrift vs. the landscape

> **Type:** Research / landscape doc (not a house-format spec; not in the spec index).
>
> **Last updated:** 2026-06-08
>
> **Purpose:** Survey apps adjacent to dailydrift ("the System") — features, stack, LLMs, GitHub stars, **pricing** — and, for each, state honestly **where dailydrift would win, and where it doesn't** (including where the competitor is simply better).

> **Two blunt caveats, read these first:**
> 1. **dailydrift is unbuilt.** Today it is a **spec suite + an early scaffold**, not a shipping product. Every competitor below **ships, has real users, integrations, and polish**. So every "edge" here is a **design intention, not a benchmark** — on the only axis most people care about (it works today), dailydrift currently loses to all of them.
> 2. **Numbers are an approximate June-2026 snapshot.** Star counts drift; pricing varies by region/promo; closed-source internals are marked `unknown`. A few figures (e.g. Hermes stars) looked off and are flagged.

---

## 1. The yardstick — what dailydrift is (and its honest status)

dailydrift is a **self-hosted, privacy-first "operational intelligence."** Its bet is the *combination* of:

- **Situations & Storylines as the primary object** (work modeled as living threads — what changed, what's blocked — not a chat log, doc index, or workflow canvas).
- **A cited-Evidence pipeline** (`Signal → Evidence → Insight/Situation → Narrative`; Evidence is immutable, typed, attributable — every claim cites its source, P3).
- **Proactive but anti-spam** initiation (a relevance/urgency bar + notification budget + dismiss-ratio learning).
- **Always / Ask-first / Never** autonomy gating (capability + tier, two gates).
- **Per-Space isolation** (a SQLite DB per Space).
- **Self-hosted, Go single-binary, local-LLM by default** (remote frontier models opt-in).

**Honest status:** none of this is proven in product. The differentiators are also the **hardest things to execute** — proactivity that helps instead of nags, agents that don't invent actions, a pipeline whose Evidence is actually trustworthy. And the self-hosted/local-LLM choice **trades away** the model quality, polish, integrations, and zero-friction onboarding that make the competitors usable. Read §6 for the unvarnished verdict.

## 2. The landscape at a glance

Grouped by category. Stars & pricing ≈ June 2026. "Free self-host" = the OSS core; cloud tiers listed where they exist.

| App | Category | Stack · store | LLMs | Stars | Price | Self-host |
|---|---|---|---|---|---|---|
| **Khoj** | Second brain / RAG | Python(Django) · Postgres+pgvector | local+cloud | ~35k | Free self-host (AGPL); cloud deprecated '26 | ✅ |
| **Reor** | AI notes (local) | Electron/TS · LanceDB | local-default | ~8.6k | Free (AGPL), local only | ✅ |
| **AnythingLLM** | RAG chat | Node+React · LanceDB | local+cloud | ~61k | Free self-host (MIT); cloud $50–99/mo | ✅ |
| **Open WebUI** | Chat UI | Python+Svelte · SQLite | local+OpenAI-compat | ~141k | Free self-host (src-avail); ent. quote | ✅ |
| **LibreChat** | Chat UI (multi-provider) | Node+React · Mongo+pgvector | cloud+local | ~39k | Free self-host (MIT) | ✅ |
| **Onyx** (Danswer) | Enterprise RAG search | Python+Next(+Go) · Postgres+vec | model-agnostic | ~30k | Free self-host (MIT); cloud $20/user/mo | ✅ |
| **Letta** (MemGPT) | Agent + memory framework | Python · Postgres+pgvector | model-agnostic | ~23k | Free self-host (Apache); cloud $20–200/mo | ✅ |
| **Mem0** | Memory layer | Python+TS · Qdrant+graph | model-agnostic | ~58k | Free self-host (Apache); cloud $19–249/mo | ✅ |
| **CrewAI** | Multi-agent framework | Python · pluggable vec | model-agnostic | ~51k | Free (MIT); platform $25/mo; ent. ~$60k+/yr | ✅ |
| **AutoGPT** | Autonomous-agent platform | Python+React · Postgres/Redis | model-agnostic | ~177–183k | Free self-host (MIT/PolyForm); cloud $42–272/mo | ✅ |
| **Hermes** (Nous) | Autonomous personal agent | Python · local store | model-agnostic | ~uncertain | Free self-host (MIT); pay-per-token inference | ✅ |
| **Leon** | Voice/text assistant | TS/Node+Python NLU | local-leaning | ~17k | Free self-host (MIT) | ✅ |
| **Dify** | LLM-app builder | TS+Python · PG+Redis+Weaviate | model-agnostic | ~144k | Free self-host; cloud $59–159/mo; ent. ~$150k/yr | ✅ |
| **n8n** | Workflow automation | TS/Node+Vue · SQLite/PG | model-agnostic | ~192k | Free self-host (fair-code); cloud €24–800/mo | ✅ |
| **Flowise** | Agent/chatflow builder | TS/Node · SQLite/PG | model-agnostic | ~53k | Free self-host (Apache); cloud ~$35–65/mo | ✅ |
| **Lindy.ai** | AI agent builder / "AI employee" | closed cloud | cloud (GPT/Claude) | n/a | $50 / $100 / $200 /mo + credits | ❌ |
| **Martin** | Consumer AI assistant (voice) | closed cloud | cloud (undisclosed) | n/a | $35/mo ($21 ann.) · Pro $49 ($30 ann.) | ❌ |
| **Cora** (Every) | AI email chief-of-staff | closed cloud | cloud (undisclosed) | n/a | $12/mo · $24/mo (free in Every bundle) | ❌ |
| **Ohai.ai** | AI household manager | closed cloud | cloud (undisclosed) | n/a | $9.99 / $19.99 / $29.99 /mo | ❌ |
| **Saner.ai** | Proactive assistant (ADHD) | closed cloud | cloud | n/a | Free; ~$8/mo (ann.) · $16/mo | ❌ |
| **Personal.ai** | Personal model / digital twin | closed cloud | proprietary cloud | n/a | ~$40/mo consumer; ent. custom | ❌ |
| **MS Copilot** (+Recall) | OS + suite assistant | closed; Azure + on-device NPU | GPT-5.x (Azure) | n/a | Free tier; Pro $20/mo; M365 ~$30/user/mo | ❌ |
| **Google Gemini** | General assistant | closed; Google cloud (+Nano) | Gemini 3.x | n/a | Free; $9.99 / $19.99 / $100–200 /mo | ❌ |
| **Apple Intelligence** | OS personal intelligence | closed; on-device + PCC | Apple FM (+ChatGPT) | n/a | **Free with device** | ❌ (on-device) |
| **Glean** | Enterprise "Work AI" | closed cloud (VPC option) | model-agnostic cloud | n/a | ~$50+/user/mo, ~100-seat min (~$60k+/yr) | ❌ |
| **Omi** (Based Hardware) | AI wearable / lifelog | OSS: Flutter/C/Python/Swift | cloud + BYOK | ~12.7k | HW ~$89; sub ~$20/mo or BYOK; **MIT** | ✅ |
| **Bee** (Amazon) | AI wearable / lifelog | closed cloud | cloud (undisclosed) | n/a | HW $49.99; sub $19/mo | ❌ |
| **Plaud** | AI voice-recorder wearable | closed cloud | cloud (undisclosed) | n/a | HW $159–179; free 300min/mo; paid tiers | ❌ |
| **Rewind / Limitless** | Lifelog capture | closed | cloud | n/a | **Discontinued** (Meta acq., Dec '25) | ❌ |
| **Mem** (mem.ai) | AI notes / PKM | closed cloud · Pinecone | cloud (selectable) | n/a | Free tier; Pro from ~$15/mo | ❌ |
| **Notion AI** | Workspace assistant + agents | closed cloud | cloud (GPT/Claude/Gemini) | n/a | ~$18–20/user/mo (Business; AI bundled) | ❌ |
| **Tana** | AI notes / typed graph | closed cloud | cloud (Anthropic/OpenAI) | n/a | Free; $10/mo · $18/mo | ❌ |
| **Reflect** | AI notes (E2E) | closed cloud | cloud (GPT-4/Whisper) | n/a | $10/mo · $100/yr (14-day trial) | ❌ |
| **Motion** | AI scheduling + tasks | closed cloud | cloud (undisclosed) | n/a | ~$19/mo (Pro AI) · ~$29/mo (Business AI) | ❌ |
| **Reclaim.ai** | AI calendar scheduling | closed cloud (heuristic) | rules + cloud | n/a | Free; ~$8–10/mo · ~$12–15/mo business | ❌ |
| **→ dailydrift** | **Operational intelligence** | **Go single-binary · per-Space SQLite + chromem-go** | **local-by-default + opt-in remote** | — | **Free self-host (planned)** | **✅** |

## 3. The differentiator matrix

First-class? (`✓` yes · `~` partial · `✗` no). Note dailydrift's column is **"by design," not "shipping."**

| Capability | Onyx | Glean | Cora | Lindy | Copilot | Apple | Hermes | Omi | Letta/Mem0 | **dailydrift (design)** |
|---|---|---|---|---|---|---|---|---|---|---|
| Work as **Situations/Storylines** | ✗ | ✗ | ~ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | **✓** |
| **Cited-Evidence** provenance | ~ | ✓ | ✗ | ✗ | ~ | ✗ | ✗ | ✗ | ✗ | **✓** |
| **Proactive + anti-spam** | ✗ | ✗ | ✓ | ~ | ~ | ~ | ~ | ~ | ✗ | **✓** |
| **Always/Ask-first/Never** gate | ✗ | ~ | ~ | ~ | ~ | ✗ | ✗ | ✗ | ✗ | **✓** |
| **Per-Space isolation** | ~ | ~ | ✗ | ✗ | ~ | ✗ | ✗ | ✗ | ✗ | **✓** |
| **Self-hosted** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | **✓** |
| **Local-LLM by default** | ✗ | ✗ | ✗ | ✗ | ~ | ✓ | ~ | ✗ | ✗ | **✓** |
| **Ships today / has users** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **✗ (unbuilt)** |

The last row is the one that matters most right now.

## 4. Per-competitor — our edge (if built) vs. the honest caveat

`✅` = where dailydrift's *design* would genuinely differentiate · `⚠️` = where the competitor wins or dailydrift is weak.

**Chat / RAG / second-brain (OSS) — Khoj · Reor · AnythingLLM · Open WebUI · LibreChat · Onyx**
- **Khoj** — ✅ we synthesize Situations/Storylines + proactively surface; Khoj only retrieves on demand. ⚠️ Khoj ships, has ~35k stars, multi-client (Obsidian/WhatsApp/Emacs), and great search *today*.
- **Reor** — ✅ multi-source server + proactivity + governance vs. a passive local note vault. ⚠️ Reor is a polished, truly-local, zero-setup app right now; ours is a server you must run.
- **AnythingLLM** — ✅ Situations vs. static document "Workspaces"; governed action. ⚠️ MIT, ~61k stars, desktop+Docker, huge connector/vector-store support, agents+MCP shipping.
- **Open WebUI** — ✅ we're an intelligence, not a chat box. ⚠️ ~141k stars, the de-facto local-LLM UI; vastly more mature and immediately useful.
- **LibreChat** — ✅ work-state model vs. conversation log. ⚠️ broadest provider coverage, agents, MCP, multi-user — all real today.
- **Onyx** — ✅ continuous Situation modeling + immutable Evidence + personal autonomy gating vs. enterprise doc-search Q&A. ⚠️ **Onyx already does connectors + cited answers + agents in production**; we only *plan* the harder version.

**Agent / memory frameworks (OSS) — Letta · Mem0 · CrewAI · AutoGPT · Hermes · Leon**
- **Letta** — ✅ a finished governed product with a worldview vs. a memory toolkit. ⚠️ Letta's memory architecture is shipping, benchmarked, SDK'd; ours is unproven.
- **Mem0** — ✅ memory sits inside an Evidence→Situation model, not the whole product. ⚠️ Mem0 is a drop-in, ~58k-star, battle-tested memory layer *now*.
- **CrewAI** — ✅ restrained Always/Ask/Never vs. "let crews run." ⚠️ ~1M monthly downloads, huge ecosystem; we have zero.
- **AutoGPT** — ✅ governed, evidence-grounded vs. autonomous-loop heritage. ⚠️ ~180k stars, a real builder + marketplace; we're paper.
- **Hermes** — ✅ Situation/Evidence epistemics + governance on top of the self-hosted-agent shape it shares. ⚠️ **Hermes already is the lives-on-your-server, persistent, private, model-agnostic agent** — our closest *shipping* rival; it has the hard part (a working runtime) done.
- **Leon** — ✅ proactive synthesis vs. reactive command/skill loop. ⚠️ Leon runs today, offline-capable.

**Workflow / builders (OSS) — Dify · n8n · Flowise**
- **Dify / Flowise** — ✅ a running intelligence vs. a canvas you assemble apps on. ⚠️ ~144k / ~53k stars, production-grade, deployable now.
- **n8n** — ✅ relevance-modeled proactivity + Evidence vs. cron/trigger automation. ⚠️ ~192k stars, 400+ integrations, enormous community — we start at **zero integrations**, which is most of the value.

**AI chief-of-staff / proactive SaaS — Lindy · Martin · Cora · Ohai · Saner · Personal.ai**
- **Lindy** — ✅ sense-making + provenance + constitutional gating vs. action-first automation. ⚠️ **4,000+ integrations, shipping, voice agents** — and integrations are the moat.
- **Martin** — ✅ structured anti-spam Situations vs. unstructured voice nudges. ⚠️ a real voice assistant managing calendar/email/SMS across accounts today.
- **Cora** — ✅ we generalize Cora's "inbox→feed, draft-then-approve" across *all* signals with provenance + per-Space isolation. ⚠️ **Cora is the strongest philosophical cousin and it already nails email triage at $12/mo** — focused, polished, cheap; we'd have to beat it at its own game across a far harder surface.
- **Ohai** — ✅ general-purpose + governed vs. family-logistics-only. ⚠️ ships, delightful for its niche, $9.99/mo.
- **Saner** — ✅ self-hosted, evidence-grounded, autonomy-gated proactivity vs. cloud notes/tasks. ⚠️ Saner's proactivity works **now** for real ADHD users at $8/mo.
- **Personal.ai** — ✅ we model *work*, not a persona that mimics you. ⚠️ a shipping trained personal model; different goal, but real.

**Big-tech assistants — Copilot(+Recall) · Gemini · Apple Intelligence · Glean**
- **MS Copilot / Recall** — ✅ vendor-neutral, self-hosted, Situation/Evidence model + constitutional gating vs. an ecosystem-locked copilot + a searchable activity log. ⚠️ **Microsoft's distribution, M365 grounding, GPT-5.x quality, and Agent Mode are overwhelming**; Recall is ambient awareness shipping to millions.
- **Google Gemini** — ✅ privacy/ownership + sense-making vs. reactive cloud chat. ⚠️ frontier Gemini 3.x, 1M context, Deep Research, free tier, planet-scale distribution — we cannot match raw capability.
- **Apple Intelligence** — ✅ open/vendor-neutral, self-hosted, with a real Situation/Evidence model + governance vs. on-device feature-AI tied to Apple HW. ⚠️ **shares our privacy instinct, but it's free, on every device, and "just there"** — frictionless in a way a self-hosted server never is.
- **Glean** — ✅ Glean-grade citation/provenance brought to a *personal, self-hosted* intelligence with proactivity + autonomy gating. ⚠️ **Glean already ships permission-aware, source-cited, agentic Work AI** (and at ~$60k+/yr proves enterprises pay for exactly this) — they're ahead on the provenance axis we claim.

**Wearables / lifelog — Omi · Bee · Plaud · Rewind/Limitless**
- **Omi** — ✅ synthesis (Situations/Evidence) + governance vs. capture→transcript→memory; shared open/self-host value. ⚠️ Omi has an **actual hardware capture modality (ambient audio) we don't**, plus MIT code shipping at ~12.7k stars.
- **Bee / Plaud** — ✅ self-hosted + synthesis + governance vs. cloud capture-and-summarize. ⚠️ cheap, shipping hardware that captures a modality we have no answer for; Bee has Amazon behind it.
- **Rewind/Limitless** — n/a (discontinued; Meta acqui-killed it — a cautionary tale about this category's economics).

**Notes / scheduling SaaS — Mem · Notion AI · Tana · Reflect · Motion · Reclaim**
- **Mem / Notion AI / Tana / Reflect** — ✅ we synthesize from external Signals with provenance + proactivity vs. AI over content *you* author. ⚠️ all ship, are polished, and Notion/Tana have deep workspace ecosystems; Tana's typed graph overlaps our Entities but is live today.
- **Motion / Reclaim** — ✅ cross-domain awareness vs. single-domain calendar optimization. ⚠️ they **solve scheduling really well right now**; we don't do scheduling at all yet.

## 5. Closest neighbors — honest ranking

1. **Hermes (Nous)** — closest *shipping* architecture (self-hosted, persistent, private, model-agnostic). We add Situation/Evidence + governance it lacks — *if we ship*.
2. **Cora (Every)** — closest *philosophy* (anti-spam digest, draft-then-approve). It already wins on email; we bet on generalizing across all signals.
3. **Glean** — closest on *provenance* (cited, permission-aware) — and it's ahead of us there, just enterprise-scoped and expensive.
4. **Onyx** — closest *open-source* connectors+citations; reframed enterprise-search vs. our personal operational-intelligence.
5. **Omi** — closest on *open/self-host + capture*; different (ambient audio) modality.

## 6. The honest verdict — differentiated, or crap?

**Not crap — but unproven, and niche by construction.**

- **The concept is genuinely under-served.** No shipping product combines *Situations/Storylines + immutable cited Evidence + anti-spam proactivity + Always/Ask-first/Never gating + per-Space isolation + self-hosted/local-LLM*. Cora validates the proactivity framing, Glean validates provenance-as-product, Hermes/Onyx/Khoj validate self-hosted demand. The **whitespace is real**: a *privacy-owned sense-making layer* that tells you what changed and what's blocked, with receipts, and acts only under explicit control.
- **But the moat is "the combination," which is also the execution trap.** Each differentiator is individually hard, and they compound: proactivity that isn't annoying, agents that don't fabricate actions, an Evidence pipeline that's actually trustworthy. Products routinely *die* on exactly these.
- **The strategic choices cost us the mass market.** Self-hosted + local-LLM-by-default means **weaker model quality** than Copilot/Gemini/Glean (frontier cloud), **setup friction** a $20/mo SaaS doesn't have, and **zero integrations on day one** while Lindy/n8n have thousands. Big-tech (Copilot/Gemini/Apple) win on distribution and capability by orders of magnitude. The realistic audience is the **privacy/tinkerer/self-hoster niche** (the Khoj/Onyx/Hermes crowd) — meaningful, loyal, but not large.
- **Today, it loses to everything on the only metric that counts: it doesn't exist.** A 35-way feature comparison flatters a product that hasn't shipped a feature.

**Bottom line:** strong, differentiated *thesis*; brutal execution risk; niche-by-design. Worth building **only if** you (a) genuinely value ownership/privacy enough to run a server, and (b) can execute the proactivity + Evidence quality that nobody else has nailed. If either fails, you've built a worse, lonelier Hermes/Onyx. The idea isn't the weak point — **shipping the hard 20% that makes it feel magical is.**

## Sources

**OSS assistants/RAG:** [Khoj](https://github.com/khoj-ai/khoj) · [Reor](https://github.com/reorproject/reor) · [AnythingLLM](https://github.com/Mintplex-Labs/anything-llm) ([cloud pricing](https://anythingllm.com/cloud)) · [Open WebUI](https://github.com/open-webui/open-webui) · [LibreChat](https://github.com/danny-avila/librechat) · [Onyx](https://github.com/onyx-dot-app/onyx) ([pricing](https://onyx.app/pricing))
**Agent/memory/builders:** [Letta](https://github.com/letta-ai/letta) ([pricing](https://docs.letta.com/letta-code/pricing)) · [Mem0](https://github.com/mem0ai/mem0) ([pricing](https://mem0.ai/pricing)) · [CrewAI](https://github.com/crewaiinc/crewai) ([pricing](https://crewai.com/pricing)) · [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT) ([pricing](https://www.agpt.co/pricing.html)) · [Hermes](https://github.com/NousResearch/hermes-agent) · [Leon](https://github.com/leon-ai/leon) · [Dify](https://dify.ai/pricing) · [n8n](https://n8n.io/pricing/) · [Flowise](https://flowiseai.com/)
**Chief-of-staff / proactive:** [Lindy](https://www.lindy.ai/pricing) · [Martin](https://www.trymartin.com/pricing) · [Cora](https://cora.computer/) ([bundle](https://every.to/on-every/the-every-bundle-now-includes-cora)) · [Ohai](https://www.ohai.ai/) · [Saner](https://www.saner.ai/pricing) · [Personal.ai](https://www.personal.ai/pricing)
**Big-tech:** [M365 Copilot pricing](https://www.microsoft.com/en-us/microsoft-365-copilot/pricing) · [Google AI subscriptions](https://gemini.google/subscriptions/) · [Apple Intelligence](https://www.apple.com/apple-intelligence/) ([PCC](https://security.apple.com/blog/private-cloud-compute/)) · [Glean pricing](https://checkthat.ai/brands/glean/pricing)
**Wearables/notes/scheduling:** [Omi](https://github.com/BasedHardware/omi) ([site](https://www.omi.me/)) · [Bee (TechCrunch)](https://techcrunch.com/2026/01/12/why-amazon-bought-bee-an-ai-wearable/) · [Plaud](https://www.plaud.ai/products/notepin) · [Mem pricing](https://get.mem.ai/pricing) · [Notion pricing](https://www.notion.com/pricing) · [Tana pricing](https://tana.inc/pricing) · [Reflect](https://reflect.app/) · [Motion pricing](https://www.usemotion.com/pricing) · [Reclaim pricing](https://www.morgen.so/blog-posts/reclaim-pricing)

*Caveats: star counts/pricing are approximate June-2026 snapshots and drift; closed-source stacks/LLMs marked unknown; Hermes star figure flagged as uncertain; Rewind/Limitless discontinued.*
