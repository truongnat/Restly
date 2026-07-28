# Thinking methods

Session-wide ways of working — **not** report section titles. Never brand
headings or create method-named artifacts (`OUTCOME.md`, `IPO.md`,
`SMALL_BATCH.md`, `IMPLICIT.md`, `SSOT.md`, `FEEDBACK.md`, `HAPPY_PATH.md`,
`REVERSIBLE.md`, `AUTOMATE.md`, `HANDOFF.md`, `EVIDENCE.md`, `BOTTLENECK.md`,
`5W1H.md`, …).

Ops rules (short): `.agents/SKILL_PREAMBLE.md` → Thinking methods  
Policy summary: `.agents/AGENT_POLICY.md` → Thinking methods  
Source ops/policy: `docs/policy/SKILL_PREAMBLE.md`, `docs/policy/AGENT_POLICY.md`

## Framing order

```text
1. Outcome-first              → lock Output (WHO / WHAT / EVIDENCE)
2. Input → Process → Output   → bind Input + Process to that Output
3. Make implicit explicit     → classify & surface material implicits
4. Single Source of Truth     → cite canonical stores; no forks
5. Small-batch                → size completable units + coding Verify slots
6. Feedback loop              → modality + latency×risk (Example/See/Run/Spike)
7. Default path first         → L1 happy → L2 validation → L3 errors → L4 rare
8. Reversible decisions       → R/H/U ceremony by reverse-cost
9. Standardize before automate → manual → standard → template → automate
10. Design for handoff        → six-question successor test
11. Evidence over confidence  → claim only with recorded proof
12. Optimize bottleneck       → relieve the constraint stage first
13. 5W1H (if unclear)         → diagnose; fold into real sections
14. Vital few                 → prioritize in summaries / memory
```

## Methods in this folder

| Method | Normative file | Installed path |
| --- | --- | --- |
| **Outcome-first** | [outcome-first.md](./outcome-first.md) | `.agents/thinking/outcome-first.md` |
| **Input → Process → Output** | [input-process-output.md](./input-process-output.md) | `.agents/thinking/input-process-output.md` |
| **Make implicit explicit** | [make-implicit-explicit.md](./make-implicit-explicit.md) | `.agents/thinking/make-implicit-explicit.md` |
| **Single Source of Truth** | [single-source-of-truth.md](./single-source-of-truth.md) | `.agents/thinking/single-source-of-truth.md` |
| **Small-batch** | [small-batch.md](./small-batch.md) | `.agents/thinking/small-batch.md` |
| **Feedback loop** | [feedback-loop.md](./feedback-loop.md) | `.agents/thinking/feedback-loop.md` |
| **Default path first** | [default-path-first.md](./default-path-first.md) | `.agents/thinking/default-path-first.md` |
| **Reversible decisions** | [reversible-decisions.md](./reversible-decisions.md) | `.agents/thinking/reversible-decisions.md` |
| **Standardize before automate** | [standardize-before-automate.md](./standardize-before-automate.md) | `.agents/thinking/standardize-before-automate.md` |
| **Design for handoff** | [design-for-handoff.md](./design-for-handoff.md) | `.agents/thinking/design-for-handoff.md` |
| **Evidence over confidence** | [evidence-over-confidence.md](./evidence-over-confidence.md) | `.agents/thinking/evidence-over-confidence.md` |
| **Optimize bottleneck** | [optimize-bottleneck.md](./optimize-bottleneck.md) | `.agents/thinking/optimize-bottleneck.md` |

Vital few and 5W1H are fully specified in policy/preamble today (short methods).
When a method needs staff-engineer detail, add a file here and link it from
preamble + this index — do **not** invent a separate skill.

**Evidence over confidence** = claim works/done/Ready only with recorded proof
(test, screenshot, log, API, metrics, link, confirmed checklist) — no
`EVIDENCE.md`. **Optimize bottleneck** = relieve the constraint stage
(requirements / coding / review / deploy / decision-wait) before polishing
everything — no `BOTTLENECK.md`. **Design for handoff** = six-question
successor test on existing Handoff/Dev context/PR/memory. Readable writing =
first-pass prose. Coding-card hard size stays in planning step-03 §B–§C.
Confirm-first in `SKILL_PREAMBLE.md`.
