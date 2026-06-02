# dailydrift — Project Instructions for AI Agents

dailydrift is the working codename for **"the System"**: a self-hosted operational intelligence
that maintains continuous contextual awareness across a user's work, research, and life — modeling
work as living *Situations and Storylines* (not event feeds), surfacing what changed and what's
blocked, and acting under explicit, approval-gated control. The target architecture is an always-on
self-hosted **server** (the brain) with **native clients** (views & controls). The current codebase
is an early **Wails desktop client** scaffold; the product itself is defined by the specs.

## Specifications — the product source of truth

- `specs/index.md` is the map of the whole spec suite — read it first, then load only what a task needs.
- **Read `specs/constitution.md` before any other spec** (governing principles P1–P12, the Always/Ask-first/Never autonomy model, the example cast).
- Approved specs: `constitution`, `overview`, `glossary`. `how-it-works` is in review. Everything else in `index.md` is an unwritten backlog.
- When code and an approved spec conflict, the spec wins — fix the code or flag the gap; don't silently diverge.

## Project structure

- `main.go` — Wails bootstrap (window options, embeds `frontend/dist`, registers bound structs).
- `app.go` — the `App` struct. **Methods on `App` are exposed to the frontend**; the TS bindings in `frontend/wailsjs/` are generated from them — never hand-edit `wailsjs/`.
- `frontend/` — the active Wails client (React 19 + TS). This is the UI; `frontend/wailsjs/` confirms it is the bound frontend.
- `specs/` — product specifications (see above).
- `.beads/` — beads issue-tracker data. `var/` — scratch/temp (gitignored).
- `dailydrift/` — a standalone Vite + React + shadcn scaffold present in the tree; **not** wired into the Wails build (uses eslint/prettier, not the project's Biome).

## Stack & tooling

- **Backend:** Go 1.23, Wails v2.11.
- **Frontend:** React 19, Vite 8, Tailwind v4, shadcn (`base-nova` style, zinc base), Base UI, lucide icons.
- **Package manager:** `pnpm` (in `frontend/`). **Lint/format:** Biome. **Issue tracking:** `bd` (beads).

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->

## Build & verification

- **Dev (hot reload):** `just dev` → `wails dev -tags webkit2_41`. The `webkit2_41` tag is required to build on this Linux/WebKitGTK setup.
- **Production build:** `wails build`.
- **Frontend only:** in `frontend/` — `pnpm install`, `pnpm run build` (`tsc -b && vite build`).
- **Lint/format the frontend before committing:** `pnpm run check` (Biome check+write) or `pnpm run lint`.
- No Go or frontend test suites exist yet — add them with the feature they cover, not as a separate pass.

## Conventions

- **Frontend formatting is Biome-enforced:** 4-space indent, double quotes, always semicolons, `useBlockStatements` (no single-line `if` bodies). Don't fight the formatter — run `pnpm run check`.
- **Import aliases (shadcn):** `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, `@/hooks`. Use these, not deep relative paths.
- Add shadcn components via the shadcn CLI so they land in `frontend/src/components/ui/` with the configured style.
- To expose backend behavior to the UI, add a method to `App` in `app.go`; regenerate bindings via the Wails dev/build flow rather than editing `frontend/wailsjs/`.

## Shell safety (non-interactive)

`cp`/`mv`/`rm` may be aliased to `-i` and hang waiting for input. Always use non-interactive forms: `rm -f`, `rm -rf`, `cp -f`, `mv -f`. For `ssh`/`scp` use `-o BatchMode=yes`; `apt-get` use `-y`.
