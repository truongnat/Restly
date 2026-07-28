---
name: pdf
description: >-
  Create, inspect, edit, and validate PDF files with strict supported-lossless
  coverage manifests (Python/pypdf/pdfplumber/reportlab). Use when the user
  mentions PDF, pages, extract text, merge/reorder pages, or PDF metadata.
---

# PDF

## Purpose

Work with PDF files using the Python CLI under a supported-lossless coverage
contract. OCR and raster checks are optional and must be marked `skipped` when
tools are absent (never a false pass).

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | .pdf path and/or JSON create/edit spec; optional manifest path. |
| Outputs | .pdf deliverable for create/edit plus coverage manifest JSON with coverage_ratio=1.0. |
| Safety | Do NOT publish encrypted or XFA PDFs. Do NOT claim OCR success without Tesseract. Mark missing optional tools as skipped, never false-pass. Do NOT silently drop pages/text. |

### Required artifacts

#### `coverage.json`
- Required: yes
- **format** (required, string): Must be pdf.
- **operation** (required, string): inspect | create | edit | validate
- **coverage_ratio** (required, number): Must equal 1.0 before publish.
- **items** (required, array): Coverage inventory entries.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## Runtime

On first use, run `python .agents/skills/pdf/scripts/setup.py`. It creates
`.agents/skills/pdf/.venv` and installs only this skill's dependencies.

## Commands

```bash
.agents/skills/pdf/.venv/bin/python .agents/skills/pdf/scripts/cli.py inspect input.pdf --manifest coverage.json
.agents/skills/pdf/.venv/bin/python .agents/skills/pdf/scripts/cli.py create spec.json output.pdf --manifest coverage.json
.agents/skills/pdf/.venv/bin/python .agents/skills/pdf/scripts/cli.py edit input.pdf edits.json output.pdf --manifest coverage.json
.agents/skills/pdf/.venv/bin/python .agents/skills/pdf/scripts/cli.py validate output.pdf
```

On Windows, replace `.venv/bin/python` with `.venv/Scripts/python.exe`.
