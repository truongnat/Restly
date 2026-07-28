# Demo session (good) — Path Quick

Copy shapes only. Shows a readable Quick pack.

## Files in a real session

- `QUICK.md` — goal + facts
- `TASKS.md` — one card + Dev context with Sources
- `CONTEXT.md` — from `build_context.py`
- `SYNC.md` — Implementation readiness PASS
- `EXECUTION.md` / `REVIEW.md` / `DONE.md` as usual

### QUICK.md (excerpt)

```markdown
## Developer overview
| Field | Value |
| Path | `Quick` |
| Status | `ready_for_sync` |

## Goal
Null-guard `parseDate` so empty string returns null instead of throwing;
non-empty parsing unchanged (proven by unit tests).

## Facts
- Crash in `src/utils/date.ts` when input is `""`
- Callers already treat null as “no date”
```

### TASKS.md card (excerpt)

```markdown
### T-001: Guard empty string in parseDate
- Trace: user report + `src/utils/date.ts`
- Work items:
  - [ ] 1. Return null when `!value.trim()`
  - [ ] 2. Add unit case empty string
- AC: `parseDate("") === null`; existing dates unchanged
- Verify: `pnpm test -- date`
- Files/scope: `src/utils/date.ts` (known)
#### Dev context
- **Reuse:** existing `parseDate` `[Source: src/utils/date.ts]`
- **Contracts / data:** input string → Date|null `[Source: src/utils/date.ts]`
- **Constraints:** No specific guidance found.
- **Guardrails:** do not change timezone helpers
- **Gaps:** none
```

### Anti-patterns (bad)

```markdown
## Executive summary (80/20)
- Align stakeholders to optimize the holistic date flow…

## Goal
Fix parseDate / add null check

### T-001: BE date
- AC: works per spec
- Files/scope: backend
#### Dev context
- Need to ensure consistency across the system
```

Bad because: method branding, **activity-only Goal** (fails Outcome-first),
filler, vague card, no Source, wrong layer title. See
`.agents/thinking/outcome-first.md`.
