# Restly coding standards

Agent-facing rules also live in `.cursor/rules/`. This document is the human entrypoint.

## Engineering rule set

These documents are normative for new and changed code:

| Document                                                                | Scope                                                                                |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [Frontend coding rules](./engineering/frontend-coding-rules.md)         | React/TypeScript architecture, naming, complexity, state, async Tauri UX and testing |
| [Rust and Tauri coding rules](./engineering/tauri-rust-coding-rules.md) | Native architecture, commands, async jobs, security, persistence and quality         |
| [Comment and trace rules](./engineering/comment-and-trace-rules.md)     | Feature-scoped flow/rule tags and trace requirements                                 |
| [Flow and business-rule registry](./engineering/flow-registry.md)       | Approved namespaces, flow IDs and critical rule IDs                                  |
| [Commit rules](./engineering/commit-rules.md)                           | Conventional Commits, atomicity, Linear references and verification                  |

When a short checklist in this file conflicts with a detailed rule, the detailed engineering rule applies. Architecture/security decisions recorded in an accepted ADR take precedence for their explicit scope.

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
  adapters/          → port implementations (browser/native)
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
4. New remote/native capability → port in `application/ports` + adapter + register in `createAppContainer`.
5. FE must not call Tauri directly outside `infrastructure/tauri`.

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
| Native capability  | port + `infrastructure/tauri` adapter   |
| Cache/UI sync      | TanStack Query in `features/*/model`    |
| Shell UI state     | Zustand (`app/store`)                   |
| Local widget state | `useState` / `useReducer`               |
| Validation         | Zod in `entities`                       |

## Current hybrid phase

- Browser Send uses real `fetch`; optional mock adapter remains available.
- Persisted browser state currently uses `shared/lib/persist.ts` (`restly.mock.v1`).
- Tauri/native capabilities must follow the Rust/Tauri rules when introduced.
- Pages use kebab-case.
- Prefer shadcn primitives under `components/ui`.
- Store actions must not be named `use*`.

## Tooling

Frontend:

- Format: `npm run fmt`
- Lint: `npm run lint`
- Test: `npm test`
- Gate: `npm run check`

Rust/Tauri when present:

- `cargo fmt --check`
- `cargo clippy --all-targets --all-features -- -D warnings`
- `cargo test`
