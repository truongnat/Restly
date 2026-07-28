# Step 04 — Self-check and handoff

## Goal

Verify `BUSINESS_ANALYSIS.md` against the contract. Fail closed.

## Precondition (fail closed)

- [ ] Step ledger 01–02 = `done`
- [ ] Step ledger 03 = `done` or `blocked` (with questions asked)
- [ ] Spec quality section appears **before** User stories in the artifact

If precondition fails → return to the earliest incomplete step. Do **not** set Ready=Yes.

## Checks (run all)

1. File exists and was seeded from template (has Step ledger + Spec quality review).
2. Step ledger is sequential: no later step `done` while an earlier step is `todo`.
3. Spec quality review sits before User stories / Business rules / AC (not skipped or moved to the end after filling stories).
4. Problem statement is one sentence.
5. Stakeholders listed with role/pain.
6. Scope in and out both present.
7. Business rules have IDs; AC use Given/When/Then and map to BR/US.
8. Assumptions are not labeled as confirmed requirements.
9. Spec quality review has Feasibility, Correctness, and Capability recommendations (no leftover `_(TODO)_` on verdicts unless blocked).
10. No handoff Ready=Yes while Feasibility/Correctness is Fail/Unknown+blocking
    or Blocking=Yes capability gaps are Open.
11. Open questions include owners (if known) and blocking flags.
12. Executive summary ≤5 bullets and mentions the top Spec quality finding or gap.
13. No PLAN/TASKS/code invented by this skill.
14. Mark Step ledger 04 `done` or `blocked` with checklist evidence.

## Done when

- [ ] All checks pass **or** Ready=No with blockers listed.
- [ ] Step ledger 04 = `done` or `blocked`.
- [ ] User is told next skill and path to `BUSINESS_ANALYSIS.md`.

## Stop

Business-analysis ends here. Do **not** auto-run basic-design/planning unless asked.
