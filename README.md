# Restly

Desktop-first API client (Postman alternative) — **hybrid**: real `fetch` Send by default, mock fixtures + Mock Server wire, **no Tauri yet**.

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

## Routes

| Path            | Screen                                      |
| --------------- | ------------------------------------------- |
| `/`             | Welcome + Postman import/export             |
| `/workspace`    | Request editor + real Send (Cancel)         |
| `/history`      | Grouped history                             |
| `/environments` | Env + variables                             |
| `/auth`         | Auth profiles                               |
| `/mocks`        | Mock servers (wired into Send when running) |
| `/websocket`    | WebSocket client                            |
| `/sse`          | Server-Sent Events client                   |
| `/settings`     | Theme / prefs / telemetry / auto-update     |

**Shortcuts:** `Ctrl/Cmd+K` command palette.

**Env:** `VITE_USE_MOCK_HTTP=true` forces mock echo adapter.

Persist: `restly.mock.v1`.

## Develop

```bash
npm install
npm run dev
npm run check   # fmt + lint + test + build
```

## Agent skills

Simple Skills kit in `.agents/` — see `AGENTS.md`.

## Coding standards

See [docs/CODING_STANDARDS.md](./docs/CODING_STANDARDS.md) and `.cursor/rules/`.
