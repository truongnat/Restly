# Step 05 — Self-check and handoff

## Goal

Verify `DISCUSSION.md` against the brainstorming contract. Fail closed.

## Precondition (fail closed)

- [ ] Step ledger 01–04 marked (`done` or earlier `blocked` with questions)
- [ ] Spec quality review section exists before Scope/Options

If precondition fails → return to the earliest incomplete step.

## Checks (run all)

1. Session folder listing shows `DISCUSSION.md`.
2. File was seeded from template (has Step ledger, Spec quality review, then
   Goal, Facts, Scope, Options, Recommendation, Handoff).
3. Step ledger is sequential: no later step `done` while an earlier step is `todo`.
4. Goal is one sentence — Outcome-first (WHO + WHAT + EVIDENCE), not activity-only
   (“write/implement/refactor/fix X”, “works per spec”). Desired outcome is
   observable behaviors, not a disguised backlog.
5. Facts / assumptions / unknowns are separated (no assumption labeled as fact).
6. Scope in and scope out both present; Scope serves the Goal (not unrelated work).
7. Options matrix has ≥1 real option with verify method.
8. Recommendation has Choose + Reason + Confidence.
9. Handoff names one of: business-analysis, basic-design, planning, research, execution.
10. If Unknowns/Risks/Capability gaps still block code merge, Handoff **Blockers** is not empty (must not claim “no blockers” while Unknowns list open decision/data/auth items).
11. No PLAN.md/TASKS.md/code changes invented by this skill (unless user explicitly asked outside contract).
12. Executive summary has at most five decision-oriented bullets.
13. Issue triage covers material decisions; no Critical/blocking item was
    bypassed without a recorded user answer.
14. Spec quality review exists with Feasibility, Correctness, and Capability
    recommendations; no leftover `_(TODO)_` on verdicts unless ledger 02/04 is
    `blocked`. No recommendation was made while Feasibility/Correctness is
    Fail/Unknown+blocking, or while Blocking=Yes capability gaps are open.
15. Visual triage distinguishes text/table/diagram/HTML. Any generated HTML
    includes Tailwind + anime.js CDN tags, is user-confirmed, accessible, and
    linked to an Issue ID. Choice logging may still require session-serve.
16. Mark Step ledger 05 `done` or `blocked` with checklist evidence.

## Done when

- [ ] All checks pass **or** remaining issues sit under Unknowns + Handoff Blockers.
- [ ] Step ledger 05 updated.
- [ ] User is told next skill and path to `DISCUSSION.md` (and that blockers still apply downstream).

## Stop

Brainstorming ends here. Do **not** auto-run planning/design unless user asks.
