# Restly

Desktop-first API client UI (Postman alternative) — **mock-phase** (no real HTTP / Tauri yet).

Design under `design/` is **reference only**, not pixel SSOT.

## Stack

| Layer      | Tech                                                   |
| ---------- | ------------------------------------------------------ |
| Core       | Vite 8, React 19, TypeScript 6                         |
| Style      | Tailwind CSS 4, shadcn/ui (Radix Nova), Lucide, Motion |
| Data       | TanStack Query, TanStack Table, TanStack Form, Zustand |
| Routing    | TanStack Router                                        |
| Validation | Zod 4                                                  |
| Tooling    | OXC (oxlint + oxfmt), Vitest                           |

## Architecture

```
src/app | pages | features | entities | shared | components/ui | infrastructure
```

Clean / hexagonal frontend layering — see `.cursor/rules/clean-architecture.mdc`.

## Routes (mock UI)

| Path            | Screen                          |
| --------------- | ------------------------------- |
| `/`             | Welcome + import + recent       |
| `/workspace`    | Request editor + mock Send      |
| `/history`      | Grouped history, restore/delete |
| `/environments` | Env + variables CRUD            |
| `/auth`         | Auth profiles (apply to request)|
| `/mocks`        | Mock servers + routes           |
| `/settings`     | Theme / prefs / stubs           |

Persist key: `restly.mock.v1` (folders, envs, history, auth profiles, mock servers, prefs).

## Develop

```bash
npm install
npm run dev
npm run check   # fmt + lint + test + build
```

## Agent skills

Simple Skills kit in `.agents/` (frontend+backend). See `AGENTS.md`.

## Coding standards

See [docs/CODING_STANDARDS.md](./docs/CODING_STANDARDS.md) and `.cursor/rules/`.
