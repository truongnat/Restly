# Step 02 — Frame + Spec quality

## Goal

Fill problem/stakeholders/scope framing and **mandatory Spec quality review**.
Stop for clarification when Feasibility/Correctness fail or capability gaps block.

## Precondition (fail closed)

Before editing content sections, verify:

- [ ] Step ledger 01 = `done`
- [ ] `BUSINESS_ANALYSIS.md` exists and contains headings `Step ledger` and `Spec quality review`
- [ ] User stories / AC sections still empty or placeholders (do not fill them in this step)

If precondition fails → return to step-01. Do **not** continue.

## Rules

- Edit **only** `BUSINESS_ANALYSIS.md`.
- Separate confirmed requirements vs assumptions vs open questions.
- Do **not** accept specs at face value.
- Do **not** write technical architecture here.
- Ask at most three focused blocking questions at a time.

## Fill these sections

1. Problem statement (one sentence)
2. Stakeholders
3. Scope (in / out / non-goals)
4. Spec quality review:
   - Feasibility (tính khả thi)
   - Correctness (tính đúng đắn)
   - Capability recommendations (khả năng feature / gaps)
5. Open questions (promote Blocking=Yes capability gaps here)
6. Update Step ledger 02

## Spec quality rules

- **Feasibility:** can process/systems/data/timeline support this?
- **Correctness:** do specs match reality, or are specs/system wrong?
- **Capability recommendations:** ask what a feature of this type should include
  even if omitted (limits, validation, permissions, audit, errors, overwrite,
  progress/retry, observability). Example: upload without max size.
- Verdicts: `Pass` / `Pass-with-gaps` / `Fail` / `Unknown`.

## Mandatory stop gate

Stop and wait for the user when:

- Feasibility or Correctness is `Fail` / `Unknown` and treated as blocking; or
- any Capability gap is `Blocking=Yes` and still `Open`; or
- stakeholder authority for a critical rule is unknown.

Do not continue to step-03 by inventing defaults.

## Done when

- [ ] Problem statement is one sentence.
- [ ] Stakeholders and scope are filled.
- [ ] Spec quality has Feasibility + Correctness verdicts.
- [ ] Capability table has ≥1 real gap **or** explicit “no material gaps”.
- [ ] Blocking gaps appear in Open questions.
- [ ] Step ledger 02 = `done` or `blocked` (with questions asked).
- [ ] No leftover `_(TODO)_` on Problem statement / Spec quality verdicts unless blocked.

## Next

Only if Step ledger 02 = `done`: Read and follow `./step-03-stories-rules-ac.md`.
If `blocked`: stop for user answers.
