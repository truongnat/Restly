# Step 01 — Init (seed DISCUSSION template)

## Goal

Create session `DISCUSSION.md` from the skill template **before** filling content.

## Precondition (fail closed)

- [ ] Brainstorming `SKILL.md` contract was read fully
- [ ] Session path is known or can be created safely
- [ ] `templates/DISCUSSION.template.md` exists

If the template is missing, stop and report it. Do **not** invent a replacement.

## Rules

- Read this step fully. Do **not** skip to recommendation yet.
- Do **not** invent DISCUSSION free-form — copy the template.
- Do **not** create PLAN.md / TASKS.md / design docs / `OVERVIEW.md` in this skill.
- Do **not** proceed to step-02 until `DISCUSSION.md` exists on disk.

## Actions

1. Resolve the active session dir (do **not** invent a folder name):
   - Reuse if one is active: `bash .agents/tools/session/session.sh current`.
   - Otherwise create + record it (brainstorming usually starts the task):
     `bash .agents/tools/session/session.sh new <short-slug>`.
   Use the printed `.agent-work/sessions/<Task-N-…>/` path as `{session}` below.
   Never write artifacts to a temp/cache/scratchpad path.
2. Locate template: `{skill-root}/templates/DISCUSSION.template.md`
3. Copy (Write tool) → `{session}/DISCUSSION.md`
4. If `DISCUSSION.md` already exists with real content:
   - Ask user: overwrite with fresh template, or keep and continue from step-02.
   - Default if user says redo brainstorming: overwrite DISCUSSION with template.
5. List the session directory and confirm `DISCUSSION.md` exists.
6. Set Step ledger row 01 to `done` with evidence = path to `DISCUSSION.md`.

## Done when

- [ ] `DISCUSSION.md` exists in session (from template).
- [ ] Step ledger 01 = `done`.
- [ ] Confirmed via directory listing.
- [ ] No `OVERVIEW.md` was created (status comes from `session.sh status` + TASKS later).

## Next

Only after Done: Read and follow `./step-02-frame.md`.
Do **not** skip ahead.
