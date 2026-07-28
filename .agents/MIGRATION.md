# Migration notes (agents + hosts)

Breaking or behavior changes hosts should know after reinstall.

## 2026-07 — Kit / Work + quality bar

| Change | Action on host |
| --- | --- |
| Artifacts moved `.agents/sessions|memory` → `.agent-work/` | Move old folders; run `session.sh set …`; ensure `.gitignore` has `.agent-work/` (installer appends) |
| `OVERVIEW.md` retired | Delete or ignore; progress = `TASKS.md` + `session.sh status` |
| Lean `settings.yaml` | Keep your knobs; decision/visual/comment matrices live in AGENT_POLICY defaults |
| TASK `#### Dev context` required | Re-run planning step-03 or fill Dev context before sync/`execution` |
| Sync **Implementation readiness** | `SYNC.md` needs heading; verdict `PASS`\|`CONCERNS`\|`FAIL` |
| New skill `quick-fix` | Use for tiny fixes; Path=Quick must not create BA/design |
| Quality lint | Run `lint_artifacts.py` before review/done (CI-style locally) |
| Docs `START_HERE` / `WHAT_NEXT` / `MIGRATION` | Installed under `.agents/` |
| Installer `doctor` / `uninstall` | `./install.sh doctor`; `./install.sh uninstall --yes` (optional `--purge-work`, `--keep-settings`) |
| CLI `sk` | PyPI `pipx install simple-skills` then `sk install` / `doctor` / `uninstall` (see README Publish) |
| Skill `excel-doc-convert` | Office profile: Excel 設計書/方眼紙 → HTML+MD + `convert-report.json` |
| Doc reality check | `investigate` / `basic-design` / `detail-design`: docs↔code; Blocking → STOP + Ask method (Confirm-first) |
| Language `vi` | Prose in Vietnamese; **headings/template keys/enums stay English**; no mixed VI/EN bodies |
| Keywords glossary | brainstorming / investigate / research: `## Keywords` (Term/Meaning/Where seen); criteria in SKILL_PREAMBLE |
| Work commit protocol | `session.sh commit` after lifecycle artifact writes; `session.sh archive` after successful `done`; see AGENT_WORK.md |
| Confirm-first + Ask methods | STOP immediately on Blocking; classify `confirm`/`choice`/`fact`/`table`/`diagram`/`html` then ask; no quiz-as-document — SKILL_PREAMBLE |
| Outcome-first Thinking method | Session-wide: lock WHO/WHAT/EVIDENCE in Goal/Desired outcome/DoD/AC before Approach/TASKS; normative `.agents/thinking/outcome-first.md`; no `OUTCOME.md` / no method-branded headings |
| Input→Process→Output Thinking method | After Output draft: bind Input (facts/trace/dev context) + Process (Approach/Work items) to Output; normative `.agents/thinking/input-process-output.md`; no `IPO.md` |
| Make-implicit-explicit Thinking method | Surface Assumptions/rules/owners/timeboxes/edges/DoD; dual-interpretation → Confirm-first; normative `.agents/thinking/make-implicit-explicit.md`; no `IMPLICIT.md` |
| Single Source of Truth Thinking method | Cite canonical stores; no forks; progress=`TASKS`+status; Doc reality Blocking → prefer visual Ask methods + fold into canonical; normative `.agents/thinking/single-source-of-truth.md`; no `SSOT.md` |
| Small-batch Thinking method | Completable units with independent Verify + short feedback latency; normative `.agents/thinking/small-batch.md`; card hard size remains planning step-03 §B/§C; no `SMALL_BATCH.md` |
| Feedback loop Thinking method | Shortest useful signal by latency×risk (Example/See/Run/Spike/Ask/Compare); Hybrid C with Small-batch; normative `.agents/thinking/feedback-loop.md`; no `FEEDBACK.md` |
| Default path first Thinking method | L1 happy → L2 validation → L3 errors → L4 rare; name edges early, deepen late; normative `.agents/thinking/default-path-first.md`; no `HAPPY_PATH.md` |
| Reversible decisions Thinking method | R/H/U by reverse-cost; Type R try-and-measure; Type H Spike+ADR; Quick forbids new Type H; normative `.agents/thinking/reversible-decisions.md`; no `REVERSIBLE.md` |
| Standardize before automate Thinking method | Manual → standardize → template → automate; no CI/bot/skill without checklist; normative `.agents/thinking/standardize-before-automate.md`; no `AUTOMATE.md` |
| Design for handoff Thinking method | Six-question successor test (what/why/run/check/risks/next); normative `.agents/thinking/design-for-handoff.md`; no `HANDOFF.md` |
| Evidence over confidence Thinking method | Claim works/done/Ready only with recorded proof; normative `.agents/thinking/evidence-over-confidence.md`; no `EVIDENCE.md` |
| Optimize bottleneck Thinking method | Relieve constraint stage first (requirements/coding/review/deploy/decision-wait); normative `.agents/thinking/optimize-bottleneck.md`; no `BOTTLENECK.md` |
| Docs source taxonomy | Source tree under `docs/{guides,policy,thinking,conventions,config,examples}/`; install still flattens most files into `.agents/` (Thinking stays `.agents/thinking/`). See `docs/README.md`. |
| Multi-CLI Phase 1 | `detect_agents.py`, `RULES_BUNDLE.template.md`, `build_context --pack --check`, `delegate_worker.py` (Rules gate; dry-run); settings `rules.agents.*` |

## How to upgrade a host project

```bash
# from cloned simple-skills
./install.sh --agents-mode replace   # or prompt
# then in the host project
./install.sh doctor
bash .agents/tools/session/session.sh doctor
python .agents/tools/session/lint_artifacts.py
```

Reinstall **preserves** `.agents/settings.yaml`. Policy/skills/tools refresh from the kit.

To remove the kit: `./install.sh uninstall --yes` (keeps `.agent-work/` unless `--purge-work`).
