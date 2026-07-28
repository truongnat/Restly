# Agent Policy (detailed)

Full mandatory policy. Read after the short root `AGENTS.md` entrypoint.
If detail here conflicts with the entrypoint, this file wins on substance;
`AGENTS.md` wins only on required reading order.

## Settings

Read `.agents/settings.yaml` and `.agents/PRJ_REFERENCE.md` at the **start of
every task**. Keep `settings.yaml` **lean** — only project knobs. Built-in
defaults below apply when a key is absent. Do not paste this whole policy into
settings.

### User knobs (edit `.agents/settings.yaml`)

| Key | Values | Default |
| --- | --- | --- |
| `language` | `en` \| `vi` | `en` |
| `rules.code.comments.prose_language` | `repo-default` \| `en` \| `vi` | `repo-default` |
| `rules.branch.mode` | `direct` \| `checkout` | `checkout` |
| `rules.branch.base` | branch name | detect from repo |
| `rules.branch.naming` | pattern e.g. `feat/<slug>` | empty |
| `rules.reports.output_format` | `markdown` \| `html` | `markdown` |
| `rules.docs.enabled` | bool | `true` |
| `rules.docs.location` | path | `.agents/wiki` |
| `rules.docs.format` | `markdown` \| `html` \| `docx` \| `xlsx` | `markdown` |
| `rules.docs.sync_strategy` | `with-commit` \| `main-only` | `with-commit` |
| `rules.agents.fallback` | `main` \| CLI id | `main` |
| `rules.agents.routing.<skill>` | ordered CLI ids | empty → main only |

Optional (add only when the repo has a convention; `init` may merge them):
`rules.commit.*`, `rules.pull_request.*`, `rules.agents.*`,
`rules.code.comments.language_style`. Apply only populated values.

- **Re-read settings** at the start of every task and every skill invocation.
  Never reuse a cached `language` (or other settings) from earlier in the
  session. Mid-session edits win after re-read. A direct instruction in the
  current user request overrides the file for that turn.
- **`language`:** thread / report / artifact **prose only** (summaries,
  paragraphs, cell *values*, questions) in `en` or `vi` — **one language per
  artifact**, no half-VI half-EN bodies. **Does not** set source-code comment
  or docstring language. **Do not translate** Markdown headings, template
  section titles, template table column headers, or enum/machine values
  (`Quick`, `PASS`, `Match`, `todo`, …). Code, paths, commands, and domain IDs
  stay as-is.
- **`rules.code.comments.prose_language`:** language of comments and docstrings
  in source files. `repo-default` = follow `PRJ_REFERENCE.md` / existing repo
  style, else prefer English. `en` / `vi` = force that language. Never infer
  this from `settings.language`.
- **`rules.branch.mode`:** `direct` = work/commit on base/main; `checkout` =
  create/checkout a work branch **before any code edit** (never commit feature
  work on base). Unset → `checkout`.
- **`rules.reports.output_format`:** same contract/basename; HTML uses the
  enterprise theme in `.agents/DESIGN_SYSTEM.md` (prefer short `.ss-*` classes).
- If `.agents/PRJ_REFERENCE.md` is missing or stale, run `init` before other
  lifecycle skills (`force` only when explicitly requested).

### Built-in defaults (not required in settings)

Use these unless the host explicitly overrides them in settings:

**Decisions** (brainstorming / BA / planning / design / investigate when blocked):
stop on `critical-unresolved`, `blocking-unknown`, `feasibility-fail-or-unknown`,
`correctness-fail-or-unknown`, `blocking-capability-gap`;
`require_sequential_step_ledger: true`;
`require_spec_quality_before_downstream_work: true`;
`stop_immediately_on_blocking_question: true`;
`require_ask_method_classification: true`;
`max_blocking_questions_per_round: 3`.

**Visuals / Ask methods:** `triage: required`; `html: ask-before-create`;
`prefer_diagram_for_flows: true`. Ask method taxonomy (confirm/choice/fact/
table/diagram/html): `.agents/SKILL_PREAMBLE.md` → Confirm-first.

**Multi-CLI (optional workers):** main brain stays authoritative. Inventory via
`detect_agents.py`; route by skill **preferred_role** + `rules.agents.routing`;
always build `CONTEXT_PACK.md` with **Rules (mandatory)** before dispatch;
refuse spawn if Rules gate fails; fallback `main`. See SKILL_PREAMBLE →
Delegation & Rules pass-down.

**Reports (skim structure):** open with a short **Executive summary** (≤5
decision bullets) then a **Developer overview** panel **inside that same
artifact**. Do **not** create a separate `OVERVIEW.md` landing page — it goes
stale. Progress truth is `TASKS.md` + `session.sh status`. Do **not** name
sections after methods (`Outcome-first`, `IPO`, `Make-implicit-explicit`,
`SSOT`, `Small-batch`, `Feedback loop`, `Default path first`,
`Reversible decisions`, `Standardize before automate`, `Design for handoff`,
`Evidence over confidence`, `Optimize bottleneck`, `80/20`, `5W1H`). Chart when
useful; skip filler.

**Thinking methods (session-wide — not report titles):**

- **Outcome-first:** before Scope / Approach / TASKS / code, lock WHO + WHAT +
  EVIDENCE in `Goal` / `Desired outcome` / DoD / AC. Reject activity-only
  Goals (“write API”, “refactor auth”). Full rules:
  `.agents/thinking/outcome-first.md`.
- **Input → Process → Output:** after Output is drafted, name sufficient Input
  (facts/trace/dev context) and a coherent Process (Approach/Work items) that
  produces that Output. Full rules:
  `.agents/thinking/input-process-output.md`.
- **Make implicit explicit:** write and classify material Assumptions, business
  rules, owners, timeboxes, edges, DoD; dual-interpretation → Confirm-first.
  Full rules: `.agents/thinking/make-implicit-explicit.md`.
- **Single Source of Truth:** one kind of truth → one official update place;
  cite don’t fork; progress = `TASKS.md` + `session.sh status`. Docs↔code
  Blocking → classify layer, prefer visual Ask methods, fold into canonical.
  Full rules: `.agents/thinking/single-source-of-truth.md`.
- **Small-batch:** slice work into completable units with independent Verify
  and short coding feedback latency (Approach phases, TASK size rules, per-card
  Verify in execution). Full rules: `.agents/thinking/small-batch.md`.
- **Feedback loop:** shortest useful signal by latency×risk — Example
  (Given→Expect), See, Run, Spike, Ask, Compare. Hybrid C with Small-batch
  (size vs modality). Full rules: `.agents/thinking/feedback-loop.md`.
- **Default path first:** deepen L1 happy → L2 validation → L3 errors → L4
  rare; name edges early, implement rare late; thin security/money guards only
  when Blocking. Full rules: `.agents/thinking/default-path-first.md`.
- **Reversible decisions:** class R/H/U by reverse-cost; Type R try-and-measure;
  Type H options + Spike + ADR; High-impact ≠ hard-to-reverse; Quick forbids
  new Type H locks. Full rules: `.agents/thinking/reversible-decisions.md`.
- **Standardize before automate:** manual → understand → standardize → template
  → automate; no CI/bot/new skill without a checklist/template. Full rules:
  `.agents/thinking/standardize-before-automate.md`.
- **Design for handoff:** six-question successor test (what/why/run/check/risks/
  next); no chat-only material context; no opaque green. Full rules:
  `.agents/thinking/design-for-handoff.md`.
- **Evidence over confidence:** claim works/done/Ready/fixed only with recorded
  proof (test, screenshot, log, API, metrics, link, confirmed checklist). AI
  confidence ≠ a run. Full rules:
  `.agents/thinking/evidence-over-confidence.md`.
- **Optimize bottleneck:** relieve the constraint stage first (requirements /
  coding / review / deploy / decision-wait); do not polish everything. Full
  rules: `.agents/thinking/optimize-bottleneck.md`.
- **Vital few (Pareto / “80/20”):** across the whole session, keep attention on
  the small set of facts, risks, and decisions that change the outcome. Use it
  when prioritizing, summarizing, and writing memory — never as a heading or
  as a checklist of trivia. Distinct from Optimize bottleneck (content vs
  stage).
- **5W1H:** a diagnostic lens (What / Why / Who / When / Where / How) for hard
  or unclear problems in the **session context**. Apply silently while framing
  or investigating; fold answers into the real sections. Never stamp a 5W1H
  table, never title a report “5W1H”, never fill Who/What/… for trivial noise.

**Code comments:** follow `.agents/CODE_COMMENTS.md` —
`doc_comments: public-api`; `flow_comments: non-obvious`;
`non_obvious_flow: required`; `rationale_and_constraints: required`;
`obvious_code_narration: avoid`; markers
`[TODO, FIXME, NOTE, HACK, SECURITY, PERF]`. Comment/docstring **prose**
follows `rules.code.comments.prose_language` (default `repo-default`), not
`settings.language`. Prefer the repo’s existing style from `PRJ_REFERENCE.md`
when it conflicts with defaults.

## Architecture

**Kit** (`.agents/`) is installer-owned. **Work** (`.agent-work/`) holds
sessions + memory together under a nested git (required when `git` is
available) — see `.agents/AGENT_WORK.md` → Work commit protocol.

- `AGENTS.md`: Entrypoint. Read this first.
- `.agents/settings.yaml`: Project-level agent settings (language, etc.). Read first.
- `.agents/PRJ_REFERENCE.md`: Generated project context shared by all skills.
- `.agents/tools/`: Local utilities copied on install (for example the HTML
  decision server that logs user choices, and `session/session.sh`).
- `.agent-work/`: Feature work tree (sessions + memory). Nested git; not
  mirrored by the installer. Prefer ignoring it in the product root git.
- `.agent-work/sessions/`: Per-task artifacts; active pointer `.current`.
- `.agent-work/memory/`: Cross-task, durable knowledge base. `INDEX.md` is the
  vital-few map; each entry holds durable lessons from a finished task. `done` writes
  it; any skill may read it.
- `.agents/wiki/`: Human-facing project wiki maintained by the `docs` skill
  (location/format/strategy from `rules.docs`). Distinct from `PRJ_REFERENCE.md`
  (agent context).
- `.agents/CODE_COMMENTS.md`: The code comment convention (per-language doc
  comments, flow documentation, markers). `execution` applies it; `review`
  checks it. Defaults in AGENT_POLICY; optional overrides in settings.
- `.agents/DESIGN_SYSTEM.md`: Compact enterprise HTML recipe (semantic +
  short `.ss-*` classes; beauty in CSS, not utility soup).
- `.agents/THIRD_PARTY_SKILLS.md`: Sources, revisions, and licenses for vendored skills.
- `.agents/SKILL_PREAMBLE.md`: Shared Language + Work layout + Memory for first-party skills.
- `.agents/AGENT_POLICY.md`: This detailed policy file.
- `.agents/AGENT_WORK.md`: Kit vs Work layout and nested-git guidance.
- `.agents/skills/`: Each directory is an independent skill (or shared helper such as `office-common`).
  - `SKILL.md`: **Authoritative** skill definition when present.
  - First-party workflow and office skills contain a **Contract (mandatory)** section.
  - `agents/openai.yaml`, when present, is machine-readable metadata. It is not a substitute for reading `SKILL.md`.
  - `.agents/skills/office-common/`: shared Python helpers for office skills (not an agent skill).

### Skill architecture

- Every invokable skill has one authoritative `SKILL.md`.
- First-party skills must also have `agents/openai.yaml` mirroring inputs,
  outputs, safety, workflow, and artifact schema.
- First-party inventory is declarative at `docs/config/first-party-skills.json`.
- First-party workflow skills start by reading `.agents/SKILL_PREAMBLE.md`.
- Vendored third-party skills retain their upstream structure and are listed in
  `.agents/THIRD_PARTY_SKILLS.md`; do not fabricate first-party contracts for
  them. Expo may ship `agents/openai.yaml` as optional host metadata only.
- Shared helpers are not invokable skills and must be documented as such.
- Install profiles (`core` default / `office` / `frontend` / `backend` / `all`)
  live in `docs/config/install-profiles.json`.
- Repository validation: `python scripts/validate_skills.py`.
- Session artifact schema: `python .agents/tools/session/validate_artifacts.py`
  (required before review pass / done complete).

## Skill compliance

When a skill applies:

1. Read `.agents/SKILL_PREAMBLE.md` when the skill points to it, then read its
   `SKILL.md` fully **before** other actions for that skill.
2. For first-party workflow/office skills, obey the **Contract (mandatory)** section first.
3. Produce any artifacts required by the skill.
4. Treat safety constraints as hard stops — do not violate them for convenience.
5. If the skill requirements cannot be satisfied, stop and report what is missing.
6. Do **not** rely on `agents/openai.yaml` alone; `SKILL.md` is binding.
7. Before a `review` recommendation of Ready* or before `done` marks complete,
   run `python .agents/tools/session/validate_artifacts.py` on the active
   session and fix any schema failures. Do not claim complete while it fails.

## Security (hard rules)

These rules are hard stops. They cannot be disabled by settings and override
convenience.

1. **Secrets**: Never read, print, log, echo, or commit secrets or credentials
   (`.env`, tokens, API keys, passwords, private keys). Redact when quoting.
   Do not commit files likely to hold secrets (`.env`, `credentials.json`,
   `*.pem`, `id_rsa`); warn the user if explicitly asked to.
2. **Least exposure**: Do not send project code or data to external services
   without explicit user consent.
3. **Destructive actions**: Do not run irreversible commands (e.g.
   `git push --force` to shared branches, `git reset --hard`, `rm -rf`,
   `DROP`/`TRUNCATE`) without explicit confirmation.
4. **No weakening controls**: Do not disable or bypass auth, permission checks,
   input validation, or TLS/cert verification to make something work.
5. **Untrusted input**: Do not introduce injection risks (SQL, command, path
   traversal). Validate and escape external input.
6. **Dependencies**: Add only dependencies from trusted sources with an
   explicit reviewed version/range; update the lockfile when the project uses
   one. Do not add unknown or unconstrained packages silently.
7. **Report, don't hide**: If a security risk is found or a rule blocks the
   task, stop and report it clearly instead of working around it.

## Office skills (supported-lossless)

First-party Python skills: `xlsx`, `docx`, `pptx`, `pdf`.

1. On first use, run `.agents/skills/<skill>/scripts/setup.py`; use that
   skill's private `.venv` runtime and do not install packages globally.
2. Prefer each skill's `scripts/cli.py` over ad-hoc generation.
3. Every create/edit must produce a coverage manifest with `coverage_ratio == 1.0`.
4. Unsupported structures (macros, OLE, signatures, encryption, out-of-subset OOXML/PDF features) **block** publish.
5. Optional tools (LibreOffice, Tesseract, Poppler) may be used when present; if absent, mark checks `skipped` — never false-pass.
6. Keep `.agents/skills/office-common` installed beside the office skills.

## Source-code comments

During execution/coding:

- Add short comments for non-obvious control flow, business-rule application,
  invariants, compatibility workarounds, security boundaries, and important
  trade-offs. Explain **why**, not a line-by-line **what**.
- For multi-stage flows, place a brief flow/rationale comment at the
  orchestration boundary so a reviewer can understand sequencing and failure
  behavior.
- Follow comment/docstring conventions from `.agents/PRJ_REFERENCE.md` and
  `.agents/settings.yaml`; update comments when behavior changes.
- Avoid comments that merely repeat clear code. If no comment is needed, keep
  the code self-explanatory through naming and structure.

## Decision and visual gates

Brainstorming, business-analysis, and planning must fail closed:

- Follow the skill **step files in order**. Each step has a Precondition and a
  Step ledger entry in the artifact. Do not mark a later step done while an
  earlier step is still `todo`/`blocked`. If a precondition fails, return to
  the earliest incomplete step instead of filling later sections first.
- Classify material issues by severity, clarity, blocking status, owner, and
  visual need.
- Challenge specs/design with **Spec quality review** before recommending or
  planning:
  1. **Feasibility (tính khả thi)** — can this actually be delivered with current
     stack, data, auth, ops, and timeline?
  2. **Correctness (tính đúng đắn)** — do specs match the real system/domain, or
     are the specs (or the system) wrong?
  3. **Capability recommendations (khả năng feature / gaps)** — ask for capabilities
     a feature of this type should normally include even if specs omit them
     (example: upload without max size, MIME allowlist, overwrite policy, progress,
     retry, audit, permissions, error recovery).
- When a Critical issue, blocking unknown, Feasibility/Correctness Fail/Unknown,
  or Blocking=Yes capability gap is unresolved, **STOP immediately** and ask the
  user in chat (**Confirm-first** + **Ask method** — see
  `.agents/SKILL_PREAMBLE.md`). Do not select a default, keep filling the current
  artifact, continue downstream sections, bury the issue as an assumption, or
  hand the user a “finished” document whose payload is still open questions.
- **Classify Ask method before asking** (`confirm` / `choice` / `fact` /
  `table` / `diagram` / `html`). Basic Yes/No or value → `confirm`/`fact`/
  `choice` in chat. Multi-criteria → `table`. Flow/boundary → `diagram`.
  Spatial/UI/multi-state → `html` (ask-before-create). Do not use HTML for
  abstract strategy text.
- **Reuse before re-ask:** check Clarification checkpoint, memory, and already
  Answered Unknowns; prefer `confirm` on prior decisions when they still apply.
- Downstream work means Scope/Options and Recommendation in brainstorming,
  User stories/Business rules/Acceptance criteria in business-analysis, and
  Goal/Approach/TASKS in planning. These sections must remain unfilled until
  the Spec quality gate passes.
- Ask with the chosen method — default **one** question/visual per message
  (max three independent `confirm`/`choice`/`fact` blockers per round). Record
  method + answer in the Clarification checkpoint, then **rewrite the real
  sections**. Residual Open questions / Unknowns in a finished artifact are for
  **non-blocking** items only.
- Triage visual format by decision value (subset of Ask methods):
  - text/table for simple comparisons;
  - diagram for architecture, sequence, state, or data flow;
  - HTML for UI layout, responsive/before-after/multi-state, or spatial option
    comparisons where a static table/diagram is insufficient.
- Do not generate HTML for every complex issue. Honor
  default is ask before creating it (override with `rules.visuals.html` only if needed).
- When a confirmed HTML decision page is ready, serve it with
  `.agents/tools/session-serve/serve.py`, read the result with
  `.agents/tools/choice-reader/read.py --issue-id <issue-id>`, and record that
  answer in the clarification checkpoint before continuing.
- Visual HTML must include Tailwind + anime.js CDN tags for static viewing,
  remain accessible, contain no sensitive data, and use only the allowed CDNs
  plus local decision-server helpers. Treat it as a decision aid rather than
  production UI. Choice logging still requires session-serve.

## Video evidence

- When a screen recording or demo video is supplied to business-analysis,
  investigate, or tester, extract periodic frames with
  `.agents/tools/video-keyframes/extract.py` before detailed visual analysis.
- Store generated frames in the active session, then cite `manifest.json` and
  specific frame paths in the artifact instead of treating the whole video as
  an opaque source.
- Choose an interval appropriate to the clip and cap frame count. Sampling can
  miss short transitions, does not analyze audio, and must not be presented as
  proof of continuous behavior.
- If FFmpeg is unavailable, report the evidence limitation; do not silently
  claim the recording was analyzed.

## Contract Compliance

Every first-party workflow skill embeds a Contract in `SKILL.md` (mirrored in
`agents/openai.yaml`):

**Contract table** (required rows — machine-checked via
`contract_table_fields` in `first-party-skills.json`):

| Field | Description |
|-------|-------------|
| Inputs | What the skill expects as input |
| Outputs | What the skill produces as output |
| Safety | Constraints the agent MUST NOT violate |

Optional table rows (when used): `preferred_role` for multi-CLI routing.

**Required artifacts** (mandatory subsection immediately after the table, not a
table row — content is too large for one cell): heading
`### Required artifacts` listing files that MUST be created/updated and their
required fields. The agent MUST obey the Contract strictly — it is not
advisory. If the contract says "do not modify code", the agent MUST NOT modify
code. If it says "create a file", the agent MUST create that file.

## Workflow

Base folder for runtime artifacts: `.agent-work/sessions/<Task-N-short-description>/` (repo root).

### Scale & Quick path (BMAD-inspired)

Pick a path **once** at task start (record in DISCUSSION or PLAN Developer overview).
Do not run Full ceremony on tiny work.

| Path | When | Flow |
| --- | --- | --- |
| **Quick** | Single clear fix/change; scope fits ≤3 TASK cards; no open product decisions; **no new Type H locks** (public API / core schema / auth architecture — Reversible decisions) | Skill **`quick-fix`** → sync → execution → review → done. Skip BA + basic/detail design + Spec quality matrices. Lint fails if BA/design files appear. |
| **Lite** | Small feature; some unknowns but not enterprise design | Brainstorming Lite (still steps, short sections) → optional skip BA/design → planning Lite → sync → execution → … |
| **Full** | Multi-surface, unclear product, contracts/architecture needed | Full lifecycle: brainstorming → (BA) → design → planning → sync → execution → review → done |

Rules:

- Quick/Lite still require **Readable writing**, session discipline, and honest status.
- Quick still needs TASK cards with **Dev context** when code changes (even 1 card).
- If Quick hits a blocking unknown, Spec mismatch, or **Type H** decision
  (hard-to-reverse: public API / core schema / auth / large infra) → **upgrade**
  to Lite/Full; do not invent. See `.agents/thinking/reversible-decisions.md`.

### Session discipline (mandatory)

- **One active session, resolved deterministically.** The active session dir is
  recorded in `.agent-work/sessions/.current`. Resolve it at the **start of every
  lifecycle skill** — do not guess or re-derive the folder name:

  ```bash
  bash .agents/tools/session/session.sh current
  ```

  The first skill of a task creates it with `session.sh new <slug>`; every later
  skill **reuses** the path that `session.sh current` returns. Never invent a
  second `<Task-N-…>` folder for the same task.
- **Lifecycle artifacts live ONLY in the active session under `.agent-work/`.**
  Write DISCUSSION, PLAN, TASKS, EXECUTION, REVIEW, and every other **session**
  artifact **inside** that session dir. **Never** write them under
  `.agents/skills/`, an OS temp dir, a scratchpad, a `cache/` folder, or
  anywhere outside `.agent-work/`. Redoing an artifact (e.g. re-writing
  `PLAN.md` during review) overwrites it **in the same active session** — not
  a new folder, not a side/cache copy.
- **Wiki exception:** the `docs` skill writes the enterprise wiki under
  `rules.docs.location` (default `.agents/wiki`). That is kit-adjacent by
  design and is not a lifecycle session report.
- **Host `.gitignore`:** ensure the product root ignores `.agent-work/` so Work
  uses its nested git instead of bloating the product history.
- **Work commit protocol (mandatory when nested git exists).** After a
  lifecycle skill writes or updates artifacts under `.agent-work/`, run
  `session.sh commit 'docs(<skill>): …'` before declaring the skill done.
  `session.sh new` commits the new session automatically. On successful `done`
  (no open defect loop), run `session.sh archive` so the session moves to
  `sessions/_archive/` and the active tree stays lean. Nested Work commits are
  **not** product PRs and are **not** `rules.docs` `with-commit` (wiki). See
  `.agents/AGENT_WORK.md`.
- **Progress is computed, never hand-written.** Refresh TASKS progress from the
  real card states instead of typing counts or maintaining `OVERVIEW.md`:

  ```bash
  bash .agents/tools/session/session.sh status
  ```

  Paste its mermaid pie into `TASKS.md` and copy its counts verbatim. A
  task/session is `done` **only** when the tool prints `COMPLETE: yes` **and**
  the review verdict passed. Never show `100%`, a full "done" pie, or Status
  `done` while any card is `todo`/`in_progress`/`blocked`/`review` — the tool
  reports those as `COMPLETE: no`. Do **not** create or update `OVERVIEW.md`.

### Project memory (`.agent-work/memory/`)

- **Durable, cross-task knowledge** (survives across sessions). `done` distills
  each finished task into `.agent-work/memory/<Task-N-slug>.md` — the **vital few**:
  non-obvious decisions + why, gotchas, reusable conventions, and pointers. It
  is not a changelog and must not be titled `80/20`. Do **not** paste full
  session reports into memory — artifact history belongs in the Work nested git.
- **Read before deciding/analyzing.** At the start of any step that frames,
  researches, investigates, designs, or plans (`brainstorming`, `research`,
  `investigate`, `business-analysis`, `basic-design`, `detail-design`,
  `planning`, …), read `.agent-work/memory/INDEX.md` first and open the entries
  whose hook matches the task. Any step may read memory whenever it helps.
- Prefer prior lessons over re-deriving them; if memory conflicts with current
  evidence, trust current evidence and note the drift so `done` can update the
  entry.

### Project initialization

- **Greenfield (brand-new project, no code yet):** run `scaffold` first. It
  bootstraps the skeleton (stack, structure, tooling, CI), initializes the repo
  and `.agents/` wiring, records stack ADRs, then hands off to `init`. It is
  greenfield-only — it never scaffolds over an existing project.
- **Existing project:** run `init` when entering it or when
  `.agents/PRJ_REFERENCE.md` is missing. Re-run in `refresh` mode after material
  architecture, tooling, or business-rule changes; explicit `force` rebuilds the
  reference from the current repository while preserving user settings.

Order for a new project: `scaffold` → `init` → lifecycle (`brainstorming`/
`planning` → …).

### Dev Lifecycle per Task

0. Choose **Quick / Lite / Full** (see Scale & Quick path). Record the choice.
1. `brainstorming` → `DISCUSSION.md` (Quick may use a short DISCUSSION or skip
   to planning when the user already stated a clear fix).
   - **Diverge then converge:** gather facts/options before locking a recommendation.
   - While facilitating clarification: **STOP immediately** on Blocking needs;
     classify **Ask method**; **one** question/visual per message (max three
     only when they are independent `confirm`/`choice`/`fact` blockers). No
     question walls; no quiz-as-document.
   - Step workflow (Full/Lite): seed → frame + Spec quality → scope/options → recommend → self-check.
   - Templates: `.agents/skills/brainstorming/templates/`; steps: `step-01` … `step-05`.
   - Scope/options and recommendation cannot start until blocking Spec quality findings are resolved (Full/Lite).
2. `business-analysis` (optional; **skip on Quick**) → `BUSINESS_ANALYSIS.md`
   - Templates: `.agents/skills/business-analysis/templates/`; steps: `step-01` … `step-04`.
   - Step workflow: seed template → frame + Spec quality → stories/rules/AC → self-check.
   - Stories, rules, and AC cannot start until the Spec quality gate passes; stop on Blocking=Yes gaps.
3. `basic-design` → `BASIC_DESIGN.md` (**skip on Quick** unless architecture is the task)
   - Template: `.agents/skills/basic-design/templates/BASIC_DESIGN.template.md`.
   - **Doc reality check** (docs/wiki ↔ codebase) **before** architecture/components/flows.
   - Blocking mismatches → **STOP immediately**; classify Ask method; prefer
     `diagram`/`table`/`html` so the user **sees** docs vs code (SSOT); ask in
     chat (max 3); do not design as if docs were automatically true.
4. `detail-design` → `DETAIL_DESIGN.md`
   - Template: `.agents/skills/detail-design/templates/DETAIL_DESIGN.template.md`.
   - Re-run **Doc reality check**; contracts/data_model only after gate; High-impact assumptions need `Confirmed?` or user accept.
5. `planning` → `PLAN.md` + `TASKS.md` (**both required on disk**)
   - Step workflow: seed templates → decision + Spec quality gate → fill PLAN (slim) → **Work inventory → specific micro-TASKS with Dev context** → self-check.
   - Each TASK card must include `#### Dev context` with `[Source: …]` cites (or
     `No specific guidance found.`) so execution does not invent tech details.
   - Templates: `.agents/skills/planning/templates/`; steps: `.agents/skills/planning/steps/step-01` … `step-04`.
   - TASKS must remain unfilled until Spec quality passes (Full/Lite; Quick may slim Spec quality).
   - Reject if: steps skipped, PLAN-only, empty TASKS template, tasks inside PLAN, test-matrix as T-001 before code, missing inventory, vague/epic cards, missing Dev context, or **Ready=Yes with open blockers**.
6. `sync`
   - Read-only refresh; set **Implementation readiness** `PASS` | `CONCERNS` | `FAIL`.
   - Respect PLAN Ready/blockers; rewrite `SYNC.md` if older than PLAN/TASKS.
   - Execution only after `PASS` (or `CONCERNS` with explicit user accept).
7. `execution` → `EXECUTION.md` (+ live progress in `TASKS.md`)
   - Read the active card’s **Dev context** first; follow Sources; do not invent.
   - Implement changes step by step, record commands and verification.
   - As each Work item / card finishes: check off `- [ ]` → `- [x]`, set Status (`in_progress` / `done` / `blocked`), update Progress board Done column.
8. `review` → `REVIEW.md`
   - Check correctness, regression, security, maintainability.
9. `done` → `DONE.md` (+ optional `PR_MESSAGE.md`, `PR_DESCRIPTION.md`)
   - Summarize, handoff, prepare PR/MR.

**Quick** skips BA + design + Spec matrices when the change is tiny and clear.
**Lite** may skip BA/design when brainstorming hands off to planning.
Upgrade path if unknowns block.

### Post-done defect loop

A defect found **after** `done` (a reviewer, QA, or a later PR review) means the
task is **not** done. Do not patch silently and do not open a new session.

1. **Reopen, don't hide.** In the **same** session (`session.sh current`): flip
   `DONE.md` status to `Needs fix` (or `Partial`), and set the affected
   `TASKS.md` card(s) back to `in_progress`/`blocked` (add a new fix card if the
   defect is new scope). Reopening makes `session.sh status` report
   `COMPLETE: no` again — as it should.
2. **Pick the re-entry point by the nature of the defect:**
   - Root cause unclear → `investigate` → `execution`.
   - Clear bug within existing scope/plan → `execution` (fix the reopened card).
   - Defect exposes a wrong/missing spec or design → back up to `planning` /
     `detail-design` (or `business-analysis` / `brainstorming` if the direction
     itself was wrong) → `execution`.
3. **Always re-gate.** After the fix, run `review` again; only re-run `done`
   when `review` passes **and** `session.sh status` prints `COMPLETE: yes`.
4. **Same branch.** Fix on the current work branch per `rules.branch.mode`
   (`direct` → base branch; `checkout` → the existing feature branch). Never
   open a new branch just for the fix.
5. **Feed memory.** When `done` re-runs, record the defect as a **Gotcha** in the
   task's `.agent-work/memory/` entry (update it, don't duplicate) — this is exactly
   the durable knowledge worth keeping.

### Documentation wiki

`docs` → standards-based doc set under `rules.docs.location` (default `.agents/wiki/`)

- A **real enterprise documentation set**, not a skim: SRS (ISO/IEC/IEEE 29148),
  Architecture (arc42 + C4 + 4+1 views), ADRs, High-Level Design, Low-Level
  Design, Reference (API + data model), Operations (runbook), and Guides
  (Diátaxis) — with a coverage matrix, stable IDs, and traceability. It reuses
  session artifacts (SRS ← business-analysis/DISCUSSION, HLD ← BASIC_DESIGN,
  LLD ← DETAIL_DESIGN, ADRs ← decision gates) and marks `Gap`/`Unknown` rather
  than inventing.
- Two modes: `full` (author the whole set, document by document) and `sync`
  (update only the documents/sections a code change affects, via `.docmap.md`).
- `rules.docs.format` picks the organization: `markdown` (doc tree — the
  canonical source), `html` (linked pages + theme), `docx` (one controlled
  document with TOC, via the `docx` skill), or `xlsx` (workbook of registers/
  matrices, via the `xlsx` skill). html/docx/xlsx render from the markdown source.
- `rules.docs.sync_strategy` controls how it stays in step with code:
  - `main-only`: wiki is written **only** on the base/main branch; feature
    branches never touch it.
  - `with-commit`: `done` runs `docs sync` and includes the wiki in the **same
    commit** as the task, so docs travel through the PR.

### Investigation

`investigate` → `INVESTIGATE.md` (Doc reality check when docs/specs cited; Blocking → STOP + Ask method / Confirm-first)

Use when debugging or tracing root cause — no commitment to implement.

### PR Review

`review-pr` → `REVIEW_PR.md`

Use when reviewing a pull request or branch diff.

### Research

`research` → `RESEARCH.md`

Use when researching external sources or making technical decisions.

### Testing

`tester` → `TESTCASES.md` (+ optional `TESTCASES.csv`)

Use when requirements, plans, or implemented changes need test design,
traceability, test data, or verification evidence.

## Artifact format resolution

- Resolve `rules.reports.output_format` before creating or reading a
  human-readable first-party lifecycle artifact:
  - `markdown`: write the contract basename with `.md`;
  - `html`: write the same basename with `.html`.
- Artifact names shown as `*.md` in skill contracts and templates are logical
  names whose default representation is Markdown. For example, logical
  `BUSINESS_ANALYSIS` resolves to `BUSINESS_ANALYSIS.html` in HTML mode.
- Downstream skills first read the configured extension, then fall back to the
  alternate extension so existing sessions remain compatible. Non-report
  formats such as CSV, JSON, office files, source code, and manifests are not
  changed by this setting.
- Markdown templates remain authoritative for required sections and order.
  In HTML mode, map them to semantic headings, sections, lists, tables, and
  code blocks without omitting contract fields.
- HTML reports must be accessible and **reading-first**: semantic landmarks
  (`header` / `main` / `footer`), one `h1`, ordered headings, real lists/tables.
  Prefer short `.ss-*` classes from `.agents/DESIGN_SYSTEM.md` (do not invent
  long Tailwind utility stacks). Theme follows Anthropic frontend-design +
  OpenAI Apps SDK UI (system fonts, hairline cards, green accent signature).
- **Dual load mode:** every HTML artifact must include Tailwind CDN and
  anime.js CDN tags so static open (`file://` / editor preview) still
  renders. Also include relative local theme links from the session folder
  (`../../tools/decision-server/...`) plus absolute `/styles.css` (and
  siblings) for decision-server. The server injects missing tags only as a
  safety net — agents must not omit the CDN tags. Allowed external CDNs:
  `cdn.tailwindcss.com`, `cdn.jsdelivr.net/npm/animejs@3.2.2`. No sensitive
  data. Replace Mermaid with an accessible table or inline SVG.
- Interactive HTML decisions use `data-issue-id` and `data-choice`. Viewing
  works statically; recording a choice requires
  `.agents/tools/session-serve/serve.py <session> --file <ARTIFACT>.html`.
  After the user chooses, the sticky banner confirmation is required; read
  the result with `choice-reader` and record it in the artifact.

## Thinking methods (session-wide)

These are **ways of working**, not section names or report titles. Do not brand
artifacts with method labels (`Outcome-first`, `IPO`, `Make-implicit-explicit`,
`SSOT`, `Small-batch`, `Feedback loop`, `Default path first`,
`Reversible decisions`, `Standardize before automate`, `Design for handoff`,
`Evidence over confidence`, `Optimize bottleneck`, `80/20`, `5W1H`). Do not
create `OUTCOME.md` / `IPO.md` / `SMALL_BATCH.md` / `IMPLICIT.md` / `SSOT.md` /
`FEEDBACK.md` / `HAPPY_PATH.md` / `REVERSIBLE.md` / `AUTOMATE.md` /
`HANDOFF.md` / `EVIDENCE.md` / `BOTTLENECK.md`. Fold method results into
existing fields only.

**Framing order:** Outcome-first → Input→Process→Output → Make-implicit-explicit
→ Single Source of Truth → Small-batch → Feedback loop → Default path first →
Reversible decisions → Standardize before automate → Design for handoff →
Evidence over confidence → Optimize bottleneck → (5W1H if unclear) → vital few
when summarizing/memory.

1. **Outcome-first (mandatory):** Start from the observable end state, not the
   task list. Every `Goal`, `Desired outcome`, DoD item, and task `AC` must
   pass the **three-axis test** (WHO uses it, WHAT they observe, EVIDENCE that
   allows stopping). Activity-only statements (“write API”, “refactor auth”,
   “works per spec”) are invalid as Goal/AC. Process milestones (PR, lint) may
   supplement DoD but never replace a consumer/contract outcome.

   **Land in existing fields:** Quick → `QUICK.md` Goal + card AC/Verify;
   Lite/Full → `DISCUSSION` Goal + Desired outcome → `PLAN` Goal / Non-goals /
   DoD / Verification → each TASK AC with falsifiable Verify. Review/Done must
   map evidence to DoD/AC, not “files changed.”

   **Fail closed:** If the outcome is activity-only or WHO/EVIDENCE is missing
   and would change design, STOP (Confirm-first) — do not invent Approach or
   TASKS to hide a fuzzy Goal. Desired outcome describes behaviors, not a
   disguised backlog (“write DTO / service / UI”).

   **Normative detail** (definitions, strength ladder, translation table,
   anti-patterns, worked examples, agent checklist):
   `.agents/thinking/outcome-first.md` (source `docs/thinking/outcome-first.md`).
   Kit authors: keep this as a Thinking method, not a separate skill.

2. **Input → Process → Output (mandatory after Output draft):** Name what must
   be known to start (**Input**), how it will be transformed (**Process**), and
   the observable result (**Output** — already locked by Outcome-first). Card
   shape: Trace/Dev context → Work items → AC/Verify. Approach phases must each
   advance a checkable Output slice. Blocking Input gaps → Confirm-first; do
   not invent contracts. Reject Process theatre (steps that do not advance
   Output) and wishful Output (Goal with empty Facts/Approach).

   **Normative detail:**
   `.agents/thinking/input-process-output.md`
   (source `docs/thinking/input-process-output.md`).

3. **Make implicit explicit (mandatory before locking Approach/TASKS):** Write
   material Assumptions, business rules, owners, timeboxes, edges, and DoD.
   Fact ≠ Assumption ≠ Rule ≠ Preference ≠ Unknown. Dual-interpretation that
   changes Output/Process → Confirm-first (do not silent-pick). Blocking rows
   need Owner. High-impact Assumption `Confirmed?: No` blocks Ready. Asking
   stays Confirm-first in SKILL_PREAMBLE.

   **Normative detail** (taxonomy, dual-interpretation test, anti-patterns,
   worked examples):
   `.agents/thinking/make-implicit-explicit.md`
   (source `docs/thinking/make-implicit-explicit.md`).

4. **Single Source of Truth (mandatory when citing/updating facts):** Each kind
   of information has one official update place; session artifacts cite, they
   do not fork. Progress = `TASKS.md` + `session.sh status` only. Docs↔code
   conflict: classify descriptive vs normative vs change-in-flight — never
   silent “code wins.” Doc reality Blocking → Confirm-first with preferred
   visual Ask methods (`diagram` / `table` / `html`) so the user sees the
   diff; fold into Clarification and the chosen canonical store. Optional
   Canonical sources table in Constraints — never `SSOT.md`.

   **Normative detail:**
   `.agents/thinking/single-source-of-truth.md`
   (source `docs/thinking/single-source-of-truth.md`).

5. **Small-batch (mandatory when sizing and executing):** Prefer
   `complete → check → continue` over mega-batches. Every phase/card needs one
   goal, one Output, independent Verify, and short feedback latency. Obey
   planning `step-03` §B/§C as hard card-size law. In execution, run **this
   card’s Verify** before starting a dependent next card; never mark `done`
   without Verify (or documented skip + risk). Quick ceiling remains 1–3 cards.

   **Normative detail** (four-property test, batch levels A–E, heuristics,
   anti-patterns, worked examples):
   `.agents/thinking/small-batch.md` (source `docs/thinking/small-batch.md`).

6. **Feedback loop (mandatory when choosing signals):** Shortest **useful**
   loop by latency×risk. Modalities: Example (Given→Expect), See, Run, Spike,
   Ask, Compare. Hybrid C: Small-batch owns size + coding Verify rhythm; this
   method owns modality and stage gates (confirm requirements by example; UI
   preview before polish; spike before Full; per-card Run stays Small-batch).
   Fold into Clarification + canonical (SSOT). Avoid thrashing and fake-short
   loops (trivia asks / unrelated green tests).

   **Normative detail:**
   `.agents/thinking/feedback-loop.md`
   (source `docs/thinking/feedback-loop.md`).

7. **Default path first (mandatory when ordering depth):** L1 happy → L2
   validation → L3 errors → L4 rare. Name material edges early (Non-goals /
   CAP / stub AC); deepen rare late. Thin early guards only for Blocking
   security/money/data-loss. Fail closed on exception-first Approach/DETAIL
   or fake happy paths.

   **Normative detail:**
   `.agents/thinking/default-path-first.md`
   (source `docs/thinking/default-path-first.md`).

8. **Reversible decisions (mandatory when locking choices):** Classify
   reverse-cost **R** / **H** / **U**. Type R: try-and-measure. Type H: options
   + Spike when needed + ADR (SSOT). Type U: treat as H until proven R.
   High-impact ≠ hard-to-reverse. Path Quick forbids new Type H locks.

   **Normative detail:**
   `.agents/thinking/reversible-decisions.md`
   (source `docs/thinking/reversible-decisions.md`).

9. **Standardize before automate (mandatory when proposing automation):**
   Ladder manual → understand → standardize → template → automate. Do not add
   CI/bots/hooks/new skills without a checklist/template (or Approach phases
   for that ladder). Automate vital checklist rows only; org automation often
   Type H.

   **Normative detail:**
   `.agents/thinking/standardize-before-automate.md`
   (source `docs/thinking/standardize-before-automate.md`).

10. **Design for handoff (mandatory on finished work):** Six-question successor
   test — what / why / run / check / risks / next — answerable from files alone.
   Strengthen `## Handoff`, Dev context, Verify, PR/DONE; never `HANDOFF.md`.
   Opaque green fails. Readable writing remains first-pass prose clarity.

   **Normative detail:**
   `.agents/thinking/design-for-handoff.md`
   (source `docs/thinking/design-for-handoff.md`).

11. **Evidence over confidence (mandatory on status claims):** Claim works /
   done / Ready / fixed / root cause only with recorded proof (test,
   screenshot, log, API response, metrics, link preview, confirmed checklist).
   “Should be fine” / AI fluency is not evidence. Skip = risk + status — never
   fake pass. Opaque green that ignores this AC fails.

   **Normative detail:**
   `.agents/thinking/evidence-over-confidence.md`
   (source `docs/thinking/evidence-over-confidence.md`).

12. **Optimize bottleneck (mandatory when choosing improvements):** Name the
   constraint stage (requirements / coding / review / deploy / decision-wait)
   and relieve that first. Do not optimize everything; local optima upstream of
   a blocked gate create inventory. Aim automation at the bottleneck after a
   checklist. Distinct from Vital few (stage vs content).

   **Normative detail:**
   `.agents/thinking/optimize-bottleneck.md`
   (source `docs/thinking/optimize-bottleneck.md`).

13. **Vital few (Pareto):** Hold the whole session in mind and surface only what
   changes the decision or outcome. Executive summaries and memory entries
   should reflect that prioritization — without a heading called `80/20` or
   branded titles like “Executive summary” plus a method suffix.

14. **5W1H:** When the problem is hard, ambiguous, or the feature is unclear /
   wrong / underspecified, silently check What / Why / Who / When / Where / How
   against the **session context** (goal, constraints, evidence, unknowns). Put
   the useful answers into the real sections (facts, risks, Spec quality,
   investigation). Prefer using 5W1H to clarify a **locked or draft outcome**,
   not as a substitute for naming WHO/WHAT/EVIDENCE. **Forbidden:** default
   5W1H sections, empty/`N/A` tables, answering trivia just to “use the
   method”, or titling anything `5W1H`.

## Artifact Quality

### Readable first (non-negotiable)

- A competent teammate must understand the artifact on a **first pass**.
  Prefer cutting length over clever abstraction. See
  `.agents/SKILL_PREAMBLE.md` → Readable writing.
- Every sentence must carry a fact, decision, risk, evidence pointer, or next
  action. Delete the rest.
- Prefer: `path`, `API`, `field`, `command`, `ID`. Avoid: vague process talk
  and method branding.
- Spec quality rows need a concrete finding + evidence + verdict. Ban
  essay-like answers to the question column.
- Finished files: no `_(TODO)_`, no unused sections, no placeholder Mermaid.

### Skim structure

- Every human-readable report starts with **Executive summary**: at most five
  bullets with the decision, outcome, top findings/risks, and next action.
  Title it exactly that — **no method branding**.
- Immediately after the summary, include a **Developer overview** panel **in
  the same artifact**: status, progress, blockers, next action, and owner.
- Add **Charts/diagrams** only when they improve a decision. Prefer one clear
  chart. If none helps, omit the section (do not paste a generic flowchart).
- Put supporting evidence after the overview. Detail remains mandatory where
  contracts, safety, verification, or reproducibility require it.
- **No separate `OVERVIEW.md`.** Progress = `TASKS.md` + `session.sh status`.
- Apply only **populated** project knobs from `.agents/settings.yaml`.
- Output: short, structured, decision-oriented. Bullets/tables over paragraphs.
- No filler. No marketing language. No method-named sections.
- Language from `.agents/settings.yaml`: thread/report prose in `language`;
  source-code comments/docstrings in `rules.code.comments.prose_language`;
  headings / template keys / enums / identifiers stay English (shared form).
  One language per artifact — no mixed VI/EN body text.

## Developer UX / DX

Agents write for humans who skim. Optimize for developer experience:

1. **Scan first**: developer overview panel and chart before long prose.
2. **Actionable**: every overview ends with a concrete next command/skill.
3. **Traceable**: link Issue IDs, task IDs, files, and evidence paths.
4. **Honest status**: use `todo` / `in_progress` / `done` / `blocked` /
   `needs_info`; never imply green when blockers remain. Prefer
   `session.sh status` + `TASKS.md` over any hand-written progress page.
5. **Low friction**: prefer Mermaid in Markdown over external tools; keep
   charts small enough to render in common Markdown previews.
6. **No noise**: no decorative visuals, no empty sections, no duplicated
   walls of text already present in another artifact, no stale `OVERVIEW.md`.
