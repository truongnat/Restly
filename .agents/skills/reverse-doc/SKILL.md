---
name: reverse-doc
description: >-
  Reconstruct a coherent SPEC_SRS or requirements pack from scattered Word,
  PDF, images, Excel design sheets, or notes. Alias /reverse-doc. Uses office
  / excel-doc-convert when needed; never invent missing requirements.
  (Hard contract.)
---

# Reverse doc

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Aliases: `.agents/BA_SKILLS.md`.

## Purpose

Rebuild a **traceable** requirements view from messy inputs. Prefer extracting
evidence first; mark gaps explicitly.

## Contract (mandatory)

| Field | Requirement |
|-------|-------------|
| preferred_role | `researcher` |
| Inputs | Source files (docx/pdf/images/xlsx/md), target shape (`srs` default), optional glossary. |
| Outputs | `REVERSE_DOC.md` inventory + `SPEC_SRS.md` (or linked specify artifact) under the session. |
| Safety | Do NOT invent FR/NFR not evidenced. Do NOT treat OCR guesses as facts — mark Confidence. Do NOT claim lossless layout recovery. Prefer `excel-doc-convert` for 方眼紙 Excel. **Confirm-first** when sources conflict. |

### Required artifacts

#### `REVERSE_DOC.md`
- Seed `templates/REVERSE_DOC.template.md`
- Source inventory, extraction notes, conflicts, confidence, handoff

#### `SPEC_SRS.md` (or mode output)
- Prefer `specify` `SPEC_SRS.template.md` structure when target=`srs`
- Every FR/NFR cites a source ID from `REVERSE_DOC.md`

## Workflow

1. Inventory sources; assign `S-001`…
2. For Excel design docs: run/invoke `excel-doc-convert` when available.
3. For docx/pdf/images: extract text via office skills or describe visible content; record limits.
4. Write `REVERSE_DOC.md` then fill `SPEC_SRS.md` with Source column filled.
5. List conflicts Blocking; Confirm-first.
6. `session.sh commit 'docs(reverse-doc): …'`.

## Quality Standards

- [ ] Every requirement cites a source ID or is Gap/Unknown.
- [ ] Conflicts listed, not silently merged.
- [ ] Work commit done.
