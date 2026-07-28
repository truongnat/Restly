# Single Source of Truth (Thinking method)

> **Status:** Session-wide thinking method (same class as **Outcome-first**,
> **Input→Process→Output**, **Make-implicit-explicit**, **Small-batch**,
> **vital few**, and **5W1H**).  
> **Not** a report section title. **Not** a separate skill. **Not** a new
> artifact (`SSOT.md` / `CANONICAL.md` / second progress board are forbidden).  
> Fold results into existing fields — Trace, Dev context `[Source:]`, Constraints
> (optional Canonical sources), Clarification, Doc reality, TASKS/status.  
> Installed path: `.agents/thinking/single-source-of-truth.md`  
> Source: `docs/thinking/single-source-of-truth.md`.  
> Short ops rules: `.agents/SKILL_PREAMBLE.md` → Thinking methods.  
> Policy summary: `.agents/AGENT_POLICY.md` → Thinking methods.  
> **Asking** Blocking conflicts still follows Confirm-first + Ask method in
> `SKILL_PREAMBLE.md` — this file defines *where truth lives* and *how to show
> docs↔code conflict so the user can decide*; Confirm-first defines *how to ask*.

Agents must treat this file as **normative** when citing, copying, or updating
facts. If the same requirement, contract, schema, decision, or progress state
can be “updated” in two places, the session will drift — agents pick the
convenient copy; humans argue which one is real.

---

## 1. Purpose

Each **kind** of information has **one official place to update**. Everywhere
else **cites or projects** — it must not silently become a competing truth.

| Kind (typical) | Canonical home (host chooses tools) |
| --- | --- |
| Requirement / AC | Jira / Linear / story-spec / BA artifact the project named |
| API contract | OpenAPI / proto / contract tests golden |
| Database schema | Migrations (or schema-as-code the repo uses) |
| Technical decision | ADR for **Type H** (hard-to-reverse); Clarification for Type R — see `.agents/thinking/reversible-decisions.md` |
| Progress | **`TASKS.md` + `session.sh status`** (kit law — no `OVERVIEW.md`) |
| Skill contract (kit) | `SKILL.md` (not `openai.yaml`) |

**Core claim:** Prefer a pointer (`Trace`, `[Source:]`, ticket ID, OpenAPI path)
over restating the full truth in chat, Word, PLAN, and code comments as if each
were authoritative.

Session artifacts (`DISCUSSION`, `PLAN`, `BASIC_DESIGN`, cards) are **work
products**. They may summarize. They must not fork the requirement or contract
without updating the canonical store (or Explicitly recording “accepted drift”
in Clarification).

---

## 2. Definitions

| Term | Meaning |
| --- | --- |
| **Canonical store** | The one place where updates for that kind are official |
| **Projection / cite** | Copy or summary that points back (`Trace`, Source, §, ID) |
| **Fork** | Same fact updated in two places with no single winner |
| **SSOT map** | Short list: kind → canonical path/tool (optional in Constraints) |

### Cite, don’t fork

1. **Read** from canonical when possible.  
2. **Write** material changes to canonical first (or open a Blocking card to do so).  
3. **Refresh** projections (Dev context, design prose) after canonical changes.  
4. **Never** “fix Dev context to match code” while leaving OpenAPI/migration
   wrong — that inverts SSOT.

### Optional Canonical sources (Constraints)

When the host has multiple docs or tools, a short table in DISCUSSION/PLAN
**Constraints** (or `PRJ_REFERENCE.md`) is enough — **not** a new file:

| Kind | Canonical | Notes |
| --- | --- | --- |
| API | `openapi/openapi.yaml` | |
| Schema | `db/migrations/` | |
| Progress | `TASKS.md` + `session.sh status` | kit default |
| AC | `STORY.md` / Jira PROJ-123 | project-specific |

Lite/Quick: Trace + `[Source:]` may suffice. Full multi-doc: fill the table once.

---

## 3. Conflict: docs ↔ code (and how to show it)

A **conflict** is two descriptions of the same behavior that disagree. SSOT does
**not** hardcode “code always wins” or “docs always wins.”

### Three layers of “correct” (classify before asking)

| Layer | Question | Typical evidence |
| --- | --- | --- |
| **Descriptive** | What does the system do *now*? | Code, runtime, migrations, logs |
| **Normative** | What *must* it do? | Approved AC, OpenAPI shipped, ADR |
| **Change-in-flight** | What are we *changing* to? | Ticket + explicit user/decision |

Blocking Doc reality almost always means the agent does not yet know which layer
applies. Silent pick = dual-interpretation failure (Make-implicit-explicit).

### Doc reality (kit mechanism)

Used in `investigate` / `basic-design` / `detail-design` (and whenever design
depends on wiki/spec):

1. Claim + doc evidence + code/runtime evidence  
2. Verdict: `Match` / `Mismatch` / `Missing-in-docs` / `Missing-in-code` /
   `Stale` / `Unknown`  
3. Blocking=`Yes` → Confirm-first **STOP**  
4. Clarification records: **doc / code / refresh-docs-first** (or investigate)  
5. **Fold** the answer into real sections **and** update the chosen canonical
   (or file a follow-up to update it) — chat alone must not remain the only
   correct place

### Visualize Blocking conflict (mandatory preference)

Users often **see** a table row and still do not understand *what* differs or
*why* it matters. **Show ≠ understand.**

When Doc reality Blocking=`Yes` and the user must choose a winner:

| Conflict shape | Prefer Ask method | What to show |
| --- | --- | --- |
| Flow / pipeline / common vs 設計書 | `diagram` | Two paths side-by-side or one diagram with **diff nodes/edges** highlighted; cite code path |
| Sequence / ownership boundary | `diagram` | Sequence or boxes — docs version vs code version |
| API / fields / schema | `table` (or `html` if dense) | Field-level: doc claim vs code/OpenAPI |
| UI / layout / screen states | `html` | Before/after or dual state via `VISUAL_DECISION.html` (ask-before-create) |
| Pure stale meta (Last-synced only) | `confirm` / `choice` | Visual optional |

**Rules:**

1. The visual **is** the Confirm-first question — one visual (or one small table)
   per message; do not dump Mermaid into the design body *and* leave the real
   ask as a prose quiz in Open questions.  
2. Every conflict visual must answer three things in one frame: **docs say**,
   **code does**, **diff point** — then options (doc / code / refresh /
   investigate).  
3. Non-Blocking mismatches may stay as table rows only.  
4. Never invent paths in the diagram — same Doc reality evidence rules.  
5. After the user picks, fold into Clarification **Accepted source of truth**
   and update/plan the canonical store accordingly.

```text
Detect Blocking Doc reality
  → Classify shape (flow / contract / UI / stale)
  → Prefer diagram | html | table over bare A/B/C text
  → User chooses on the visual
  → Fold → update canonical (or explicit follow-up)
```

### After the choice (fold into SSOT)

| User chose | Then |
| --- | --- |
| **Trust code** (descriptive wins for now) | Design/fix to code-as-is; schedule or run docs refresh; mark wiki Stale accepted if needed |
| **Trust doc** (normative / intended wins) | Plan/fix toward doc; code is debt; do not “update Dev context only” |
| **Refresh-docs-first** | Stop design/fix body; sync docs; re-run Doc reality |
| **Investigate** | Handoff `investigate`; do not close Confirmed on docs alone |

---

## 4. Relationship to other Thinking methods

**Framing order:**

```text
1. Outcome-first              → lock Output (WHO / WHAT / EVIDENCE)
2. Input → Process → Output   → bind Input + Process to Output
3. Make implicit explicit     → classify & surface material implicits
4. Single Source of Truth     → point Input/facts at canonical stores; no forks
5. Small-batch                → slice on cited truth (not chat folklore)
6. Feedback loop              → modality + latency×risk for signals
7. Default path first         → L1→L2→L3→L4 depth order
8. 5W1H (if still unclear)    → diagnose; fold into real sections
9. Vital few                  → summarize only what changes the outcome
```

| Method | Job vs SSOT |
| --- | --- |
| Make-implicit-explicit | *What* must be written/classified; SSOT = *where* official updates live |
| IPO | Input sufficiency includes “from the right store” |
| Small-batch | Trace/plan_ref cite SSOT — do not copy full requirements onto every card |
| Feedback loop | After signal, fold into Clarification + **canonical** (this file) |
| Default path first | Contract happy shape before exception catalog in OpenAPI/DETAIL |
| Confirm-first | Mechanism to resolve Blocking SSOT conflicts (prefer visual Ask methods) |
| Doc reality | Detection table for docs↔code; SSOT adds layers + visualize + fold |

**Anti-pattern:** Make-explicit a rule only in DISCUSSION, never in AC/OpenAPI,
then ship from the DISCUSSION prose as if it were the contract.

---

## 5. Kit defaults already SSOT (obey)

| Domain | Canonical | Do not |
| --- | --- | --- |
| Progress | `TASKS.md` + `session.sh status` | Create `OVERVIEW.md` or a second board |
| Strategy vs cards | `PLAN.md` strategy; cards only in `TASKS.md` | Full cards duplicated in PLAN |
| Kit skill text | `SKILL.md` | Treat `openai.yaml` as authoritative |
| Kit vs work | `.agents/` vs `.agent-work/` | Mix install history into work |
| Agent facts | `PRJ_REFERENCE.md` | Confuse human wiki with agent reference |
| Card tech facts | Trace + Dev context `[Source:]` | Invent paths; leave Gaps empty when unknown |

---

## 6. Where it lands (no new artifacts)

| Behavior | Field / mechanism |
| --- | --- |
| Cite requirements/contracts | Trace; Dev context `[Source:]`; plan_ref |
| Optional kind→store map | Constraints “Canonical sources” (or PRJ_REFERENCE) |
| Docs↔code mismatch | Doc reality table + Clarification |
| Blocking conflict ask | Confirm-first with **visual** Ask method when shape needs it |
| Progress updates | TASKS + status only |
| Contract change in execution | Edit OpenAPI/migration/ADR first; refresh Dev context |

---

## 7. Fail closed

Stop or block Ready / design body / Confirmed root-cause when:

1. Trace is vague (`"spec"` / `"DISCUSSION"`) with no §/ID/path and the claim
   drives AC or contracts.  
2. Dev context states a tech fact with no `[Source:]` and invents paths.  
3. AC/TASKS contradict OpenAPI (or chosen API SSOT) and neither is updated.  
4. A second progress surface is introduced (`OVERVIEW.md`, parallel board).  
5. Doc reality Blocking=`Yes` unresolved — including asking with bare jargon
   when the conflict shape required a diagram/table/html for the user to
   understand.  
6. Chat answer never folded into Clarification + canonical follow-up.

---

## 8. Anti-patterns

| Anti-pattern | Why it fails | Do instead |
| --- | --- | --- |
| Requirement rewritten in chat, Word, Jira, and PLAN differently | Four truths | One AC store; others cite |
| “Code always wins” hardcoded | Normative/change-in-flight ignored | Classify layer → visualize → ask |
| Bare `choice` on opaque Mismatch | User cannot see the diff | `diagram` / `table` / `html` |
| Quiz-as-document Open questions | No decision | Confirm-first visual, then fold |
| Fix Dev context only | Projection becomes fake SSOT | Fix canonical first |
| Mega-copy of OpenAPI into every card | Drift magnet | Trace + Source pointers |

---

## 9. Worked examples

### A. Flow mismatch — visualize

**Bad ask:** “Spec says ExcelCreator; code uses CommonPrint — trust doc or code?”

**Good:** Mermaid (or equivalent) with two branches; highlight the diverging
node; cite `src/.../CommonPrint`. Ask: A follow code / B follow doc (update
code) / C refresh docs first / D investigate. Record Ask method=`diagram`.

### B. Field mismatch — table

| Field | Doc (設計書 §) | Code / OpenAPI | Diff |
| --- | --- | --- | --- |
| `baseCd` | required | optional | Missing-in-code vs over-doc |

Ask method=`table`; user picks normative vs descriptive.

### C. Progress fork

**Bad:** Maintain `OVERVIEW.md` “status” plus TASKS.  
**Good:** Update TASKS only; `session.sh status` for board truth.

---

## 10. Agent checklist

- [ ] Material claims cite a canonical store (or Gaps / Blocking Unknown)  
- [ ] No competing progress board  
- [ ] Dev context is projection with `[Source:]`, not a second contract  
- [ ] Doc reality Blocking → layer classified → **visual Ask method** when
      user must understand the diff  
- [ ] Clarification has Accepted source of truth after answer  
- [ ] Canonical update done or explicitly queued — not chat-only  
- [ ] No method-branded heading (`## Single Source of Truth`)  
- [ ] No `SSOT.md` / `CANONICAL.md` created  

---

## 11. Kit author notes

- Keep this as a Thinking method under `docs/thinking/`.  
- Install to `.agents/thinking/single-source-of-truth.md`.  
- Confirm-first Ask taxonomy stays in `SKILL_PREAMBLE.md`; Doc reality skills
  link here for visualize + fold rules.  
- Do not invent host-specific tools (Jira vs Linear) — project declares
  pointers; kit supplies progress SSOT and cite discipline.
