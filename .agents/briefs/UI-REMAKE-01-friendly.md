# Brief UI-REMAKE-01 — Friendly remake (Stitch = reference only)

Executor: **agy**. Repo: `/root/Restly`.

## Design Read (locked unless user amends)

> Reading this as: **desktop API client** for developers, with a **Linear / Insomnia / Bruno–friendly** language — calm light shell, clear hierarchy, restrained motion. Stitch assets under `design/` are **IA/feature reference only**, not pixel SSOT.

**Dials:** VARIANCE 4 · MOTION 3 · DENSITY 6 (tool UI, not landing page).

## Skills to follow (read before coding)

1. `.agents/skills/frontend-design/SKILL.md`
2. `.agents/skills/design-taste-frontend/SKILL.md` (anti-slop; dials above)
3. `.agents/skills/redesign-existing-projects/SKILL.md` (audit → fix, don’t greenfield wipe)
4. `.agents/skills/web-component-design/SKILL.md`
5. Project rules: `.cursor/rules/ui-direction.mdc`, `clean-architecture.mdc`, `di.mdc`

## Goals

Remake current shell + main screens so they feel **friendly and coherent** as a real API client:

1. **One light shell** — keep AppShell option A (full-height sidebar); refine spacing, type, nav clarity.
2. **Workspace** — request + response readable; prefer **side-by-side** split on wide screens, stack on narrow; clear empty state before Send.
3. **History / Environments / Settings / Welcome** — same visual language; reduce hardcoded chrome; use shadcn + shared tokens.
4. **No** fake macOS traffic lights; **no** pixel-chasing Stitch dark/light conflicts.
5. Keep architecture (DI, ports, features/*/model) — this is a **visual/UX remake**, not a rewrite of data layer.

## Anti-goals

- Marketing-landing maximalism / purple AI gradients / Inter-as-only-identity for the sake of “premium”
- Breaking routes or mock Send flow
- Implementing F01+ feature backlog (Auth editor, CRUD env, real HTTP, …)

## Acceptance

1. `/`, `/workspace`, `/history`, `/environments`, `/settings` usable and visually consistent.
2. Empty / pending Send states feel guided (copy + layout).
3. `npm run fmt && npm run lint && npm run build` pass.
4. Short Vietnamese report: design read, what changed, what was intentionally left for features.

## Commands

```bash
cd /root/Restly
npm run fmt && npm run lint && npm run build
```

Live: http://127.0.0.1/
