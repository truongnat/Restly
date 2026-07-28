# Restly — Project Reference

Generated for Simple Skills `init` / ongoing agent context.

## Executive summary

Restly is a **desktop-first API client** (Postman alternative). Current phase is **UI scaffold + architecture**, then features after UI remake is approved. Runtime shell (Tauri/Electron) and real HTTP come later.

Stack: Vite 8, React 19, TypeScript 6, Tailwind 4, shadcn/ui, TanStack (Query/Router/Table/Form), Zod 4, Zustand, Motion, Lucide, OXC.

## Project identity

| Field | Value |
| --- | --- |
| Name | Restly |
| Domain | API client / developer tools |
| Users | Developers needing local, privacy-first request workflows |
| Lifecycle | Early — remake UI (friendly) before feature build-out |
| Design source | Stitch under `design/` = **reference only** (not pixel SSOT) |

## Architecture intent

Clean / hexagonal **frontend** layering (`.cursor/rules/clean-architecture.mdc`, skill `restly-clean-frontend`). Skill kit: `sk install --profile all` (FE + backend/architecture skills).

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
  entities/         # domain types + Zod
  shared/           # ui kit, utils, styles, di helpers
  infrastructure/   # adapters, mock, di, query
```

## Agent kit

- Entrypoint: `AGENTS.md` → `.agents/START_HERE.md`
- Settings: `.agents/settings.yaml` (`language: vi`)
- Orchestrator: `.cursor/rules/agent-orchestrator.mdc` (controller; agy executes)
- CLI: `sk doctor` / `sk install --profile all`

## Conventions

- No real network in UI phase; mocks behind DI ports.
- Source comments: English (`repo-default`).
- Feature backlog (F01+) only after user **chốt OK** on remade UI.
