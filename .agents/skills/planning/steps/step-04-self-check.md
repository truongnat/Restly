# Step 04 — Self-check and handoff

## Goal

Verify artifacts against the planning contract. Fail closed — do not set Ready=Yes if checks fail or blockers remain.

## Precondition (fail closed)

- [ ] Step ledger 01–03 marked (`done` or earlier `blocked` with questions)
- [ ] `PLAN.md` contains Spec quality review before Goal
- [ ] Spec quality Feasibility + Correctness verdicts filled (or ledger 02 = `blocked`)

If precondition fails → return to the earliest incomplete step. Do **not** set Ready=Yes.

## Checks (run all)

### Structure

1. Session folder listing shows both `PLAN.md` and `TASKS.md`.
2. `PLAN.md` has **no** `### T-00x` sections with AC/Verify/Files/Status/Work-items bodies.
3. `TASKS.md` has `plan_ref`, a filled `## Work inventory` table (Full Mode), a `## Progress board`, and at least one real `### T-00x` card.
4. Every ID in PLAN Task index appears in TASKS.md Execution order, Progress board, and as a heading; counts match. Progress board Status=`todo` and Done=`[ ]` at planning handoff.
5. No template leftovers on kept content: `_(TODO)_`, `_(short title)_`, `_(…)_`, `T-002 → _(extend)_` left as the only order, empty inventory row only.
6. PLAN starts with Step ledger + Executive summary of at most five decision-oriented
   bullets.
7. Step ledger is sequential: no later step `done` while an earlier step is `todo`.
8. Pre-planning decision gate classifies severity/clarity/blocking/visual need;
   every Critical/blocking item has recorded resolution evidence. No confirmed
   HTML need is left without a completed visual decision handoff.
9. Spec quality review exists with Feasibility, Correctness, and Capability
   recommendations; no leftover `_(TODO)_` on verdicts unless ledger 02 is
   `blocked`. Ready stays No while any of those are Fail/Unknown+blocking
   or Blocking=Yes capability gaps remain open.

### Quality — size & specificity

10. First implement-oriented task is **not** “write test cases / TC matrix / 6 dimensions” before feature code.
11. Every TASKS card passes **Task size** and **Card specificity** from `step-03-fill-tasks.md` (§B and §C), including **Dev context** (§C.11).
12. Spot-check fail patterns (any one → FAIL, return to step-03):
    - Titles that are only layer epithets: `BE Search`, `FE form`, `API`, `UI`, `tests` with no named unit
    - Description / Work items missing numbered checkbox steps (`- [ ] N. …`) or only “Implement X per spec”
    - One card owns multiple endpoints **or** multiple child screens **or** Export+Print together
    - Trace has no section/AC id
    - Files/scope is only `backend` / `frontend` / `services`
    - AC is only “works” / “correct” / “per spec” / “implemented” / activity restatement of the title
    - Verify cannot falsify the AC (vague “manual QA” with no observation)
    - Missing `#### Dev context` or tech facts without `[Source: …]` / without `No specific guidance found.`
13. Full Mode inventory: row count is credible vs Scope (e.g. “6 child screens” ⇒ ≥6 related inventory rows or shell+N — not one row).
14. Confirmed assumptions in PLAN: any **High-impact** row still `Confirmed?: No` counts as a **blocker**.
15. **Outcome-first:** PLAN Goal is not activity-only; DoD includes ≥1
    consumer/contract outcome (not only PR/lint); every card AC traces as a
    slice of that Goal (see `.agents/thinking/outcome-first.md`).
16. **IPO:** Approach phases advance Goal slices; each card has Input
    (Trace/Dev context) → Process (Work items) → Output (AC/Verify)
    (see `.agents/thinking/input-process-output.md`).
17. **Make-implicit-explicit:** no High-impact Assumption still Confirmed=No;
    Blocking gate items have Owner + resolution evidence; Facts are not guesses
    (see `.agents/thinking/make-implicit-explicit.md`).
18. **Small-batch:** Cards pass §B/§C; Approach has no mega-phase; each card
    Verify is independently falsifiable (see `.agents/thinking/small-batch.md`).

### Blockers → Ready (critical)

19. Re-read `DISCUSSION.md` / `BUSINESS_ANALYSIS.md` Spec quality findings and
    Handoff blockers (if present). Copy any **still unresolved** items into PLAN
    Handoff blockers.
20. **Ready for sync/execution? must be No** if any of:
    - Checks 1–18 fail
    - PLAN Handoff blockers list is non-empty (unresolved)
    - DISCUSSION/BA listed blockers that were never resolved/struck
21. **Ready = Yes** only when checks 1–18 pass **and** Handoff blockers are `none` (or explicitly marked resolved with evidence).
22. Mark Step ledger 04 `done` or `blocked` with checklist evidence.

Never write Ready=Yes while the same document’s Blockers line still lists open items.

## Done when

- [ ] PLAN Handoff Ready matches rules 19–21.
- [ ] Step ledger 04 updated.
- [ ] Failures are listed in Blockers or fixed by returning to step-02/step-03.
- [ ] User is told:
  - If Ready=Yes → next skill `sync` (old `SYNC.md` is stale; must re-run sync).
  - If Ready=No → do **not** execute; resolve blockers or ask user; may re-run planning after clarifications.
  - If tasks were too coarse → explicitly say: rewrite via step-03 using Work inventory (do not execute on epic cards).

## Stop

Do **not** invent an extra step. Do **not** implement code here.
Planning skill ends when this step completes.
