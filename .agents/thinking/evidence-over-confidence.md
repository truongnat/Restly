# Evidence over confidence (Thinking method)

> **Status:** Session-wide thinking method (same class as **Outcome-first**,
> **Input→Process→Output**, **Make-implicit-explicit**, **Single Source of
> Truth**, **Small-batch**, **Feedback loop**, **Default path first**,
> **Reversible decisions**, **Standardize before automate**, **Design for
> handoff**, **Optimize bottleneck**, **vital few**, and **5W1H**).  
> **Not** a report section title. **Not** a separate skill. **Not** a new
> artifact (`EVIDENCE.md` / `CONFIDENCE.md` are forbidden).  
> Fold results into Verify, DoD, EXECUTION verification, REVIEW coverage,
> DONE/PR Verification, investigation evidence, Spec/Doc reality tables.  
> Installed path: `.agents/thinking/evidence-over-confidence.md`  
> Source: `docs/thinking/evidence-over-confidence.md`.  
> Short ops rules: `.agents/SKILL_PREAMBLE.md` → Thinking methods.  
> Policy summary: `.agents/AGENT_POLICY.md` → Thinking methods.  
> **Outcome-first** owns naming EVIDENCE in Goal/AC. **Feedback loop** owns
> choosing a signal modality. **This file** owns the bar: **do not claim**
> works / done / Ready / fixed without recorded proof. Especially critical for
> AI agents — fluent confidence is not a run.

Agents must treat this file as **normative** when asserting status, Ready,
pass, safe, or root cause. Confidence without evidence fails closed.

---

## 1. Purpose

Prefer **proof** over **assurance**.

| Forbidden claim shape | Required shape |
| --- | --- |
| “Chắc là chạy rồi.” / “Should be fine.” | Named check + result |
| “Looks good.” | Screenshot / UI path checked |
| “Fixed.” | Reproduce → change → re-check with evidence |
| “Ready to merge.” | Verification table maps to DoD/AC |
| “Root cause is X.” | Observation IDs that support X; counter-evidence noted |

**Acceptable evidence kinds** (use what fits the claim):

| Kind | Example |
| --- | --- |
| **Test** | `dotnet test --filter OrdersCreate` — 3 passed, 0 failed |
| **Screenshot** | path or session attach showing the UI state |
| **Log** | relevant lines + timestamp / request id |
| **API response** | status + body snippet (redact secrets) |
| **Metrics** | before/after latency, error rate, count |
| **Link preview** | URL + what it proves (deployed page, ticket, CI run) |
| **Confirmed checklist** | named rows checked with date/Owner — not empty boxes |

**Core claim:** A confident sentence is not evidence. If it was not run /
observed / confirmed, do not assert it as fact.

---

## 2. Division of labor

| Method / mechanism | Owns |
| --- | --- |
| **Outcome-first** | What EVIDENCE *must exist* for Goal/AC |
| **Feedback loop** | *Which* modality gets a useful signal soonest |
| **Small-batch** | Verify *this* card before the next dependent |
| **SSOT** | Cite CI/ticket/canonical store — don’t invent a second truth |
| **Design for handoff** | Successor can see Q4 (how to check) + recorded result |
| **Make-implicit-explicit** | Skipped checks = written risk, not silent hope |
| **Evidence over confidence** | Claim ↔ proof binding; no confidence theatre |

```text
Outcome-first = what would prove success?
Feedback loop = how do we get a signal?
Evidence over confidence = did we actually get it before claiming?
```

---

## 3. Definitions

| Term | Meaning |
| --- | --- |
| **Claim** | Any assertion of works / done / Ready / safe / fixed / root cause |
| **Evidence** | Concrete, inspectable artifact of a check (command output, file, log, …) |
| **Confidence theatre** | Fluent language that implies proof without a check |
| **Opaque green** | Tests/noise green that does not address **this** AC (also handoff fail) |
| **Skipped with risk** | Honest non-run: Status `skipped`/`blocked` + risk — not “passed” |

---

## 4. Where it lands (no new artifacts)

| Claim site | Landing |
| --- | --- |
| Card done | Verify command + result in card / EXECUTION |
| Session Done | DONE Verification: passed / failed / skipped / not run |
| PR | PR_DESCRIPTION Verification — maps to DoD/AC |
| Review Ready | verification_reviewed + requirement_coverage evidence |
| Investigate | Evidence IDs; do not lock root cause without support |
| Doc reality | Doc evidence **and** code/runtime evidence columns |
| Chat status | Prefer “ran X → Y” over “should be fine” |

**Do not** invent `EVIDENCE.md`. Strengthen Verify / verification tables.

---

## 5. Stage gates

### Discovery / investigate

| Gate | Rule |
| --- | --- |
| Root cause | Requires supporting evidence IDs; else “likely” + gap |
| Doc reality | Verdict needs both doc cite and code/runtime cite when claimed |

### Design / planning

| Gate | Rule |
| --- | --- |
| AC / DoD | Name falsifiable Verify (Outcome-first EVIDENCE) |
| Spec findings | finding + evidence path + verdict — not essays |

### Execution

| Gate | Rule |
| --- | --- |
| Status=`done` | Verify ran for **this** AC; evidence recorded |
| Skip | Risk + `skipped`/`blocked` — never mark passed |

### Review / Done / PR

| Gate | Rule |
| --- | --- |
| Ready / Ready with risks | Evidence maps to DoD/AC; missing Verify → not Ready |
| Confidence field on findings | Secondary; **evidence** is primary |
| Agent self-report | Treat as claim until EXECUTION/REVIEW/DONE shows proof |

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
10. Design for handoff
11. Evidence over confidence   → claim only with recorded proof
12. Optimize bottleneck
13. 5W1H (if unclear)
14. Vital few
```

| Method | vs Evidence over confidence |
| --- | --- |
| Outcome-first | Shapes required EVIDENCE; this method enforces recording it |
| Feedback loop | Chooses signal; this method forbids claiming without it |
| Design for handoff | Q4 needs a check; this method needs the **result** |
| Vital few | Summaries keep strongest proof, not every log line |
| Investigate confidence | Score ≠ substitute for observation |

---

## 7. Fail closed

1. Status=`done` / Done / Ready with no Verify result (and no documented skip).  
2. “Should work” / “chắc chạy rồi” / “LGTM” as the only verification.  
3. Root cause locked with zero supporting evidence IDs.  
4. Failed or not-run check marked passed.  
5. Green suite that does not address this AC presented as proof.  
6. `EVIDENCE.md` / method-branded `## Evidence over confidence` created.  
7. Agent asserts merge-ready from reasoning alone — no run/see/confirm.

---

## 8. Anti-patterns

| Anti-pattern | Why it fails | Do instead |
| --- | --- | --- |
| Confidence as proof | AI/human fluency ≠ runtime | Run / See / confirm checklist |
| File-list as Done | Touched ≠ verified | Verification rows |
| “Tests exist” | Existence ≠ this change | Name filter + result |
| Screenshot without claim | Unrelated UI noise | Caption what it proves |
| Secret dump in logs | Unsafe “proof” | Redact; cite request id |
| Empty checklist | Theatre | Confirmed rows + Owner/date |
| Pre-existing fail as your fail | Wrong narrative | Label pre-existing + evidence |

---

## 9. Worked examples

### A. Card done

**Bad:** “Implemented OrdersCreate — should be fine.”  
**Good:** Verify `dotnet test --filter OrdersCreate` — 3 passed, 0 failed;
401 case logged in EXECUTION.

### B. PR

**Bad:** “Fixed validation.”  
**Good:** Verification: contract tests 201/400; screenshot of form error
banner; Risks: i18n strings not reviewed.

### C. Investigate

**Bad:** “Definitely a race in the cache.”  
**Good:** E-002 log shows stale ETag; E-003 repro 3/3; counter: single-node
OK — likely race; confirm with Spike under load.

### D. Agent chat

**Bad:** “I’ve updated the handler; you’re good to merge.”  
**Good:** “Ran filter tests — pass. Reviewer: check problem+json shape.
Skipped e2e — risk noted in DONE.”

---

## 10. Agent checklist

- [ ] Every works/done/Ready/fixed claim has named evidence  
- [ ] Verify result recorded (pass/fail/skipped + risk)  
- [ ] Evidence addresses **this** AC/DoD — not unrelated green  
- [ ] Root cause / Doc reality verdicts cite observations  
- [ ] No confidence-only language as verification  
- [ ] Secrets redacted in pasted evidence  
- [ ] No `EVIDENCE.md` / method-branded heading  
- [ ] PR/DONE Verification distinguishes passed / failed / skipped / not run  

---

## 11. Kit author notes

- Install to `.agents/thinking/evidence-over-confidence.md`.  
- Keep Outcome-first EVIDENCE axis; do not duplicate three-axis here.  
- execution / review / done already have verification fields — strengthen
  comments and fail-closed language; do not add parallel files.  
- Prefer linking this method next to “Never mark done if Verify skipped.”
