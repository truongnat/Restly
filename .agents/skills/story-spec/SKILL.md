---
name: story-spec
description: >-
  BA story layer: Cockburn usecase, backlog user stories, or Given/When/Then AC
  (modes usecase|userstory|ac). Aliases /usecase /userstory /ac. Prefer
  business-analysis for full Lite/Full Spec-quality gate. (Hard contract.)
---

# Story spec (use case / story / AC)

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Aliases: `.agents/BA_SKILLS.md`.

## Purpose

Deepen **one** story-layer artifact. For Path=Lite/Full with open Spec quality
needs, run or resume `business-analysis` first.

## Modes

| Mode | Alias | Output |
| --- | --- | --- |
| `usecase` | `/usecase` | `USECASE.md` |
| `userstory` | `/userstory` | `USER_STORIES.md` |
| `ac` | `/ac` | `AC.md` |

## Contract (mandatory)

| Field | Requirement |
|-------|-------------|
| preferred_role | `reasoner` |
| Inputs | Mode, epic/feature context, actors, related BA/PRD/SRS IDs. |
| Outputs | One mode file seeded from the matching template. |
| Safety | Do NOT write vague AC (“works”, “as per spec”). Do NOT skip alternate/exception flows on usecases. Do NOT invent business rules. **Confirm-first** on Blocking scope. |

### Required artifacts

Templates: `USECASE.template.md`, `USER_STORIES.template.md`, `AC.template.md`.

Shared: executive_summary, developer_overview, mode, trace_ids, open_questions, handoff.

## Workflow

1. Confirm mode.
2. Seed template; link US/AC/UC/BR IDs.
3. For `ac`, use Given / When / Then (prose language from settings; keywords stay English).
4. `session.sh commit 'docs(story-spec): <mode> …'`.

## Quality Standards

- [ ] Correct mode file; GWT AC testable.
- [ ] Usecase has main + ≥1 extension/exception when realistic.
- [ ] Stories have actor/need/value + priority.
- [ ] Work nested git: ran `session.sh commit 'docs(story-spec): …'` after writing
      (or `WORK_COMMIT=clean`).
