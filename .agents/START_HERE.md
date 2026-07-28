# Start here (2 minutes)

Read this first. Everything else is optional until you need it.

## Install → first task

1. Install the CLI once, then the kit:

```bash
pipx install simple-skills   # once (PyPI)
sk install
```

Until PyPI: `pipx install git+https://github.com/truongnat/simple-skills.git`  
Or: `curl -fsSL https://raw.githubusercontent.com/truongnat/simple-skills/main/i | bash`

2. Run skill **`init`** once.
3. Pick a path and say it out loud to the agent:

| Path | Use when | Do |
| --- | --- | --- |
| **Quick** | Tiny clear fix (≈1–3 cards) | Use skill **`quick-fix`** — no BA/design |
| **Lite** | Small feature | Short brainstorming → planning → sync → execution |
| **Full** | Unclear / multi-surface | Full lifecycle |

4. Health + session tools:

```bash
sk doctor
bash .agents/tools/session/session.sh help
bash .agents/tools/session/session.sh current
bash .agents/tools/session/session.sh status
python .agents/tools/session/validate_artifacts.py
python .agents/tools/session/lint_artifacts.py
```

Remove later: `sk uninstall --yes` (keeps `.agent-work/`; add `--purge-work` to delete sessions).

5. Stuck? Open [WHAT_NEXT.md](./WHAT_NEXT.md).
   BA aliases (PRD/diagrams/stories/…): [BA_SKILLS.md](./BA_SKILLS.md) —
   install with `sk install --profile ba`.

## Must / Should / Reference

| Layer | Read when | Files |
| --- | --- | --- |
| **Must** | Every task | This file + `.agents/settings.yaml` + skill `SKILL.md` Contract |
| **Should** | First-party skill run | `.agents/SKILL_PREAMBLE.md` (Language, Work, Readable writing, Scale) |
| **Reference** | Conflict / deep rule | `.agents/AGENT_POLICY.md`, `.agents/AGENT_WORK.md`, `.agents/MIGRATION.md`, `.agents/thinking/` |

Do **not** read all of `AGENT_POLICY.md` up front. Open a section only when blocked.

## Non-negotiables (Must)

- Artifacts only under `.agent-work/sessions/<Task-…>/` (not under `.agents/`).
- Write for a busy teammate: concrete paths/IDs; no filler.
- Progress = `TASKS.md` + `session.sh status` (no `OVERVIEW.md`).
- Quick path must not create BA/design/Spec matrices.
- Before code: sync readiness `PASS` (or `CONCERNS` + your OK).
- Product git ignores `.agent-work/`; Work has nested git + **commit protocol**
  (`session.sh commit` / `archive`) — see AGENT_WORK.md.
- **Confirm-first:** on Blocking need, STOP immediately; classify **Ask method**
  (`confirm`/`choice`/`fact`/`table`/`diagram`/`html`); ask that way — do not
  finish artifacts as a quiz (SKILL_PREAMBLE).
- Optional workers: `detect_agents.py` + `build_context.py --pack --check`
  (Rules mandatory) before any sub-agent dispatch — see Delegation in preamble.

## Settings you might edit

`language` · `rules.code.comments.prose_language` · `rules.branch.mode` ·
`rules.reports.output_format` · `rules.docs.*`  
Defaults for everything else live in AGENT_POLICY.
