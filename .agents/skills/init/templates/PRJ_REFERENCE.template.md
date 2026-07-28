# Project Reference

## Executive summary

<!-- Maximum five bullets: purpose, architecture, critical constraint, primary
workflow, and biggest unknown/risk. Put the most decision-useful facts first. -->

- TODO

## Project identity

- Purpose:
- Users/stakeholders:
- Domain:
- Lifecycle/status:

## Workspaces / apps (monorepo)

<!-- Omit this section (or mark N/A) for a single-package repo. For a monorepo,
add ONE row per app/package/service, each with its OWN stack — never collapse
different stacks (e.g. a Flutter app next to Next.js/NestJS apps) into one. -->

| Path | Type | Stack | Entry point | Key commands | Source |
|---|---|---|---|---|---|
| apps/TODO | app/package/service | TODO (e.g. Next.js / NestJS / Flutter) | TODO | TODO | manifest path |

## Technology stack

<!-- In a monorepo, list the stack PER workspace (mirror the table above), not
only the root manifest. -->

| Technology | Role | Version | Workspace(s) | Source | Confidence |
|---|---|---|---|---|---|
| TODO | TODO | TODO | root / apps/TODO | TODO | TODO |

## Architecture and key flows

| Component / flow | Responsibility | Entry point / boundary | Dependencies | Source |
|---|---|---|---|---|
| TODO | TODO | TODO | TODO | TODO |

## Business rules

| ID | Rule | Affected area | Source | Confidence |
|---|---|---|---|---|
| BR-001 | TODO | TODO | TODO | TODO |

## Key constraints

| Constraint | Type | Reason/source | Impact |
|---|---|---|---|
| TODO | technical/business/compliance/compatibility | TODO | TODO |

## Verified commands

| Purpose | Command | Source | Confidence |
|---|---|---|---|
| Setup | TODO | TODO | TODO |
| Run | TODO | TODO | TODO |
| Test | TODO | TODO | TODO |
| Lint | TODO | TODO | TODO |
| Build | TODO | TODO | TODO |

## Project conventions

### Code

- Structure/naming:
- Error handling:
- Doc-comment style (detected): _(TSDoc/JSDoc, PEP 257, Javadoc, GoDoc, … or none)_
- Flow/rationale comments:

### Git

- Branch mode (`direct` / `checkout`):
- Base branch:
- Branch naming:
- Commit convention:

### Pull requests

- Title:
- Required description sections:
- Required checks:

### Reports

- Executive-summary style:
- Developer overview panel (inside each real artifact — not a separate OVERVIEW.md):
- Charts/diagrams (Mermaid):
- Progress source of truth: `TASKS.md` + `session.sh status` (no OVERVIEW.md):
- Custom sections:

### Decision and visual gates

- Critical/blocking question policy:
- Preferred diagram format:
- HTML decision-aid policy:

## Security notes

<!-- Boundaries and rules only. Never paste secret values. -->

- TODO

## Authoritative references

| Source | Purpose | Authority |
|---|---|---|
| TODO | TODO | primary/supporting |

## Agent CLIs

<!-- Filled by: python .agents/tools/session/detect_agents.py --write
Status: available | auth_unknown | missing. Never paste tokens. -->

| CLI id | Status | Path | Auth probe | Notes |
|---|---|---|---|---|
| _(run detect_agents)_ |  |  |  |  |

## Unknowns and conflicts

| Question / conflict | Impact | Owner | Blocking |
|---|---|---|---|
| TODO | TODO | TODO | yes/no |

## Freshness

- Mode: init / refresh / force
- Generated or updated:
- Source commit:
- Scope inspected:
