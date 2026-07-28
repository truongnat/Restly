---
name: ba-test
description: >-
  BA testing prep: overview checklist (/test-checklist) then executable cases
  (/test-cases). Complements tester; optional playwright-hint mode. Writes
  TEST_CHECKLIST.md or expands into TESTCASES.md. (Hard contract.)
---

# BA test

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Aliases: `.agents/BA_SKILLS.md`.

## Purpose

Prepare BA-facing test coverage **before** deep `tester` runs:

| Mode | Alias | Output |
| --- | --- | --- |
| `checklist` | `/test-checklist` | `TEST_CHECKLIST.md` |
| `cases` | `/test-cases` | `TESTCASES.md` (same shape as `tester` when possible) |
| `playwright-hint` | `/playwright-gen` | section in `TESTCASES.md` — **hints only**, not a runnable suite claim |

## Contract (mandatory)

| Field | Requirement |
|-------|-------------|
| preferred_role | `critic` |
| Inputs | Mode; AC/US/FR; user-flow/API maps when present. |
| Outputs | Mode artifact under active session. |
| Safety | Do NOT claim pass without execution. Do NOT use real PII as test data. Do NOT claim Playwright scripts are production-ready from hints alone. **Confirm-first** on untestable AC. |

### Required artifacts

- `checklist` → `templates/TEST_CHECKLIST.template.md`
- `cases` / `playwright-hint` → prefer `tester` schema fields in `TESTCASES.md`; seed `templates/TESTCASES_BA.template.md` if starting fresh

## Workflow

1. Confirm mode.
2. `checklist`: scenario inventory by priority/type for review.
3. `cases`: expand checklist rows into executable cases (Given/When/Then or steps).
4. `playwright-hint`: add selector/flow hints only; hand off to engineering for real codegen.
5. `session.sh commit 'docs(ba-test): …'`.

## Quality Standards

- [ ] Cases map to AC/US/FR when available.
- [ ] No real personal data.
- [ ] Playwright mode labeled as hints.
- [ ] Work commit done.
