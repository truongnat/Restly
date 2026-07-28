# Make the implicit explicit (Thinking method)

> **Status:** Session-wide thinking method (same class as **Outcome-first**,
> **Input→Process→Output**, **Small-batch**, **vital few**, and **5W1H**).  
> **Not** a report section title. **Not** a separate skill. **Not** a new
> artifact (`IMPLICIT.md` / `EXPLICIT.md` are forbidden).  
> Fold results into existing fields — Facts, Assumptions, Unknowns, Constraints,
> Issue triage, Clarification, Spec quality, DoD, Dev context Gaps.  
> Installed path: `.agents/thinking/make-implicit-explicit.md`  
> Source: `docs/thinking/make-implicit-explicit.md`.  
> Short ops rules: `.agents/SKILL_PREAMBLE.md` → Thinking methods.  
> Policy summary: `.agents/AGENT_POLICY.md` → Thinking methods.  
> **Asking** Blocking items still follows Confirm-first + Ask method in
> `SKILL_PREAMBLE.md` — this file defines *what must be written and classified*;
> Confirm-first defines *how to ask without quiz-as-document*.

Agents must treat this file as **normative** when classifying knowledge and
decisions. Most project failures are not “bad code” — they are **two parties
reading the same sentence two ways**. If a material interpretation is still
only in someone’s head (or the model’s), the session is not ready to size
batches or execute.

---

## 1. Purpose

Whatever is currently “understood between the lines” must be written down when
it can change Output, Process, ownership, timing, or acceptance:

| Often left implicit | Why it hurts |
| --- | --- |
| **Assumption** | Treated as Fact → built on folklore |
| **Business rule** | Two “correct” behaviors ship |
| **Owner / accountability** | Decision hangs; everyone waits on “someone” |
| **Deadline / timebox** | Scope expands because nothing forces cut |
| **Edge case** | Happy path ships; production discovers the edge |
| **Definition of Done** | “Done” means different things to FE/BE/QA/PM |

**Core claim:** Prefer an ugly explicit table row over a confident silent fill.
Silent agreement is not agreement.

This method does **not** require documenting trivia. It requires documenting
**material** implicits — those that would change Goal, Scope, Approach, AC,
security, data, or handoff if interpreted differently.

---

## 2. Definitions (taxonomy — use precisely)

| Kind | Meaning | May drive code? | Typical field |
| --- | --- | --- | --- |
| **Fact** | Observed or sourced truth (user/repo/doc with cite) | Yes | Confirmed facts; Dev context with `[Source:]` |
| **Assumption** | Believed true, **not** yet confirmed | Only if Low risk **or** Confirmed | Assumptions (Risk + Confirmed?) |
| **Business rule** | Normative “system must …” (domain/policy) | Yes, once explicit | Facts (if sourced), Trace, Constraints, AC |
| **Preference** | Soft want (“nice if…”) | No unless promoted to Goal/AC | Non-goals / deferred Unknown |
| **Unknown** | Missing knowledge | No — resolve or block | Unknowns; Issue triage |
| **Decision** | Choice among alternatives | Yes after recorded | Issue triage + Clarification (+ ADR if Reversibility=H) |
| **Owner** | Who is accountable to answer/decide/accept | Meta | Unknowns.Owner; Issue triage.Owner |
| **Deadline / timebox** | When this session/slice must stop or cut | Yes (forces scope) | Constraints |
| **Edge case** | Non-happy path that still belongs in scope or Out of scope | Yes if in scope | Capability gaps; AC; Risks; Out of scope |
| **DoD / AC** | Explicit stop criteria + evidence | Yes | PLAN DoD; card AC + Verify |

### Classification rules

1. **Never label an Assumption as a Fact.**  
2. **Never leave a Business rule only in chat memory** — cite or write it.  
3. **Preference ≠ Rule.** Promote explicitly or keep out of AC.  
4. **Unknown with two plausible readings that change Output/Process = Blocking**
   until Confirm-first resolves it — even if the agent feels “pretty sure.”  
5. **High-impact Assumption with `Confirmed?: No` = blocker** for Ready
   (planning already treats High-impact this way — obey it as Make-explicit law).

---

## 3. Dual-interpretation test (mandatory)

For any sentence in the ask, spec, or design that will drive work, ask:

```text
Could a competent teammate read this two different ways
AND would those ways change Output, Process, security, data, or AC?
```

| Result | Action |
| --- | --- |
| No | Proceed; optional note if useful |
| Yes, and Blocking | Confirm-first **now**; record in Clarification / Issue triage |
| Yes, but not Blocking | Write Assumption or Unknown (Blocking=No) + Owner; do not silent-pick |
| Yes, and already decided | Write the Decision + evidence/source |

**Agent anti-pattern:** “I’ll just implement the reasonable reading.”  
**Required:** Make the reading explicit; if Blocking, stop and ask.

---

## 4. Relationship to other Thinking methods

**Framing order:**

```text
1. Outcome-first              → lock Output (WHO / WHAT / EVIDENCE)
2. Input → Process → Output   → bind Input + Process to Output
3. Make implicit explicit     → classify & surface material implicits in Input
4. Single Source of Truth     → cite canonical stores; no forks
5. Small-batch                → slice on clarified Input (not on folklore)
6. Feedback loop              → modality + latency×risk (Example/See/…)
7. Default path first         → L1→L2→L3→L4 depth order
8. 5W1H (if still unclear)    → diagnose; fold into real sections
9. Vital few                  → summarize only what changes the outcome
```

| Method | Job vs Make-explicit |
| --- | --- |
| Outcome-first | DoD/AC must be explicit Outputs — Make-explicit supplies rules/edges that belong in them |
| IPO | Input sufficiency — Make-explicit cleans what counts as Fact vs Assumption vs Unknown |
| SSOT | Where official updates live; Make-explicit is what must appear |
| Small-batch | Split after implicits are visible — else you split the wrong seams |
| Feedback loop | Dual-interpretation → Example confirm (not bare Yes/No) when behavior Blocking |
| Default path first | Name edges here; deepen rare **after** happy path (not exception-first) |
| Confirm-first | Mechanism to resolve Blocking implicits in chat |
| Readable writing | How prose reads; Make-explicit is *what must appear* |
| Spec quality | Finds missing capabilities/edges; Make-explicit requires promoting them to triage |
| Vital few | Limits *how many* implicits to keep in summaries — not an excuse to hide Blocking ones |
| 5W1H | Optional lens when dual-interpretation persists |

**Anti-pattern:** Small-batch 40 cards built on an unconfirmed High-impact
assumption (“auth is optional”). Explicit first, then cut batches.

---

## 5. Where each implicit lands (artifact map)

Do **not** create `## Make implicit explicit` or `IMPLICIT.md`.

| Implicit | Primary landing | Notes |
| --- | --- | --- |
| Assumption | `Assumptions` (Risk + Confirmed?) | High + No → Ready blocker |
| Business rule | Confirmed facts (with source) **or** Trace / Dev context Constraints | If unsourced → Assumption or Unknown |
| Owner | Unknowns.Owner; Issue triage.Owner | Blocking rows need a human owner (user/BA/lead), not empty |
| Deadline / timebox | Constraints | e.g. “ship by Fri” / “2h spike only” — forces Non-goals |
| Edge case | Spec quality Capability gaps; Risks; AC Then; Out of scope | In-scope edge → AC or gap; out-of-scope → Non-goals. **Order:** name early; deepen L2–L4 after L1 (`.agents/thinking/default-path-first.md`) — do not silent-drop. |
| DoD | PLAN Definition of done; card AC + Verify | Already Outcome-first; Make-explicit forbids vibes-only Done |
| Dual reading | Issue triage + Clarification checkpoint | Confirm-first Ask method |
| Invented tech fill | Dev context **Gaps** | Never silent-fill contracts/fields |

### Card-level

```text
Trace + Dev context (explicit rules/sources/gaps)
  → Work items
  → AC that states edges if in scope
```

If execution would need a rule not in Trace/Dev context → stop; return to
planning or Confirm-first — do not “make it up in code.”

---

## 6. Path-specific rules

### Quick

- Facts / Out of scope / Unknowns must separate known vs guessed.
- High-impact Assumption or dual-interpretation on product behavior →
  Confirm-first or **upgrade Path** (do not silent-pick on Quick).
- DoD collapses to Goal + card AC/Verify — still must be explicit.

### Lite / Full

- Brainstorming step-02: Facts ≠ Assumptions ≠ Unknowns (already required).
- Make-explicit adds: Owner on Blocking unknowns/issues; Constraints note
  timebox when user stated one; Capability gaps for material edges.
- Planning: inherit unresolved implicits into decision gate; High-impact
  unconfirmed assumptions block Ready.

### Execution / Review / Done

- Do not invent business rules while coding.
- Review: flag behavior that matches an unstated assumption.
- Done: DoD evidence explicit; residual assumptions called out as risks.

---

## 7. Gates (fail closed)

### Gate E1 — Before Scope / Approach / TASKS

Refuse to proceed when:

1. Dual-interpretation test fails and Blocking=Yes without Clarification answer, or
2. Blocking Unknown lacks Owner (who will answer?), or
3. Business rule driving AC is neither sourced nor listed as Assumption/Unknown, or
4. Facts table contains guesses.

**Action:** Confirm-first and/or rewrite classification rows.

### Gate E2 — Planning Ready

Ready=No when:

1. Any **High** risk Assumption still `Confirmed?: No`, or
2. Critical/Blocking issue without resolution evidence, or
3. DoD missing consumer/contract outcome (Outcome-first), or
4. Dev context would require inventing rules (Gaps ignored).

### Gate E3 — Execution

If a needed rule/edge is absent from Trace/Dev context/PLAN:

- Status=`blocked` or return to planning — **not** silent implementation.

---

## 8. Anti-patterns (deep)

### A. Assumption laundered as Fact

```text
BAD:  Confirmed facts: “API always returns problem+json”
      (no source; just habit)
GOOD: Assumptions: problem+json on 4xx — Risk High — Confirmed? No
      → Confirm-first or cite OpenAPI
```

### B. Silent reasonable reading

```text
BAD:  Spec says “validate input” → agent picks regex without asking
GOOD: Issue: which fields/rules? Blocking=Yes; Ask method=table/fact
```

### C. Owner vacuum

```text
BAD:  Unknowns: export async vs sync — Blocking=Yes — Owner: _(blank)_
GOOD: Owner: user / BA name; Clarification asked this turn
```

### D. Deadline only in chat

```text
BAD:  User said “need it tomorrow”; Constraints empty; Scope unbounded
GOOD: Constraints: timebox end-of-day tomorrow — forces Non-goals cuts
```

### E. Edge cases as vibes

```text
BAD:  “We’ll handle errors later” (unnamed)
GOOD: CAP gap or AC: empty BaseCd → M-01; over-max → M-OVER; or Non-goals
      (Default path first: name now; deepen L2/L3 after L1)
```

### F. Quiz-as-document

```text
BAD:  Ship DISCUSSION whose main content is 20 open questions
GOOD: STOP; ask ≤3 Blocking via Confirm-first; finish sections with answers
```

### G. Method branding

```text
BAD:  ## Make implicit explicit
GOOD: fill Assumptions / Unknowns / Constraints / DoD (apply silently)
```

### H. Over-documentation

```text
BAD:  Page of Low-risk assumptions that cannot change Output
GOOD: Material / High / Blocking only in active tables; rest omit
```

---

## 9. Worked examples

### Example 1 — Same sentence, two readings

**Ask:** “Delete user should be soft delete.”

| Reading A | Reading B |
| --- | --- |
| `deleted_at` set; row remains | Status=`disabled`; row remains |
| Hard delete after 30 days | Never hard delete |

**Make-explicit:** Issue Blocking=Yes — choose retention rule; Owner=user;
record Decision; AC states observable behavior + Verify.

### Example 2 — Assumption vs rule

```text
Fact:       POST /orders returns 401 when anonymous `[Source: OpenAPI]`
Assumption: FE will map 401 to login redirect — Risk Medium — Confirmed? No
Rule (after confirm): anonymous submit → redirect /login?next=…
```

### Example 3 — Quick with timebox

```text
Constraints: spike ≤2h; no schema migration
Out of scope: backfill job
Goal/AC:     null-guard only
```

Implicits (time + no migration) are explicit → Small-batch stays tiny.

### Example 4 — Dev context Gap

```text
Gaps: max upload size not in design — unknown
```

Execution must not invent `10MB`. Confirm-first or Blocking card.

---

## 10. Agent checklist (reasoning only — not a report section)

Before Approach / TASKS / code:

- [ ] Facts are sourced or labeled; no guesses in Facts
- [ ] Material Assumptions listed with Risk + Confirmed?
- [ ] High + unconfirmed → blocked or Confirm-first done
- [ ] Business rules cited or queued as Assumption/Unknown
- [ ] Blocking Unknowns/Issues have Owner
- [ ] User-stated deadline/timebox in Constraints (if any)
- [ ] Material edges in AC, gaps, Risks, or Non-goals
- [ ] DoD/AC explicit (Outcome-first)
- [ ] Dual-interpretation test applied to driving sentences
- [ ] No method-branded headings; no quiz-as-document

Before Ready / execution done:

- [ ] No silent rule invention in Dev context or code
- [ ] Residual implicits called out as risks/follow-ups

---

## 11. Maintenance notes for kit authors

- Keep Confirm-first mechanics in `SKILL_PREAMBLE.md`; keep classification
  taxonomy and dual-interpretation test here.
- Install to `.agents/thinking/make-implicit-explicit.md`.
- Prefer template comments + Ready gates over new artifacts.
- Framing order: after IPO, before Small-batch.
- English kit form; thread prose follows `settings.language`.
