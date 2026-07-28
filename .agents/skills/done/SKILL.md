---
name: done
description: "Close a task after execution/review with DONE.md, PR_MESSAGE.md, PR_DESCRIPTION.md, and optional RELEASE_NOTE.md. (Hard contract in this SKILL.md — MUST follow.)"
---

# Done

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Source copy: `docs/policy/SKILL_PREAMBLE.md` / `docs/policy/AGENT_WORK.md`.

## Purpose

Close a task with clear, honest, reviewable artifacts.

Prefer inputs from `EXECUTION.md`, `REVIEW.md`, `PLAN.md` (DoD/rollback), and `TASKS.md` when present (task completion vs intended cards).

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | PLAN.md, TASKS.md when present, EXECUTION.md, REVIEW.md, diff/file changes, verification evidence, skipped checks, blockers, risks, PR/MR template, existing `.agent-work/memory/INDEX.md`. |
| Outputs | DONE.md, a distilled `.agent-work/memory/<Task-N-slug>.md` + updated `.agent-work/memory/INDEX.md`, PR_MESSAGE.md, PR_DESCRIPTION.md, optional RELEASE_NOTE.md. |
| Safety | Do NOT overclaim verification. Do NOT hide skipped/failed checks. Do NOT mark complete if blockers remain. Do NOT describe changes that were not made. Do NOT put secrets into final artifacts. Do NOT mark Done while `session.sh status` is `COMPLETE: no` or while `validate_artifacts.py` / `lint_artifacts.py` fails. Do NOT skip Work `session.sh commit` after DONE+memory; archive only when Done/Done with risks and no defect loop (see AGENT_WORK.md). |

### Required artifacts

#### `DONE.md`
- Required: yes
- **executive_summary** (required, array): Maximum five bullets with final status, delivered value, verification, residual risk, and next action.
- **developer_overview** (required, object): Final status, verification summary, residual risks, next action.
- **charts** (optional, array): Mermaid delivery/verification chart when useful; otherwise N/A.
- **status** (required, string): Done / Done with risks / Needs fix / Blocked / Partial.
- **summary** (required, string): Outcome-focused summary (not file list).
- **scope_completed** (required, array): Scope item, status, evidence.
- **what_changed** (required, array): Area, change summary, reason.
- **files_changed** (required, array): File path, summary.
- **verification** (required, array): Check, command/method, result, evidence.
- **review_result** (optional, string): Findings and resolution, or 'No findings.'
- **skipped_failed_checks** (optional, array): Check, status, reason, risk.
- **risks_followups** (optional, array): Item, type (risk/follow-up/blocker), impact, owner/next action.
- **handoff** (required, string): Next step, reviewer focus, QA focus, deployment notes.


#### Docs wiki sync (per `rules.docs`)
- If `rules.docs.enabled` is false, skip.
- If `rules.docs.sync_strategy: with-commit`: run the `docs` skill in `sync`
  mode for this task's change set and **stage the wiki changes so they land in
  the same commit** as the task (they travel through the PR).
- If `rules.docs.sync_strategy: main-only`: do **not** touch the wiki here on a
  feature branch — note in DONE.md that the wiki is refreshed on `main`.

#### Project memory (`.agent-work/memory/`)
- Required: yes. Persists **across tasks** (not per session) — sibling to
  `.agent-work/sessions/`.
- Write one distilled entry `.agent-work/memory/<Task-N-slug>.md` from
  `templates/MEMORY_ENTRY.template.md`, then add/refresh a one-line pointer in
  `.agent-work/memory/INDEX.md` (seed it from `templates/MEMORY_INDEX.template.md`
  if missing; newest on top).
- **Vital few (mandatory):** capture only knowledge that will change future
  work — non-obvious decisions + why, gotchas, reusable conventions, pointers.
  It is **not** a changelog: omit anything reconstructable from git, `DONE.md`,
  or the code. If nothing durable was learned, still create the entry with
  `Outcome` filled and each section `None.` — do not pad. Do not title the
  entry or its sections `80/20`. Full session history belongs in Work nested git (`session.sh commit`), not in memory dumps.
- **De-duplicate:** before writing, scan `.agent-work/memory/INDEX.md`; if this
  supersedes or extends an existing entry, update that entry instead of adding
  a near-duplicate.

#### `PR_MESSAGE.md`
- Required: no
- Conventional commit format: feat/fix/refactor(scope): summary.

#### `PR_DESCRIPTION.md`
- Required: no
- Summary, Changes, Verification, Review Notes, Risks/Follow-ups.
- Must answer Design for handoff: what / why / how verified / next (reviewer
  focus) / risks — `.agents/thinking/design-for-handoff.md`.
- Verification must be evidence over confidence (named check + result — not
  “should be fine”) — `.agents/thinking/evidence-over-confidence.md`.

#### `RELEASE_NOTE.md`
- Required: no
- Only when change is user-facing or user requests it.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## Quality Standards

- [ ] Final status is one of: Done / Done with risks / Needs fix / Blocked / Partial.
- [ ] Summary describes outcome, not a file list.
- [ ] Verification distinguishes: passed / failed / skipped / not run.
- [ ] No failed check is marked as passed.
- [ ] Review result is included.
- [ ] PR_MESSAGE.md follows Conventional Commits format.
- [ ] PR_DESCRIPTION.md answers: what changed, why, how verified, reviewer focus
      (Design for handoff Q1/Q2/Q4/Q6 — `.agents/thinking/design-for-handoff.md`).
- [ ] Verification is evidence-backed (passed/failed/skipped/not run) — not
      confidence-only (`.agents/thinking/evidence-over-confidence.md`).
- [ ] DONE handoff names next + risks; no chat-only material context.
- [ ] When TASKS.md exists, DONE summary reflects completed vs remaining task IDs honestly (use Progress board / Status / checkboxes; do not claim Done if open `todo`/`in_progress`/`blocked` IDs remain without documented blockers).
- [ ] A `.agent-work/memory/<Task-N-slug>.md` entry exists and `.agent-work/memory/INDEX.md` has its pointer. The entry holds only the vital few, no changelog, no padding, and does not duplicate an existing entry.
- [ ] `python .agents/tools/session/validate_artifacts.py` and `lint_artifacts.py` exit 0; `session.sh status` prints `COMPLETE: yes` before marking Done.

- [ ] First-pass readable: concrete names (paths/APIs/IDs); no abstract filler.
- [ ] No leftover `_(TODO)_` or placeholder Mermaid in finished sections.
- [ ] Spec/review findings state finding + evidence + verdict (not essays).

- [ ] Work nested git: after DONE + memory, ran `session.sh commit 'chore(done): Task-N-slug memory + close'` (or clean).
- [ ] If status is Done / Done with risks and there is no open defect loop, ran `session.sh archive` (session under `sessions/_archive/`).

## WRONG vs CORRECT

```markdown
// WRONG — file list instead of outcome
Changed: teacher-form.tsx, teacher-service.ts, teacher-test.ts

// CORRECT — outcome-focused
Summary: Preserved teacher list search state when navigating back from detail page,
including year filter restoration and search keyword persistence.
```

```markdown
// WRONG — hiding skipped checks
Verification: all passed.

// CORRECT — honest reporting
Verification:
- typecheck: passed
- lint: passed
- unit tests: skipped (test database not available)
- e2e: skipped (browser setup unavailable)
Residual risk: Main flow not verified by automated tests. Manual check done.
```

## Edge Cases

| Situation | Handling |
|---|---|
| Task has blockers | Status = Blocked. DONE.md records blocker and suggested next action. Do NOT create PR artifacts. |
| No PR template found in repo | Use fallback template from this skill. Document in notes. |
| User only needs summary, no PR | Use Lite Mode. No file creation needed. |
| Review found issues that were fixed | Document finding → resolution → evidence in review_result section. |
| Scope changed during execution | Document deviation in DONE.md. Note whether deviation was reviewed. |
| Defect found AFTER done (reviewer/QA/PR) | Task is not done. In the same session, set DONE status → `Needs fix`, reopen the affected TASKS card(s), then follow the **Post-done defect loop** in `.agents/AGENT_POLICY.md`: fix via execution (investigate/planning first if the cause is unclear or a spec/design gap), re-run `review`, and only re-run `done` when review passes and `session.sh status` is `COMPLETE: yes`. |

## Limitations

- Does NOT auto-fix code.
- Does NOT turn unverified tasks into done.
- When TASKS.md exists, do not claim Done if open task IDs remain without documented blockers.
- If review found blockers, return to execution before done.
