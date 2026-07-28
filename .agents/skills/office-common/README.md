# office-common

Shared Python helpers for first-party office skills (`xlsx`, `docx`, `pptx`, `pdf`).

This directory is installed beside those skills (via `install.sh` / `install.ps1`)
but is not an agent skill itself (no `SKILL.md`).

## Package

`python/office_common/` provides:

- Coverage manifests (`CoverageManifest`, `CoverageError`)
- Semantic fingerprints
- Atomic publish (temp → validate → replace)
- OOXML ZIP inventory helpers
- Optional tool detection (LibreOffice, Tesseract, Poppler)

## Import path

Skill CLIs add `skills/office-common/python` (or `.agents/skills/office-common/python`)
to `sys.path` before importing `office_common`.
