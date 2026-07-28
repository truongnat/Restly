# Plan

> Filled by planning step-02. Strategy only — **no** full task cards
> (`### T-00x` with AC/Verify/Files) in this file. See `TASKS.md` for work.
> Write for a busy teammate: concrete paths/phases — no filler.
> Obey `.agents/SKILL_PREAMBLE.md` Readable writing.

## Step ledger (mandatory — update every step)

| Step | Name | Status | Evidence |
|---|---|---|---|
| 01 | Init templates | `todo` / `done` | PLAN.md + TASKS.md exist |
| 02 | Fill PLAN + Spec quality | `todo` / `done` / `blocked` | Feasibility/Correctness/Capability filled |
| 03 | Fill TASKS inventory/cards | `todo` / `done` / `blocked` | Work inventory + cards |
| 04 | Self-check | `todo` / `done` / `blocked` | Ready Yes/No with evidence |

> **Hard rule:** Do not mark a later step `done` while an earlier step is still
> `todo`/`blocked`. Do not fill TASKS before Spec quality review is done.

## Executive summary

<!-- ≤5 concrete bullets. Fill last, keep first. -->

- _(TODO)_

## Developer overview

| Field | Value |
|---|---|
| Status | `needs_info` / `planning` / `ready_for_sync` / `blocked` |
| Cards drafted | `0` |
| Critical open decisions | `0` |
| Next action | _(ask user / fill tasks / sync)_ |

## Charts (optional)

<!-- Omit unless useful. No placeholder Mermaid. -->

## Pre-planning decision gate

<!-- Inherit unresolved items from DISCUSSION/BA/design. Do not fill strategy
while a blocking row is open. Reversibility R/H/U — Type H needs options/Spike/ADR
before Ready (.agents/thinking/reversible-decisions.md). -->

| Issue ID/source | Issue / decision | Severity | Clarity | Blocking? | Reversibility | Visual need/format | Resolution evidence | Status |
|---|---|---|---|---|---|---|---|---|
| _(TODO)_ | _(TODO — one concrete decision)_ | Critical / High / Medium / Low | Clear / Partial / Unknown | Yes / No | R / H / U | none / text / table / diagram / html-recommended | _(user answer/path)_ | Open / Resolved |

### Questions requiring user input

| Issue | Focused question | Why the plan changes | Answer |
|---|---|---|---|
| _(TODO)_ | _(TODO)_ | _(TODO)_ | _(wait for user)_ |

> **STOP gate:** Strategy and TASKS stay unfilled while any Critical issue,
> blocking unknown, or unconfirmed `html-recommended` item is open.

## Spec quality review

<!-- Concrete finding + evidence + verdict. No abstract essays. -->

### 1. Feasibility

| Finding (concrete) | Evidence | Verdict |
|---|---|---|
| _(TODO)_ | _(repo / design / ops)_ | Pass / Pass-with-gaps / Fail / Unknown |

### 2. Correctness

| Finding (concrete) | Evidence | Verdict |
|---|---|---|
| _(TODO)_ | _(repo / API / DB / screen)_ | Pass / Pass-with-gaps / Fail / Unknown |

### 3. Capability gaps

| Gap ID | Missing capability | Ask or default | Blocking? | Status |
|---|---|---|---|---|
| CAP-001 | _(TODO)_ | _(ask / propose)_ | Yes / No | Open / Deferred / Resolved |

## Goal

<!-- Outcome-first. One sentence. WHO + WHAT + EVIDENCE.
     Inherit/align with DISCUSSION Desired outcome when present.
     BAD: "Implement order API"  GOOD: "FE can POST /orders and show field errors
     from problem+json; 201/400/401 covered by contract tests."
     See .agents/thinking/outcome-first.md -->

_(TODO)_

## Scope

- _(TODO — separable deliverables that serve the Goal, not activities for their own sake)_

## Non-goals

<!-- Explicitly protect the Goal from silent expansion.
     Default path first: park rare edges here (name early, deepen late) —
     do not delete Spec gaps silently. .agents/thinking/default-path-first.md -->

- _(TODO)_

## Assumptions

<!-- Make-implicit-explicit: High + Confirmed=No → Ready blocker.
     See .agents/thinking/make-implicit-explicit.md -->

| Assumption | Risk | Confirmed |
|------------|------|-----------|
| _(TODO)_ | Low / Medium / High | No / Yes |

## Approach

<!-- IPO Process + Small-batch + Feedback loop + Default path first: phased
     strategy — each phase advances a checkable Output slice.
     Order phases L1 happy → L2 validation → L3 errors → L4 rare (or Non-goals).
     Not “backend then frontend” alone; not exception catalog before happy slice.
     If proposing CI/bot/new skill: ladder manual → checklist → template →
     automate (.agents/thinking/standardize-before-automate.md).
     Prefer phases that relieve the named bottleneck stage
     (.agents/thinking/optimize-bottleneck.md); defer non-constraint polish to
     Non-goals.
     High rewind-cost unknowns → early Spike or Confirm-first Example/See.
     See .agents/thinking/input-process-output.md, small-batch.md,
     feedback-loop.md, default-path-first.md -->

1. _(TODO — L1 happy path deliverable)_
2. _(TODO — L2 validation / L3 errors as needed)_
3. _(TODO — L4 rare only if in scope; else omit / Non-goals)_

## Affected areas

| Area / path | Expected change | Confidence |
|-------------|-----------------|------------|
| _(TODO — real path)_ | _(TODO)_ | known / inferred / unknown |

## Test strategy

<!-- Optional. How to verify **after** code exists. -->

- _(TODO or N/A)_

## Verification strategy

<!-- How the session Goal/DoD will be evidenced (commands, UI checks, logs).
     Prefer falsifiable checks over “manual QA TBD”.
     Feedback loop: name modalities (Run/See/Example) that hit Desired outcome
     examples — not green noise. Coding per-card Run stays in TASKS Verify. -->

- _(TODO — automated command)_
- _(TODO — manual check / UI preview if layout in scope)_

## Definition of done

<!-- Outcome-first checklist. Each box must be falsifiable and map to Goal.
     At least one consumer/contract outcome — not only process hygiene.
     BAD alone: [ ] PR opened  [ ] Lint clean
     GOOD:      [ ] FE shows problem+json field errors on 400 (screenshot/log)
                [ ] Contract tests 201/400/401 pass
                [ ] OpenAPI matches handlers
                [ ] (optional) PR/lint hygiene -->

- [ ] _(TODO — observable consumer/contract outcome + evidence)_
- [ ] _(TODO — verify command or UI check recorded)_
- [ ] `TASKS.md` complete and matches Task index below

## Rollback strategy

- **Code:** _(TODO)_
- **Config:** _(TODO)_
- **Data:** _(TODO or N/A)_

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| _(TODO)_ | _(TODO)_ | _(TODO)_ |

## Task index

<!-- Draft OK in step-02. Step-03 replaces with fine-grained IDs. ID + title only. -->

T-001 _(title)_ → T-002 _(title)_ → … → T-00N _(tests after code)_ (see TASKS.md)

## Handoff

<!-- Ready=Yes ONLY if blockers is `none`. Never Yes + open blockers. -->

- Ready for sync/execution? **No**
- Blockers: _(list unresolved items, or `none`)_
