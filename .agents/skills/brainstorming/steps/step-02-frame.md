# Step 02 — Frame (goal, facts, Spec quality)

## Goal

Fill framing, **Spec quality review**, and issue/visual triage. Stop for user
clarification before scope/options when a Critical issue, blocking unknown, or
blocking Spec quality finding remains.

## Precondition (fail closed)

- [ ] Step ledger 01 = `done`
- [ ] `DISCUSSION.md` exists and contains headings `Step ledger` and `Spec quality review`

If precondition fails → return to step-01. Do **not** continue.

## Rules

- Edit **only** `DISCUSSION.md`.
- Separate **facts** vs **assumptions** vs **unknowns** — never mix.
- **Outcome-first (mandatory):** Goal and Desired outcome before anything that
  looks like a backlog. Read `.agents/thinking/outcome-first.md` if unsure.
  - Goal = **one sentence** that passes **WHO + WHAT + EVIDENCE**.
  - Reject activity-only Goals: “write X”, “implement Y”, “refactor Z”,
    “fix the bug”, “works per spec”.
  - Desired outcome = observable behaviors for the consumer — **not**
    “write DTO / service / UI”.
  - If WHO or EVIDENCE is missing and would change direction → Confirm-first
    **STOP** (do not fill Spec quality around a fuzzy Goal).
- **IPO (mandatory):** After Goal/Desired outcome, treat Facts/Constraints as
  **Input** and Unknowns as Input gaps. Do not invent Process (Scope/Options
  later, Approach in planning) while Blocking Input remains open. See
  `.agents/thinking/input-process-output.md`.
- **Make-implicit-explicit (mandatory):** Facts ≠ Assumptions ≠ Unknowns.
  Dual-interpretation that changes Output/Process → Confirm-first (do not
  silent-pick). Blocking Unknowns/Issues need Owner. User-stated deadline →
  Constraints. See `.agents/thinking/make-implicit-explicit.md`.
- **Feedback loop (mandatory on Blocking behavior/shape):** Prefer confirm by
  **Example** (Given→Expect) or **See** (`diagram`/`html`) over bare Yes/No when
  the answer must show the behavior. UI/layout Blocking → preview before later
  polish. See `.agents/thinking/feedback-loop.md`.
- **Reversible decisions (mandatory on material decisions):** Classify
  Reversibility `R`/`H`/`U` on Issue triage. Type R → fast Confirm/try; Type H →
  options + Spike/ADR path; Type U → treat as H. High-impact ≠ hard-to-reverse.
  See `.agents/thinking/reversible-decisions.md`.
- Inspect repo/user input for facts; mark guesses as assumptions.
- Do **not** implement code.
- Do **not** write PLAN/TASKS or basic/detail design.
- Do **not** fill Scope/Options/Recommendation in this step.
- Classify every material issue by severity, clarity, blocking status, owner,
  visual need, and **Ask method** (`confirm`/`choice`/`fact`/`table`/
  `diagram`/`html` — see SKILL_PREAMBLE Confirm-first).
- On any Blocking need: **STOP immediately**. Classify Ask method, then ask
  with that method. Default: **one focused question** (or one visual) per
  message; up to three only when they are independent `confirm`/`choice`/
  `fact` blockers. Explain why the answer changes direction. No question walls;
  no quiz-as-document.
- **Diverge, do not converge yet:** fill facts/unknowns/Spec quality/triage here;
  do not write Recommendation (that is step-04 after scope/options).
- Update Step ledger 02 to `done` or `blocked` before leaving this step.

## Fill these sections

1. Goal
2. Desired outcome
3. Confirmed facts
4. Constraints
5. Assumptions (risk + confirmed)
6. Unknowns (blocking flag)
7. Issue triage
8. Clarification checkpoint
9. Spec quality review — Feasibility / Correctness / Capability recommendations
10. Visual triage

## Spec quality rules

- Do **not** accept specs at face value. Challenge them against the repo and domain.
- **Feasibility:** can this actually be delivered with current stack/data/auth/ops/time?
- **Correctness:** are specs consistent with the real system (or is the system wrong)?
- **Capability recommendations:** list what a feature of this type should normally
  include even if specs omit it (limits, validation, permissions, audit, errors,
  rollback, observability, UX edge cases). Promote each material gap to Issue
  triage / Clarification checkpoint.
- Verdicts: `Pass` / `Pass-with-gaps` / `Fail` / `Unknown`.

## Mandatory stop gate

Stop and wait for the user when any item is:

- severity `Critical` and not explicitly accepted/resolved; or
- clarity `Partial/Unknown` and marked `Blocking: Yes`; or
- Spec quality Feasibility/Correctness is `Fail` or `Unknown` with Blocking=Yes; or
- a Blocking=Yes capability gap is unanswered; or
- `html-recommended` and the user has not confirmed whether to create the
  visual decision aid.

Do not continue to step-03, choose defaults, or hide these items as assumptions.
Record each question and answer in `Clarification checkpoint`.

## Done when

- [ ] Goal is one clear sentence that passes Outcome-first three-axis
      (WHO + WHAT + EVIDENCE) — not activity-only.
- [ ] Desired outcome lists observable consumer behaviors (not a task backlog).
- [ ] At least one confirmed fact **or** explicit “no facts yet” with unknowns listed.
- [ ] Assumptions and unknowns are not labeled as facts.
- [ ] Blocking Unknowns/Issues have Owner; dual-interpretation driving sentences
      are triaged or Confirm-first answered (Make-implicit-explicit).
- [ ] Blocking behavior/shape uses Feedback-loop modality (Example Given→Expect
      or See) — not bare Yes/No when the user must understand the behavior.
- [ ] Material decisions have Reversibility R/H/U; Type H not left Open while
      Recommendation proceeds (Reversible decisions).
- [ ] Every material issue has severity/clarity/blocking/visual classification.
- [ ] Spec quality review has Feasibility + Correctness verdicts and ≥1 capability
      gap row (or explicit “no material gaps”).
- [ ] No unresolved Critical or blocking item remains before moving on.
- [ ] Step ledger 02 = `done` or `blocked` (with questions asked).
- [ ] No leftover `_(TODO)_` on Goal / Desired outcome / Spec quality verdicts
      (unless blocked — then note blocker).

## Next

Only if Step ledger 02 = `done`: Read and follow `./step-03-scope-options.md`.
If `blocked`: stop for user answers — do **not** scope around open Spec quality blockers.
