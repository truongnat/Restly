# PPTX Coverage (v1)

## Contract

Supported-lossless with `coverage_ratio == 1.0` required before publish.

## Supported

- Slides and shape text
- Standard slide layouts/masters/theme/media package parts
- Notes slides and charts package parts in declared prefixes

## Unsupported (block)

- VBA / macros, OLE, ActiveX
- Digital signatures
- Custom XML outside declared prefixes
- Legacy `.ppt`
- Pixel-perfect visual QA (optional Poppler/LibreOffice checks are skipped if absent)

## CLI

```bash
.agents/.venv/bin/python .agents/skills/pptx/scripts/cli.py inspect file.pptx
.agents/.venv/bin/python .agents/skills/pptx/scripts/cli.py create spec.json out.pptx
.agents/.venv/bin/python .agents/skills/pptx/scripts/cli.py edit in.pptx edits.json out.pptx
.agents/.venv/bin/python .agents/skills/pptx/scripts/cli.py validate file.pptx
```
