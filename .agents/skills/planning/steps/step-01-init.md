# Step 01 — Init (seed templates)

## Goal

Create session folder artifacts from templates **before** filling content.

## Precondition (fail closed)

- [ ] Planning `SKILL.md` contract was read fully
- [ ] Session path is known or can be created safely
- [ ] PLAN and TASKS templates exist

If any template is missing, stop and report it. Do **not** invent a replacement.

## Rules

- Read this step fully. Do **not** skip to filling strategy or tasks yet.
- Do **not** invent PLAN/TASKS from scratch — copy templates.
- Do **not** create or refresh `OVERVIEW.md` — progress is `TASKS.md` +
  `bash .agents/tools/session/session.sh status`.
- Do **not** proceed to step-02 until both template files exist on disk in the session folder.
- After seeding, inspect upstream DISCUSSION/BA/design blockers and fill only
  `Pre-planning decision gate` before proceeding.

## Actions

1. Resolve the **active** session dir — do **not** create a new one and do
   **not** write to a temp/cache/scratchpad path:
   `bash .agents/tools/session/session.sh current`. Reuse the printed
   `.agent-work/sessions/<Task-N-…>/` path as the session folder. (If truly no
   session exists yet, `session.sh new <short-slug>` first.) When re-running
   planning during a later phase (e.g. review asked you to redo the plan),
   this returns the **same** session so `PLAN.md`/`TASKS.md` are overwritten in
   place — never in a new or cache location.
2. Locate skill templates:
   - `{skill-root}/templates/PLAN.template.md`
   - `{skill-root}/templates/TASKS.template.md`
3. Copy (Write tool) into the session dir as:
   - `PLAN.md` ← PLAN.template.md
   - `TASKS.md` ← TASKS.template.md
4. If `PLAN.md` / `TASKS.md` already exist and are non-template content:
   - Ask user: overwrite with fresh templates, or keep and continue from step-02/03.
   - Default if user says redo planning: overwrite with templates.
5. Copy unresolved issues/unknowns **and Spec quality findings** from DISCUSSION,
   BUSINESS_ANALYSIS, and design artifacts into PLAN's decision gate + Spec
   quality review. Classify severity, clarity, blocking status, and visual need.
6. If any Critical/blocking/unconfirmed `html-recommended` item or blocking Spec
   quality finding is open, ask focused questions (at most three at a time),
   record answers, and **stop**.
7. Set Step ledger 01 = `done` with evidence that PLAN.md + TASKS.md exist.
8. List the session directory and confirm files exist.

## Done when

- [ ] `PLAN.md` exists in session (from template).
- [ ] `TASKS.md` exists in session (from template).
- [ ] Step ledger 01 = `done`.
- [ ] Confirmed via directory listing.
- [ ] Upstream issues/Spec quality were triaged; unresolved blockers caused a user-question stop.
- [ ] No `OVERVIEW.md` was created or required.

## Next

Only after Done: Read and follow `./step-02-fill-plan.md`.
Do **not** fill TASKS yet.
