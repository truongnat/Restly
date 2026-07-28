---
name: user-flow
description: >-
  BA user-flow analysis: happy path, error path, and edge cases for a journey.
  Alias /user-flow. Writes USER_FLOW.md with optional Mermaid. (Hard contract.)
---

# User flow

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Aliases: `.agents/BA_SKILLS.md`.

## Purpose

Describe how a user completes a goal across screens/steps, including failures
and edges. Does **not** draw full Figma/wireframes (P1).

## Contract (mandatory)

| Field | Requirement |
|-------|-------------|
| preferred_role | `reasoner` |
| Inputs | Goal, persona/actor, entry point, related US/UC/AC, known constraints. |
| Outputs | `USER_FLOW.md` from template. |
| Safety | Do NOT omit error path when auth/payment/submit exists. Do NOT invent screens without marking Assumption. **Confirm-first**. |

### Required artifacts

#### `USER_FLOW.md`
- Seed `templates/USER_FLOW.template.md`
- executive_summary, developer_overview, goal, actor, entry,
  happy_path, error_paths, edge_cases, optional mermaid, trace_refs,
  open_questions, handoff

## Workflow

1. Confirm goal + actor.
2. List happy steps; then errors; then edges.
3. Optional Mermaid `flowchart`.
4. Commit Work.

## Quality Standards

- [ ] Happy + error + edge present (or N/A + reason).
- [ ] Steps observable (UI/API outcome).
- [ ] Work nested git: ran `session.sh commit 'docs(user-flow): …'` after writing
      (or `WORK_COMMIT=clean`).
