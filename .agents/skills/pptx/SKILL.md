---
name: pptx
description: >-
  Create, inspect, edit, and validate PowerPoint .pptx files with strict
  supported-lossless coverage manifests (Python/python-pptx). Use when the user
  mentions PowerPoint, .pptx, slides, or decks.
---

# PPTX

## Purpose

Work with modern PowerPoint `.pptx` files using the Python CLI under a
supported-lossless coverage contract.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | .pptx path and/or JSON create/edit spec; optional manifest path. |
| Outputs | .pptx deliverable for create/edit plus coverage manifest JSON with coverage_ratio=1.0. |
| Safety | Do NOT publish when unsupported OOXML parts/macros/OLE/signatures exist. Do NOT claim pixel-perfect fidelity without optional tool checks. Do NOT silently drop slides/shapes. |

### Required artifacts

#### `coverage.json`
- Required: yes
- **format** (required, string): Must be pptx.
- **operation** (required, string): inspect | create | edit | validate
- **coverage_ratio** (required, number): Must equal 1.0 before publish.
- **items** (required, array): Coverage inventory entries.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## Runtime

On first use, run `python .agents/skills/pptx/scripts/setup.py`. It creates
`.agents/skills/pptx/.venv` and installs only this skill's dependencies.

## Commands

```bash
.agents/skills/pptx/.venv/bin/python .agents/skills/pptx/scripts/cli.py inspect input.pptx --manifest coverage.json
.agents/skills/pptx/.venv/bin/python .agents/skills/pptx/scripts/cli.py create spec.json output.pptx --manifest coverage.json
.agents/skills/pptx/.venv/bin/python .agents/skills/pptx/scripts/cli.py edit input.pptx edits.json output.pptx --manifest coverage.json
.agents/skills/pptx/.venv/bin/python .agents/skills/pptx/scripts/cli.py validate output.pptx
```

On Windows, replace `.venv/bin/python` with `.venv/Scripts/python.exe`.
