# Quick fix

> Path=**Quick**. Tiny clear change only. No BA/design/Spec matrices.
> Obey `.agents/SKILL_PREAMBLE.md` Readable writing.

## Developer overview

| Field | Value |
|---|---|
| Path | `Quick` |
| Status | `ready_for_tasks` / `ready_for_sync` / `blocked` |
| Cards | `0` |
| Next action | _(fill TASKS / sync / upgrade to Lite)_ |

## Goal

<!-- Outcome-first. One sentence. WHO + WHAT + EVIDENCE.
     BAD: "Fix parseDate" / "Add null check"
     GOOD: "parseDate(\"\") returns null (no throw); non-empty parsing unchanged;
            proven by pnpm test -- date."
     If rewrite needs product/design choice → upgrade Path (not Quick).
     See .agents/thinking/outcome-first.md -->

_(one sentence)_

## Facts

<!-- IPO Input: from user / repo — paths/IDs. Blocking gaps → upgrade Path. -->

- _(from user / repo — paths/IDs)_

## Out of scope

<!-- Protect the Goal; name what this Quick fix will not change. -->

- _(what this Quick fix will not touch)_

## Unknowns

| Unknown | Blocking? |
|---------|-----------|
| _(none or list — if Blocking=Yes, upgrade Path)_ | Yes / No |

## Handoff

- **Next:** `sync` → `execution` (after PASS)
- **Upgrade instead if:** product/design unknown appears
