# Default path first (Thinking method)

> **Status:** Session-wide thinking method (same class as **Outcome-first**,
> **Input→Process→Output**, **Make-implicit-explicit**, **Single Source of
> Truth**, **Small-batch**, **Feedback loop**, **vital few**, and **5W1H**).  
> **Not** a report section title. **Not** a separate skill. **Not** a new
> artifact (`HAPPY_PATH.md` / `DEFAULT_PATH.md` / `EXCEPTIONS.md` are forbidden).  
> Fold results into existing fields — Desired outcome order, Non-goals,
> Capability gaps (deferred), Approach phase order, TASK `execution_order`,
> DETAIL section order (flows before error catalogs), card AC layers.  
> Installed path: `.agents/thinking/default-path-first.md`  
> Source: `docs/thinking/default-path-first.md`.  
> Short ops rules: `.agents/SKILL_PREAMBLE.md` → Thinking methods.  
> Policy summary: `.agents/AGENT_POLICY.md` → Thinking methods.  
> **Naming** edges stays Make-implicit-explicit / Spec quality.  
> **This file** owns *implementation and design depth order*: default →
> validation → errors → rare edges.  
> **Thin early guards** (security/money/data-loss) follow Feedback-loop
> latency×risk — they are not an excuse to build an exception encyclopedia.

Agents must treat this file as **normative** when ordering Approach phases,
DETAIL sections, and TASK cards. Starting from every exception makes the
system complex **before** any value exists.

---

## 1. Purpose

Design and deliver in layers:

```text
1. Default / happy path     → normal flow that creates consumer value
2. Validation               → reject/accept inputs with clear codes/messages
3. Error handling           → dependency/system failures, recovery, mapping
4. Rare edges               → uncommon harden / optimize last (or Non-goals)
```

**Core claim:** A working default path is the substrate for every later layer.
Exception-first design produces complexity without demoable value.

**Not** “ignore errors.”  
**Is** “name material edges early; deepen and code rare edges late.”

| Layer | Ships when | Typical landing |
| --- | --- | --- |
| **L1 Default** | Happy Given→Expect green | Goal / Desired outcome first bullets; main flow; T-happy cards |
| **L2 Validation** | Invalid input → defined reject | AC 4xx/field errors; validation cards after L1 |
| **L3 Errors** | Dependency/system fail paths | Error mapping, retries policy, user-visible failure |
| **L4 Rare** | Only if in scope this session | Non-goals, deferred CAP gap, or last phase/cards |

---

## 2. Division of labor

| Method | Owns |
| --- | --- |
| **Make-implicit-explicit** | Edge must be **written** (AC / gap / Non-goals) — never silent |
| **Vital few** | *Which* outcomes matter in summaries |
| **Small-batch** | *How big* each card is + Verify rhythm |
| **Feedback loop** | *When/which signal*; Example on L1 first; thin L2/L3 samples |
| **Default path first** | *Order of depth*: L1→L2→L3→L4 in design, Approach, execution_order |
| **Outcome-first** | L1 Goal must be consumer value, not “add all validation” |

```text
Make-explicit:  don’t forget the edge exists
Default-path:   don’t implement the edge encyclopedia before L1 works
```

---

## 3. Definitions

| Term | Meaning |
| --- | --- |
| **Default / happy path** | The usual successful journey for the session Goal (no fault injection) |
| **Validation** | Input/rule checks that reject bad requests **before** or at the boundary |
| **Error handling** | Failures after accept: timeouts, 5xx, partial writes, user-visible recovery |
| **Rare edge** | Low-frequency or exotic branch; often Non-goals this session |
| **Thin early guard** | Minimal Blocking safety (auth, money, delete) on L1 — not full L4 catalog |
| **Exception-first** | Anti-pattern: DETAIL/Approach/cards lead with every branch before L1 exists |
| **Name early, deepen late** | Record edge in gaps/Non-goals/AC stub; implement after L1 (and usually L2) |

---

## 4. Rules (mandatory)

1. **L1 before L2–L4 depth.** Main flow / 2xx / primary UI journey is designed
   and (when coding) verified before expanding validation matrices, error
   catalogs, or rare harden.  
2. **Name early.** Material edges discovered in Spec quality or dual-read go
   into Capability gaps, Risks, Non-goals, or stub AC — do **not** omit them
   because “happy path first.”  
3. **Deepen late.** Rare / low-risk edges stay Non-goals or last cards unless
   promoted.  
4. **Thin early guards.** If Feedback-loop risk says security/money/data-loss
   blocks any ship, add the **smallest** fail-closed guard on L1 — not the full
   exception matrix.  
5. **Approach / execution_order** list L1 phases/cards before L2/L3/L4.  
6. **DETAIL / BASIC flows:** main path section first; validation/errors after;
   omit rare or mark Deferred.  
7. **Tests:** happy Verify first; then representative validation; then error
   injection; rare last or skip.  
8. **Fake happy path forbidden:** L1 must not depend on an unimplemented L4
   edge to be independently verifiable (Small-batch).

---

## 5. Stage gates

### Discovery

| Do | Don’t |
| --- | --- |
| Desired outcome: normal behaviors first | Novel of every exception before Goal |
| ≥1 happy Example (Feedback loop) | Only error examples |
| Edges → Unknowns / Non-goals / CAP | Pretend edges don’t exist |

### Design (basic / detail)

| Do | Don’t |
| --- | --- |
| Main flows / happy sequence first | 15-branch sequence before main path |
| Validation + errors sections after | Field-level reject matrix as §1 |
| Deferred rare explicitly | Invent 40 edges as “facts” |

### Planning

| Do | Don’t |
| --- | --- |
| Approach phase 1 = L1 checkable slice | “Error middleware + all validators” first |
| Card order L1→L2→L3→(L4) | Inventory by technical layer only (validators before feature) |
| Non-goals for out-of-session rare | Silent drop of Blocking CAP gaps |

### Execution

| Do | Don’t |
| --- | --- |
| Finish L1 card Verify before deep L2/L3 piles | Code all error paths then “try happy” |
| Keep L1 demoable | Mark L1 `done` while it needs unfinished rare edge |

### Review / Done

| Do | Don’t |
| --- | --- |
| Evidence maps L1 DoD first | Only edge-case test dumps |
| Deferred edges listed | Claim “production-ready” with unnamed gaps |

---

## 6. Framing order

```text
1. Outcome-first
2. Input → Process → Output
3. Make implicit explicit     → name edges / rules
4. Single Source of Truth
5. Small-batch                → size units
6. Feedback loop              → early signals (happy Example first)
7. Default path first         → order L1→L2→L3→L4 depth
8. Reversible decisions       → R/H/U ceremony by reverse-cost
9. 5W1H (if unclear)
10. Vital few                 → which L1 outcomes stay in summaries
```

| Method | vs Default path first |
| --- | --- |
| Make-explicit | Write the edge; this method orders when to deepen it |
| Reversible decisions | Type H thin guards early OK; still not exception encyclopedia |
| Vital few | Chooses important Outputs; this method sequences path layers |
| Small-batch | Split cards; this method orders those cards by layer |
| Feedback loop | Signal early on L1; sample L2/L3 — not exception-first feedback |
| Outcome-first | L1 Goal is value; “add validation” alone is weak Goal |

---

## 7. Where it lands (no new artifacts)

| Behavior | Field / mechanism |
| --- | --- |
| Happy behaviors first | Desired outcome bullet order; Goal |
| Deferred rare | Non-goals / Out of scope; CAP gap “deferred” |
| Phase order | PLAN Approach (L1 phase before error phase) |
| Card order | TASKS Progress board / execution_order / Depends |
| Design body | Flows → validation → errors → optional rare |
| Thin guard | Constraints / Guardrails in Dev context; early card if Blocking |

Never create `## Default path first` or `HAPPY_PATH.md`.

---

## 8. Fail closed

Stop or rewrite when:

1. Approach / DETAIL leads with exception catalog and L1 flow is empty/TODO.  
2. First N coding cards are only validators/error middleware while L1 AC has
   no card.  
3. L1 AC cannot Verify without an unfinished rare-edge card (fake happy).  
4. Blocking security/money guard missing **and** no thin-early card scheduled
   (Feedback loop wins — still not full L4).  
5. Material Spec capability gaps deleted to “keep happy path simple” with no
   Non-goals / deferred row.  
6. Method-branded heading or `HAPPY_PATH.md` created.

---

## 9. Anti-patterns

| Anti-pattern | Why it fails | Do instead |
| --- | --- | --- |
| Exception-first design | Complexity before value | L1 flow + Verify first |
| Edge encyclopedia in DETAIL | Unreviewable; happy path buried | Main path; defer rare |
| Silent “errors later” | Production surprise | Name in Non-goals/gap/AC |
| Boil-the-ocean validation | No 201/demo | L1 success then L2 matrix |
| Layer-first inventory | “BE validation” before feature | Vertical L1 slice cards |
| Fake happy path | Not independently verifiable | Split or finish dependency |
| Equating with “skip QA” | Ships unsafe | Thin guards + L2/L3 in order |

---

## 10. Worked examples

### A. Orders API

**Bad Approach:** (1) all validation rules (2) every error code (3) idempotency
edge (4) maybe POST success.

**Good:** (1) POST 201 + id (L1) (2) 400 field map (L2) (3) 401 + upstream 502
mapping (L3) (4) idempotency keys → Non-goals or last card (L4).

### B. Search F10

**Bad:** DETAIL lists every tab/inactive/race/timeout before “search returns
rows.”

**Good:** Main flow + happy Example → empty BaseCd M-01 (L2) → timeout message
(L3) → exotic race → Non-goals.

### C. Thin early guard

**Bad:** Full audit/compliance matrix before login works.  
**Good:** L1 login session works; thin “must be authenticated” guard on L1;
full audit trail Non-goals or later phase.

### D. Make-explicit harmony

Spec quality finds “max upload size unknown.”  
**Name early:** CAP gap Blocking or Assumption.  
**Deepen late:** after L1 upload happy works, add L2 size reject card — or
Confirm-first then Non-goals if out of session.

---

## 11. Agent checklist

- [ ] Desired outcome / Goal leads with L1 consumer value  
- [ ] Material edges named (gap / Non-goals / stub AC) — not silent  
- [ ] Approach phases ordered L1→L2→L3→(L4)  
- [ ] TASK cards / execution_order follow that order  
- [ ] DETAIL/BASIC: main flows before error catalogs  
- [ ] L1 independently verifiable (no fake happy)  
- [ ] Thin early guards only where latency×risk demands  
- [ ] No `HAPPY_PATH.md` / no method-branded heading  

---

## 12. Kit author notes

- Install to `.agents/thinking/default-path-first.md`.  
- Keep Make-explicit as the “write edges” law; keep this as “order depth.”  
- Preamble: four-layer order + name-early/deepen-late + thin guards.  
- Do not invent a skill or happy-path artifact.
