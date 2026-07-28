---
name: ba-integrate
description: >-
  BA tool sync scaffolds: Jira Cloud (/jira) and Confluence (/confluence)
  bidirectional plans. Offline mapping first; live API only with explicit
  credentials and user confirmation. (Hard contract.)
---

# BA integrate (Jira / Confluence)

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Aliases: `.agents/BA_SKILLS.md`.

## Purpose

Prepare **safe** sync between session backlog/docs and Jira/Confluence.

## Modes

| Mode | Alias | Output |
| --- | --- | --- |
| `jira` | `/jira` | `INTEGRATE_JIRA.md` |
| `confluence` | `/confluence` | `INTEGRATE_CONFLUENCE.md` |

## Contract (mandatory)

| Field | Requirement |
|-------|-------------|
| preferred_role | `researcher` |
| Inputs | Mode; local stories/AC/docs; site URL; project/space keys; auth method. |
| Outputs | Integrate plan artifact; optional dry-run log. |
| Safety | Do NOT store API tokens in session artifacts. Do NOT live-push without explicit user confirmation. Do NOT overwrite remote blindly — prefer dry-run + field mapping. Secrets only via env/OS keychain, never committed. **Confirm-first**. |

### Required artifacts

- `jira` → `templates/INTEGRATE_JIRA.template.md`
- `confluence` → `templates/INTEGRATE_CONFLUENCE.template.md`

## Workflow

1. Build field/page mapping from local IDs ↔ remote keys.
2. Produce dry-run change list (create/update/skip).
3. If user confirms live sync: use official CLI/API with env credentials; log results without secrets.
4. `session.sh commit 'docs(ba-integrate): <mode> …'`.

## Quality Standards

- [ ] Mapping table complete for in-scope items.
- [ ] Dry-run before live.
- [ ] No tokens in markdown.
- [ ] Work commit done.
