# DOCX outline spec (enterprise doc set)

> A Word document is **one linear file**, so deliver the doc set as a single
> controlled document with Heading styles + TOC — the same standards, one file.
> Build with the `docx` skill (office-common / python-docx). Deliverable:
> `<location>/<Project>-documentation.docx` (+ the markdown source the docmap
> tracks, so `sync` stays incremental).

## Document structure (Heading order → generates the TOC)

1. **Title page** — project, version, date, source commit.
2. **Table of contents** (from Heading 1/2).
3. **Documentation coverage matrix** — table (document · status · owner · last-synced).
4. **Part I — Software Requirements Specification (ISO/IEC/IEEE 29148)**
   H2 per SRS section (Introduction … Verification, Traceability). FR/NFR tables.
5. **Part II — Architecture (arc42)** — H2 per arc42 section 1–12; embed C4 and
   sequence diagrams as **images** (render Mermaid → PNG).
6. **Part III — Architecture Decisions** — one H2 per ADR.
7. **Part IV — High-Level Design** — components, flows, data ownership.
8. **Part V — Low-Level Design** — contracts, data model, sequences, rules.
9. **Part VI — Reference** — API reference (tables), data model (ERD image).
10. **Part VII — Operations** — deployment, runbook, observability, security.
11. **Part VIII — Guides** — onboarding, how-to (Diátaxis).
12. **Appendix** — traceability matrix, glossary, sources & freshness table.

## Formatting rules
- Built-in styles (`Title`, `Heading 1/2/3`, `Normal`) so TOC/navigation work —
  never fake headings with bold text.
- Tables for structured data (requirements, contracts, workspaces, ADR log).
- Each Part/section opens with a short overview before detail.
- Embed all images; office files must be self-contained (no external links).

## Sync granularity
Monolithic file: `sync` regenerates the `.docx` but uses the docmap to
re-derive only the **sections** whose sources changed; unchanged text is carried
over. Keep requirement/ADR IDs stable across regenerations.
