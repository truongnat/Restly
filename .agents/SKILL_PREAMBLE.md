# Shared skill preamble

First-party skills point here instead of pasting Language/Memory/Work blocks.
**Read this file fully** at the start of every first-party skill invocation —
before Purpose, Contract, or steps.

Installed path: `.agents/SKILL_PREAMBLE.md` (source: `docs/policy/SKILL_PREAMBLE.md`).
Layout detail: `.agents/AGENT_WORK.md`.

## Language (do this first)

**Re-read `.agents/settings.yaml` now** — do not reuse a `language` value cached
earlier in this session. Values: `en` | `vi`. Mid-session edits win after
re-read. A direct instruction in the current user request overrides the file.

### What follows `language` (thread / report prose only)

Write **all narrative content** in that language: executive summary bullets,
paragraphs, table *cell values* that are sentences, questions to the user,
recommendations, handoff prose, Clarification checkpoint answers.

**One language per artifact.** Do not mix: a Vietnamese summary with an English
architecture paragraph, or half-translated tables. If unsure of a term, keep the
domain identifier raw and explain once in `language` — do not flip the whole
section to English.

**Not for source code.** `settings.language` does **not** set comment or
docstring language. When writing/editing code, use
`rules.code.comments.prose_language` (see `.agents/CODE_COMMENTS.md`). Default
`repo-default` = repo convention, else English — never infer from thread
`language`.

### What stays English (shared form — never translate)

Keep the **template form** identical across projects so schemas/lint/tools work:

| Keep in English | Examples |
| --- | --- |
| Markdown `##` / `###` headings | `## Executive summary`, `## Doc reality check`, `## Goal` |
| Template section titles & Step ledger step names | `Frame + Spec quality`, Status column labels as in templates |
| Table **column headers** from templates | `Claim`, `Doc evidence`, `Verdict`, `Blocking`, `Ask user?` |
| Enum / machine values | `Quick`/`Lite`/`Full`, `PASS`/`FAIL`, `Match`/`Mismatch`, `todo`/`done`/`blocked`, `Confirmed?` Yes/No |
| Code, paths, commands, API routes, IDs | `FBD13001`, `lblBase`, `src/...` |

**Wrong (`language: vi`):** `## Tóm tắt điều hành` or `## Mục tiêu`  
**Right (`language: vi`):** `## Executive summary` with Vietnamese bullets underneath.

**Domain terms:** keep original product/spec identifiers (JP screen names, field
IDs, API paths) as-is. Do **not** invent bilingual ceremony (JP/EN/VN label
rows) unless the domain artifact itself requires it.

## Work layout (mandatory)

Simple Skills splits **Kit** and **Work**:

| Layer | Path | Contents |
| --- | --- | --- |
| Kit | `.agents/` | skills, tools, settings, policy (installer) |
| Work | `.agent-work/` | `sessions/` + `memory/` together (nested git) |

Rules:

1. Write **lifecycle session artifacts** (DISCUSSION, PLAN, TASKS, REVIEW, …)
   **only** under `.agent-work/sessions/<Task-N-…>/` — never under temp/cache,
   and never under `.agents/skills` or other kit paths.
2. Write durable lessons **only** under `.agent-work/memory/`.
3. Resolve the active session with:
   ```bash
   bash .agents/tools/session/session.sh current
   ```
   Create one with `session.sh new <slug>` (also ensures `.agent-work` + nested
   git). Progress: `session.sh status`.
4. **Wiki exception (`docs` skill only):** the enterprise wiki tree goes under
   `rules.docs.location` (default `.agents/wiki`). That path may live under
   `.agents/` by design. It is **not** a lifecycle session report and is **not**
   forbidden by rule 1. Still never write wiki into `.agents/skills/`.
5. Prefer the product root `.gitignore` to include `.agent-work/` so Work history
   stays in its nested git, not the product repo.
6. **Work commit protocol:** when nested git exists, after writing or updating
   any session/memory artifact in this skill, run:
   ```bash
   bash .agents/tools/session/session.sh commit 'docs(<skill>): <short why>'
   ```
   Do not claim the skill finished while `session.sh doctor` reports
   `work_dirty=yes`. Full cadence + archive: `.agents/AGENT_WORK.md` → Work
   commit protocol. This is **not** product `rules.docs` `with-commit` (wiki).

## Memory (read first)

Before framing, researching, deciding, designing, planning, investigating, or
writing durable docs, read `.agent-work/memory/INDEX.md` and open the entries
whose hook matches this task. Reuse prior decisions, gotchas, and conventions
instead of re-deriving them; if memory conflicts with current evidence, trust
current evidence and note the drift. If none apply, continue.
(Memory is written by `done` — the **vital few** only. Do **not** dump full
session artifacts into memory; nested-git history is the version store.)

Skills that only execute, sync, review, or test still obey Language and Work
layout. Memory is optional for those unless the task needs prior decisions.

## Thinking methods (session-wide — not titles)

These methods apply to the **whole session**. They are **not** report section
names. Never brand headings or executive summaries with method labels
(`Outcome-first`, `Input→Process→Output`, `Make-implicit-explicit`,
`Single Source of Truth`, `Small-batch`, `Feedback loop`, `Default path first`,
`Reversible decisions`, `Standardize before automate`, `Design for handoff`,
`Evidence over confidence`, `Optimize bottleneck`, `80/20`, `5W1H`). Never
create `OUTCOME.md` / `IPO.md` / `SMALL_BATCH.md` / `IMPLICIT.md` / `SSOT.md` /
`FEEDBACK.md` / `HAPPY_PATH.md` / `REVERSIBLE.md` / `AUTOMATE.md` /
`HANDOFF.md` / `EVIDENCE.md` / `BOTTLENECK.md` / `OVERVIEW.md`. Fold results
into real fields (`Goal`, `Desired outcome`, DoD, AC, Verify, Facts,
Assumptions, Unknowns, Constraints, Trace, Approach, Non-goals, Work items,
Step ledger, Clarification, Issue triage, Handoff, Dev context).

**Apply in this order when framing:**

1. **Outcome-first** — lock **Output** (WHO / WHAT / EVIDENCE) before tasks.
2. **Input → Process → Output** — bind sufficient **Input** and a coherent
   **Process** to that Output (always, right after Outcome-first).
3. **Make implicit explicit** — write and classify material Assumptions, rules,
   owners, timeboxes, edges, DoD; dual-interpretation → Confirm-first.
4. **Single Source of Truth** — cite canonical stores; do not fork the same
   fact across chat/docs/code; progress = `TASKS.md` + `session.sh status`.
5. **Small-batch** — slice Process into units that each complete + verify
   before the next (phases, cards, execution rhythm).
6. **Feedback loop** — shortest **useful** signal (Example/See/Run/Spike/Ask/
   Compare) by latency×risk; apply Example/See early in discovery/design too.
7. **Default path first** — deepen L1 happy → L2 validation → L3 errors → L4
   rare; name edges early, implement rare late (thin security/money guards OK).
8. **Reversible decisions** — class R/H/U by reverse-cost; Type R try-and-measure;
   Type H options + Spike + ADR; Quick Path forbids new Type H locks.
9. **Standardize before automate** — manual → understand → standardize →
   template → automate; do not CI/bot/skill a process with no checklist.
10. **Design for handoff** — six-question successor test (what / why / run /
    check / risks / next); no chat-only material context; no opaque green.
11. **Evidence over confidence** — claim works/done/Ready only with recorded
    proof (test, screenshot, log, API, metrics, link, confirmed checklist).
12. **Optimize bottleneck** — relieve the constraint stage first (requirements /
    coding / review / deploy / decision-wait); do not polish everything.
13. **5W1H** — only when the outcome/problem is hard or unclear.
14. **Vital few** — when summarizing or writing memory.

### Outcome-first (mandatory before Scope / Approach / TASKS / code)

Do **not** start from “what tasks to do.” Start from the observable end state.

**Three-axis test** — every Goal / Desired outcome / DoD item / AC must name:

| Axis | Question | Fail if missing |
| --- | --- | --- |
| **WHO** | Who uses or depends on the result (persona, screen, caller, system)? | Consumer unclear |
| **WHAT** | What observable change do they get (status, field, message, file, metric, behavior)? | Only an activity verb |
| **EVIDENCE** | What check lets us stop (test, request, UI check, log, screenshot)? | “Probably works” |

**Invalid (activity / weak):** “Write the API”, “Refactor auth”, “Fix search”,
“Works per spec”, “PR opened” alone.

**Valid shape:** “FE order form can `POST /orders`, show problem+json field
errors, and contract tests cover 201/400/401.”

**Strength (prefer higher):** activity (reject) → internal artifact → contract →
consumer behavior → evidence-bound consumer behavior. Session **Goal** should
be consumer/contract level, not “implement X”.

**Where it lands (no new sections):**

| Path | Must pass three-axis |
| --- | --- |
| Quick | `QUICK.md` Goal; each card AC + Verify |
| Lite/Full | `DISCUSSION` Goal + Desired outcome → `PLAN` Goal/DoD/Verification → each TASK AC |
| Review/Done | Evidence maps to DoD/AC — not “files touched” |

**Fail closed:** If Goal is activity-only, or WHO/EVIDENCE is missing and would
change design, **STOP** (Confirm-first). Rewrite or ask — do **not** invent
Approach/TASKS to hide a fuzzy Goal. Desired outcome must describe behaviors,
not a backlog of “write DTO / write service / write UI”.

Full normative detail, anti-patterns, and worked examples:
`.agents/thinking/outcome-first.md` (source `docs/thinking/outcome-first.md`).

### Input → Process → Output (mandatory after Output is drafted)

Every unit (session, phase, card) needs all three:

| Part | Question | Lands in |
| --- | --- | --- |
| **Input** | What must be known/available to start? | Facts, Constraints, Trace, Dev context |
| **Process** | How do we transform Input into Output? | Approach phases, Work items |
| **Output** | What observable result + evidence? | Goal, DoD, AC, Verify (Outcome-first) |

**Fail closed:** Blocking Input gap → Confirm-first (do not invent contracts).
Process without Output = theatre. Output without Input = wishful. Card shape:
`Trace/Dev context → Work items → AC/Verify`.

Full normative detail:
`.agents/thinking/input-process-output.md`
(source `docs/thinking/input-process-output.md`).

### Make implicit explicit (mandatory before locking Approach / TASKS)

Most failures are two readings of one sentence — not “bad code.” Write material
implicits; do not silent-fill.

**Taxonomy:** Fact ≠ Assumption ≠ Business rule ≠ Preference ≠ Unknown.  
**Dual-interpretation test:** if two competent readings change Output/Process/
security/data/AC → Confirm-first (Blocking) or record Assumption/Unknown with
Owner — do not “pick the reasonable one” silently.

**Land in existing fields:** Assumptions (Risk + Confirmed?); Unknowns + Issue
triage (Owner required when Blocking); Constraints (deadline/timebox when
stated); Spec quality gaps / AC / Non-goals (edges); DoD/AC (Outcome-first);
Dev context Gaps (never invent).

**Fail closed:** High-impact Assumption `Confirmed?: No`; Blocking unknown
without Owner; guesses in Facts; quiz-as-document.

How to ask remains Confirm-first in this preamble. Full taxonomy/anti-patterns:
`.agents/thinking/make-implicit-explicit.md`
(source `docs/thinking/make-implicit-explicit.md`).

### Single Source of Truth (mandatory when citing or updating facts)

One kind of truth → one official update place; everything else cites.

**Cite, don’t fork:** Trace / `[Source:]` / ticket IDs beat restating AC or
contracts in chat, PLAN, and cards as competing truth. Progress truth is only
`TASKS.md` + `session.sh status` (no `OVERVIEW.md`).

**Docs ↔ code conflict:** Do **not** silent-pick “code wins” or “docs wins.”
Classify descriptive vs normative vs change-in-flight. Doc reality Blocking →
Confirm-first. Prefer **visual** Ask methods (`diagram` / `table` / `html`) so
the user sees docs-say vs code-does vs diff — bare A/B/C jargon often fails.
Fold the answer into Clarification **and** the chosen canonical store (or an
explicit follow-up to update it).

Optional short “Canonical sources” table in Constraints / `PRJ_REFERENCE.md` —
never a separate `SSOT.md`.

Full normative detail:
`.agents/thinking/single-source-of-truth.md`
(source `docs/thinking/single-source-of-truth.md`).

### Small-batch (mandatory when sizing phases / cards / execution)

Smooth = `small step → complete → check → continue` — not one mega-batch.

**Four-property test** — every phase/card must have:

1. One goal  
2. One observable Output (Outcome-first)  
3. Independently falsifiable Verify  
4. Short feedback latency (verify this batch before compounding the next)

**Land in existing fields:** PLAN Approach phases; TASK cards (obey planning
`step-03` §B Task size + §C — hard law for Full/Lite); Quick ceiling 1–3
cards; execution **per-card Verify** before dependent next.

**Fail closed:** Mega-batch (layer epithets, multi-endpoint cards), fake-small
(no AC), or deferred “test at the end” across many cards.

Full normative detail (levels, heuristics, anti-patterns, worked examples):
`.agents/thinking/small-batch.md` (source `docs/thinking/small-batch.md`).

### Feedback loop (mandatory when choosing how/when to get a signal)

Shortest **useful** loop — not deferred “test at the end,” not thrashing.

**Latency × risk:** higher rewind cost → earlier + stronger signal.  
**Modalities:** Example (Given→Expect) · See (diagram/html) · Run (Verify) ·
Spike · Ask · Compare (Doc reality).  
**Hybrid C:** Small-batch sizes units + coding Verify rhythm; this method picks
modality and stage gates (requirement example, UI preview before polish, spike
before Full). Fold signals into Clarification + canonical (SSOT).

**Fail closed:** abstract Blocking AC with no example; UI shape into impl with
no preview; mega Approach “build then test”; `done` without Verify (Small-batch).

Full normative detail:
`.agents/thinking/feedback-loop.md`
(source `docs/thinking/feedback-loop.md`).

### Default path first (mandatory when ordering design / Approach / cards)

Deepen in layers: **L1 happy → L2 validation → L3 errors → L4 rare**.

**Name early, deepen late:** material edges go in Non-goals / CAP gaps / stub
AC (Make-implicit-explicit) — do not silent-drop. Implement rare after L1 (and
usually L2) works. **Thin early guards** only for Blocking security/money/
data-loss (Feedback loop risk) — not an exception encyclopedia first.

**Fail closed:** Approach/DETAIL leads with exception catalog while happy flow
is empty; first cards are only validators while L1 has no card; fake happy path
(L1 needs unfinished rare edge to Verify).

Full normative detail:
`.agents/thinking/default-path-first.md`
(source `docs/thinking/default-path-first.md`).

### Reversible decisions (mandatory when locking choices)

Match ceremony to **reverse-cost** — not every decision needs the same rigor.

| Class | Ceremony |
| --- | --- |
| **R** reversible | Decide fast → try → measure; no ADR spam |
| **H** hard-to-reverse | Options + Spike/POC when needed + record why (ADR) |
| **U** unknown | Treat as **H** until proven **R** |

**High-impact ≠ hard-to-reverse** (two axes). Path=Quick forbids **new** Type H
locks (public API / core schema / auth architecture) — upgrade Path instead.
Issue triage: `Reversibility` = `R`\|`H`\|`U`.

Full normative detail:
`.agents/thinking/reversible-decisions.md`
(source `docs/thinking/reversible-decisions.md`).

### Standardize before automate (mandatory when proposing CI / bots / skills)

Ladder: **manual → understand → standardize → template → automate**.

Automating an unstable process creates an **accelerated mess**. Do not add CI,
bots, hooks, or new agent skills until a checklist/template exists (or Approach
phases include the ladder). Map each automated check to a named standard row
(Vital few). Org-wide automation is often Reversibility **H**.

Full normative detail:
`.agents/thinking/standardize-before-automate.md`
(source `docs/thinking/standardize-before-automate.md`).

### Design for handoff (mandatory on finished artifacts / cards / PRs)

Successor (or you in six months) must continue from **files alone** — not chat.

**Six questions:** What is this? Why this way? How to run? How to check?
What risks? What’s next? Land in Goal/Handoff/Dev context/Verify/Risks/PR —
never a new `HANDOFF.md`. Opaque green (tests pass, nobody understands) fails.

Full normative detail:
`.agents/thinking/design-for-handoff.md`
(source `docs/thinking/design-for-handoff.md`).

### Evidence over confidence (mandatory on works / done / Ready / fixed claims)

Prefer proof over assurance. Do **not** claim works / done / Ready / fixed /
root cause from fluency alone (“chắc chạy rồi”, “should be fine”).

**Evidence kinds:** test result, screenshot, log, API response, metrics, link
preview, confirmed checklist — recorded in Verify / EXECUTION / REVIEW / DONE /
PR. Skip = risk + `skipped`/`blocked`, never fake pass. AI confidence ≠ a run.

Full normative detail:
`.agents/thinking/evidence-over-confidence.md`
(source `docs/thinking/evidence-over-confidence.md`).

### Optimize bottleneck (mandatory when choosing what to improve)

Do not optimize everything at once. Name the constraint stage — requirements,
coding, review, deployment, or waiting on decisions — then relieve **that**
first. Local speed-ups elsewhere often add inventory, not throughput. Automate
only after a checklist, and prefer automating the bottleneck
(Standardize before automate).

Full normative detail:
`.agents/thinking/optimize-bottleneck.md`
(source `docs/thinking/optimize-bottleneck.md`).

### Vital few

Prioritize what actually changes the outcome (summaries, memory). Do not title
anything `80/20` or brand the executive summary with a method suffix. Distinct
from Optimize bottleneck (stage constraint vs content priority).

### 5W1H

Only when the problem is hard/unclear — apply silently to the session goal and
evidence, then fold answers into real sections. Do not stamp 5W1H tables, do
not answer trivia, do not brand a heading `5W1H`.

Policy summary: `.agents/AGENT_POLICY.md` → Thinking methods.

## Readable writing (mandatory — every artifact)

Readers must understand ~80%+ of the artifact on a **first pass** without
decoding jargon. If a teammate new to the task cannot act from it, rewrite.

**Do:**

1. Concrete names: file paths, API routes, table/field IDs, screen IDs,
   commands, ticket/AC IDs, exact error strings.
2. Short sentences. One claim per bullet. Tables for lists of facts.
3. Spec quality / Doc reality findings = **specific** finding + evidence path +
   verdict. Example: `FBD13001 Search ignores BaseCd — see api/… line 40 —
   Mismatch` — not “cần align architecture với domain”. When designing or
   investigating from docs: **ask** on Blocking mismatches (docs vs code /
   common vs 設計書 / stale wiki) before continuing. If the user must choose
   a winner, prefer Ask method `diagram` / `table` / `html` so they **see**
   docs-say vs code-does (SSOT — `.agents/thinking/single-source-of-truth.md`).
4. Delete unused sections. Finished artifacts must not contain `_(TODO)_` or
   leftover template scaffolding.
5. Charts only when they change a decision; otherwise omit (no decorative
   placeholder Mermaid).
6. **Keywords** (discovery artifacts): when the report uses domain/opaque terms
   a busy teammate would not know, fill `## Keywords` — see below.
7. **Confirm-first:** if Blocking clarity is missing, **STOP immediately**,
   classify **Ask method** (`confirm` / `choice` / `fact` / `table` /
   `diagram` / `html`), ask that way in chat, then finish the artifact — see
   Confirm-first below. Do not ship a “done” document whose main job is a quiz.

**Do not:**

1. Pad to fill the template. Empty honesty beats fake completeness.
2. Abstract filler: “leverage”, “align stakeholders”, “holistic approach”,
   “ensure consistency”, “optimize the flow” with no object.
3. Restate section titles as content (“This section covers feasibility…”).
4. Dump bilingual labels (JP/EN/VN) unless the **domain artifact** requires
   them; never invent translation noise for ceremony.
5. Answer method prompts (Outcome-first / IPO / Make-implicit-explicit /
   SSOT / Small-batch / Feedback-loop / Default-path-first /
   Reversible-decisions / Standardize-before-automate / Design-for-handoff /
   Evidence-over-confidence / Optimize-bottleneck / 5W1H / vital-few) as
   trivia sections or method-branded headings; do not ship activity-only
   Goals/ACs, Process without Output, mega-batches without Verify, silent
   dual-interpretation picks, docs↔code Blocking asks without a visual when
   the user must see the diff, abstract requirements without a Given→Expect
   example when Blocking, exception-first Approach/DETAIL before a working L1
   path, Type H locks without options/Spike/ADR, CI/bot/skill automation
   without a prior checklist/template, finished artifacts with empty Handoff /
   chat-only context / opaque green, works/done/Ready claims without recorded
   evidence, or “optimize everything” with no named constraint stage.
6. Narrate your process (“I will now analyze…”, “As an AI…”).
7. **Complete-with-questions:** fill Goal / Recommendation / Architecture / …
   while Critical or Blocking items are still unanswered, or dump a long Open
   questions list as the deliverable. That wastes a write cycle and forces
   every reader to re-parse unresolved work.

### Confirm-first (stop → classify → ask → answer → then finish)

When clarity is missing for a **Blocking** decision:

1. **STOP immediately** — do not keep writing Goal / Architecture /
   Recommendation / contracts. Mark the Step ledger / Status `blocked` if
   needed. Do not “finish the doc then list questions.”
2. **Reuse** — scan Clarification checkpoint, memory INDEX, Answered Unknowns,
   prior user messages. Prefer a short **confirm** (“Still X?”) over re-asking.
3. **Classify Ask method** (mandatory — pick one before asking):

   | Ask method | Use when | How to ask (method) |
   | --- | --- | --- |
   | `confirm` | Prior answer / assumption likely still true; Yes/No | One chat line: claim + Y/N. No essay. |
   | `choice` | 2–5 discrete options (pick one) | Numbered A/B/C in chat; one line why each changes the doc. |
   | `fact` | Need a concrete value (path, ID, env, owner, limit) **or** a Given→Expect example | One short question + expected shape; for requirements prefer an example row (Feedback loop). |
   | `table` | Compare ≥2 options on ≥2 criteria **or** confirm behavior via example matrix | Markdown table in chat (or Clarification); ask which row/column wins. |
   | `diagram` | Ambiguity is about flow, boundary, sequence, or state | Mermaid (or equivalent) in session/chat; ask which path/edge. |
   | `html` | Ambiguity is spatial/UI: layout, responsive, before/after, multi-state | Classify `html-recommended` → ask-before-create → seed `VISUAL_DECISION.html` + session-serve; never for pure strategy text. Prefer **before** UI polish (Feedback loop). |

4. **Ask in chat** with that method — default **one** question (or one visual)
   per message. Exception: up to **3** independent `confirm` / `choice` /
   `fact` blockers in one round. Never mix `html`/`diagram` with a wall of
   text questions in the same turn.
5. **Record** method + answer in Clarification checkpoint, then **rewrite the
   real sections** with the decision — not with the question left open.
6. **Finished bar** — residual Unknowns / Open questions = **non-blocking**
   only. Blocking unanswered → Status=`blocked`, no fake downstream sections.

**Wrong:** keep filling BASIC_DESIGN, then dump “Open questions” for the reader.  
**Right:** Blocking Doc reality row → STOP → prefer `diagram`/`table`/`html`
(or `choice`/`confirm` when the diff is already obvious) → fold answer +
canonical follow-up → then write Architecture.

Self-check before saving: *Would I paste this into a PR for a busy reviewer?*
If no → cut half, name concrete things. If blocked on the user → STOP and ask
with the right Ask method; do not finish the quiz-as-document.
Also run the **six-question handoff test** (what / why / run / check / risks /
next) — `.agents/thinking/design-for-handoff.md`. Opaque green fails.
Claims of works/done/Ready need **recorded evidence** —
`.agents/thinking/evidence-over-confidence.md`.

### Keywords (glossary for discovery reports)

Required on **brainstorming / investigate / research** artifacts when the body
uses terms a new teammate would not decode on first pass. Optional elsewhere
when the same problem appears. Heading stays English: `## Keywords`.

| Column | Content |
| --- | --- |
| Term | Exact string as used in the report (ID, JP name, acronym, module) |
| Meaning | One short line in `settings.language` |
| Where seen | Path / doc § / log / UI — evidence, not invention |

**Include a term when ≥1 is true:**

1. **Opaque ID / product name** — screen/form IDs (`FBD13001`, `RBD09002`), JP
   帳票/画面 names, internal service nicknames.
2. **Acronym or shorthand** used more than once, or once but critical to the
   recommendation (e.g. `WMS`, `指図`, `ExcelCreator`).
3. **Project-specific meaning** of a common word (e.g. “common” = shared print
   pipeline in *this* repo).
4. **Doc/code token** the reader must map (control IDs, table names, error
   codes) to follow evidence or Doc reality rows.

**Do not list:** everyday words; generic programming vocabulary (`HTTP`,
`JSON`, `null`) unless the project redefines them; every column of a wide
Excel; bilingual triple rows for ceremony.

**Cap:** vital few — typically **3–12** rows. Prefer linking Meaning to Where
seen over essays. If no opaque terms → `_(none — plain language)_` once.

## Delegation & Rules pass-down (sub-agents)

Main brain (host agent) may route a skill to an optional worker CLI when
inventory + `rules.agents.routing` say so. Workers **do not inherit** kit
memory — they only know what is in the pack.

1. **Inventory:** `python .agents/tools/session/detect_agents.py --write`
   (see `PRJ_REFERENCE` → Agent CLIs).
2. **When to delegate:** skill is Lite/Full (or heavy evidence/coding); a
   preferred CLI is `available`; Quick-trivial work stays on main.
3. **preferred_role** (skill Contract): `researcher` | `reasoner` | `coder` |
   `critic` — pick routing list by role, not by marketing model names.
4. **Pack before dispatch:**
   ```bash
   python .agents/tools/session/build_context.py --skill <id> --pack --check
   ```
   Produces `CONTEXT_PACK.md` with **`## Rules (mandatory)` first**. If
   `--check` fails → **refuse dispatch**, fallback main.
5. **Rules pass-down is non-negotiable.** Never minify by deleting Rules.
   Source template: `.agents/tools/session/RULES_BUNDLE.template.md`. Updating
   Confirm-first / Language / Work layout in this preamble requires updating
   that template in the **same change**.
6. **Worker invoke scaffold:**
   ```bash
   python .agents/tools/session/delegate_worker.py --skill <id> --cli auto --dry-run
   ```
   `--cli auto` (default) applies `rules.agents.routing.<skill>` then
   `rules.agents.fallback` (default `main`). Explicit `--cli` must be on the
   routing list unless `--force-cli`. After worker returns:
   `validate_artifacts.py` + `lint_artifacts.py` + `session.sh commit`.
   Spawn is manual-approve in Phase 2 (no silent CLI).

## Scale (Quick / Lite / Full)

At task start, pick a path (see `.agents/AGENT_POLICY.md` → Scale & Quick path):

- **Quick** — tiny clear fix; skip BA/design/Spec matrices; still use TASK Dev context.
- **Lite** — small feature; short sections; optional skip design.
- **Full** — unclear product or multi-surface; full lifecycle.

Record the choice in DISCUSSION/PLAN Developer overview (`Path:`).
