# Optimize bottleneck (Thinking method)

> **Status:** Session-wide thinking method (same class as **Outcome-first**,
> **Input→Process→Output**, **Make-implicit-explicit**, **Single Source of
> Truth**, **Small-batch**, **Feedback loop**, **Default path first**,
> **Reversible decisions**, **Standardize before automate**, **Design for
> handoff**, **Evidence over confidence**, **vital few**, and **5W1H**).  
> **Not** a report section title. **Not** a separate skill. **Not** a new
> artifact (`BOTTLENECK.md` / `TOC.md` / `CONSTRAINT.md` are forbidden).  
> Fold results into Issue triage, Approach focus, Non-goals, PLAN risks,
> WHAT_NEXT / Handoff next, memory pointers, review of process complaints.  
> Installed path: `.agents/thinking/optimize-bottleneck.md`  
> Source: `docs/thinking/optimize-bottleneck.md`.  
> Short ops rules: `.agents/SKILL_PREAMBLE.md` → Thinking methods.  
> Policy summary: `.agents/AGENT_POLICY.md` → Thinking methods.  
> **Vital few** owns which *facts/risks* matter in a summary. **Small-batch**
> owns unit size. **This file** owns which **process stage** is the constraint
> — do not polish everything at once.

Agents must treat this file as **normative** when choosing where to spend
improvement energy (session, Path, tooling, or flow). Fixing the wrong stage
feels busy and changes little.

---

## 1. Purpose

Do **not** optimize the whole system at once. Find the **largest bottleneck**,
then relieve it.

Ask where work is actually stuck:

| Stage | Bottleneck looks like |
| --- | --- |
| **Requirements** | Unclear Goal; Blocking unknowns; Doc reality loops; rework from dual-read |
| **Coding** | Mega-batches; missing Dev context; slow local Verify; wrong Path depth |
| **Review** | Queue wait; vague PRs; missing evidence; re-review churn |
| **Deployment** | Manual release pain; env gaps; no rollback; brittle pipeline |
| **Waiting on decisions** | Type H without Owner; Confirm-first backlog; silent stalls |

**Core claim:** Relieving the true constraint beats ten small optimizations
elsewhere. Local speed-ups upstream of a blocked gate often create inventory,
not throughput.

---

## 2. Division of labor

| Method / mechanism | Owns |
| --- | --- |
| **Vital few** | Sparse *content* in summaries/memory |
| **Small-batch** | Completable *unit* size inside a stage |
| **Feedback loop** | Faster *signal* inside/near the constraint |
| **Reversible decisions** | Ceremony cost of Type H — often the “waiting” bottleneck |
| **Standardize before automate** | Don’t automate a non-bottleneck messy process |
| **Evidence over confidence** | Don’t “fix” review by claiming green without proof |
| **Optimize bottleneck** | *Which stage* to improve first |

```text
Vital few = which facts matter?
Optimize bottleneck = which stage is stuck?
```

---

## 3. Definitions

| Term | Meaning |
| --- | --- |
| **Bottleneck / constraint** | Stage whose capacity limits end-to-end progress most |
| **Local optimum** | Faster non-constraint stage that does not raise throughput |
| **Inventory** | Finished work waiting on the constraint (PRs, half-specs, unreviewed cards) |
| **Decision wait** | Progress blocked on Owner/Confirm/Type H — still a bottleneck |
| **Multi-optimize** | Parallel “improve everything” programs — usually fail closed |

---

## 4. How to find it (lightweight)

1. **Name the flow** for this session or team: requirements → design → code →
   review → deploy (adapt labels to reality).  
2. **Where does work pile up?** Longest queue / most idle waiting / most
   rework loops.  
3. **One bottleneck hypothesis** — write it in Risks / Approach / Handoff
   (one line).  
4. **Relieve that stage** with the smallest useful change (Feedback loop /
   Small-batch / Confirm-first / Path / checklist).  
5. **Re-measure** — if another stage is now worst, switch; do not keep
   polishing the old one by habit.

Evidence for the hypothesis can be: cycle time, count of blocked cards,
rewrites of Goal, PR wait days, deploy failures — not vibes alone
(Evidence over confidence).

---

## 5. Where it lands (no new artifacts)

| Behavior | Field / mechanism |
| --- | --- |
| Session stuck | Issue triage / Status `blocked` + Owner; Confirm-first |
| Plan focus | Approach phases attack the constraint; Non-goals defer non-constraint polish |
| Path choice | Quick when coding isn’t the issue and Type H isn’t needed |
| Tooling urge | Only automate/check the bottleneck stage (Standardize before automate) |
| Handoff / WHAT_NEXT | Next action relieves constraint — not “also refactor X” |
| Memory | Note recurring constraint if durable (Vital few) |

**Do not** invent `BOTTLENECK.md`. One line in Risks/Approach beats a essay.

---

## 6. Stage gates

### Discovery / clarification

| If bottleneck is… | Do |
| --- | --- |
| Requirements | Outcome-first + Make-explicit + Confirm-first before more docs |
| Decision wait | Owner + timebox; Type R try-and-measure when safe |

### Design / planning

| If bottleneck is… | Do |
| --- | --- |
| Coding later | Dev context + small cards + Verify slots — not more architecture essays |
| Review later | Design for handoff Q1–Q6 into PLAN/PR shape early |

### Execution

| If bottleneck is… | Do |
| --- | --- |
| Coding | Small-batch + Feedback loop on L1; don’t dig L4 rare |
| Waiting | Surface blocked Owner; do not invent Type H |

### Review / Done / tooling

| If bottleneck is… | Do |
| --- | --- |
| Review | Evidence over confidence + clear PR; don’t add review bots without checklist |
| Deploy | Fix release/rollback path before micro-optimizing handlers |
| “Optimize everything” | Refuse — pick one constraint |

---

## 7. Framing order

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
10. Design for handoff
11. Evidence over confidence
12. Optimize bottleneck        → relieve the constraint stage first
13. 5W1H (if unclear)
14. Vital few
```

| Method | vs Optimize bottleneck |
| --- | --- |
| Vital few | Content priority; this method *stage* priority |
| Small-batch | Size inside a stage; this method *which* stage |
| Feedback loop | Faster signal; aim it at the constraint |
| Standardize before automate | Automate constraint checklists — not hobby stages |
| Default path first | Depth order inside coding; bottleneck may be outside coding |
| Reversible decisions | Decision-wait often *is* the bottleneck |

---

## 8. Fail closed

1. “Optimize everything” / parallel micro-improvements with no constraint named.  
2. Speeding a non-constraint while cards/PRs pile at the real gate.  
3. New CI/bot/skill for a stage that is not the bottleneck (and no checklist).  
4. Ignoring decision-wait — treating only code speed as “performance.”  
5. `BOTTLENECK.md` / method-branded `## Optimize bottleneck` created.  
6. Claiming the bottleneck moved with no evidence (Evidence over confidence).

---

## 9. Anti-patterns

| Anti-pattern | Why it fails | Do instead |
| --- | --- | --- |
| Premature micro-opt | Local optimum | Name constraint stage first |
| More process everywhere | Slows non-gates | Ceremony only where stuck |
| Automate the easy stage | Accelerated irrelevance | Ladder on the bottleneck |
| Ignore Owner waits | Fake “coding problem” | Confirm-first / Type R |
| Refactor while Goal fuzzy | Requirements bottleneck | Outcome-first first |
| Ten Non-goals as “focus” | Noise | One constraint hypothesis |

---

## 10. Worked examples

### A. Requirements bottleneck

**Bad:** Scaffold CI + lint bots while Goal is activity-only.  
**Good:** Lock WHO/WHAT/EVIDENCE; Confirm Blocking Doc reality; defer bots.

### B. Review bottleneck

**Bad:** Agents produce more PRs faster.  
**Good:** PR Verification + six-question handoff; one clear reviewer focus;
stop opening PR #5 until #3 moves.

### C. Decision-wait bottleneck

**Bad:** Build both auth options “to save time.”  
**Good:** Type H → Owner + Spike timebox; or Path upgrade — don’t dual-build.

### D. Coding bottleneck

**Bad:** Rewrite unrelated modules for “cleanliness.”  
**Good:** Small-batch L1 cards + per-card Verify; cut L4 rare from this Path.

---

## 11. Agent checklist

- [ ] Named constraint stage (one hypothesis) before process/tooling changes  
- [ ] Next action / Approach attacks that stage  
- [ ] Non-constraint polish deferred (Non-goals / later Path)  
- [ ] Decision-wait considered as a real bottleneck  
- [ ] Automation aimed at constraint + has checklist  
- [ ] Re-check after relief — don’t habit-optimize the old stage  
- [ ] No `BOTTLENECK.md` / method-branded heading  
- [ ] Bottleneck claims have light evidence (queue, blocked count, rework)  

---

## 12. Kit author notes

- Install to `.agents/thinking/optimize-bottleneck.md`.  
- Keep Vital few as summary prioritization; do not merge the two methods.  
- WHAT_NEXT / Issue triage / Approach Non-goals are enough landing zones.  
- Cross-link Standardize before automate when agents propose new bots.
