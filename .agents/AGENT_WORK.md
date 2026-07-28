# Agent Work layout

Simple Skills splits **Kit** and **Work** so installer files never share a
version history with feature artifacts.

## Kit — `.agents/`

Owned by the installer (`install.sh` / `install.ps1`):

- `skills/`, `tools/`
- `settings.yaml`, `SKILL_PREAMBLE.md`, `AGENT_POLICY.md`
- `DESIGN_SYSTEM.md`, `CODE_COMMENTS.md`, `THIRD_PARTY_SKILLS.md`
- optional `wiki/` (docs skill; location from `rules.docs`)

Reinstall may mirror/replace kit files. Do **not** put task artifacts here.

## Work — `.agent-work/`

Owned by the feature / team. Contains **sessions + memory together** (one
context when implementing a feature). Installer appends `.agent-work/` to the
host `.gitignore` so Work stays out of the product root history.

Progress lives in `TASKS.md` (cards include **Dev context** with `[Source:]`
cites). There is no separate `OVERVIEW.md`. Before execution, `sync` records
**Implementation readiness** `PASS` | `CONCERNS` | `FAIL`.

```text
.agent-work/
├── .git/                 # nested git (created by session.sh)
├── README.md
├── sessions/
│   ├── .current          # pointer to active Task-N-…
│   ├── Task-N-<slug>/    # active task artifacts
│   └── _archive/         # closed tasks (after session.sh archive)
└── memory/
    ├── INDEX.md
    └── Task-N-<slug>.md  # durable lessons (vital few)
```

### Why a sibling folder (not inside `.agents`)?

Skills/tools are kit and change on reinstall. Sessions/memory are work and need
cheap checkout/diff over time. One nested git on `.agent-work` versions both
session and memory without bloating the product root git or colliding with the
installer.

### Host root `.gitignore` (required on install)

The installer appends (or creates) this entry in the **host project**
`.gitignore`:

```gitignore
.agent-work/
```

This kit repo also ignores `.agent-work/` in its own `.gitignore`. Work history
stays in the nested git under `.agent-work/`, not in the product root.

Track kit selectively if you want (for example commit `.agents/settings.yaml`
and `PRJ_REFERENCE.md`); leave Work out of the product history.

### Who commits what (trust / ownership)

| Tree | Commit where? | Who |
| --- | --- | --- |
| Product source | Host root git | Humans / normal PR flow |
| Product wiki (`rules.docs` / `with-commit`) | Host root git (same PR as the task) | `docs` skill + `done` |
| `.agents/settings.yaml`, `PRJ_REFERENCE.md` (optional) | Host root git | Team (shared conventions) |
| `.agents/skills`, tools, policy | Usually **not** committed — reinstall from kit | Installer |
| `.agent-work/sessions`, `memory` | **Nested** git inside `.agent-work/` only | Agents via `session.sh commit` / `archive` |

**Do not** force-add `.agent-work/` into the product repo. Losing the host clone
without the nested `.agent-work/.git` loses session history — back up Work if
it matters. Run `session.sh doctor` after install to verify ignore + nested git.

**Not the same as** `rules.docs.sync_strategy: with-commit` — that stages the
**product wiki** into the **host** feature commit/PR. Work nested commits never
belong in product PRs.

### Work commit protocol (mandatory when git is available)

Nested git is **required** when `git` exists on the machine (`session.sh` inits
it). Agents **MUST** milestone-commit Work after changing session or memory
files — do not leave dirty trees. Memory stays the **vital few**; full artifact
history lives in nested git (so memory does not bloat with dumps).

| Event | Command |
| --- | --- |
| `session.sh new <slug>` | Auto: `chore(session): create Task-N-slug` |
| Lifecycle skill finished writing/updating artifacts | `session.sh commit 'docs(<skill>): <artifact> — <short why>'` |
| `done` after DONE + memory | `session.sh commit 'chore(done): Task-N-slug memory + close'` |
| Task closed successfully (no defect loop) | `session.sh archive` → `chore(archive): Task-N-slug` |

Helper behavior:

- `commit` → `WORK_COMMIT=<sha>` or `WORK_COMMIT=clean` (no-op if clean).
- `archive` → moves `sessions/Task-N-…` → `sessions/_archive/Task-N-…`, clears
  `.current` if it pointed there, then commits.
- Defect loop after `done`: **do not archive** yet; keep the active session and
  reuse it until review/`done` truly finish.

```bash
bash .agents/tools/session/session.sh commit 'docs(basic-design): BASIC_DESIGN — auth flow'
bash .agents/tools/session/session.sh archive          # after successful done
bash .agents/tools/session/session.sh doctor            # work_dirty / last_commit
```

### Commands

```bash
bash .agents/tools/session/session.sh help
bash .agents/tools/session/session.sh doctor
bash .agents/tools/session/session.sh work-root
bash .agents/tools/session/session.sh new <slug>
bash .agents/tools/session/session.sh current
bash .agents/tools/session/session.sh status
bash .agents/tools/session/session.sh commit [message]
bash .agents/tools/session/session.sh archive [slug|current]
```

Inside `.agent-work`, use normal git (`status`, `diff`, `log`, branches) to
compare artifact versions for the feature.
