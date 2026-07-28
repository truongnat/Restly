# Discussion

> Seeded by brainstorming step-01. Fill via steps 02–04.
> Write for a busy teammate: concrete names, short bullets, no filler.
> Separate **facts** vs **assumptions** vs **unknowns**. End with one clear
> **recommendation** + **handoff**. Obey `.agents/SKILL_PREAMBLE.md` Readable writing.

## Step ledger (mandatory — update every step)

| Step | Name | Status | Evidence |
|---|---|---|---|
| 01 | Init template | `todo` / `done` | path to this file |
| 02 | Frame + Spec quality | `todo` / `done` / `blocked` | Feasibility/Correctness/Capability filled |
| 03 | Scope + options | `todo` / `done` / `blocked` | Scope in/out + options matrix |
| 04 | Recommend + handoff | `todo` / `done` / `blocked` | Choose + next skill |
| 05 | Self-check | `todo` / `done` / `blocked` | checklist passed |

> **Hard rule:** Do not mark a later step `done` while an earlier step is still
> `todo`/`blocked`. Do not skip Spec quality review.

## Executive summary

<!-- ≤5 bullets. Concrete. Fill last, keep first. No method branding. -->

- _(TODO)_

## Developer overview

| Field | Value |
|---|---|
| Path | `Quick` / `Lite` / `Full` |
| Status | `needs_info` / `ready_to_recommend` / `recommended` |
| Open Critical/blocking | `0` |
| Visual decisions pending | `0` |
| Next action | _(ask user / fill options / handoff)_ |

## Charts (optional)

<!-- Omit this whole section unless a diagram changes a decision.
Do not leave placeholder Mermaid. -->

## Keywords

<!-- Opaque IDs / JP terms / acronyms. Meaning in settings.language. Cap 3–12.
Criteria: SKILL_PREAMBLE → Keywords. Or: _(none — plain language)_ -->

| Term | Meaning | Where seen |
|---|---|---|
| _(TODO or none)_ |  |  |

## Goal

<!-- Outcome-first (Thinking method — not a heading brand).
     One sentence. MUST pass three-axis: WHO + WHAT + EVIDENCE.
     Name the user/system-facing end state — NOT an activity.
     BAD:  "Write the search API" / "Refactor auth" / "Fix the bug"
     GOOD: "Operator on FBD08001 can search by BaseCd and see columns C1–C5;
            empty BaseCd shows M-01 (verified with sample §11)."
     Full rules: .agents/thinking/outcome-first.md -->

_(TODO)_

## Desired outcome

<!-- Expand Goal into observable behaviors (still Outcome-first).
     Bullets = what “done” looks like to the consumer — NOT a task backlog.
     BAD:  write DTO / write service / write UI
     GOOD: search returns §8-shaped rows; over-max shows M-OVER; export file …
     Order (Default path first): normal/happy behaviors first, then validation/
     error outcomes; rare edges → Non-goals or later bullets.
     Each bullet should be falsifiable later via PLAN DoD / TASK Verify.
     Feedback loop: for Blocking/dual-read behaviors, include ≥1 Given→Expect
     example (confirm by example) — prefer a happy example first.
     .agents/thinking/feedback-loop.md · .agents/thinking/default-path-first.md
     Include who benefits when not obvious from Goal. -->

_(TODO)_

## Confirmed facts

<!-- IPO Input: what is already known (user/repo/research) — not guesses.
     Blocking gaps belong in Unknowns, not here. -->

- _(TODO)_

## Constraints

<!-- Make-implicit-explicit Input: time / stack / tools / policy / deadline.
     If user stated a timebox, write it here — forces Non-goals cuts.
     SSOT (optional Full/multi-doc): add Canonical sources rows — kind → store
     (API/OpenAPI, schema/migrations, AC/ticket, progress=TASKS+status).
     See .agents/thinking/single-source-of-truth.md — never create SSOT.md. -->

| Constraint | Source |
|------------|--------|
| _(TODO — time / stack / tools / policy / deadline)_ | _(user / repo)_ |

## Assumptions

<!-- Make-implicit-explicit: never put guesses in Facts. Risk High + Confirmed=No
     blocks Ready. See .agents/thinking/make-implicit-explicit.md -->

| Assumption | Risk | Confirmed |
|------------|------|-----------|
| _(TODO)_ | Low / Medium / High | No |

## Unknowns

<!-- Blocking=Yes requires Owner (who answers?). Dual-interpretation of a driving
     sentence → Issue triage + Confirm-first, do not silent-pick. -->

| Unknown | Blocking? | Owner |
|---------|-----------|-------|
| _(TODO)_ | Yes / No | _(user / BA / lead — required if Blocking)_ |

## Issue triage

<!-- Severity: Critical/High/Medium/Low. Clarity: Clear/Partial/Unknown.
Blocking=Yes means recommendation/planning must stop until answered.
Reversibility (R/H/U): ceremony by reverse-cost — see
.agents/thinking/reversible-decisions.md (High-impact ≠ hard-to-reverse). -->

| ID | Issue / decision | Severity | Clarity | Blocking? | Reversibility | Owner | Status |
|---|---|---|---|---|---|---|---|
| ISS-001 | _(TODO — one concrete decision; dual readings that change Output/Process)_ | Critical / High / Medium / Low | Clear / Partial / Unknown | Yes / No | R / H / U | _(user / BA / lead — required if Blocking)_ | Open / Answered |

## Clarification checkpoint

<!-- Confirm-first: STOP immediately on Blocking. Classify Ask method
(confirm|choice|fact|table|diagram|html), ask that way in chat, record answer,
rewrite real sections. Do not ship DISCUSSION as a quiz.
Feedback loop: behavior/dual-read → prefer Example (Given→Expect) via fact/table;
UI/shape → diagram/html before polish. See .agents/thinking/feedback-loop.md -->

| Issue ID | Ask method | Focused question / prompt | Why it blocks | User answer / evidence | Resolved? |
|---|---|---|---|---|---|
| ISS-001 | confirm / choice / fact / table / diagram / html | _(TODO — prefer Given→Expect or visual when behavior/shape)_ | _(TODO)_ | _(wait for answer)_ | Yes / No |

> **STOP gate:** Do not continue to Scope/Options while any Critical issue or
> blocking unknown is unresolved. Status=`blocked` until answers land.

## Spec quality review

<!-- Challenge specs BEFORE recommending. Each finding must be concrete.
GOOD: "Upload API has no max size — POST /files — Fail / Blocking"
BAD:  "Cần đảm bảo tính khả thi với hệ thống hiện tại" -->

### 1. Feasibility

| Finding (concrete) | Evidence (path/API/doc) | Verdict |
|---|---|---|
| _(TODO)_ | _(repo / user / docs)_ | Pass / Pass-with-gaps / Fail / Unknown |

- Blockers if not feasible: _(none or list)_

### 2. Correctness

| Finding (concrete) | Evidence (path/API/screen/DB) | Verdict |
|---|---|---|
| _(TODO)_ | _(repo / screen / API / DB)_ | Pass / Pass-with-gaps / Fail / Unknown |

- Spec vs system mismatches: _(none or list)_

### 3. Capability gaps

| Gap ID | Missing capability | Why it matters | Ask or default | Blocking? |
|---|---|---|---|---|
| CAP-001 | _(TODO — e.g. max upload size)_ | _(TODO)_ | _(ask / propose default)_ | Yes / No |

> **STOP gate:** If Feasibility or Correctness is `Fail` / `Unknown` and
> Blocking=Yes, stop and ask. Blocking capability gaps also stop recommendation.

## Visual triage

<!-- Ask method `diagram` / `html` only. Map from SKILL_PREAMBLE Question methods.
`html` requires ask-before-create — never for pure strategy text. -->

| Issue ID | Visual need | Format | Why (one line) | User confirmed? | Artifact |
|---|---|---|---|---|---|
| ISS-001 | none / useful / required | text / table / diagram / html-recommended | _(TODO)_ | Yes / No / N/A | _(path or not needed)_ |

## Scope in

- _(TODO)_

## Scope out

- _(TODO)_

## Non-goals

- _(TODO or none)_

## Options considered

| Option | Pros | Cons | Effort | Risk | Reversible? | How to verify |
|--------|------|------|--------|------|-------------|---------------|
| A — _(name)_ | | | | | | |
| B — _(name)_ | | | | | | |

<!-- At least one option. Prefer 2+ when trade-offs exist. -->

## Recommendation

- **Choose:** _(Option X)_
- **Reason:** _(why — concrete)_
- **Not choosing:** _(brief)_
- **Confidence:** High / Medium / Low

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| _(TODO)_ | _(TODO)_ | _(TODO)_ |

## Handoff

<!-- Design for handoff six questions (what/why/run/check/risks/next).
     Successor continues without chat. .agents/thinking/design-for-handoff.md -->

- **Next skill:** business-analysis / basic-design / planning / research / execution _(pick one)_
- **Why:** _(one line — Q2)_
- **Verify / evidence so far:** _(or n/a — Q4)_
- **Blockers / risks before next skill:** _(none or list — Q5)_
- **How to continue:** _(path to DISCUSSION / facts — Q3 if needed)_
