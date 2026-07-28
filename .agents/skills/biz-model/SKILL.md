---
name: biz-model
description: >-
  BA business diagrams: sequence, activity, swimlane, bpmn, state, erd,
  usecase-diagram, d2-erd, d2-activity, d2-architect, dbdiagram. Formats
  mermaid|plantuml|d2|dbml. Offline source for paste into D2/dbdiagram.io.
  (Hard contract — MUST follow.)
---

# Biz model (BA diagrams)

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Aliases: `.agents/BA_SKILLS.md`.

## Purpose

Produce **one** diagram package for a business/system concern. Prefer diagrams
that trace to FR/US/AC IDs already in the session.

## Modes

| `diagram` | Alias | Default format |
| --- | --- | --- |
| `sequence` | `/sequence` | mermaid |
| `activity` | `/activity` | mermaid |
| `activity-swimlane` | `/activity-swimlane` | plantuml |
| `bpmn` | `/bpmn` | mermaid (BPMN-like) + Camunda/Bizagi limits |
| `state` | `/state` | mermaid |
| `erd` | `/erd` | mermaid |
| `usecase-diagram` | `/usecase-diagram` | mermaid |
| `d2-erd` | `/d2-erd` | d2 |
| `d2-activity` | `/d2-activity` | d2 |
| `d2-architect` | `/d2-architect` | d2 |
| `dbdiagram` | `/dbdiagram` | dbml |

`format`: `mermaid` | `plantuml` | `d2` | `dbml`.  
D2/DBML are **source for external renderers** (d2 CLI / dbdiagram.io). Do not claim
in-repo live preview unless the tool is actually available.

## Contract (mandatory)

| Field | Requirement |
|-------|-------------|
| preferred_role | `reasoner` |
| Inputs | `diagram` mode, subject, actors/entities, related IDs, format preference. |
| Outputs | Session `MODEL.md` with one primary diagram fenced block (+ optional `.d2`/`.dbml` sidecar). |
| Safety | Do NOT invent systems/actors. Do NOT claim Camunda XML or live D2 render without evidence. **Confirm-first** on Blocking unknowns. |

### Required artifacts

#### `MODEL.md`
- Seed `templates/MODEL.template.md`
- executive_summary, developer_overview, diagram, format, subject,
  actors_or_entities, trace_refs, diagram_source, legend, open_questions,
  limitations, handoff

Optional sidecars in session: `diagrams/<slug>.d2` or `diagrams/<slug>.dbml`.

## Workflow

1. Confirm `diagram` (+ format).
2. Gather actors/entities; list `trace_refs`.
3. Write fenced source in `MODEL.md`; for d2/dbml also write sidecar when useful.
4. State paste/render instructions in Limitations.
5. `session.sh commit 'docs(biz-model): <diagram> …'`.

## Quality Standards

- [ ] One primary diagram; headings English.
- [ ] Happy path + key branches when applicable.
- [ ] Trace refs when IDs exist.
- [ ] Limitations honest (no fake Camunda/D2 render).
- [ ] Work commit done.
