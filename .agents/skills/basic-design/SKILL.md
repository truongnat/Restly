---
name: basic-design
description: "Turn an approved DISCUSSION.md direction into system-level design — boundaries, components, flows, interfaces, and data ownership — before detail design or planning. Domain-agnostic; omit unused sections. (Hard contract in this SKILL.md — MUST follow.)"
---

# Basic Design

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Source copy: `docs/policy/SKILL_PREAMBLE.md` / `docs/policy/AGENT_WORK.md`.

## Purpose

Turn an approved direction into a system-level design: what is being built, where boundaries sit, and which parts own which data.

**Before drawing architecture:** run **Doc reality check** — challenge whether
session/wiki docs match the codebase (stale specs, common libs that differ from
prose, missing surfaces). **Stop and ask** on Blocking mismatches; do not design
as if docs were automatically true.

This skill focuses on:

- Capture the chosen recommendation from DISCUSSION.md as design context.
- **Doc reality check** (docs ↔ code) with user confirm when Blocking.
- Define architecture overview and major components.
- Describe main actor or system flows (happy paths only).
- Name external interfaces at purpose level (not full contracts).
- Assign logical data ownership (entities/stores, not full schemas).
- List logical data sources with access mode (read/write/both) when relevant.
- Note major entry points or surfaces in scope (omit if N/A).
- Note relevant NFRs only when they affect design.
- Prepare handoff to detail-design (or research/investigate if blocked).

The goal: lock boundaries before writing implementable contracts or task plans. Stay domain-agnostic — works for APIs, UIs, batches, libraries, CLIs, or mixed systems.

## Dynamic depth

- Include only sections that apply to the task.
- Omit unused optional sections (do not invent filler).
- Mark gaps as Blocking Unknowns; **ask in chat** (Confirm-first) instead of
  finishing BASIC_DESIGN with a long Open questions quiz. Residual non-blocking
  unknowns only after answers are folded into architecture/components/flows.
- Lite Mode: Doc reality (short table) + goal + components + flows + handoff.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| preferred_role | `reasoner` (routing hint for multi-CLI; fallback main). |
| Inputs | DISCUSSION.md with clear recommendation; BA notes if available; **repo inspection**; wiki/HLD under `rules.docs.location` when docs enabled; investigate findings when useful. |
| Outputs | `BASIC_DESIGN.md` from template (or equivalent) including **Doc reality check**, goal, context, architecture, components, flows, data ownership, optional surfaces/NFRs, open questions, handoff. |
| Safety | Do NOT implement code. Do NOT invent file paths without inspecting the codebase. Do NOT treat docs/wiki as truth without Doc reality check. Do NOT fill architecture/components/flows while Doc reality has Blocking=`Yes` unresolved — **Confirm-first**: STOP immediately, classify Ask method, ask in chat (max 3), then finish with answers — do not ship a design as an open-questions quiz. Do NOT write full contracts (detail-design). Do NOT re-litigate BR — point to BA. Do NOT create PLAN.md. If Path=`Quick`, **stop** and use `quick-fix` (or upgrade Path). |

### Required artifacts

#### `BASIC_DESIGN.md`
- Required: yes
- Prefer seed: `templates/BASIC_DESIGN.template.md`
- **executive_summary** (required, array): Maximum five bullets with direction, key boundaries, top Doc reality finding/risk, and next action.
- **developer_overview** (required, object): Status, Doc reality blockers count, key components/boundaries, open questions, next action.
- **doc_reality_check** (required, object): Table of vital claims with doc evidence, code evidence, verdict (`Match`/`Mismatch`/`Missing-in-docs`/`Missing-in-code`/`Stale`/`Unknown`), Blocking, and Ask user?; plus Clarification checkpoint when any Blocking=`Yes`.
- **charts** (required, array): At least one Mermaid architecture/boundary/flow diagram, or N/A with reason when a diagram adds no value.
- **goal** (required, string): One sentence aligned with DISCUSSION recommendation.
- **context** (required, string): Chosen direction and scope summary from DISCUSSION (and BA if present).
- **architecture_overview** (required, string): Short overview of system shape; optional mermaid for boundaries.
- **components** (required, array): Components/modules with responsibility (real packages when they exist, else mark Proposed).
- **user_or_system_flows** (required, array): Main actor or system flows (happy paths only).
- **data_ownership** (required, array): Logical entities/stores and which component owns them.
- **surfaces_or_entry_points** (optional, array): Major in-scope entry points or surfaces (API routes area, UI areas, jobs, CLI commands, message topics). Omit if single obvious surface.
- **logical_data_sources** (optional, array): Logical data sources with access mode (read / write / both). Names only — no full schemas.
- **shape_sketch** (optional, string): Optional short sketch of interaction or output shape (ASCII or bullets). Omit if flows already enough.
- **interfaces_external** (optional, array): Named external systems, APIs, events, or libraries with purpose only (not full contracts).
- **nfrs** (optional, array): Relevant NFRs only if they affect design.
- **out_of_scope_design** (optional, array): Design topics explicitly deferred or excluded.
- **open_questions** (optional, array): Open questions with blocking flag.
- **handoff** (required, string): Suggested next skill: detail-design, research, or investigate.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## Doc reality check (mandatory)

Run **before** architecture/components/flows. ≤5 vital claims the design depends on.

| Check | Rule |
|---|---|
| Locate sources | Session DISCUSSION/BA + wiki HLD/API if docs enabled (`.docmap.md` / Last-synced when present). |
| Inspect code | Real modules/routes/tables for those claims — no invented paths. |
| Verdict | `Match` / `Mismatch` / `Missing-in-docs` / `Missing-in-code` / `Stale` / `Unknown`. |
| Stale wiki | Missing Last-synced or behind HEAD → `Stale`/`Unknown`; ask: trust wiki, trust code, or refresh docs first? |
| Common vs spec | Spec describes flow A but shared/common code does B → `Mismatch`, Blocking unless user accepts. |
| Stop gate | Any Blocking=`Yes` → classify Ask method; prefer `diagram`/`table`/`html` when the user must see the diff (flow/fields/UI); ask (max 3), wait; do not continue design body. Bare A/B/C only if the diff is already obvious. See `.agents/thinking/single-source-of-truth.md`. UI/layout Blocking → **See** before polish (Feedback loop). |
| Source of truth | Record in Clarification checkpoint: doc / code / refresh-docs-first. Fold into canonical store (or explicit follow-up) — chat alone is not SSOT. |
| Layers | Do not silent-pick “code wins.” Classify descriptive vs normative vs change-in-flight before asking. |

## When to Use

Use this skill when:

- DISCUSSION.md has a clear recommendation and scope.
- Task needs architecture, module boundaries, or flow structure before coding.
- Multiple components or systems interact and ownership must be clear.
- Need BASIC_DESIGN.md before detail-design or planning.
- Business-analysis is done (or not needed) and technical shape is next.

## When NOT to Use

Do NOT use this skill when:

- Direction is still unclear — use brainstorming first.
- Business rules/AC are unclear and stakeholders must decide — use business-analysis.
- Task is small/clear (Lite skip) — handoff straight to planning or execution.
- User asks for full contracts, field lists, or query specs — use detail-design.
- User asks for task breakdown, DoD, or rollback — use planning.
- User needs code changes — use execution.
- Deep external comparison is needed first — use research.
- Root-cause debugging is needed — use investigate.

## Quality Standards

- [ ] Doc reality check filled **before** architecture/components/flows.
- [ ] No Blocking=`Yes` left unresolved (asked + answered, or user accepted risk).
- [ ] Goal is one sentence aligned with DISCUSSION recommendation.
- [ ] Architecture overview is short; diagram only if it clarifies boundaries.
- [ ] Each component has a clear responsibility (real path or Proposed).
- [ ] Flows cover main paths only — no task IDs or full contracts.
- [ ] External interfaces are purpose-level only.
- [ ] Unused optional sections are omitted (not filled with N/A spam).
- [ ] Open questions mark blocking vs non-blocking.
- [ ] Handoff points to detail-design, or research/investigate if blocked.

- [ ] First-pass readable: concrete names (paths/APIs/IDs); no abstract filler.
- [ ] No leftover `_(TODO)_` or placeholder Mermaid in finished sections.
- [ ] Spec/review findings state finding + evidence + verdict (not essays).

- [ ] Work nested git: ran `session.sh commit 'docs(basic-design): …'` after writing artifacts (or `WORK_COMMIT=clean`). See AGENT_WORK.md.

- [ ] Confirm-first: on Blocking need, STOP immediately; classify Ask method (`confirm`/`choice`/`fact`/`table`/`diagram`/`html`); ask that way; finished artifact is not a quiz — residual Open questions non-blocking only (SKILL_PREAMBLE).

## WRONG vs CORRECT

```markdown
// WRONG — design from 画面設計書 alone, never opened the repo
Components: PrintService owns PDF (as in design doc §3).

// CORRECT — Doc reality first + visualize Blocking conflict
| Claim | Doc | Code | Verdict | Blocking |
| Print via ExcelCreator | 帳票設計書 RBD… | src/.../CommonPrint uses different pipeline | Mismatch | Yes |
Ask method=diagram: two-path Mermaid (docs vs code), highlight diverge node;
options: follow doc / follow code / refresh docs / investigate.
```

```markdown
// WRONG — detail dumped into basic design
POST /api/items body: { id: string, name: string, ... 20 fields }

// CORRECT — purpose-level boundary
External: Item Admin API — create/list items in tenant scope.
Ownership: Item Service owns Item; Tenant Master is read-only for this feature.
```

```markdown
// WRONG — forcing UI sections on a library change
Screens: N/A. Controls: N/A. Tabs: N/A.

// CORRECT — omit UI; keep what applies
Components: Parser module, Config loader.
Flows: Load config → parse input → emit result events.
```

## Edge Cases

| Situation | Handling |
|---|---|
| DISCUSSION conflicts with repo patterns | Prefer existing patterns. Doc reality `Mismatch`; visualize + ask which wins. |
| Spec vs common library behavior | Blocking until user chooses doc update vs design-to-code-as-is (diagram preferred). |
| Wiki Last-synced missing/stale | Verdict `Stale`/`Unknown`; ask refresh docs vs trust code (`confirm`/`choice` OK if no behavior claim). |
| Blocking unknown | Stop short of fake design. Handoff to research or investigate. |
| Single-module change | Lite Mode — short Doc reality table; skip unused optional sections. |
| Multi-artifact pack (hub + children) | One BASIC_DESIGN with surfaces list; detail-design may split per surface later. |
| No BA notes but rules implied | Mark as assumptions; do not invent BR IDs. |


## Limitations

- Does NOT implement code.
- Does NOT replace brainstorming when direction is unclear.
- Does NOT replace business-analysis for requirements.
- Does NOT produce full contract/query/field detail (use detail-design).
- Does NOT produce PLAN.md task breakdown (use planning).
- Does NOT invent file paths without inspecting the codebase.
- Does NOT accept documentation as correct without Doc reality check.
- Does NOT hardcode a product domain, screen type, or stack.
