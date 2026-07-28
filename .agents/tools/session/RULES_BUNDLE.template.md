# Rules bundle (mandatory for sub-agents)

> Obey this block **verbatim**. If it conflicts with convenience, **Rules win**.
> Main brain must include this in every CONTEXT_PACK before dispatch.
> Do not delete, summarize away, or “optimize” these rules.

## Language

- Thread / report / artifact **prose** (summaries, paragraphs, questions)
  follows project `settings.language` (`en` | `vi`) — **one language per
  artifact**.
- **Do not translate** Markdown headings, template section titles, table column
  headers, or enum/machine values (`Quick`, `PASS`, `Match`, `todo`, …).
- Code, paths, commands, and domain IDs stay as-is.
- Source-code **comments / docstrings** follow
  `rules.code.comments.prose_language` (`repo-default` | `en` | `vi`), **not**
  `settings.language`. `repo-default` = repo convention else English.

## Work layout

- Write **lifecycle** artifacts **only** under `.agent-work/sessions/<Task-…>/`.
- Durable lessons only under `.agent-work/memory/` (vital few — not full dumps).
- **Never** write session reports under `.agents/skills/`, temp, or cache.
- Wiki (`docs` skill) may use `rules.docs.location` (often `.agents/wiki`) —
  that path is allowed; it is not a session report.
- Do not force-add `.agent-work/` into the product git history.

## Confirm-first + Ask methods

On any **Blocking** need: **STOP immediately**. Do not keep filling Goal /
Architecture / Recommendation / contracts. Classify **Ask method** before asking:

| Ask method | Use when |
| --- | --- |
| `confirm` | Prior answer / Yes-No |
| `choice` | 2–5 discrete options |
| `fact` | Concrete value (path, ID, env, owner) |
| `table` | Multi-criteria compare |
| `diagram` | Flow / boundary / sequence / state |
| `html` | Spatial/UI/multi-state only (ask-before-create) |

Ask in chat (or return Ask-back to main). Do **not** ship a finished document
whose main payload is still open questions (no quiz-as-document). Residual
Unknowns in a finished artifact = **non-blocking** only.

## Readable writing

- Concrete paths/IDs/commands. Short sentences. No abstract filler.
- Finished sections must not contain leftover `_(TODO)_` scaffolding.
- Do not narrate process (“As an AI…”).

## Safety

- Never read, print, log, or commit secrets (`.env`, tokens, credentials).
- No destructive commands (`rm -rf`, `DROP`, force-push) without explicit
  user confirmation via main.
- Do not invent file paths, business rules, or “fixes” beyond Sources in the pack.

## Output contract

- Write **only** the files and headings listed in the pack’s Output contract.
- If Blocking clarity is missing: return status `blocked` + Ask method table to
  main — do **not** guess and mark done.
- Prefer updating the named session artifact in place; do not create parallel
  copies under temp/cache.
