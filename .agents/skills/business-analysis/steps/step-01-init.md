# Step 01 — Init (seed BUSINESS_ANALYSIS template)

## Goal

Create session `BUSINESS_ANALYSIS.md` from the template **before** filling content.

## Precondition (fail closed)

- [ ] Business-analysis `SKILL.md` contract was read fully
- [ ] Session path is known or can be created safely
- [ ] `templates/BUSINESS_ANALYSIS.template.md` exists

If the template is missing, stop and report it. Do **not** invent a replacement.

## Rules

- Read this step fully. Do **not** jump to stories/AC yet.
- Do **not** invent the artifact free-form — copy the template.
- Do **not** create PLAN/TASKS/design docs in this skill.
- Do **not** proceed to step-02 until the file exists on disk.

## Actions

1. Resolve the active session dir (do **not** invent a folder name):
   `bash .agents/tools/session/session.sh current` — reuse that path as
   `{session}` below. If none is active yet, create one with
   `session.sh new <short-slug>`. Never write to a temp/cache/scratchpad path.
2. Locate template: `{skill-root}/templates/BUSINESS_ANALYSIS.template.md`
3. Copy (Write tool) → `{session}/BUSINESS_ANALYSIS.md`
4. If file already exists with real content:
   - Ask user: overwrite with fresh template, or keep and continue from step-02.
5. Set Step ledger row 01 to `done` with evidence = path.
6. List the session directory and confirm the file exists.

## Done when

- [ ] `BUSINESS_ANALYSIS.md` exists in session (from template).
- [ ] Step ledger 01 = `done`.
- [ ] Confirmed via directory listing.

## Next

Only after Done: Read and follow `./step-02-frame-quality.md`.
