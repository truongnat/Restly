---
name: xlsx
description: >-
  Create, inspect, edit, and validate Excel .xlsx files with strict
  supported-lossless coverage manifests (Python/openpyxl). Use when the user
  mentions Excel, spreadsheet, .xlsx, workbook, cells, or formulas.
---

# XLSX

## Purpose

Work with modern Excel `.xlsx` files using the Python CLI. Every create/edit
must prove supported-lossless coverage (`coverage_ratio == 1.0`) before publish.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | .xlsx path and/or JSON create/edit spec; optional manifest path. |
| Outputs | .xlsx deliverable for create/edit plus coverage manifest JSON with coverage_ratio=1.0. |
| Safety | Do NOT publish when unsupported OOXML parts/macros/OLE/signatures exist. Do NOT claim full Excel format support. Do NOT silently drop sheets/cells. Use office-common helpers beside this skill. |

### Required artifacts

#### `coverage.json`
- Required: yes
- **format** (required, string): Must be xlsx.
- **operation** (required, string): inspect | create | edit | validate
- **coverage_ratio** (required, number): Must equal 1.0 before publish.
- **items** (required, array): Coverage inventory entries with status preserved/transformed/unsupported/skipped.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## Workflow

1. On first use, run `python .agents/skills/xlsx/scripts/setup.py`.
   This creates a private `.agents/skills/xlsx/.venv` and installs only this
   skill's `requirements.txt`. Do not install into global Python.
2. Prefer CLI over ad-hoc scripts.
3. For edits of unknown files: `inspect` first; stop if unsupported.
4. Write via `create`/`edit` (atomic temp → validate → publish).
5. Keep the coverage manifest with the deliverable.

## Commands

```bash
.agents/skills/xlsx/.venv/bin/python .agents/skills/xlsx/scripts/cli.py inspect input.xlsx --manifest coverage.json
.agents/skills/xlsx/.venv/bin/python .agents/skills/xlsx/scripts/cli.py create spec.json output.xlsx --manifest coverage.json
.agents/skills/xlsx/.venv/bin/python .agents/skills/xlsx/scripts/cli.py edit input.xlsx edits.json output.xlsx --manifest coverage.json
.agents/skills/xlsx/.venv/bin/python .agents/skills/xlsx/scripts/cli.py validate output.xlsx
```

On Windows, replace `.venv/bin/python` with `.venv/Scripts/python.exe`.

### Create spec example

```json
{
  "properties": {"title": "Sales", "creator": "agent"},
  "sheets": [
    {"title": "Data", "rows": [["Name", "Qty"], ["A", 1], ["B", 2]]}
  ]
}
```

## Limitations

- `.xls` not supported.
- Macros/OLE/signatures block writes.
- Formula recalculation via LibreOffice is optional; absence is `skipped`, not a pass.
