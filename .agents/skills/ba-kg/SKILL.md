---
name: ba-kg
description: >-
  BA knowledge graph: link IDs and artifacts across the session into a
  searchable graph (/kg). Writes KG.md with Mermaid graph + edge table.
  (Hard contract.)
---

# BA knowledge graph

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Aliases: `.agents/BA_SKILLS.md`.

## Purpose

Build a **trace graph** of entities (Epic/US/AC/FR/BR/API/Screen/Test) and
edges (implements, traces, tests, maps). For lookup, not a vector DB.

## Contract (mandatory)

| Field | Requirement |
|-------|-------------|
| preferred_role | `researcher` |
| Inputs | Session artifacts with IDs; optional focus question. |
| Outputs | `KG.md` from template. |
| Safety | Do NOT invent links without citing both ends. Orphan IDs stay listed as orphans. **Confirm-first** if corpus empty. |

### Required artifacts

#### `KG.md`
- Seed `templates/KG.template.md`
- executive_summary, nodes, edges, mermaid graph, orphans, query_answers, handoff

## Workflow

1. Scan session for IDs and explicit mappings.
2. Build node + edge tables; draw Mermaid `flowchart` or `graph`.
3. List orphans (ID with no edge).
4. Answer focus question if provided.
5. `session.sh commit 'docs(ba-kg): …'`.

## Quality Standards

- [ ] Every edge cites source artifact.
- [ ] Orphans visible.
- [ ] Work commit done.
