# Step 02 — Fill PLAN.md (strategy only)

## Goal

Fill `PLAN.md` as **strategy only**, including Spec quality review. Full task
cards stay in `TASKS.md` (step-03).

## Precondition (fail closed)

- [ ] Step ledger 01 = `done`
- [ ] `PLAN.md` contains headings `Step ledger` and `Spec quality review`
- [ ] No open Critical/blocking/unconfirmed html-recommended item from step-01

If precondition fails → return to step-01 / ask user.

## Rules

- Edit **only** `PLAN.md` in this step.
- Prefer inputs: `DETAIL_DESIGN.md` → screen/API design docs →
  `BASIC_DESIGN.md` → `BUSINESS_ANALYSIS.md` / `DISCUSSION.md`.
- **Forbidden in PLAN.md:** `### T-00x` bodies with Description / AC / Verify / Files / Status / Work items.
- Scope bullets must name **distinct deliverables** (agents will inventory-split these in step-03). Prefer “6 child screens (list ids)” over “FE UI”.
- **Outcome-first (mandatory):** Before Approach / Task index, lock PLAN `Goal`
  with WHO + WHAT + EVIDENCE (align with DISCUSSION Desired outcome when
  present). Reject activity-only Goals. DoD must include ≥1 falsifiable
  consumer/contract outcome — process hygiene (PR/lint) alone is insufficient.
  See `.agents/thinking/outcome-first.md`.
- **IPO (mandatory):** Approach = Process toward Goal; each phase names a
  checkable Output slice. Do not fill Approach while Blocking Input gaps
  remain. See `.agents/thinking/input-process-output.md`.
- **Make-implicit-explicit (mandatory):** High-impact Assumptions Confirmed;
  Blocking gate items have Owner + resolution evidence; no silent rule picks.
  See `.agents/thinking/make-implicit-explicit.md`.
- **Small-batch (mandatory):** Prefer more smaller phases/cards over one
  mega-phase. Each phase must be completable and verifiable before the next
  compounds error. Card explosion happens in step-03 (§B/§C). See
  `.agents/thinking/small-batch.md`.
- **Feedback loop (mandatory):** High rewind-cost items need an early signal —
  Example (Given→Expect), See (preview/diagram), or Spike phase — before Full
  Approach depth. Do not plan “build then test” as the only loop. See
  `.agents/thinking/feedback-loop.md`.
- **Default path first (mandatory):** Order Approach / later cards L1 happy →
  L2 validation → L3 errors → L4 rare. Name edges in Non-goals/CAP; do not lead
  with an exception encyclopedia. See `.agents/thinking/default-path-first.md`.
- **Reversible decisions (mandatory):** Classify material decisions R/H/U.
  Type H (public API, core schema, auth, large infra) need options + Spike/ADR
  before Ready; do not invent Type H locks in execution. See
  `.agents/thinking/reversible-decisions.md`.
- **Standardize before automate (when CI/bot/skill in scope):** Do not jump to
  automation without checklist/template phases (manual → standardize →
  template → automate). See `.agents/thinking/standardize-before-automate.md`.
- **Optimize bottleneck (when choosing focus / tooling):** Name the constraint
  stage (requirements / coding / review / deploy / decision-wait); Aim Approach
  and Non-goals at relieving that — do not polish everything. See
  `.agents/thinking/optimize-bottleneck.md`.
- Task index in this step may be a **draft** short list of phases; **step-03 will replace it** with the fine-grained ID list from Work inventory. Do not treat a 8–12 epic index as final quality.
- Do **not** put “write test cases / 6 dimensions matrix” as the first index item before feature work.
- Do **not** start step-03 until PLAN sections below are filled (no leftover `_(TODO)_` on required fields unless marked blocked).
- Re-check `Pre-planning decision gate` **and Spec quality review** before writing Goal/Scope/Approach.
  Any open Critical/blocking/Spec-quality issue means **stop and ask**, not “plan with an
  assumption.”
- Classify visual need as text/table/diagram/html-recommended/none. Planning
  does not create HTML: when HTML is confirmed, keep Ready=No and hand off to
  brainstorming/basic-design; resume after the decision is recorded.
- Update Step ledger 02 to `done` or `blocked` before leaving.

## Mandatory stop gate

Do not fill strategy or task index until all Critical/blocking rows **and**
blocking Spec quality findings are resolved with user answers/evidence. Use the
structured question tool when available; ask at most three focused blocking
questions at a time.

## Fill these PLAN.md sections

1. Pre-planning decision gate + clarification answers + visual triage
2. Spec quality review — Feasibility / Correctness / Capability recommendations
3. Goal (one sentence — Outcome-first: WHO + WHAT + EVIDENCE; not activity-only)
4. Scope / Non-goals — Scope: enumerate separable units (endpoints, services, screens, validations) that **serve the Goal**; Non-goals protect against expansion
5. Assumptions (risk + confirmed)
6. Approach (phases only — each phase should advance an observable slice of the Goal; IPO Process)
7. Affected areas (paths + confidence) — inspect repo when possible
8. Test strategy (optional — after-code)
9. Verification strategy (falsifiable checks for the Goal)
10. Definition of done (≥1 consumer/contract outcome + evidence; not only PR/lint)
11. Rollback strategy
12. Risks
13. Task index (**draft** ID + title OK; refined in step-03)
14. Handoff (blockers; Ready stays No until step-04)
15. Executive summary (maximum five bullets) — fill last, keep it first.

## Spec quality rules

- Do **not** plan as if specs/design are automatically correct.
- Re-validate Feasibility against current codebase/ops capacity.
- Re-validate Correctness against real APIs, DB, screens, and domain rules.
- List Capability recommendations omitted by specs/design (limits, validation,
  permissions, audit, errors, rollback, observability, UX edge cases). Promote
  Blocking=Yes gaps into the decision gate / clarification questions.
- Ready stays No while Feasibility/Correctness is Fail/Unknown+blocking or a
  Blocking=Yes capability gap remains open.

## Done when

- [ ] Required PLAN sections filled (or explicitly blocked with open questions).
- [ ] Goal passes Outcome-first three-axis; DoD has ≥1 falsifiable consumer/contract outcome.
- [ ] Approach phases each name a checkable Output slice (IPO Process ↔ Goal).
- [ ] Approach is small-batch shaped (no single “implement everything” phase).
- [ ] Spec quality review filled; blocking Fail/Unknown/gaps asked or deferred with evidence.
- [ ] No full task cards inside PLAN.md.
- [ ] Scope lists separable deliverables an inventory can explode in step-03.
- [ ] Decision gate has no unresolved Critical/blocking/visual decision.
- [ ] Step ledger 02 = `done` or `blocked`.

## Next

Only if Step ledger 02 = `done`: Read and follow `./step-03-fill-tasks.md`.
If `blocked`: stop for user answers.
Do **not** claim planning complete yet.
