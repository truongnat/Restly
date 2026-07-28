# Restly coding standards

Agent-facing rules also live in `.cursor/rules/`. This doc is the human checklist.

## Layers

```
app/                 → composition root: boot DI, router, providers, Zustand
application/ports    → API/IO interfaces (no React, no fetch)
application/use-cases→ biz logic (pure + port calls)
pages/               → thin routes
features/*/ui        → presentational React
features/*/model     → resolve(DI) + TanStack Query/Form wiring
features/*/lib       → pure helpers + feature constants
entities/            → types + Zod (no React)
shared/              → constants, lib, styles, primitives
components/ui        → shadcn
infrastructure/
  adapters/          → port implementations (mock → real later)
  di/                → Container, tokens, bootContainer, resolve
  mock/              → fixtures
  query/             → QueryClient
```

**Dependency rule:** inward only. `entities` / `application` never import React or adapters. UI never imports adapters directly — only `resolve(TOKENS.*)` from `features/*/model`.

## DI (module-level, not Context)

1. `bootContainer()` in `app/main.tsx` **before** `createRoot`.
2. Feature hooks: `resolve(TOKENS.SendRequest)` inside `queryFn` / `mutationFn`.
3. Unit tests: call use-cases with fakes, or `setContainer(createTestContainer(...))` — **no React mount**.
4. Do **not** put the container in React Context.

See `.cursor/rules/di.mdc`.

## How to split code

1. New screen → `pages/XPage.tsx` + `features/x/...` if logic grows.
2. JSX > ~150 lines or 3+ responsibilities → extract child UI + `model` hook.
3. Business branching in JSX → move to `application/use-cases` or feature `lib`.
4. New remote capability → port in `application/ports` + adapter + register in `createAppContainer`.

## Constants

| Scope          | Path                                |
| -------------- | ----------------------------------- |
| Global         | `src/shared/constants/<domain>.ts`  |
| Feature        | `src/features/<f>/lib/constants.ts` |
| Config / env   | `src/shared/config/`                |
| Domain schemas | `src/entities/`                     |

Use `UPPER_SNAKE` + `as const`. No magic strings/numbers in UI.

## Logic separation

| Kind               | Prefer                                  |
| ------------------ | --------------------------------------- |
| Biz rules          | `application/use-cases`                 |
| IO / HTTP          | port + `infrastructure/adapters` via DI |
| Cache/UI sync      | TanStack Query in `features/*/model`    |
| Shell UI state     | Zustand (`app/store`)                   |
| Local widget state | `useState` / `useReducer`               |
| Validation         | Zod in `entities`                       |

## Mock phase

- No real network / Tauri. Persist UI state via `shared/lib/persist.ts` (`restly.mock.v1`).
- Pages: kebab-case (`auth-page.tsx`, `mocks-page.tsx`). Domain extras: `entities/auth-profile.ts`, `entities/mock-server.ts`.
- Prefer shadcn primitives under `components/ui` (incl. `context-menu`).
- Store actions must not be named `use*` (oxlint treats them as hooks).

## Tooling

- Format: `npm run fmt` (oxfmt)
- Lint: `npm run lint` (oxlint)
- Test: `npm test` (Vitest)
- Gate: `npm run check` (fmt + lint + test + build)
