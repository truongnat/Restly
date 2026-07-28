# What next?

Situation → skill. Prefer the smallest path that fits.

| Situation | Path | Skill(s) |
| --- | --- | --- |
| Brand-new empty repo | Full | `scaffold` → `init` |
| Entering an existing repo | — | `init` (or refresh) |
| One-line / tiny clear bugfix | **Quick** | `quick-fix` → `execution` → `review` → `done` |
| Small feature, mostly clear | **Lite** | `brainstorming` (short) → `planning` → `sync` → `execution` → … |
| Unclear goals / options | **Full** | `brainstorming` first |
| Need stories / AC / business rules | Full/Lite | `business-analysis` |
| Need system boundaries | Full | `basic-design` → `detail-design` |
| Ready to break into cards | Lite/Full | `planning` |
| Stale context before code | — | `sync` (need `PASS`) |
| Root cause unknown | — | `investigate` |
| Need external/internal facts | — | `research` |
| Review a PR/diff | — | `review-pr` |
| Write tests / evidence | — | `tester` |
| Project wiki / ADR set | — | `docs` |
| PRD / BRD / URD / SRS / roadmap / discover | BA | `specify` (modes) — see `BA_SKILLS.md` |
| Sequence / activity / ERD / BPMN-like | BA | `biz-model` |
| Usecase / userstory / AC GWT | BA | `story-spec` (or `business-analysis`) |
| Missing flows vs feature | BA | `gap-analysis` |
| Happy/error/edge journey | BA | `user-flow` |
| Partner API summary / field map / readiness | BA | `api-ba` |
| Test checklist → cases | BA | `ba-test` (then `tester`) |
| Rebuild SRS from Word/PDF/Excel/images | BA | `reverse-doc` |
| ASCII/HTML wireframe / HTML prototype | BA | `ux-wireframe` |
| Change request impact | BA | `gap-analysis` mode=`cr` |
| Project BA dashboard / knowledge graph | BA | `ba-dashboard` / `ba-kg` |
| Meet / userguide / export / preview | BA | `ba-handoff` |
| Jira / Confluence sync plan | BA | `ba-integrate` |
| Office files (xlsx/docx/…) | — | install `--profile office` |
| BA kit bundle | — | install `--profile ba` |
| Excel 設計書 / 方眼紙 → MD/HTML | — | `excel-doc-convert` (office profile) |
| Don’t know | — | stay on **Quick** unless blocked; then upgrade Lite/Full |

## Commands

```bash
bash .agents/tools/session/session.sh help
bash .agents/tools/session/session.sh doctor
bash .agents/tools/session/session.sh commit 'docs(<skill>): …'   # Work milestone
bash .agents/tools/session/session.sh archive                    # after successful done
python .agents/tools/session/build_context.py --skill planning --pack --check
python .agents/tools/session/detect_agents.py --write
python .agents/tools/session/delegate_worker.py --skill planning --cli codex --dry-run
python .agents/tools/session/lint_artifacts.py
python .agents/tools/session/validate_artifacts.py
```

Blocking product/doc unknowns → **STOP**, classify Ask method
(`confirm`/`choice`/`fact`/`table`/`diagram`/`html`), ask in chat — see
`SKILL_PREAMBLE.md` Confirm-first. Do not invent answers to stay on Quick.

## Upgrade path

If Quick hits a product/design unknown → set `Path: Lite` or `Full` and continue.
Do not invent answers to stay on Quick.
