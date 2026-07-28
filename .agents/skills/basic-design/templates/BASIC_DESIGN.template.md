# Basic Design

> Seeded by basic-design. Write for a busy teammate: concrete paths/IDs, no filler.
> Obey `.agents/SKILL_PREAMBLE.md` Readable writing + Language:
> **headings stay English**; prose follows `settings.language` (one language, no mix).
> **Hard rule:** Do not fill architecture/components/flows while Doc reality check
> has Blocking=`Yes` unresolved (ask the user first).

## Executive summary

- _(TODO)_

## Developer overview

| Field | Value |
|---|---|
| Path | `Lite` / `Full` |
| Status | `needs_info` / `designing` / `ready_for_detail` |
| Doc reality blockers | `0` |
| Next action | _(ask user / fill design / handoff)_ |

## Doc reality check (mandatory — before design body)

> Compare session/wiki docs to the **codebase**. Do not treat specs as truth.
> Verdict per row: `Match` / `Mismatch` / `Missing-in-docs` / `Missing-in-code` / `Stale` / `Unknown`.
> Blocking=`Yes` → **STOP immediately**. Classify Ask method; prefer
> `diagram`/`table`/`html` when the user must **see** docs-say vs code-does
> (SSOT — `.agents/thinking/single-source-of-truth.md`); else `confirm`/`choice`/`fact`.
> Ask in chat (max 3). Wait for answer, fold into Clarification + canonical
> follow-up, then fill design body — no quiz-as-document.

| # | Claim the design will depend on | Doc evidence (path/§) | Code evidence (path) | Verdict | Blocking | Ask user? |
|---|---|---|---|---|---|---|
| 1 | _(TODO)_ |  |  |  | Yes/No |  |

### Clarification checkpoint

<!-- STOP → Ask method → chat → record → rewrite Architecture/Components. -->

| Ask method | Questions asked (this turn) | User answers | Accepted source of truth |
|---|---|---|---|
| confirm / choice / fact / table / diagram / html |  |  | doc / code / refresh docs first |

## Goal

_(TODO)_

## Context

_(TODO)_

## Architecture overview

_(TODO)_

## Components

| Component | Responsibility |
|---|---|
|  |  |

## User or system flows

<!-- Default path first: main/happy flow(s) first; validation/error branches
     after; rare edges omit or mark deferred. .agents/thinking/default-path-first.md -->

1. _(TODO — main path)_

## Data ownership

| Entity / store | Owner component |
|---|---|
|  |  |

## Open questions

| Question | Blocking |
|---|---|
|  |  |

## Handoff

<!-- Design for handoff (six questions): Next + Verify pointer + Risks/open +
     Why if non-obvious. Successor must continue without chat.
     .agents/thinking/design-for-handoff.md — never create HANDOFF.md -->

Next skill: `detail-design` / `research` / `investigate`

- Verify: _(or see Doc reality / Goal)_
- Risks / open: _(or none)_
- Why (if needed): _(or see Clarification)_
