# Step 04 — Recommend and handoff

## Goal

**Converge:** finalize Spec quality review, then write a clear recommendation,
risks, and next-skill handoff in `DISCUSSION.md`. Do not reopen option generation
unless a blocker forces return to step-03.

## Precondition (fail closed)

- [ ] Step ledger 01–03 = `done`
- [ ] Scope in/out and Options matrix are filled
- [ ] Spec quality Feasibility + Correctness verdicts exist

If precondition fails → return to the incomplete earlier step.

## Rules

- Choose **one** option (or a clearly named hybrid) with reason + confidence.
- State what you are **not** choosing and why (brief).
- Handoff must name **one** next skill: `business-analysis` | `basic-design` | `planning` | `research` | `execution`
- Lite skip design only when task is small/clear — say so in Why.
- Do **not** start planning/design/code in this step — only handoff pointer.
- Do **not** treat assumptions as confirmed facts.
- Re-check Issue triage **and Spec quality review**. Do not recommend while any
  Critical/blocking item is unresolved, Feasibility/Correctness is
  Fail/Unknown+blocking, Blocking=Yes capability gaps are open, or a required
  visual decision is still awaiting confirmation.
- **Handoff clarity:** “Next skill = planning” means *continue the design→plan lifecycle*, **not** “ready to write production code”. List open blockers honestly; later planning must keep Ready=No until they clear.
- Update Step ledger 04 before leaving this step.

## Fill these sections

1. Spec quality review — finalize Feasibility / Correctness / Capability gaps
2. Recommendation (Choose / Reason / Not choosing / Confidence)
3. Risks (impact + mitigation)
4. Handoff (Next skill / Why / Blockers) — blockers must be non-empty if Unknowns still block implementation
5. Executive summary (maximum five bullets) — fill last, keep it at the top.
6. Step ledger 04

## Done when

- [ ] Spec quality review has clear verdicts; blocking Fail/Unknown/gaps are asked or deferred with evidence.
- [ ] Recommendation names an option + confidence and does not ignore a Fail/Unknown feasibility or correctness verdict.
- [ ] Handoff names exactly one next skill.
- [ ] Blocking unknowns / capability gaps appear under Handoff blockers (do not hide them because next skill is planning).
- [ ] Visual decision aids are linked to their Issue IDs and user decisions.
- [ ] Executive summary exposes the direction, top Spec quality finding/risk, and next action.
- [ ] Step ledger 04 = `done` or `blocked`.

## Next

Read and follow `./step-05-self-check.md`.
