---
name: specify
description: >-
  BA specify: produce product/requirements docs by mode — prd, roadmap,
  discover, urd, brd, prd-epic, or srs. Session artifacts with shared IDs and
  Confirm-first. Use when the user asks for PRD/BRD/URD/SRS/roadmap/discovery
  or aliases /prd /roadmap /discover /urd /brd /prd-epic /srs.
  (Hard contract in this SKILL.md — MUST follow.)
---

# Specify (BA requirements docs)

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Source copy: `docs/policy/SKILL_PREAMBLE.md` / `docs/policy/AGENT_WORK.md`.
Map of aliases: `.agents/BA_SKILLS.md`.

## Purpose

Author **one** requirements document for the chosen **mode**. Do not dump every
mode into one file. Reuse prior session artifacts and memory; keep trace IDs
stable (`FR-*`, `NFR-*`, `EPIC-*`, `US-*`).

## Modes (pick exactly one)

| Mode | Alias | Output file | Use when |
| --- | --- | --- | --- |
| `prd` | `/prd` | `PRD.md` | Whole-product vision, users, feature list |
| `roadmap` | `/roadmap` | `ROADMAP.md` | Now / Next / Later prioritization |
| `discover` | `/discover` | `DISCOVER.md` | Idea needs interview/validation / go-no-go |
| `urd` | `/urd` | `URD.md` | Personas, needs, journeys |
| `brd` | `/brd` | `BRD.md` | Business goals, scope, risks, ROI |
| `prd-epic` | `/prd-epic` | `PRD_EPIC.md` | One capability/epic + P0/P1/P2 + release |
| `srs` | `/srs` | `SPEC_SRS.md` | Session FR/NFR/rules/error matrix (wiki SRS → `docs`) |

If mode is unclear → **Confirm-first** (`choice`) before writing.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| preferred_role | `reasoner` |
| Inputs | Mode (required), product/feature context, stakeholders, existing DISCUSSION/BUSINESS_ANALYSIS/PRJ_REFERENCE/memory, constraints. |
| Outputs | Exactly one mode artifact under the active session, seeded from the matching template. |
| Safety | Do NOT invent stakeholder decisions. Do NOT treat assumptions as facts. Do NOT mix modes in one file. Do NOT replace `business-analysis` Spec quality for lifecycle stories/AC when Path=Lite/Full needs that gate — hand off or run BA. **Confirm-first** on Blocking unknowns. |

### Required artifacts

Seed from `templates/<MODE>.template.md` into the Output file above.

Shared required sections (all modes):

- **executive_summary** (≤5 bullets)
- **developer_overview** (Status, Mode, Open blockers, Next action)
- **mode** (required enum above)
- **trace_ids** (stable IDs introduced or reused)
- **open_questions** (Question, owner, Blocking)
- **handoff** (next skill/mode)

Mode-specific required bodies: see the seeded template.

### Reference

`agents/openai.yaml` mirrors tooling metadata. `.agents/BA_SKILLS.md` is the alias map.
Templates in `templates/` are authoritative for section shape.

## Workflow

1. Resolve active session (`session.sh current`).
2. Confirm **mode** (user alias or explicit).
3. Read memory + related session artifacts; list reused IDs.
4. Seed the matching template; fill prose in `settings.language`; keep headings English.
5. Stop on Blocking gaps (Ask method). Residual open questions must be non-blocking.
6. `session.sh commit 'docs(specify): <mode> …'`.

## Quality Standards

- [ ] Single mode; correct output filename.
- [ ] Template sections filled or `N/A` + reason (never silent delete).
- [ ] Assumptions ≠ requirements; Blocking questions asked in chat.
- [ ] Trace IDs unique and linked where features/stories/FRs appear.
- [ ] Work commit after write (`session.sh commit` or `WORK_COMMIT=clean`).

## Handoff

| After | Often next |
| --- | --- |
| `discover` go | `specify` `prd` / `brainstorming` |
| `prd` / `brd` / `urd` | `business-analysis` or `story-spec` |
| `prd-epic` | `biz-model` / `user-flow` / `story-spec` |
| `srs` | `docs` (wiki) or `basic-design` |
| `roadmap` | planning / epic specify |
