---
name: docx
description: >-
  Create, inspect, edit, and validate Word .docx files with strict
  supported-lossless coverage manifests (Python/python-docx). Use when the user
  mentions Word, .docx, document paragraphs, or tables.
---

# DOCX

## Purpose

Work with modern Word `.docx` files using the Python CLI under a
supported-lossless coverage contract.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | .docx path and/or JSON create/edit spec; optional manifest path. |
| Outputs | .docx deliverable for create/edit plus coverage manifest JSON with coverage_ratio=1.0. |
| Safety | Do NOT publish when unsupported OOXML parts/macros/OLE/signatures exist. Do NOT claim legacy .doc support. Do NOT silently drop paragraphs/tables. |

### Required artifacts

#### `coverage.json`
- Required: yes
- **format** (required, string): Must be docx.
- **operation** (required, string): inspect | create | edit | validate
- **coverage_ratio** (required, number): Must equal 1.0 before publish.
- **items** (required, array): Coverage inventory entries.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## Runtime

On first use, run `python .agents/skills/docx/scripts/setup.py`. It creates
`.agents/skills/docx/.venv` and installs only this skill's dependencies.

## Commands

```bash
.agents/skills/docx/.venv/bin/python .agents/skills/docx/scripts/cli.py inspect input.docx --manifest coverage.json
.agents/skills/docx/.venv/bin/python .agents/skills/docx/scripts/cli.py create spec.json output.docx --manifest coverage.json
.agents/skills/docx/.venv/bin/python .agents/skills/docx/scripts/cli.py edit input.docx edits.json output.docx --manifest coverage.json
.agents/skills/docx/.venv/bin/python .agents/skills/docx/scripts/cli.py validate output.docx
```

On Windows, replace `.venv/bin/python` with `.venv/Scripts/python.exe`.
