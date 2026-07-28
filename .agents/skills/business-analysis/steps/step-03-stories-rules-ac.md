# Step 03 — Stories, rules, acceptance criteria

## Goal

Write user stories, business rules, and testable acceptance criteria **after**
Spec quality review is done.

## Precondition (fail closed)

- [ ] Step ledger 01 = `done`
- [ ] Step ledger 02 = `done` (not `todo` / `blocked`)
- [ ] Spec quality Feasibility and Correctness verdicts are filled
- [ ] No open Blocking=Yes capability gaps remain unanswered

If precondition fails → return to step-02 / ask user. Do **not** invent AC over
open Spec quality blockers.

## Rules

- Edit **only** `BUSINESS_ANALYSIS.md`.
- Before writing stories/AC, re-read Spec quality review. If any Blocking item
  reopened, **stop and ask** — do not invent AC around it.
- Every BR needs an ID; every AC needs Given/When/Then and a mapping to BR/US.
- Do not write vague AC (“works well”, “per spec”).
- If a new Critical Spec quality issue appears, add it and stop — do not bury it.
- Do **not** mark Step ledger 03 `done` while Step ledger 02 is `todo`/`blocked`.

## Fill these sections

1. User stories / use cases
2. Business rules
3. Data assumptions (if any)
4. Acceptance criteria
5. Refresh Open questions / Handoff blockers if needed
6. Update Step ledger 03

## Done when

- [ ] ≥1 user story with actor/need/value.
- [ ] ≥1 business rule with ID/source/confidence.
- [ ] ≥1 AC in Given/When/Then mapped to a BR/US.
- [ ] Spec quality section still present and not downgraded without evidence.
- [ ] Step ledger 03 = `done`.

## Next

Read and follow `./step-04-self-check.md`.
