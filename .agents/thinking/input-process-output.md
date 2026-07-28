# Input → Process → Output (Thinking method)

> **Status:** Session-wide thinking method (same class as **Outcome-first**,
> **vital few**, and **5W1H**).  
> **Not** a report section title. **Not** a separate skill. **Not** a new
> artifact (`IPO.md` / `PROCESS.md` are forbidden).  
> Fold results into existing fields — do not invent parallel sections.  
> Installed path: `.agents/thinking/input-process-output.md`  
> Source: `docs/thinking/input-process-output.md`.  
> Short ops rules: `.agents/SKILL_PREAMBLE.md` → Thinking methods.  
> Policy summary: `.agents/AGENT_POLICY.md` → Thinking methods.

Agents must treat this file as **normative** when framing work after the
session **Output** is drafted (usually via Outcome-first). If Output is still
activity-only, fix Outcome-first first — IPO cannot rescue a fuzzy destination.

---

## 1. Purpose

Every unit of work — session, phase, or task card — must name three things:

```text
Input  →  Process  →  Output
```

| Part | Meaning | Fail mode if missing |
| --- | --- | --- |
| **Input** | What must already be true, known, or available before work starts | Inventing requirements, guessing contracts, coding on folklore |
| **Process** | How Input is transformed (analysis, design, code, test, review) | Busywork with no path to Output; endless “improving” |
| **Output** | Observable end state + evidence (same spirit as Outcome-first) | Wander; cannot stop; review checks the wrong thing |

**Core claim:** If **Output** is unclear, Process almost always meanders. If
**Input** is insufficient, Process invents. If **Process** is undefined,
Output becomes hope.

IPO does **not** replace Outcome-first. Outcome-first **locks Output**
(WHO / WHAT / EVIDENCE). IPO then forces agents to ask: *Do we have enough
Input, and is the Process the shortest coherent path to that Output?*

---

## 2. Definitions (use these words precisely)

| Term | Meaning in this kit | Typical fields |
| --- | --- | --- |
| **Input** | Facts, constraints, contracts, traces, prior artifacts, environment access required to start | `Confirmed facts`, `Constraints`, `Assumptions` (marked), `Trace`, `Dev context`, design/docs paths |
| **Process** | Ordered transformation steps that consume Input and produce Output | `Approach` phases, card `Work items`, skill step sequence |
| **Output** | Observable result of this unit (session Goal / DoD / card AC) | `Goal`, `Desired outcome`, DoD, `AC`, `Verify` evidence |
| **Blocking Input gap** | Missing Input that would change Process or Output if wrong | Unknowns with `Blocking: Yes` → Confirm-first |
| **Process theatre** | Steps that look productive but do not advance Output | “Research everything”, “clean architecture first”, infinite refactor |
| **Orphan Process** | Steps with no named Output | “Improve the module” with no AC |
| **Wishful Output** | Output claimed without Input or Process to support it | Goal set, Approach empty, facts empty |

**Hard rule:** Do not start Approach / TASKS / code while Output fails
Outcome-first **or** a Blocking Input gap remains open.

---

## 3. Relationship to Outcome-first

```text
1. Outcome-first              → lock session/card Output
2. Input → Process → Output   → bind Input + Process to that Output
3. Make implicit explicit     → classify Facts/Assumptions/Unknowns/rules
4. Single Source of Truth     → cite canonical stores; no forks
5. Small-batch                → slice Process into completable batches
6. Feedback loop              → modality + latency×risk for signals
7. Default path first         → L1→L2→L3→L4 depth order
8. 5W1H (if unclear)          → diagnose gaps in Input/Output; fold into real sections
9. Vital few                  → when summarizing, keep only what changes the Output
```

| Method | Asks | IPO role |
| --- | --- | --- |
| Outcome-first | What does “done” look like? | Defines **Output** |
| IPO | What do we need, and how do we get there? | Binds **Input** + **Process** to Output |
| Make-explicit | What was only “understood”? | Cleans Input classification |
| SSOT | Where is Input officially updated? | Input cites stores — doesn’t fork |
| Small-batch | Is each unit completable + checkable now? | Sizes Process into batches |
| Feedback loop | Which signal, how soon? | Example/See/Spike before deep Process |
| Default path first | Which path layer next? | Process order: happy before rare |
| 5W1H | Why is this unclear? | Clarifies weak Input/Output |
| Vital few | What still matters? | Trims noise inside a locked IPO |

**Anti-pattern:** Filling Process (TASKS) before Output (Goal) or before
blocking Input is known. Also anti-pattern: one coherent Process blob that is
not small-batch sliced — see `.agents/thinking/small-batch.md`. Do not
small-batch on unconfirmed High-impact Assumptions — see
`.agents/thinking/make-implicit-explicit.md`.

---

## 4. Sufficiency tests

### Input sufficiency

Input is **sufficient** when:

1. Every Blocking unknown that would change Output/Process is resolved or
   explicitly deferred with owner.
2. Contracts/paths needed for this unit are cited or marked
   `No specific guidance found.` / Gaps (cards).
3. Assumptions that carry High impact are Confirmed or Blocking.

Input is **insufficient** when the agent must invent product rules, API
shapes, or screen behavior to proceed.

### Process coherence

Process is **coherent** when:

1. Each step moves a named slice of Output forward (or enables a later step
   that does).
2. Order matches kit norms (e.g. feature before automated test matrix;
   models → service → API → UI → tests).
3. No step exists only for ceremony (Process theatre).

### Output clarity

Output must already pass Outcome-first three-axis. IPO adds: Output of a
**card** must be a slice of session Output; Output of a **phase** must be
checkable before the next phase.

---

## 5. Where IPO lands (artifact map)

Do **not** create headings named `Input` / `Process` / `Output` / `IPO`
unless a template already uses those English words for another reason.
Map into existing fields:

| Unit | Input | Process | Output |
| --- | --- | --- | --- |
| **Quick** | `QUICK.md` Facts, Out of scope, Unknowns | Card Work items | Goal; card AC + Verify |
| **DISCUSSION** | Confirmed facts, Constraints, Assumptions, Unknowns | (defer detailed Process to planning) | Goal, Desired outcome |
| **PLAN** | Inherited facts/constraints; Affected areas | Approach phases | Goal, DoD, Verification |
| **TASK card** | Trace, Dev context, Files/scope, Depends | Work items | AC + Verify |
| **Review/Done** | Diff + EXECUTION + prior artifacts | Review checks | Evidence mapped to DoD/AC |

### Card-level IPO (mandatory mental model)

```text
Trace + Dev context + Files     →   Work items   →   AC + Verify
         (Input)                     (Process)         (Output)
```

If AC cannot be stated, do not invent Work items. If Dev context is empty
and sources exist, extract Input before coding.

---

## 6. Path-specific rules

### Quick

- Facts = Input; Goal/AC = Output; 1–3 cards = Process.
- If Input gaps are product/design → upgrade Path (do not guess on Quick).

### Lite / Full

- Frame Output (Outcome-first) and Input (facts/unknowns) in brainstorming
  step-02 **before** Scope/Options expand Process.
- Planning Approach must name phases that each produce a checkable Output
  slice — not “do backend then frontend” without deliverables.
- Spec quality may flag Input gaps (missing capability) as Blocking.

### Execution

- Load Dev context (Input) first; execute Work items (Process); stop when
  Verify falsifies or confirms AC (Output).
- Do not expand Output mid-flight without Confirm-first / Non-goals update.

---

## 7. Gates (fail closed)

### Gate I — Input

Refuse Approach/TASKS/code when:

1. Blocking Unknown open, or
2. High-impact Assumption still `Confirmed?: No`, or
3. Card would require inventing contracts/fields not in Trace/Dev context Gaps.

**Action:** Confirm-first, or mark Gaps and stop Ready.

### Gate P — Process

Refuse Ready / execution when:

1. Approach/Work items do not cite how they advance Goal/AC, or
2. First implement card is test-matrix-only before feature Output, or
3. Cards are activity-only (“implement BE”) with no Output AC.

### Gate O — Output

Same as Outcome-first Gate A/B/C. IPO adds: every Process step must point at
an Output owner (session DoD item or card AC).

---

## 8. Anti-patterns

### A. Process without Output

```text
BAD:  Let's refactor auth, clean folders, add abstractions…
GOOD: Output locked (contracts unchanged + tests green) → Process = split
      AuthService only as needed for that Output.
```

### B. Output without Input

```text
BAD:  Goal: FE shows field errors — but no API error shape known.
GOOD: Input = OpenAPI/problem+json sample or Blocking ask → then Process.
```

### C. Input dump as Process

```text
BAD:  Approach = “read all specs, research industry best practices…”
GOOD: Approach phases that produce named deliverables toward Goal.
```

### D. Card with Process, no Output

```text
BAD:  Work items: wire service; AC: works
GOOD: AC: POST /orders 400 returns field errors map; Verify: contract test
```

### E. Method branding

```text
BAD:  ## Input → Process → Output
      ## Executive summary (IPO)
GOOD: fill Facts / Approach / Goal / AC (apply IPO silently)
```

---

## 9. Worked examples

### Example 1 — Coding task (session)

```text
Input:   Locked OpenAPI for POST /orders; FE form field IDs; auth required
Process: implement handler → contract tests → FE error map → manual 400
Output:  FE creates order on 201; shows field errors on 400; evidence in DoD
```

### Example 2 — Quick bugfix

```text
Input:   Crash repro `parseDate("")`; callers treat null as no date
Process: null-guard + unit case
Output:  parseDate("") === null; suite green (`pnpm test -- date`)
```

### Example 3 — Task card

```text
Input:   Trace DETAIL_DESIGN §API Create; Dev context cites problem+json
Process: [ ] map validation errors [ ] return 400 body [ ] unit cases
Output:  AC: invalid body → 400 + field keys; Verify: filter test name
```

### Example 4 — Missing Input (stop)

```text
Output draft: Operator can export CSV with columns C1–C5
Input gap:    Export async vs sync not decided (Blocking)
Process:      DO NOT invent TASKS for queue vs sync — Confirm-first first
```

---

## 10. Agent checklist (reasoning only — not a report section)

Before Approach / TASKS / code:

- [ ] Output passes Outcome-first three-axis
- [ ] Input listed (facts/constraints/trace/dev context); Blocking gaps handled
- [ ] Process steps each advance a named Output slice
- [ ] No Process theatre; no orphan Work items without AC
- [ ] No method-branded headings

Before review/done Ready:

- [ ] Evidence maps to Output (DoD/AC)
- [ ] Skipped Input/Process risks called out honestly

---

## 11. Maintenance notes for kit authors

- Keep IPO under `docs/thinking/`; install to `.agents/thinking/`.
- Prefer template comments + step gates over new artifacts.
- Compose with Outcome-first in preamble framing order; do not fork a skill.
- English kit form; thread prose follows `settings.language`.
