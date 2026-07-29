---
name: restly-clean-frontend
description: >-
  Apply Clean Architecture / Hexagonal patterns to the Restly Vite+React UI.
  Use when scaffolding folders, adding features, introducing HTTP/storage,
  refactoring stores, or when the user asks for clean code / clean architecture.
---

# Restly Clean Frontend

## Shared preamble

If `.agents/SKILL_PREAMBLE.md` exists, follow it first (language, work layout).

## Purpose

Keep Restly maintainable from day one: domain isolated, UI thin, infrastructure swappable (mock → real HTTP → Tauri later).

## Contract

| Field   | Requirement                                                                |
| ------- | -------------------------------------------------------------------------- |
| Inputs  | Current `src/` tree, Stitch design constraints, requested feature          |
| Outputs | Code placed in correct layers; no circular deps; brief note of ports added |
| Safety  | Do not invent backend APIs; UI phase uses mocks behind clear interfaces    |

## Target structure

```
src/
  app/                 # App shell, providers
  pages/               # Welcome, Workspace routes
  features/
    collections/
    request-editor/
    history/
    environments/
    settings/
  entities/            # Request, Collection, Environment, …
  shared/
    ui/
    lib/
    styles/
  infrastructure/      # later: http/, storage/, desktop/
```

## Dependency rule

`pages → features → entities/shared`  
`features → infrastructure` only via ports (interfaces) defined next to the feature or in `entities`.

## Steps

1. Name the feature and its entities (ubiquitous language: Collection, Request, Environment).
2. Put types/pure logic in `entities/` or `features/<x>/model/`.
3. Put React in `features/<x>/ui/` or `pages/`.
4. If data is fake, create `infrastructure/mock/<port>.ts` implementing an interface — do not hardcode fixtures inside JSX beyond trivial display demos.
5. Add a short ADR under `.agents/wiki/` or `docs/` when introducing a new port (skill `architecture-decision-records`).

## Anti-patterns

- Importing pages from features
- Zustand store that owns HTTP + UI + domain validation in one file
- Copy-pasting Stitch HTML without extracting shared UI primitives
- Mixing Vietnamese and English in the same artifact body
