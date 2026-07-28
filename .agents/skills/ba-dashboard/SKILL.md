---
name: ba-dashboard
description: >-
  BA project dashboard: progress, coverage, and risks across session artifacts
  (/dashboard). Writes DASHBOARD.md with honest status — no fake green.
  (Hard contract.)
---

# BA dashboard

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Aliases: `.agents/BA_SKILLS.md`.

## Purpose

Single skim view of BA delivery health for the **active session** (and optional
memory pointers). Prefer `session.sh status` when TASKS exist.

## Contract (mandatory)

| Field | Requirement |
|-------|-------------|
| preferred_role | `reasoner` |
| Inputs | Active session artifacts, optional TASKS/PLAN, memory INDEX. |
| Outputs | `DASHBOARD.md` from template. |
| Safety | Do NOT invent coverage %. Do NOT mark Ready while Blocking gaps remain. Prefer tool counts over hand-waved progress. **Confirm-first** if session path unclear. |

### Required artifacts

#### `DASHBOARD.md`
- Seed `templates/DASHBOARD.template.md`
- executive_summary, developer_overview, artifact_inventory, coverage,
  risks, blockers, next_actions, handoff

## Workflow

1. Resolve session; inventory artifacts present/missing.
2. Pull TASKS status via `session.sh status` when available.
3. Coverage by area (spec/model/story/api/test/ux).
4. Top risks + blockers; next actions ordered.
5. `session.sh commit 'docs(ba-dashboard): …'`.

## Quality Standards

- [ ] Inventory matches files on disk.
- [ ] No fake 100% / all-green without evidence.
- [ ] Work commit done.
