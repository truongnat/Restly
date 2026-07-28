# Restly — Project Reference

Generated for Simple Skills `init` / ongoing agent context.  
Updated: **2026-07-28** (F08 Auth + Mock Servers mock depth + context menus).

## Executive summary

Restly is a **desktop-first API client** (Postman alternative). Current phase is **mock-phase UI**: full navigable product shell with Zustand + localStorage, mock Send echo, **no real HTTP** and **no Tauri/Electron** yet.

Stack: Vite 8, React 19, TypeScript 6, Tailwind 4, shadcn/ui, TanStack (Query/Router/Table/Form), Zod 4, Zustand, Motion, Lucide, OXC, Vitest.

## Project identity

| Field | Value |
| --- | --- |
| Name | Restly |
| Domain | API client / developer tools |
| Users | Developers needing local, privacy-first request workflows |
| Lifecycle | Mock-phase UI feature-complete for F01–F16 + F08 depth + F19-lite |
| Design source | Stitch under `design/` = **reference only** (not pixel SSOT) |

## Feature status (mock)

| Area | Status | Notes |
| --- | --- | --- |
| Workspace request tabs | done | Params / Headers / Body / Auth + multipart + XML |
| Send | done | Mock echo + `{{var}}` substitute |
| Collections tree | done | CRUD + context menu + search |
| History | done | Snapshot restore, groups, welcome recent |
| Environments | done | CRUD vars, secret, duplicate |
| Auth profiles (`/auth`) | done | Named profiles → apply to request |
| Mock servers (`/mocks`) | done | Routes, start/stop mock, use-in-request |
| Settings | done | Theme + prefs persist |
| Context menus | done | Sidebar, history, env, auth, mocks |
| Real HTTP (F18) | **out** | Next major track |
| Desktop shell (F20) | **out** | Tauri later |

## Architecture intent

Clean / hexagonal **frontend** layering (`.cursor/rules/clean-architecture.mdc`, skill `restly-clean-frontend`). Skill kit: `sk install --profile all`.

## Visual / UX intent

- Skills SSOT: `frontend-design`, `design-taste-frontend`, `redesign-existing-projects`, `web-component-design`
- Vibe: calm developer tool — Linear / Insomnia / Bruno friendly, light shell, restrained motion
- See `.cursor/rules/ui-direction.mdc`

## Source layout

```
src/
  app/              # composition root + Zustand + DI boot
  application/      # ports + use-cases
  pages/            # thin route screens
  features/         # shell, request-editor, history, environments, …
  entities/         # domain types + Zod (+ auth-profile, mock-server)
  shared/           # ui kit, utils, styles, persist
  infrastructure/   # adapters, mock fixtures, di, query
  components/ui/    # shadcn primitives (incl. context-menu)
```

## Persist

`localStorage` key `restly.mock.v1` — folders, environments, history, environmentId, authProfiles, authProfileId, mockServers, mockServerId, theme, accent, toggles, bodyFiles metadata.

## Agent kit

- Entrypoint: `AGENTS.md` → `.agents/START_HERE.md`
- Settings: `.agents/settings.yaml` (`language: vi`)
- Orchestrator: `.cursor/rules/agent-orchestrator.mdc`
- Status brief: `.agents/briefs/REPORT-workspace-function-check.md`

## Conventions

- No real network in mock phase; mocks behind DI ports.
- Source comments: English (`repo-default`).
- Do not invent F18/F20 unless user asks.
