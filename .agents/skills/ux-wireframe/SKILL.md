---
name: ux-wireframe
description: >-
  BA screen sketches: ASCII (/wireframe-ascii), HTML wireframe
  (/wireframe-html), HTML prototype (/prototype-html), or Figma brief
  (/figma) for design-system handoff — not live Figma drawing. (Hard contract.)
---

# UX wireframe

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Aliases: `.agents/BA_SKILLS.md`.

## Purpose

Produce **low-fidelity** screen sketches or a **Figma handoff brief**. Live
drawing inside Figma requires user/plugin/token and is out of band.

## Modes

| Mode | Alias | Output |
| --- | --- | --- |
| `ascii` | `/wireframe-ascii` | `WIREFRAME.md` |
| `html` | `/wireframe-html` | `wireframes/*.html` + `WIREFRAME.md` |
| `prototype` | `/prototype-html` | `prototypes/*.html` + `WIREFRAME.md` |
| `figma` | `/figma` | `FIGMA_BRIEF.md` (+ optional links in WIREFRAME.md) |

## Contract (mandatory)

| Field | Requirement |
|-------|-------------|
| preferred_role | `reasoner` |
| Inputs | Mode, screens/flow, content fields, design-system notes, optional Figma file URL. |
| Outputs | Mode artifacts under active session. |
| Safety | Do NOT present as final UI. Do NOT claim frames were drawn in Figma unless the user confirms. Do NOT embed secrets. **Confirm-first** on unknown IA. |

### Required artifacts

- ascii/html/prototype → `templates/WIREFRAME.template.md`
- figma → `templates/FIGMA_BRIEF.template.md`

## Workflow

1. Confirm mode + screens.
2. ascii/html/prototype as before.
3. `figma`: list frames, components, tokens, content; link file URL if provided; give copy-paste checklist for designer.
4. `session.sh commit 'docs(ux-wireframe): …'`.

## Quality Standards

- [ ] Screens trace to US/flow IDs when available.
- [ ] Figma mode labeled brief/handoff, not “drawn in Figma”.
- [ ] Work commit done.
