# BA skills (consolidated)

Catalog of **51 BA slash-style capabilities** mapped onto first-party skills.
Prefer these over inventing 51 separate folders.

Install: `sk install --profile ba`

## Flow

`Ý tưởng → tài liệu → sơ đồ → kiểm thử → bàn giao`

| Stage | Prefer |
| --- | --- |
| Unclear goals | `brainstorming` → `specify` |
| Stories / AC (lifecycle gate) | `business-analysis` |
| Design | `basic-design` → `detail-design` |
| Wiki | `docs` |
| Tests | `ba-test` → `tester` |
| Workers | `delegate_worker.py` |

## Consolidated skills

| Skill | Modes / aliases | Artifact |
| --- | --- | --- |
| `specify` | prd, roadmap, discover, urd, brd, prd-epic, srs | mode-named `*.md` |
| `biz-model` | sequence…usecase-diagram, d2-*, dbdiagram | `MODEL.md` (+ `.d2`/`.dbml`) |
| `story-spec` | usecase, userstory, ac | USECASE / USER_STORIES / AC |
| `gap-analysis` | gap, cr | GAP / CR |
| `user-flow` | user-flow | USER_FLOW |
| `api-ba` | api-doc … api-readiness | API_BA |
| `ba-test` | checklist, cases, playwright-hint | TEST_CHECKLIST / TESTCASES |
| `reverse-doc` | reverse-doc | REVERSE_DOC + SPEC_SRS |
| `ux-wireframe` | ascii, html, prototype, figma | WIREFRAME / FIGMA_BRIEF |
| `ba-dashboard` | dashboard | DASHBOARD |
| `ba-kg` | kg | KG |
| `ba-handoff` | meet, userguide, export, preview, update-overview | mode files |
| `ba-integrate` | jira, confluence | INTEGRATE_* |

## Full 51 → target

| Alias | Target |
| --- | --- |
| `/prd` `/roadmap` `/discover` | `specify` |
| `/brainstorm` | `brainstorming` |
| `/urd` `/brd` `/prd-epic` `/srs` | `specify` |
| `/reverse-doc` | `reverse-doc` |
| `/sequence` `/activity` `/activity-swimlane` `/bpmn` `/state` `/erd` `/usecase-diagram` | `biz-model` |
| `/d2-erd` `/d2-activity` `/d2-architect` `/dbdiagram` | `biz-model` |
| `/usecase` `/userstory` `/ac` | `story-spec` |
| `/user-flow` | `user-flow` |
| `/wireframe-ascii` `/wireframe-html` `/prototype-html` `/figma` | `ux-wireframe` |
| `/api-doc` `/api-map` `/api-assess` `/api-design` `/api-checklist` `/api-test` `/api-readiness` | `api-ba` |
| `/test-checklist` `/test-cases` `/playwright-gen` | `ba-test` |
| `/gap` `/cr` | `gap-analysis` |
| `/ask` | SKILL_PREAMBLE Confirm-first |
| `/dashboard` | `ba-dashboard` |
| `/kg` | `ba-kg` |
| `/jira` `/confluence` | `ba-integrate` |
| `/export` `/preview` `/userguide` `/meet` `/update-overview` | `ba-handoff` |
| `/delegate` | `delegate_worker.py` |

## Rules

1. Stable IDs (`FR-*`, `US-*`, `AC-*`, `BR-*`).
2. Headings English; prose = `settings.language`.
3. Confirm-first on Blocking.
4. `session.sh commit` after session writes.
5. No API tokens in artifacts (`ba-integrate`).
