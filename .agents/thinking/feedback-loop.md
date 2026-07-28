# Feedback loop (Thinking method)

> **Status:** Session-wide thinking method (same class as **Outcome-first**,
> **Input→Process→Output**, **Make-implicit-explicit**, **Single Source of
> Truth**, **Small-batch**, **vital few**, and **5W1H**).  
> **Not** a report section title. **Not** a separate skill. **Not** a new
> artifact (`FEEDBACK.md` / `LOOP.md` are forbidden).  
> Fold results into existing fields — Desired outcome examples, Clarification,
> Spec quality, Approach spike phases, card `Verify`, Confirm-first Ask method,
> VISUAL_DECISION / diagrams when shape needs seeing.  
> Installed path: `.agents/thinking/feedback-loop.md`  
> Source: `docs/thinking/feedback-loop.md`.  
> Short ops rules: `.agents/SKILL_PREAMBLE.md` → Thinking methods.  
> Policy summary: `.agents/AGENT_POLICY.md` → Thinking methods.  
> **Sizing** units and coding per-card Verify rhythm remain authoritative in
> `.agents/thinking/small-batch.md` (+ planning step-03 §B/§C).  
> **This file** defines *when* a signal must arrive, *which modality* to use,
> and how to avoid fake-short or thrashing loops.  
> **Asking** still follows Confirm-first + Ask method in `SKILL_PREAMBLE.md`.

Agents must treat this file as **normative** when choosing how to get evidence
of right/wrong. Late feedback creates large drift. Short feedback on the
**wrong modality** (green tests on a misunderstood AC; “OK?” without an
example) also creates large drift.

---

## 1. Purpose

```text
do a little → get a signal → adjust → continue
```

Do **not** wait until the whole feature/design/doc is “done” to learn whether
the direction is right.

**Core claim:** Prefer the **shortest useful loop** whose signal strength
matches the risk of being wrong — not the shortest possible interrupt, and not
“test everything at the end.”

| Domain | Short useful loop (examples) |
| --- | --- |
| **Requirement** | Confirm with a **concrete example** (Given → Expect) before TASKS |
| **UI / layout** | Preview / diagram / `html` **before** polish or large UI cards |
| **Product / shape** | Spike or thin prototype **before** Full build / full DETAIL |
| **Coding** | Run **this card’s** Verify before a dependent next card (Small-batch) |
| **Docs↔code** | Doc reality + **visual** ask before design/fix body (SSOT) |

---

## 2. Division of labor (Hybrid C — do not blur)

| Method | Owns |
| --- | --- |
| **Small-batch** | *How big* is the unit? Four-property test; card ceilings; per-card coding Verify rhythm |
| **Feedback loop** | *How soon* must a signal arrive? *Which modality*? Latency × risk; stage gates |
| **Outcome-first** | *What* must the signal falsify (WHO / WHAT / EVIDENCE)? |
| **Confirm-first** | *How to ask* in chat (Ask method taxonomy) |
| **SSOT** | *Where* to write the answer after the signal (canonical store) |

```text
Small-batch creates the slot for a check.
Feedback loop chooses the signal for that slot (and earlier slots in discovery).
```

**Anti-pattern:** Duplicating Task size tables into this file.  
**Anti-pattern:** Treating Feedback loop as “another name for Small-batch.”

---

## 3. Definitions

| Term | Meaning |
| --- | --- |
| **Signal** | Evidence that the current belief is right or wrong (pass/fail, user choice, observed behavior) |
| **Modality** | Kind of signal: Run / See / Example / Spike / Ask / Compare |
| **Feedback latency** | Work/time between a change (or claim) and a usable signal |
| **Useful loop** | Latency short enough for the risk; signal strong enough to change the next action |
| **Fake-short loop** | Frequent activity with weak signal (trivia asks, unrelated tests, “LGTM”) |
| **Deferred loop** | Mega-work then one late check (UAT-only, “test after whole feature”) |
| **Thrashing** | Loops so short/noisy that direction flips without Owner/timebox |

---

## 4. Latency × risk (mandatory judgment)

```text
risk_of_wrong × cost_to_rewind  ↑  ⇒  required signal earlier + stronger
```

| If wrong would… | Typical minimum signal **before** continuing |
| --- | --- |
| Misread a business rule / dual AC | **Example** confirm (Given→Expect) + Clarification |
| Ship wrong API shape | **Example** payload + **Run** contract check / OpenAPI cite |
| Build wrong layout/flow | **See** (`diagram` / `html`) before polish |
| Prove unknown technical feasibility | **Spike** phase/card with its own Verify |
| Conflict docs↔code | **Compare** + visual Ask (SSOT Doc reality) |
| Local rename / obvious typo | Card-local **Run** may wait until end of **that** card |

**Not** every line needs a prototype. **Do** refuse to deepen PLAN/DETAIL/UI
cards while a high rewind-cost unknown has no early signal scheduled or done.

---

## 5. Modalities (choose explicitly)

| Modality | Signal | Prefer when | Kit landing |
| --- | --- | --- | --- |
| **Example** | Concrete Given → Expect (or sample payload/response) | Requirement ambiguity; dual-interpretation; AC too abstract | Clarification; Desired outcome bullets; AC examples; Ask `table`/`fact`/`diagram` |
| **See** | Diagram, preview, VISUAL_DECISION.html | Flow/boundary/UI/spatial multi-state | Confirm-first `diagram`/`html`; wireframe skills |
| **Run** | Test, curl, script, log assertion | Coding card; contract already agreed | Card `Verify`; PLAN Verification; execution evidence |
| **Spike** | Thin vertical slice or throwaway prototype answering **one** written question | Feasibility, unknown integration, “can we?” before Full | Approach phase or card; Path Quick/Lite spike; Out of scope for polish |
| **Ask** | User decision via Confirm-first | Blocking Owner decision | Clarification checkpoint |
| **Compare** | Doc claim vs code/runtime (often + See) | Spec/wiki cited; Doc reality Blocking | Doc reality table + visual (SSOT) |

### Modality rules

1. Pick **one primary modality** per Blocking signal need (can pair Compare+See).  
2. **Ask without Example/See** when the conflict is behavioral/spatial = often
   fake-short — upgrade modality (SSOT already requires visual for docs↔code
   shape conflicts).  
3. **Run** must falsify **this** AC/DoD item — unrelated green tests ≠ signal.  
4. **Spike** must state the question it answers; success ≠ “pretty demo.”  
5. After any signal that changes truth → fold into Clarification **and**
   canonical store (SSOT).

### Requirement: confirm by example (mandatory pattern)

When dual-interpretation or Blocking requirement clarity would change Output:

```text
BAD:  “Search should refresh correctly — OK?”
GOOD: Given baseCd=001, keyword=abc, tab=All, press F10
      Expect: all tabs reload; inactive rows included; N≥1 for fixture X
```

Land the example in Clarification / Desired outcome / AC. Later Verify **Run**
must be able to hit that same example (or an automated stand-in).

---

## 6. Stage gates (lifecycle)

Apply even before Small-batch cuts coding cards.

### Discovery (brainstorming / BA)

| Gate | Rule |
| --- | --- |
| Abstract AC only | Strengthen with ≥1 **Example** before Recommendation locks High-impact behavior |
| Blocking unknown | Confirm-first **now**; prefer Example/See over bare Yes/No when behavior/shape |
| Spec quality gap | Do not fill Scope as if gaps were decided |

### Design (basic / detail)

| Gate | Rule |
| --- | --- |
| Doc reality Blocking | Compare + **See** (SSOT); no design body until folded |
| UI/layout Blocking | **See** before detailing CSS/components polish |
| New contract surface | Example request/response or cite OpenAPI **before** field invention |

### Planning

| Gate | Rule |
| --- | --- |
| High rewind-cost unknown | Schedule **Spike** phase/card **or** Confirm-first — do not hide inside mega Approach |
| Every card | Verify line names a **Run** (or explicit UI check) that falsifies **this** AC |
| Verification strategy | Session-level signals for DoD — not “manual test somehow” |

### Execution

| Gate | Rule |
| --- | --- |
| Per card | **Run** this card’s Verify before dependent next (Small-batch owns rhythm) |
| Failed Verify | Adjust or `blocked` — do not open dependent cards |
| Missing rule/example | Gaps / Confirm-first — do not silent-fill |

### Review / Done

| Gate | Rule |
| --- | --- |
| Evidence | Map to DoD/AC examples — not “files touched” |
| Late surprise | Treat as process failure: which earlier gate skipped? |

---

## 7. Framing order

```text
1. Outcome-first              → lock Output (WHO / WHAT / EVIDENCE)
2. Input → Process → Output   → bind Input + Process to Output
3. Make implicit explicit     → classify & surface material implicits
4. Single Source of Truth
5. Small-batch                → size completable units + coding Verify slots
6. Feedback loop              → modality + latency×risk for each slot / stage
7. Default path first         → L1→L2→L3→L4 depth order
8. Reversible decisions       → R/H/U ceremony by reverse-cost
9. 5W1H (if still unclear)    → diagnose; fold into real sections
10. Vital few                 → summarize only what changes the outcome
```

**Early application:** Example / See / Compare gates in discovery and design
**before** step 5 finishes cutting all cards — do not wait for a full TASKS
inventory to confirm a Blocking requirement by example. Prefer a **happy**
Example first (Default path first); add validation/error examples as L2/L3.

| Method | vs Feedback loop |
| --- | --- |
| Small-batch | Size + coding rhythm; Feedback loop chooses signal quality/timing |
| Default path first | Order which path layer to signal/deepen first (L1 before rare) |
| Reversible decisions | How heavy before **lock**; Spike often serves Type H |
| Outcome-first | EVIDENCE names what Run/See must hit |
| Make-explicit | Surfaces *that* a signal is needed; Feedback loop picks *how* |
| Confirm-first | Transport for Ask / pairs with Example/See |
| SSOT | Fold signal into canonical truth |
| Vital few | Prevents thrashing on trivia loops |

---

## 8. Where it lands (no new artifacts)

| Behavior | Field / mechanism |
| --- | --- |
| Requirement example | Clarification; Desired outcome; AC Given/Expect; Ask `table`/`fact` |
| UI early preview | Confirm-first `diagram`/`html`; not Open questions dump |
| Spike before build | PLAN Approach phase or TASK with Trace “spike”; Verify answers one question |
| Coding signal | Card Verify + execution evidence (Small-batch) |
| Docs↔code | Doc reality + visual Ask + Clarification SoT (SSOT) |
| Latency note (optional) | Issue triage / Risks — “signal deferred past X = risk” |

Never create `## Feedback loop` headings or `FEEDBACK.md`.

---

## 9. Fail closed

Stop or block Ready / design body / `done` when:

1. High rewind-cost behavior is only abstract prose — no **Example** and no
   scheduled Confirm-first to get one.  
2. UI/layout Blocking continues into implementation without **See**.  
3. Doc reality Blocking without visual/compare ask (SSOT).  
4. Approach is one mega phase “build then test” with no intermediate signals.  
5. Card marked `done` without **Run** Verify evidence (or documented skip +
   risk) — Small-batch gate.  
6. Spike demo used as proof of contract/AC without stating the spike question.  
7. Chat signal never folded (SSOT / Clarification).

---

## 10. Anti-patterns

| Anti-pattern | Why it fails | Do instead |
| --- | --- | --- |
| Deferred loop (“test at the end”) | Drift compounds | Intermediate Example/See/Run/Spike |
| Fake-short (ask trivia / green noise) | No decision change | Stronger modality; Vital few |
| Bare “OK?” on requirements | Two readings survive | Given→Expect example |
| Polish UI before preview | Expensive aesthetic rewind | See first |
| Full DETAIL before feasibility spike | Ghost design | Spike phase with Verify |
| Thrashing on every comment | No Owner/timebox | Batch asks; Constraints timebox |
| Equating Feedback loop with card split only | Miss discovery/UI | Use stage gates above |
| Method-branded heading | Ceremony | Fold into real fields |

---

## 11. Worked examples

### A. Requirement — example before cards

**Bad:** AC “F10 refreshes search correctly” → eight cards → UAT fails on inactive tabs.

**Good:** Blocking dual-read → Ask method=`table` or `fact` with Given/Expect →
fold into Desired outcome + AC → cards’ Verify target that example → Run per
card (Small-batch).

### B. UI — see before polish

**Bad:** Implement full CSS grid from prose wire description → user rejects layout.

**Good:** `html-recommended` → VISUAL_DECISION / diagram → user picks → then UI
cards. Latency drops from “days of CSS” to “one preview turn.”

### C. Product — spike before Full

**Bad:** DETAIL_DESIGN for unknown vendor PDF API → three weeks → API cannot do X.

**Good:** Approach phase 0: spike “Can vendor API emit field Y?” Verify: sample
call log. Then Full detail only if Yes (or redesign).

### D. Coding — run per batch (Small-batch owns)

**Bad:** Five cards `done`, one test suite at end.

**Good:** Each card Verify; dependent next waits. Feedback loop only checks
that Verify modality is **Run** and matches AC example — sizing stays in
Small-batch.

### E. Fake-short

**Bad:** Ten Confirm-first Yes/No on non-blocking color prefs while API shape
unknown.

**Good:** One Example/Ask on API shape (Blocking); defer colors (Vital few).

---

## 12. Agent checklist

- [ ] For each Blocking / high rewind-cost item: modality chosen (Example/See/
      Run/Spike/Ask/Compare)  
- [ ] Requirement ambiguity → Given→Expect recorded (not only “confirmed”)  
- [ ] UI shape Blocking → See before polish / large UI Work items  
- [ ] Feasibility unknown → Spike with written question + Verify  
- [ ] Docs↔code Blocking → Compare + visual (SSOT)  
- [ ] Coding cards → per-card Run (Small-batch)  
- [ ] Signals folded into Clarification + canonical follow-up  
- [ ] No `FEEDBACK.md` / no `## Feedback loop` heading  
- [ ] Not thrashing: Blocking-only asks; ≤3 per round; Owner/timebox when needed  

---

## 13. Kit author notes

- Keep hybrid C: do **not** merge this file into Small-batch; cross-link both
  ways.  
- Install to `.agents/thinking/feedback-loop.md`.  
- Preamble stays short (latency×risk + modalities + stage pointer).  
- Confirm-first Ask taxonomy stays in `SKILL_PREAMBLE.md`.  
- Learning-domain “practice after concept” is out of scope for this agent kit.
