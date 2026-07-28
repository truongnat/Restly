---
name: ba-handoff
description: >-
  BA handoff/ops: meeting minutes (/meet), userguide, export pack, HTML preview,
  update-overview. Offline-first artifacts in session; office skills for
  PDF/Word when needed. (Hard contract.)
---

# BA handoff

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Aliases: `.agents/BA_SKILLS.md`.

## Purpose

Produce stakeholder-facing handoff artifacts without inventing decisions.

## Modes

| Mode | Alias | Output |
| --- | --- | --- |
| `meet` | `/meet` | `MEETING.md` |
| `userguide` | `/userguide` | `USERGUIDE.md` |
| `export` | `/export` | `EXPORT.md` + optional office renders |
| `preview` | `/preview` | `preview/index.html` + `PREVIEW.md` |
| `update-overview` | `/update-overview` | `OVERVIEW_SHARED.md` (project shared note — not lifecycle OVERVIEW.md) |

## Contract (mandatory)

| Field | Requirement |
|-------|-------------|
| preferred_role | `reasoner` |
| Inputs | Mode; notes/transcript/sources; audience; format targets. |
| Outputs | Mode artifact(s) under active session. |
| Safety | Do NOT invent meeting decisions. Do NOT put secrets in export/preview. Do NOT create retired lifecycle `OVERVIEW.md` progress page — use `update-overview` shared note only. **Confirm-first** on ambiguous owners/dates. |

### Required artifacts

Templates under `templates/` for each mode file listed above.

## Workflow

1. Confirm mode + audience.
2. Seed template; cite sources.
3. `export`/`preview`: list included artifacts; render via `docx`/`pdf`/`html` skills when requested.
4. `session.sh commit 'docs(ba-handoff): <mode> …'`.

## Quality Standards

- [ ] Decisions vs actions separated in `meet`.
- [ ] Userguide roles clear (admin/CS/…).
- [ ] Export/preview inventory honest.
- [ ] Work commit done.
