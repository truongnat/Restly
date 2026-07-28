---
name: gap-analysis
description: >-
  BA quality: gap analysis (/gap) or change-request impact (/cr). Writes GAP.md
  or CR.md with impact on related docs and Confirm-first blockers. (Hard contract.)
---

# Gap analysis / Change request

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Aliases: `.agents/BA_SKILLS.md`.

## Purpose

Two quality modes:

| Mode | Alias | Output | Use when |
| --- | --- | --- | --- |
| `gap` | `/gap` | `GAP.md` | Feature missing flows/rules/AC/capabilities |
| `cr` | `/cr` | `CR.md` | Analyze a change’s impact and list docs to update |

## Contract (mandatory)

| Field | Requirement |
|-------|-------------|
| preferred_role | `critic` |
| Inputs | Mode; for `gap`: feature + specs; for `cr`: change description + affected artifacts. |
| Outputs | One mode file from the matching template. |
| Safety | Do NOT invent gaps without expectation source. Do NOT silently rewrite product docs in `cr` — list update plan and Confirm-first before bulk edits. Do NOT close Blocking items without user confirmation. |

### Required artifacts

- `gap` → seed `templates/GAP.template.md` → `GAP.md`
- `cr` → seed `templates/CR.template.md` → `CR.md`

## Workflow

### Mode `gap`
1. State subject + expectation baseline.
2. Inventory covered flows/rules/AC/UI/API.
3. List gaps with severity Critical/High/Medium/Low.
4. Ask Blocking questions; commit Work.

### Mode `cr`
1. State change request (who/what/why).
2. Impact matrix: process, data, UI, API, rules, AC, tests, ops.
3. List artifacts to update (path + action add/change/retire).
4. Residual risks + Confirm-first on scope; commit Work.
5. Only after user confirms: hand off to `specify` / `story-spec` / `docs` / etc. to apply updates.

## Quality Standards

- [ ] Correct mode file.
- [ ] Each gap/impact row has evidence + recommendation.
- [ ] `cr` includes artifact update plan (not silent rewrites).
- [ ] Work nested git: ran `session.sh commit 'docs(gap-analysis): …'` after writing
      (or `WORK_COMMIT=clean`).
