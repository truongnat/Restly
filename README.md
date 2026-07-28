# Restly

Desktop-first API client UI (Postman alternative) — **UI phase**.

Design source: Google Stitch project **Restly API Client**.

## Stack

| Layer      | Tech                                                   |
| ---------- | ------------------------------------------------------ |
| Core       | Vite 8, React 19, TypeScript 6                         |
| Style      | Tailwind CSS 4, shadcn/ui (Radix Nova), Lucide, Motion |
| Data       | TanStack Query, TanStack Table, TanStack Form, Zustand |
| Routing    | TanStack Router                                        |
| Validation | Zod 4                                                  |
| Tooling    | OXC (oxlint + oxfmt)                                   |

## Architecture

```
src/app | pages | features | entities | shared | components/ui | infrastructure
```

## Develop

```bash
npm install
npm run dev
npm run check   # fmt + lint + build
```

## Agent skills

Simple Skills kit in `.agents/` (frontend+backend). See `AGENTS.md`.

## Coding standards

See [docs/CODING_STANDARDS.md](./docs/CODING_STANDARDS.md) and `.cursor/rules/`.
