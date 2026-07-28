---
name: scaffold
description: >-
  Bootstrap a brand-new (greenfield) project from zero — stack, structure,
  tooling, repo, and .agents/ wiring — with decisions recorded, ready for the
  lifecycle. Use before init when there is no code yet. (Hard contract in this
  SKILL.md — MUST follow.)
---

# Scaffold (new project bootstrap)

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Source copy: `docs/policy/SKILL_PREAMBLE.md` / `docs/policy/AGENT_WORK.md`.

## Purpose

Turn an empty (or nearly empty) directory into a working project **skeleton** —
the greenfield counterpart to `init` (which only reads an existing repo). It
picks a stack, lays out the structure, wires tooling (lint/format/test/CI),
initializes the repo and the `.agents/` workflow, records the stack decisions,
then hands off to the lifecycle for real features.

It **creates files** (unlike the read-only `init`). It does **not** invent
requirements — direction comes from `DISCUSSION.md`/`BUSINESS_ANALYSIS.md` when
present, otherwise from focused questions.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | Target directory, user intent, `DISCUSSION.md`/`BUSINESS_ANALYSIS.md` when present, `.agents/settings.yaml` (language, branch, code, docs), `.agent-work/memory/`, stack/tooling choices (confirmed). |
| Outputs | Project skeleton (structure, manifests, tooling config, base entry points, README/.gitignore/.env.example), initialized repo + `.agents/` kit + `.agent-work/` work wiring, stack ADRs, and `SCAFFOLD.md` in the active session. |
| Safety | Greenfield only — **never scaffold over an existing project**; if manifests/source exist, stop and route to `init`. Do NOT overwrite existing files without confirmation. Do NOT install dependencies or run project code unless the user approves (default: print the commands, don't run). Do NOT invent versions/secrets — use known-stable or ask, and mark assumptions. Respect `rules.branch.mode`. Prefer CI that encodes a stated checklist (Standardize before automate) — do not invent exotic workflows without a standard. |

### Greenfield guard (before writing anything)
- Detect existing project: run `bash .agents/skills/init/scripts/scan_workspaces.sh`.
  If it surfaces real manifests/source, this is **not** greenfield — stop and
  recommend `init` (+ lifecycle) instead of scaffolding.
- If the directory is non-empty but has no project, list what is there and ask
  before writing.

### Required artifacts
- **Project skeleton** at the repo/target root (the deliverable):
  - Directory layout for the chosen architecture (monorepo `apps/`+`packages/`,
    or single package) with base entry points / a minimal runnable "hello".
  - Package/build manifests with real **scripts** (`build`, `test`, `lint`,
    `run`) sourced from the stack's conventions.
  - Tooling config: formatter, linter, test runner, and a CI workflow (reuse
    `github-actions-templates` when applicable).
  - `README.md` (how to run), `.gitignore`, `.editorconfig`, `.env.example`.
  - Code follows `.agents/CODE_COMMENTS.md`.
- **`.agents/` kit:** ensure `settings.yaml` (from template). Do **not** store
  sessions/memory under `.agents/`.
- **`.agent-work/` work:** run `bash .agents/tools/session/session.sh work-root`;
  add `.agent-work/` to the project `.gitignore`.
- If `rules.docs.enabled` — an initial wiki scaffold (`docs full` skeleton)
  under `rules.docs.location` (default `.agents/wiki/`).
- **Stack ADRs:** one ADR per significant choice (language/framework, monorepo
  tool, package manager, test framework, CI) using the `docs` ADR template.
- **`SCAFFOLD.md`** in the active session (see template): what was created,
  decisions, assumptions/gaps, and the exact next commands.

## Workflow (step by step)

1. Resolve the active session: `bash .agents/tools/session/session.sh current`
   (or `session.sh new <slug>` / `work-root` first). Write `SCAFFOLD.md` under
   `.agent-work/sessions/…`. Read settings (language, branch, code, docs).
2. **Greenfield guard** (above). Stop/route to `init` if not greenfield.
3. Resolve intent & stack: prefer `DISCUSSION.md`/`BUSINESS_ANALYSIS.md`; for
   anything unknown ask **focused** questions (≤3 at a time): project type,
   language/framework, monorepo vs single, package manager, test framework, CI,
   license. Record each decision as an ADR (do not silently default).
4. Choose the architecture skeleton (layout, layering, naming). Keep it minimal
   and idiomatic for the stack — no speculative structure.
5. Create the skeleton: directories, manifests + scripts, tooling config, CI,
   README/.gitignore/.editorconfig/.env.example, and a minimal runnable entry.
   Ensure `.gitignore` includes `.agent-work/`. Do not overwrite existing files;
   never write real secrets.
6. Branch per `rules.branch.mode`: `direct` → stay on the base branch;
   `checkout` → create the initial work branch before writing code files. Run
   `git init` if there is no repo.
7. Wire kit + work: seed `.agents/settings.yaml` if missing; run
   `session.sh work-root`; if `rules.docs.enabled`, produce the initial wiki via
   `docs full`.
8. Write the stack ADRs and `SCAFFOLD.md` (created files, decisions, assumptions
   marked, and the exact next commands — install/build/run — as text; run them
   only if the user approves).
9. Handoff: run `init` to generate `PRJ_REFERENCE.md` from the new skeleton,
   then the lifecycle (`brainstorming`/`planning`) for the first feature.

## Quality Standards

- [ ] Greenfield guard ran; existing projects are routed to `init`, not scaffolded over.
- [ ] Stack/tooling choices are confirmed (from artifacts or user), each an ADR — not silently defaulted.
- [ ] Manifest scripts (build/test/lint/run) are real and sourced from the stack, not guessed.
- [ ] A minimal runnable entry exists; README states how to run it.
- [ ] `.agents/` kit wired (settings; wiki when enabled); `.agent-work/` present
      with `.agent-work/` in `.gitignore`; branch per `rules.branch.mode`.
- [ ] No dependencies installed / code run without approval; no invented versions/secrets (assumptions marked).
- [ ] `SCAFFOLD.md` lists created files, decisions, gaps, and the exact next commands.
- [ ] Handoff names `init` then the next lifecycle skill.

## Reference

`agents/openai.yaml` mirrors this contract for tooling. This SKILL.md is authoritative.

## Limitations

- Does NOT design features or write business logic (that is the lifecycle).
- Does NOT replace `init` — it precedes it for greenfield, then hands off.
- Does NOT install dependencies or deploy; it prepares and prints the commands.
