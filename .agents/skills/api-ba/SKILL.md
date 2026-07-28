---
name: api-ba
description: >-
  BA API work: api-doc, api-map, api-assess, api-design, api-checklist,
  api-test, api-readiness. Business-facing; never invent endpoints. (Hard contract.)
---

# API BA

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Aliases: `.agents/BA_SKILLS.md`.

## Purpose

Produce a **business-facing** API artifact — not a full OpenAPI rewrite unless
asked. Prefer citing partner docs; never invent endpoints.

## Modes

| Mode | Alias | Focus | Primary sections |
| --- | --- | --- | --- |
| `api-doc` | `/api-doc` | Business summary of partner API | Business summary |
| `api-map` | `/api-map` | API ↔ system ↔ screen | Mapping |
| `api-assess` | `/api-assess` | Build vs buy/integrate | Assess |
| `api-design` | `/api-design` | Integration collaboration | Design |
| `api-checklist` | `/api-checklist` | What to test on the API | Checklist |
| `api-test` | `/api-test` | Executable API cases + Bruno/Postman outline | Test plan |
| `api-readiness` | `/api-readiness` | Pre-prod gate | Readiness |

Write **one** `API_BA.md` per invocation (mode recorded). Re-run to deepen another mode or append a clearly labeled section if the user asks to extend the same file.

## Contract (mandatory)

| Field | Requirement |
|-------|-------------|
| preferred_role | `researcher` |
| Inputs | Mode, API docs/URL/spec, consumer screens/flows, system entities, auth constraints. |
| Outputs | `API_BA.md` from template (fill sections for the chosen mode). |
| Safety | Do NOT invent endpoints/fields. Do NOT copy secrets/tokens into artifacts. Do NOT claim production readiness or “tests passed” without evidence. **Confirm-first** when docs missing. |

### Required artifacts

#### `API_BA.md`
- Seed `templates/API_BA.template.md`
- Always: executive_summary, developer_overview, mode, sources, open_questions, handoff
- Mode-specific tables as labeled in the template

## Workflow

1. Confirm mode + source docs.
2. Fill the mode’s sections; leave others as `N/A (wrong mode)` or omit empty noise.
3. For `api-test`: outline cases + collection structure (Bruno/Postman); do not paste secrets.
4. For `api-readiness`: checklist with Pass/Fail/Unknown + evidence.
5. `session.sh commit 'docs(api-ba): <mode> …'`.

## Quality Standards

- [ ] Sources cited; invented bits marked Assumption.
- [ ] `api-map` rows have all three layers.
- [ ] `api-readiness` has no silent Pass.
- [ ] Work nested git: ran `session.sh commit 'docs(api-ba): …'` (or `WORK_COMMIT=clean`).
