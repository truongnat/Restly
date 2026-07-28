# Small-batch (Thinking method)

> **Status:** Session-wide thinking method (same class as **Outcome-first**,
> **Input→Process→Output**, **vital few**, and **5W1H**).  
> **Not** a report section title. **Not** a separate skill. **Not** a new
> artifact (`SMALL_BATCH.md` / `BATCH.md` are forbidden).  
> Fold results into existing fields — Approach phases, TASK cards, Step ledger,
> execution Verify rhythm.  
> Installed path: `.agents/thinking/small-batch.md`  
> Source: `docs/thinking/small-batch.md`.  
> Short ops rules: `.agents/SKILL_PREAMBLE.md` → Thinking methods.  
> Policy summary: `.agents/AGENT_POLICY.md` → Thinking methods.  
> Coding-card **hard size rules** remain authoritative in
> `planning/steps/step-03-fill-tasks.md` §B–§C — this file explains *why*,
> *when*, and how small-batch applies **beyond** planning cards.  
> **Feedback modality + latency×risk** (example / preview / spike / when a
> signal must arrive) live in `.agents/thinking/feedback-loop.md` — this file
> owns **unit size** and **coding per-card Verify rhythm**.

Agents must treat this file as **normative** for batch sizing and coding
feedback rhythm. If a batch cannot be completed and verified independently,
**split or stop** — do not “push through” and verify later as a pile.
For *which* signal to use in discovery/UI/product (Example/See/Spike), read
Feedback loop — do not pretend card splits alone are enough.

---

## 1. Purpose

Smooth work is not “do a lot once.” Smooth work is:

```text
small step → complete → check → continue
```

A **batch** is the smallest unit of work that still has:

1. **One goal** — a single intent (not an epic disguised as a step)
2. **One output** — an observable result (Outcome-first / IPO Output)
3. **Independent verification** — can be checked without unfinished later batches
4. **Short feedback latency** — signal of right/wrong arrives before the next
   batch compounds error

Without small-batch:

| Failure mode | What happens |
| --- | --- |
| **Mega-batch** | One PR/card owns many endpoints/screens; feedback arrives days late |
| **Fake-small** | Many tiny steps with no AC/Verify — ceremony without signal |
| **Deferred verify** | Code five cards, test once — defects attributed to the wrong batch |
| **Coupled splits** | Split so fine that no batch is independently checkable |

**Core claim:** Prefer more batches that each earn a green Verify over fewer
batches that only “look done.”

---

## 2. Definitions (use these words precisely)

| Term | Meaning in this kit | Lives in |
| --- | --- | --- |
| **Batch** | A completable unit with goal + output + verify | Approach phase, TASK card, skill step, Quick pack |
| **Mega-batch** | Unit too large to verify usefully before continuing | Epic card, “BE Search”, multi-screen card |
| **Fake-small** | Tiny activity slices without falsifiable Output | Work items without AC; “cleanup” cards |
| **Feedback latency** | Time/work between change and evidence of correctness | Card Verify; see also Feedback loop modalities |
| **Independently verifiable** | Verify can pass/fail using only this batch’s Output (+ locked Input) | Card Verify line; phase deliverable |
| **Feedback loop (rhythm)** | complete → check → adjust before next **coding** batch | Execution Progress protocol; Step ledger |

> Broader lifecycle signals (Example/See/Spike, latency×risk) = Thinking method
> **Feedback loop** (`.agents/thinking/feedback-loop.md`). Here “feedback loop”
> means the per-batch coding rhythm only.
| **Batch ceiling** | Max size allowed on this Path | Quick: 1–3 cards; Full: Task size §B |

**Hard rule:** A batch that cannot state its Output (Outcome-first) and Verify
is **not** a valid small batch — it is either mega-batch or fake-small.

---

## 3. The four-property test (mandatory)

Every batch (phase, card, Quick pack, skill step) must pass:

| # | Property | Pass looks like | Fail looks like |
| --- | --- | --- | --- |
| 1 | **One goal** | Title/intent names one unit | “Implement search + export + print” |
| 2 | **One output** | AC / phase deliverable is observable | “Work finished” / “wired up” |
| 3 | **Independent verify** | Verify runnable now for this Output | “Will test after whole feature” |
| 4 | **Short feedback** | Evidence expected within this batch’s execution | Days of coding before first check |

If any property fails → **split**, **resequence**, or **Confirm-first** (if the
split depends on an unknown).

### Independence nuance

“Independent” does **not** mean “zero dependencies.” It means:

- Dependencies are **already done** (or mocked with explicit, locked Input), and
- Verify does not require a **later** batch’s Output to interpret success.

```text
OK:   T-002 Depends: T-001 (done); Verify calls API T-001 already shipped
BAD:  T-002 AC needs UI from T-005 which is still todo — not independently verifiable
```

---

## 4. Relationship to other Thinking methods

```text
1. Outcome-first              → lock session/card Output
2. Input → Process → Output   → bind Input + Process to that Output
3. Make implicit explicit     → classify & surface material implicits in Input
4. Single Source of Truth     → cite canonical stores; no forks
5. Small-batch                → slice Process into completable, verifiable batches
6. Feedback loop              → modality + latency×risk for each signal
7. Default path first         → order cards/phases L1→L2→L3→L4
8. 5W1H (if unclear)          → diagnose; fold into real sections
9. Vital few                  → prioritize in summaries / memory
```

| Method | Question | Small-batch role |
| --- | --- | --- |
| Outcome-first | What does done look like? | Each batch Output is a **slice** of session Output |
| IPO | Input ready? Process coherent? | Process is a **sequence of batches**, not one blob |
| Make-explicit | What was only understood? | Clarify Input before cutting seams |
| SSOT | Where is official truth updated? | Trace/Source cite stores — don’t fork requirements onto every card |
| Small-batch | Is this unit completable + checkable now? | Sizing + coding Verify rhythm |
| Feedback loop | Which signal, how soon? | Fills Verify modality; early Example/See/Spike outside card size |
| Default path first | Which path layer next? | Sequence batches: happy before rare-edge encyclopedia |
| Vital few | What still matters? | Do not keep mega-batches “because they’re important” — split them |
| 5W1H | Why is sizing unclear? | Use when split boundaries are ambiguous |

**Anti-pattern:** Outcome-first Goal is excellent, IPO is filled, but Approach
is one phase “implement everything” — small-batch failed. Also anti-pattern:
splitting 40 cards on an unconfirmed High-impact assumption — Make-explicit
first (`.agents/thinking/make-implicit-explicit.md`). Also: perfect card splits
with only abstract ACs and no Example/See when risk is high — Feedback loop
failed (`.agents/thinking/feedback-loop.md`).

---

## 5. Batch levels in this kit (progressive disclosure)

Small-batch applies at **multiple altitudes**. Do not confuse them.

### Level A — Skill step (meta)

Step ledger: finish step-N (or `blocked`) before treating step-N+1 as done.
This is already enforced. Small-batch here means: **do not skip ledgers** to
“save time.”

### Level B — PLAN Approach phase

Each Approach phase must name a **checkable deliverable** (IPO Process slice).
Small-batch adds: a phase that cannot be evidenced before the next phase is
too large — split phases.

```text
BAD:  1. Backend  2. Frontend  3. Tests
GOOD: 1. POST /orders 201 contract green
      2. 400 problem+json field map green
      3. FE shows field errors on 400
      4. Automated tests for 1–2 after code exists
```

### Level C — TASK card (primary coding batch)

Authoritative mechanical rules: `step-03-fill-tasks.md` §B Task size + §C
Card specificity. This Thinking method does **not** replace those rules; it
requires agents to **obey them as small-batch law** for Full/Lite planning.

Summary of spirit (full text in step-03):

- Prefer **more smaller cards**; 15–40+ cards on large features is normal.
- Fail: ≥3 inventory rows in one card; multiple endpoints/screens; layer-only
  titles; AC “works”; Verify with ≥4 unrelated checkpoints.

### Level D — Work item inside a card

Work items are **micro-steps inside a batch**, not separate session Outcomes.
They should still be concrete, but card AC remains the Output that Verify
checks. Do not promote every Work item to its own card unless Task size fails.

### Level E — Quick path ceiling

Path=Quick ⇒ **1–3 cards** total. That ceiling **is** the small-batch budget.
If the ask needs more independently verifiable Outputs → upgrade Path.

---

## 6. Feedback rhythm (execution — mandatory mindset)

Planning creates batches; **execution** must honor their feedback loops.

### Per-card loop (canonical)

```text
start card → do Work items → run THIS card’s Verify → mark done/blocked
→ only then start a dependent next card
```

Already reflected in `execution` Progress protocol. Small-batch forbids:

| Forbidden | Why |
| --- | --- |
| Implement T-001…T-005, then run all Verifies | Feedback latency; blame ambiguity |
| Mark Status=`done` before Verify | Fake completion |
| Skip Verify “to go faster” without Status=`skipped`/`blocked` + risk | Hidden mega-batch |
| Broaden card scope mid-flight to absorb the next card | Silent mega-batch |

### When Verify is expensive

Still run the **narrowest** check that falsifies this card’s AC (one test
filter, one curl, one UI path). Defer suite-wide runs to a later test card if
TASKS ordered it that way — but do **not** skip the card-local Verify.

### Partial completion

If Work items are half done: Status=`in_progress` or `blocked`, never `done`.
Handoff must list remaining IDs. That preserves batch integrity for the next
agent.

---

## 7. Where Small-batch lands (artifact map)

Do **not** create `## Small-batch` headings or `SMALL_BATCH.md`.

| Artifact / skill | How small-batch appears |
| --- | --- |
| `DISCUSSION` | Prefer scoped options; avoid “boil ocean” recommendations |
| `PLAN` Approach | Phases = batches with checkable deliverables |
| `PLAN` Task index | Draft may be coarse; step-03 must explode to micro-cards |
| `TASKS` inventory/cards | §B/§C size + AC/Verify independence |
| `QUICK.md` | 1–3 card ceiling; upgrade if more Outputs needed |
| `execution` | Per-card Verify before dependent next; progress truth |
| Step ledger | Complete/blocked before advancing |
| `review` / `done` | Evidence per DoD/AC — not “many files changed” |

---

## 8. Sizing heuristics (judgment — complements hard §B rules)

Use these when inventing splits (inventory) or reviewing Approach:

### Split when

- Two Verifies would disagree about “done” (different endpoints, screens, ops)
- A reviewer cannot name what failed without reading the whole epic
- Export vs Print, async vs sync, or child screens differ in failure modes
- You catch yourself saying “after the whole thing works we can test”

### Do not split when

- The slice cannot be verified without the twin slice **and** both fit §B
  (rare — prefer explicit Depends + order over fake independence)
- You would create cards with no Trace/AC (fake-small)
- The only difference is file churn with the same AC (merge twins)

### Batch vs vital few

Vital few decides **which** Outputs matter in summaries. Small-batch decides
**how big** each implementation unit is. An important Output still gets split
into many cards if §B fails.

---

## 9. Path-specific rules

### Quick

- Ceiling: 1–3 cards; each with AC + Verify.
- If Outcome-first rewrite implies >3 independently verifiable Outputs →
  upgrade to Lite/Full.
- Still run Verify per card (even if all cards are tiny).

### Lite

- Inventory may be 1–3 rows; cards still need independent AC/Verify.
- Approach should be a few phases, each checkable.

### Full

- Expect large card counts; that is success, not failure.
- Step-03 §B/§C are fail-closed for Ready.
- Spec quality / Confirm-first may force splits when capability gaps imply
  separate Outputs.

---

## 10. Gates (fail closed)

### Gate S1 — Planning Ready

Ready=No when:

1. Any implement card fails Task size / Card specificity (§B/§C), or
2. Approach phases lack checkable deliverables (mega-phase), or
3. Card AC cannot be falsified by its Verify (fake-small / Outcome-first fail).

### Gate S2 — Execution

Do not start card N+1 that **Depends** on N while N is not `done` (unless
explicitly parallel and independent — then Depends should be `none`).

Do not mark `done` without card Verify pass (or documented skip with risk).

### Gate S3 — Review / Done

Prefer evidence organized **by card/DoD item**. A single “ran the suite”
line covering five cards is weaker than per-AC evidence — call out gaps.

---

## 11. Anti-patterns (deep)

### A. Epic card

```text
BAD:  T-001 BE Search (JOIN + map + over-max + DI + 4 endpoints)
GOOD: inventory split → one card per endpoint / query concern / DI
```

### B. Layer epithet

```text
BAD:  T-003 FE UI
GOOD: T-003 FBD08001 search form fields BaseCd + F3 bind
```

### C. Verify debt

```text
BAD:  Implement T-001..T-004; “test at the end”
GOOD: each card Verify on completion; suite card later if planned
```

### D. Fake-small checklist

```text
BAD:  20 cards titled “touch file X” with AC: done
GOOD: cards whose AC a stranger can falsify
```

### E. Coupled premature split

```text
BAD:  T-001 returns DTO; T-002 maps DTO; neither Verifyable alone,
      and order unclear
GOOD: one card “Search response mapping for §8” OR clear Depends +
      Verify on T-002 only if T-001 AC is a contract test green
```

### F. Method branding

```text
BAD:  ## Small-batch
      ## Executive summary (small-batch)
GOOD: Approach phases / TASK cards / execution Verify (apply silently)
```

### G. Confusing small-batch with Quick path

```text
BAD:  “Everything must be Quick”
GOOD: Quick when ≤3 clear cards; Full may have 40 small cards
```

---

## 12. Worked examples

### Example 1 — Feature Approach (before cards)

**Session Output:** FE can create order and show field errors on 400.

| Phase (batch) | Output slice | Verify idea |
| --- | --- | --- |
| P1 | `POST /orders` 201 + id | Contract test |
| P2 | 400 + field error map | Contract test |
| P3 | FE maps errors to controls | UI/manual or component test |
| P4 | Automated tests for P1–P2 | `dotnet test --filter Orders` |

### Example 2 — Respecting §B

**Design:** 6 child screens.

```text
BAD:  one card “all child screens”
GOOD: ≥6 cards (or shell + 6 config cards) — small-batch + inventory count check
```

### Example 3 — Execution rhythm

```text
T-001 done (Verify pass) → T-002 in_progress → Work items checked off
→ T-002 Verify pass → done → T-003 …
```

Not: code T-001–T-003 uncommitted in mind, then “run everything.”

### Example 4 — Quick ceiling

**Ask:** null-guard `parseDate("")`.

```text
Batch: 1 card — AC parseDate("") === null; Verify pnpm test -- date
```

If ask expands to timezone overhaul + caller migrations → not Quick.

---

## 13. Agent checklist (reasoning only — not a report section)

When writing Approach / TASKS:

- [ ] Each phase/card has one goal + Outcome-first Output + falsifiable Verify
- [ ] Cards pass step-03 §B/§C (Full/Lite)
- [ ] No mega-batch layer epithets; no fake-small without AC
- [ ] Depends/order preserve independent verify where claimed
- [ ] Quick stays ≤3 cards or Path upgraded
- [ ] High rewind-cost items have Feedback-loop modality (Example/See/Spike)
      scheduled or done — `.agents/thinking/feedback-loop.md`

When executing:

- [ ] Dev context loaded (Input)
- [ ] Verify **this** card before dependent next
- [ ] Status/progress match truth; no done-without-Verify
- [ ] Evidence recorded per card/DoD
- [ ] Verify Run falsifies **this** AC (not green noise)

When reviewing:

- [ ] Findings can point at a batch (card/phase), not only “the PR”

---

## 14. Maintenance notes for kit authors

- Keep hard size mechanics in `step-03-fill-tasks.md`; keep *mindset +
  coding Verify rhythm + multi-level batches* here.
- Keep modality / latency×risk / discovery–UI–spike gates in
  `feedback-loop.md` (Hybrid C — do not merge files).
- Install to `.agents/thinking/small-batch.md`; link from preamble + this
  folder’s README.
- Do not invent a skill or `SMALL_BATCH.md` artifact.
- When adding related methods, compose in framing order; Feedback loop owns
  modalities — do not duplicate Task size tables into preamble.
- English kit form; thread prose follows `settings.language`.
