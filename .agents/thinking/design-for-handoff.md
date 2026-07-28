# Design for handoff (Thinking method)

> **Status:** Session-wide thinking method (same class as **Outcome-first**,
> **Input→Process→Output**, **Make-implicit-explicit**, **Single Source of
> Truth**, **Small-batch**, **Feedback loop**, **Default path first**,
> **Reversible decisions**, **Standardize before automate**, **Evidence over
> confidence**, **Optimize bottleneck**, **vital few**, and **5W1H**).  
> **Not** a report section title. **Not** a separate skill. **Not** a new
> artifact (`HANDOFF.md` / `SIX_MONTH.md` are forbidden — use existing
> `## Handoff`, Developer overview, Dev context, DONE/PR/memory).  
> Fold results into Handoff sections, Next action, Dev context, Verify/DoD,
> Risks/Gaps, CODE_COMMENTS why, PR_DESCRIPTION, memory entry.  
> Installed path: `.agents/thinking/design-for-handoff.md`  
> Source: `docs/thinking/design-for-handoff.md`.  
> Short ops rules: `.agents/SKILL_PREAMBLE.md` → Thinking methods.  
> Policy summary: `.agents/AGENT_POLICY.md` → Thinking methods.  
> **Readable writing** owns first-pass clarity of prose. **Evidence over
> confidence** owns Q4 *results*. **This file** owns the **six-question
> handoff test** so a successor (or you in six months) can continue. Code that
> runs but nobody understands is not smooth.

Agents must treat this file as **normative** when finishing artifacts, cards,
PRs, or memory. Assume the next reader did **not** see the chat.

---

## 1. Purpose

Work so that **someone else** — or future you — can pick up without archaeology.

**Six-question test** — every material deliverable should answer:

| # | Question | Successor needs |
| --- | --- | --- |
| **Q1** | **What is this?** | Identity, scope, Goal / Title / Trace |
| **Q2** | **Why this way?** | Rationale, trade-off, Decision/ADR cite |
| **Q3** | **How do I run it?** | Commands, env, entry points, Dev context |
| **Q4** | **How do I check it?** | Verify / DoD / EVIDENCE |
| **Q5** | **What are the risks?** | Risks, Gaps, skipped checks, open Assumptions |
| **Q6** | **What’s next?** | Next skill, Owner, open IDs, deployment notes |

**Core claim:** Passing tests alone is insufficient if Q2/Q5/Q6 are missing.
Opaque green is still a failed handoff.

---

## 2. Division of labor

| Method / mechanism | Owns |
| --- | --- |
| **Readable writing** | Prose is scannable on first pass |
| **Outcome-first** | Q1 WHAT + Q4 EVIDENCE shape |
| **Make-implicit-explicit** | Q2/Q5 written (not silent) |
| **IPO** | Q3 Input enough to run Process |
| **SSOT** | Q2 cites canonical why (ADR), not chat folklore |
| **Small-batch** | Card-sized handoff units |
| **Feedback loop** | Q4 signal is real |
| **Vital few** | Memory/PR summary keeps only durable answers |
| **Design for handoff** | Six-question gate across artifacts |

```text
Readable writing = can they read it?
Design for handoff = can they continue from it?
```

---

## 3. Definitions

| Term | Meaning |
| --- | --- |
| **Successor** | Next agent, teammate, or future self without chat context |
| **Handoff pack** | Minimum set: artifact body + Handoff/Next + Verify + risks |
| **Opaque green** | Verify passed but Q1–Q6 unanswered for a human successor |
| **Chat-only context** | Answers that exist only in the thread — fail closed for material work |
| **Six-month test** | “Would I restart cold from these files alone?” |

---

## 4. Where each question lands (no new file)

| Q | Primary landing | Secondary |
| --- | --- | --- |
| Q1 What | Goal / Title / Executive summary / Trace | PR what-changed |
| Q2 Why | Clarification Decision; ADR (Type H); CODE_COMMENTS why; memory Decisions & why | Dev context Constraints |
| Q3 Run | Dev context; PLAN Verification commands; EXECUTION notes | README/runbook cite |
| Q4 Check | Card Verify; DoD; Outcome EVIDENCE | REVIEW verification table |
| Q5 Risks | Assumptions Risk; Gaps; REVIEW skipped/failed; Spec capability gaps | Handoff risks line |
| Q6 Next | `## Handoff`; Developer overview Next action; WHAT_NEXT | PR reviewer/QA focus |

**Do not** invent `HANDOFF.md`. Strengthen existing `## Handoff` and overview.

### Minimum Handoff section shape

When a template has `## Handoff`, fill enough that Q6 is real — and point at
Q4/Q5 if not elsewhere:

```markdown
## Handoff

- Next: `detail-design` / `planning` / `execution` / `review` / …
- Verify: _(command or “see card T-003 Verify”)_
- Risks / open: _(or none)_
- Why (if non-obvious): _(one line or “see Clarification ISS-002 / ADR”)_
```

Lite may compress to 2–3 bullets; empty “Next: TBD” fails.

---

## 5. Stage gates

### Discovery / design artifacts

| Gate | Rule |
| --- | --- |
| Recommendation / BASIC / DETAIL done | Handoff names next skill + blocking leftovers |
| Dual-read decisions | Q2 folded into Clarification (not only chat) |

### Planning / cards

| Gate | Rule |
| --- | --- |
| Dev context | Successor can start card without re-reading whole design (Q1/Q3/Q5 Gaps) |
| AC + Verify | Q4 falsifiable on **this** card |
| Flow/comment notes | Flag where Q2 belongs in code (CODE_COMMENTS) |

### Execution

| Gate | Rule |
| --- | --- |
| Card `done` | Verify evidence recorded (Q4); non-obvious why in comments if needed (Q2) |
| Blocked | Reason + next Owner (Q5/Q6) — not silent stall |

### Review / Done / PR

| Gate | Rule |
| --- | --- |
| PR_DESCRIPTION | Answers what / why / how verified / reviewer focus (Q1/Q2/Q4/Q6) |
| DONE handoff | Next + risks + verification honesty |
| Memory | Vital few of Q2/Q5/pointers — not changelog (Vital few) |

### build_context / multi-agent

Pack must remain successor-usable: paths, status, open blockers — not “see chat.”

---

## 6. Framing order

```text
1. Outcome-first
2. Input → Process → Output
3. Make implicit explicit
4. Single Source of Truth
5. Small-batch
6. Feedback loop
7. Default path first
8. Reversible decisions
9. Standardize before automate
10. Design for handoff          → six-question successor test
11. Evidence over confidence    → claim only with recorded proof
12. Optimize bottleneck         → relieve the constraint stage first
13. 5W1H (if unclear)
14. Vital few                   → compress durable handoff into memory
```

| Method | vs Design for handoff |
| --- | --- |
| Readable writing | Clarity of sentences; this method completeness of Q1–Q6 |
| Outcome-first | Supplies Q1/Q4 content |
| Make-explicit | Supplies Q2/Q5 content |
| SSOT | Q2/Q3 cite stores, not folklore |
| Evidence over confidence | Q4 needs a *result*, not only a named check |
| Vital few | Memory keeps sparse durable handoff |
| Standardize before automate | Stable templates make handoff repeatable |

---

## 7. Fail closed

1. Artifact marked ready/done with `## Handoff` empty or “TBD” only.  
2. Card `done` with no Verify evidence and no documented skip + risk (Q4/Q5).  
3. Material Decision only in chat — not Clarification/ADR (Q2 + SSOT).  
4. Dev context missing when code changes — successor cannot run (Q3).  
5. PR/DONE claims complete but skipped checks hidden (Q5).  
6. `HANDOFF.md` or method-branded `## Design for handoff` created.  
7. Opaque green: tests pass, no one can say why or what’s next.

---

## 8. Anti-patterns

| Anti-pattern | Why it fails | Do instead |
| --- | --- | --- |
| “See chat / see above” | Successor has no chat | Fold into Clarification / Handoff |
| Empty Handoff | No Q6 | Next skill + risks + verify pointer |
| File-list DONE | No Q1 value / Q2 | Outcome line + why |
| Verify without command | Fake Q4 | Concrete Run/See |
| Comment narrates “what” | No Q2 | Why/constraint (CODE_COMMENTS) |
| Memory = changelog | Noise | Vital few Q2/Q5/pointers |
| Mega-context dump | Unreadable | Six answers, short |

---

## 9. Worked examples

### A. BASIC_DESIGN handoff

**Bad:** `Next: detail-design`  
**Good:** Next `detail-design` for Item Admin API; Verify Doc reality row 2
accepted (code wins); Risk: OpenAPI stale until docs sync; Why: prefer existing
CommonPrint pipeline (Clarification).

### B. TASK card

**Bad:** AC “works”; no Dev context; Status done.  
**Good:** AC Given→Expect; Verify `dotnet test --filter OrdersCreate`; Dev
context with Sources + Gaps; comment on auth boundary why.

### C. PR

**Bad:** “Fixed stuff.”  
**Good:** What (orders 400 map); Why (align OpenAPI); Verify (filter tests +
screenshot); Reviewer focus (error JSON shape); Risks (none / …).

### D. Six-month self

Cold open: TASKS Progress + card Dev context + PLAN DoD + memory Decisions &
why → can continue without transcript. If not → handoff failed.

---

## 10. Agent checklist

- [ ] Q1–Q6 answerable from files alone (six-month test)  
- [ ] `## Handoff` / Next action concrete (not TBD)  
- [ ] Verify/DoD named (Q4)  
- [ ] Risks/Gaps/skipped honest (Q5)  
- [ ] Non-obvious why recorded (Q2) — Clarification, ADR, or code comment  
- [ ] Dev context present for code cards (Q3)  
- [ ] No chat-only material decisions  
- [ ] No `HANDOFF.md` / no method-branded heading  
- [ ] Memory/PR use Vital few — not full session paste  

---

## 11. Kit author notes

- Install to `.agents/thinking/design-for-handoff.md`.  
- Keep Readable writing in preamble; cross-link six-question test here.  
- Template comments on `## Handoff` beat new artifacts.  
- `ba-handoff` skill is a BA packaging mode — this method is session-wide.
