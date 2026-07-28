# High-Level Design (Basic Design) — <System / Feature>

> System-level design: **what** is built and **where** boundaries sit — not
> implementation detail (that is the LLD). Organized as **IEEE 1016-2009**
> design views addressing stakeholder concerns. Prefer content aggregated from
> `BASIC_DESIGN.md`. Cite sources; mark `Gap`/`Unknown`.

- **Status:** draft / reviewed / approved · **Last-synced:** `<commit>`
- **Source design:** _(BASIC_DESIGN.md path, or code evidence)_

## Overview
- _(what this covers, the shape, the key decision)_

## Design stakeholders & concerns (IEEE 1016)
| Stakeholder | Concern | View below that answers it |
|---|---|---|
| _(…)_ | _(…)_ | Context / Composition / Logical / … |

<!-- HLD covers the high-level IEEE 1016 viewpoints: Context, Composition,
Logical, Dependency, Interface, Information. Detailed viewpoints (Structure,
Interaction, State, Algorithm, Resource) belong in the LLD. -->

## Scope
- **In scope:** _(…)_  · **Out of scope:** _(…)_

## Architecture overview
_(Major components and how they collaborate; link `../02-architecture/architecture.md`.)_

```mermaid
flowchart LR
  A[Component A] --> B[Component B]
```

## Components

| Component | Responsibility | Owns data | Interfaces (purpose-level) | Source |
|---|---|---|---|---|
| _(…)_ | _(…)_ | _(entities/stores)_ | _(…)_ | _(path)_ |

## Main flows (happy paths)
_(1–3 primary flows at system level; sequence/flow diagram when useful.)_

## External interfaces
_(Purpose-level, not full contracts — those live in `api-reference.md` / LLD.)_

## Data ownership
_(Which component owns which entities/stores; read/write boundaries.)_

## Cross-cutting & constraints
_(Security boundaries, performance envelope, compliance touching this design.)_

## Open questions / gaps
| Item | Impact | Owner |
|---|---|---|
| _(…)_ | _(…)_ | _(…)_ |
