# XLSX workbook spec (enterprise doc set)

> A spreadsheet suits the **register/matrix** parts of the doc set (requirements,
> traceability, NFRs, ADR log, data dictionary) far better than prose. Reshape
> content into sheets of rows. Build with the `xlsx` skill (office-common /
> openpyxl). Deliverable: `<location>/<Project>-documentation.xlsx` (+ the
> markdown source the docmap tracks).

## Sheets (one concern per sheet)

| Sheet | Purpose | Columns |
|---|---|---|
| `Overview` | skim overview + coverage matrix | Aspect, Summary, Source |
| `Coverage` | doc status | Document, Standard, Status, Owner, Last-synced |
| `Requirements` | SRS functional reqs | ID (FR-*), Requirement, Priority, Source, AC/Verify, Trace |
| `NFRs` | quality attributes | ID (NFR-*), Attribute, Requirement, Measure/Target, Source |
| `Traceability` | thread | Req ID, Design (HLD/LLD §), Code path, Test |
| `ADRs` | decision log | ADR, Title, Status, Date, Decision, Consequences |
| `Workspaces` | apps/packages | Path, Type, Stack, Entry point, Commands, Responsibility, Source |
| `DataModel` | data dictionary | Entity, Field, Type, Constraints, Notes, Source |
| `APIs` *(optional)* | contracts | Surface, Operation, Input, Output, Auth, Source |
| `Docmap` | freshness/index | Wiki unit, Sheet, Source paths, Last-synced |

## Formatting rules
- Row 1 = bold header; freeze the header row; sensible column widths.
- One fact per row; no merged narrative cells. Keep prose short in `Summary`/
  `Responsibility` columns.
- Every content sheet has a `Source` column (same honesty rule; mark `Unknown`).
- Keep IDs (FR/NFR/ADR) stable so `sync` can update rows in place.

## Sync granularity
`sync` updates only the **rows/sheets** whose source paths changed (new app = new
`Workspaces` row + any per-app rows; removed app = mark removed). Rewrite the
`Docmap` sheet's Last-synced.
