# PDF Coverage (v1)

## Contract

Supported-lossless with `coverage_ratio == 1.0` required before publish.

## Supported

- Page count and extractable page text
- Simple tables extracted by pdfplumber (inventory)
- Core metadata title/author
- Create text pages via ReportLab
- Edit: page reorder + metadata update

## Unsupported (block)

- Encrypted PDFs
- XFA forms
- Claiming OCR success without Tesseract (OCR checks are skipped if absent)
- Absolute layout/font glyph preservation across all PDF producers

## Optional tools

- Tesseract: OCR (skipped if absent)
- Poppler: rasterization helpers (skipped if absent)

## CLI

```bash
.agents/.venv/bin/python .agents/skills/pdf/scripts/cli.py inspect file.pdf
.agents/.venv/bin/python .agents/skills/pdf/scripts/cli.py create spec.json out.pdf
.agents/.venv/bin/python .agents/skills/pdf/scripts/cli.py edit in.pdf edits.json out.pdf
.agents/.venv/bin/python .agents/skills/pdf/scripts/cli.py validate file.pdf
```
