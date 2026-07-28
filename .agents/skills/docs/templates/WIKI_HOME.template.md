# <Project name> — Documentation

## Overview

<!-- The vital 20%: what this is, its shape, how to run, where to start. ~5 bullets. -->

- _(purpose)_
- _(architecture in one line)_
- _(how to run / primary workflow)_
- _(biggest constraint or risk)_
- _(where to start reading)_

## Documentation coverage matrix

<!-- Real status per document. A non-trivial repo that is all "complete" on the
first pass is a red flag — be honest with partial/gap. -->

| Document | Standard | Status | Owner | Last-synced |
|---|---|---|---|---|
| [SRS](01-requirements/SRS.md) | ISO/IEC/IEEE 29148 | complete / partial / gap / N/A | | `<commit>` |
| [Architecture](02-architecture/architecture.md) | arc42 + C4 + 4+1 | | | |
| [ADRs](02-architecture/decisions/ADR-index.md) | ADR | | | |
| [High-Level Design](03-design/HLD.md) | basic design | | | |
| [Low-Level Design](03-design/LLD.md) | detailed design | | | |
| [API Reference](04-reference/api-reference.md) | — | | | |
| [Data Model](04-reference/data-model.md) | — | | | |
| [Runbook / Ops](05-operations/runbook.md) | — | | | |
| [Guides](06-guides/onboarding.md) | Diátaxis | | | |

## Workspaces at a glance

| Path | Type | Stack | Page |
|---|---|---|---|
| _(apps/…)_ | app/package | _(Next.js / NestJS / Flutter / …)_ | _(04-reference/workspaces/…md)_ |

## Traceability (thread)

_(Requirement → design → code/test. Full matrix lives in the SRS appendix.)_

---

Sources: _(root manifests, README, session artifacts)_
Last-synced: `<commit>`
