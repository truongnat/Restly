---
name: excel-doc-convert
description: >-
  Convert messy Excel documents (JP 方眼紙 / 帳票 / 画面設計書, heavy merged
  cells) into HTML (rowspan/colspan) and semantic Markdown with an explicit
  convert-report. Use when the user asks to turn Excel design docs, forms, or
  templates into Markdown/HTML, or mentions merge cells, 方眼紙, 帳票設計書,
  画面設計書, or Excel-as-document (not spreadsheet edit).
---

# Excel Doc Convert

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/skills/`.
Source copy: `docs/policy/SKILL_PREAMBLE.md` / `docs/policy/AGENT_WORK.md`.

## Purpose

Turn **document-like Excel** (merged layouts, JP templates) into readable
**HTML + Markdown**. This is not lossless Excel editing — use skill `xlsx` for
create/edit/validate of workbooks.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action.

| Field | Requirement |
|-------|-------------|
| Inputs | Path to `.xlsx` (not `.xls`); optional sheet filter and row/col caps. |
| Outputs | Per-sheet `.html` + `.md`, plus `convert-report.json` listing strategies and limitations. Written under the active session (or a user-named path outside the kit). |
| Safety | Do **not** claim layout-lossless Markdown. Do **not** invent cell values. Do **not** silently drop sheets when converting “all”. Mark shapes/charts/comments unsupported in the report. Prefer HTML for layout sheets. Domain IDs (FBD/RBD, control IDs) stay raw. |

### Required artifacts

#### `convert-report.json`
- Required: yes (written next to outputs under `.agent-work/sessions/<Task-…>/` unless the user names another non-kit path)
- **format** (required, string): Must be `excel-doc-convert`.
- **operation** (required, string): `classify` \| `convert`.
- **source** (required, string): Input workbook path.
- **sheets** (required for convert, array): Per-sheet strategy, paths, merge counts.
- **limitations** (required for convert, array): Explicit gaps (shapes, stamps, truncation).

### Reference

- Methods: `references/METHODS.md`
- JP template notes: `references/JP_TEMPLATES.md`
- `agents/openai.yaml` mirrors tooling metadata; this SKILL.md Contract wins.

## Runtime

On first use:

```bash
python .agents/skills/excel-doc-convert/scripts/setup.py
```

Creates `.agents/skills/excel-doc-convert/.venv` and installs only this skill's
`requirements.txt`.

## Workflow

1. Resolve the active session (`session.sh current`) unless the user named an
   output path; never write under `.agents/skills/` or the kit tree.
2. `classify` first on unknown workbooks.
3. `convert` with caps; raise `--max-rows` / `--max-cols` only when needed.
4. Open HTML for layout QA; use Markdown for RAG / handoff.
5. For sheet strategy `layout-asset`, treat HTML as primary; MD is a stub + link.
6. Review `convert-report.json` limitations before claiming “done”.
7. Optional: LLM pass to rewrite MD from HTML/text **without changing numbers/IDs** —
   still keep the report and HTML as evidence.
8. Work nested git: run
   `session.sh commit 'docs(excel-doc-convert): …'` after writing session
   outputs (or confirm `WORK_COMMIT=clean`).

## Commands

```bash
PY=.agents/skills/excel-doc-convert/.venv/bin/python
CLI=.agents/skills/excel-doc-convert/scripts/cli.py

$PY $CLI classify path/to/doc.xlsx
$PY $CLI convert path/to/doc.xlsx out_dir/
$PY $CLI convert path/to/doc.xlsx out_dir/ --sheets '表紙,機能概要,画面項目詳細'
$PY $CLI convert path/to/doc.xlsx out_dir/ --max-rows 200 --max-cols 50
```

Windows: use `.venv/Scripts/python.exe`.

## Strategies (built-in)

| Strategy | When | Markdown behavior |
| --- | --- | --- |
| `cover-kv` | 表紙 / cover | Heuristic 項目\|内容 table |
| `control-table` | Detects コントロール名 + コントロールID | № / name / ID table |
| `merged-doc` / `simple-grid` | Default | Structure-aware text blocks |
| `table-dense` | Many merges / wide sheet | Same + expect truncation caps |
| `layout-asset` | レイアウト in title | HTML primary; MD stub |

## Do not

- Use this skill to **edit** formulas or republish `.xlsx` → use `xlsx`.
- Flatten merges into a Markdown table (repeats values across columns).
- Trust cover stamp/approval row pairs without human glance.
- Convert `.xls` / macros as supported.
