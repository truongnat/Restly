# Reversible decisions (Thinking method)

> **Status:** Session-wide thinking method (same class as **Outcome-first**,
> **Input→Process→Output**, **Make-implicit-explicit**, **Single Source of
> Truth**, **Small-batch**, **Feedback loop**, **Default path first**,
> **Standardize before automate**, **Design for handoff**, **vital few**, and
> **5W1H**).  
> **Not** a report section title. **Not** a separate skill. **Not** a new
> artifact (`REVERSIBLE.md` / `TYPE1.md` / decision log file beyond ADR rules).  
> Fold results into Issue triage (`Reversibility`), Clarification, Assumptions,
> Approach spikes, ADR (Type H only), Path selection.  
> Installed path: `.agents/thinking/reversible-decisions.md`  
> Source: `docs/thinking/reversible-decisions.md`.  
> Short ops rules: `.agents/SKILL_PREAMBLE.md` → Thinking methods.  
> Policy summary: `.agents/AGENT_POLICY.md` → Thinking methods.  
> **Confirm-first** stays the ask mechanism. **SSOT** owns where Type H
> decisions are recorded (ADR). **Feedback loop** owns Spike modality.  
> **Design for handoff** needs R/H/U + why visible to successors (Q2/Q5).  
> **This file** owns *how much ceremony* before locking a choice — by cost to
> reverse, not by treating every decision equally.

Agents must treat this file as **normative** when choosing speed vs rigor for
decisions. Do not spend the same analysis budget on renaming a module and on
locking a public API.

---

## 1. Purpose

Two speeds of decision-making:

| Class | Meaning | How to decide |
| --- | --- | --- |
| **R — Reversible** | Wrong choice is cheap to undo | Decide fast → try → measure (Feedback loop) |
| **H — Hard-to-reverse** | Wrong choice is expensive / slow / widely coupled | Analyze → options → Spike/POC → record why (ADR / Clarification) |
| **U — Unknown** | Reversibility not yet clear | Treat as **H** until proven **R** |

**Core claim:** Match ceremony to reverse-cost. Over-analyzing Type R wastes
time; rushing Type H locks debt.

### Examples (typical — host may differ)

| R (reversible) | H (hard-to-reverse) |
| --- | --- |
| UI library / theme tweak | Core DB schema / identity model |
| Layout / copy / naming | Authentication / authorization architecture |
| Small module internal structure | **Public** API contract (external consumers) |
| Local helper refactor | Large cloud / multi-region infra bet |
| Non-exported internal DTO | One-way data migration / destructive ops |

---

## 2. Division of labor

| Method | Owns |
| --- | --- |
| **Make-implicit-explicit** | Decision must be **written** (not silent); Severity / Blocking |
| **High-impact Assumption** | Risk if wrong *now* — orthogonal to reversibility |
| **Feedback loop** | Spike/Example/See modalities; latency×risk for *signals* |
| **SSOT** | Type H rationale lives in **ADR** (or linked Clarification → ADR) |
| **Default path first** | Path-layer depth order (happy→rare) — not reverse-cost |
| **Path Quick/Lite/Full** | Process shape; Quick forbids new Type H locks |
| **Reversible decisions** | Class R/H/U + ceremony table below |

```text
High-impact ≠ Hard-to-reverse
  High + R:  “wrong button label hurts UX” → Confirm/Example fast; no ADR
  High + H:  “wrong public auth model” → Spike + ADR + Owner
  Low  + H:  rare, but still H ceremony if truly one-way (e.g. drop column)
```

---

## 3. Definitions

| Term | Meaning |
| --- | --- |
| **Reverse-cost** | Effort/risk to undo after the choice ships (code, data, consumers, ops) |
| **Ceremony** | Analysis, options, POC, written rationale required before lock |
| **Lock** | Choice that others will treat as given (contract, schema, ADR, merged API) |
| **Try-and-measure** | Ship thin change + Verify/feedback without heavy design |
| **ADR** | Architecture Decision Record — SSOT for Type **H** technical locks |

---

## 4. Ceremony by class (mandatory)

### R — Reversible

| Do | Don’t |
| --- | --- |
| Pick a default; Confirm-first only if Blocking dual-read | Multi-page research / ADR |
| Prefer See/Example when UI/shape (Feedback) | Block Ready for taste-only debates |
| Verify after try | Pretend every rename needs stakeholder workshop |

### H — Hard-to-reverse

| Do | Don’t |
| --- | --- |
| ≥2 options (or “status quo”) with one-line trade-off | Silent pick in execution |
| Spike/POC when feasibility unknown (Feedback) — one written question | “We’ll migrate later” with no plan |
| Record **why** in ADR or Clarification Decision + ADR follow-up | Chat-only lock of public contract/schema |
| Owner for Blocking H | Path=Quick inventing new public API/auth/schema |

### U — Unknown

Treat as **H** until reverse-cost is evidenced as low (then reclassify **R**).

---

## 5. Heuristics (classify quickly)

Ask:

```text
If we are wrong, can we undo in ≤1–2 small cards
without breaking external consumers / stored data / auth?
```

| If… | Class |
| --- | --- |
| Yes | **R** |
| No (consumers, data one-way, security boundary, infra bet) | **H** |
| Unsure | **U** → **H** |

**Public vs internal:** unpublished / single-service internal shapes often **R**
until published; once external or cross-team → upgrade to **H**.

**Destructive ops** (drop data, force-push main, revoke keys): always **H** +
explicit confirmation — aligns with kit irreversible-destructive rules.

---

## 6. Stage gates

### Discovery / Issue triage

- Add **Reversibility** `R` / `H` / `U` on material decisions.  
- Type **R** Blocking: short Confirm/Example — do not stall on essays.  
- Type **H** Blocking: options + Owner; schedule Spike if needed before Recommend.

### Design / Planning

- Type **H** in scope → Approach includes Spike or “ADR draft” phase, or Ready
  stays blocked.  
- Type **R** → do not inflate DETAIL with option matrices.

### Execution

- Do **not** invent Type **H** locks (new public routes, schema, auth mode)
  without Clarification/ADR/spike evidence.  
- Type **R** changes: implement + Verify; note in card if useful.

### Docs / SSOT

- Type **H** technical choice → ADR (or docs ADR section) is canonical.  
- Type **R** → no ADR spam.

### Path

| Path | Rule |
| --- | --- |
| **Quick** | No new Type **H** locks; if discovered → upgrade Path |
| **Lite/Full** | Type **H** allowed with ceremony above |

---

## 7. Framing order

```text
1. Outcome-first
2. Input → Process → Output
3. Make implicit explicit     → surface Decision / Assumption
4. Single Source of Truth     → Type H → ADR home
5. Small-batch
6. Feedback loop              → Spike/Example for signals
7. Default path first
8. Reversible decisions       → R/H/U ceremony match
9. Standardize before automate → checklist before CI/bot
10. Design for handoff          → six-question successor test
11. Evidence over confidence    → claim only with recorded proof
12. Optimize bottleneck         → relieve the constraint stage first
13. 5W1H (if unclear)
14. Vital few
```

| Method | vs Reversible decisions |
| --- | --- |
| Feedback loop | *When/how* to get a signal; this method *how heavy* before lock |
| Make-explicit | Write the decision; this method sets rigor by reverse-cost |
| SSOT | Where Type H rationale lives (ADR) |
| Standardize before automate | Org CI/bot often Type H — still need checklist first |
| Design for handoff | Successor must see R/H/U + why (Q2/Q5) |
| Optimize bottleneck | Decision-wait often *is* the constraint |
| High-impact | Orthogonal axis — use both columns when needed |
| Path Quick | Process ceiling; this method forbids new H on Quick |

---

## 8. Where it lands (no new artifacts)

| Behavior | Field / mechanism |
| --- | --- |
| Class label | Issue triage `Reversibility` = `R` \| `H` \| `U` |
| Type R ask | Short Confirm-first / See / Example |
| Type H ask | Options table + Spike + Owner |
| Type H record | ADR (+ Clarification pointer) |
| Path guard | Quick → upgrade if H appears |
| Assumption | Risk High + Reversibility H → strongest Ready gate |

Never create `## Reversible decisions` or `REVERSIBLE.md`.

---

## 9. Fail closed

1. New public API / core schema / auth architecture locked in execution with no
   options/Spike/ADR (or explicit user accept recorded).  
2. Path=Quick introduces Type **H** without upgrade.  
3. Type **U** treated as **R** without evidence.  
4. ADR written for every Type **R** rename (noise — refuse).  
5. Type **H** Blocking left Open while Recommendation/Ready claims done.  
6. Material decision with no Reversibility when it drives Approach/TASKS.

---

## 10. Anti-patterns

| Anti-pattern | Why it fails | Do instead |
| --- | --- | --- |
| Analyze everything | Paralysis on Type R | Try-and-measure |
| Rush Type H | Lock wrong contract/schema | Spike + ADR |
| ADR spam | Dilutes SSOT | ADR for H only |
| Equate High-impact with H | Wrong ceremony | Two axes |
| Chat-only Type H | No canonical why | ADR / Clarification fold |
| Spike without question | Fake ceremony | Feedback-loop spike rule |

---

## 11. Worked examples

### A. Layout tweak (R)

ISS: card density. Reversibility=`R`. Ask method=`html` preview → pick →
implement. No ADR.

### B. Public orders API (H)

ISS: external POST /orders shape. Reversibility=`H`. Options A/B + Spike
consumer fixture → ADR “why problem+json” → then DETAIL. Not Quick.

### C. High-impact but R

ISS: empty-state copy. Severity High for UX. Reversibility=`R`. Example
confirm → ship. Not an ADR.

### D. Unknown → H

ISS: “Which queue for jobs?” Unclear migrate cost → `U` then `H` until spike
shows swap ≤1 card → may reclassify `R`.

---

## 12. Agent checklist

- [ ] Material decisions classified R / H / U on Issue triage  
- [ ] Ceremony matches class (fast vs options+Spike+ADR)  
- [ ] High-impact and Reversibility not conflated  
- [ ] Type H recorded in ADR or linked Clarification  
- [ ] Quick Path has no new Type H locks  
- [ ] No `REVERSIBLE.md` / no method-branded heading  
- [ ] Type R not blocked on essay research  

---

## 13. Kit author notes

- Install to `.agents/thinking/reversible-decisions.md`.  
- Keep Confirm-first ask taxonomy in preamble; keep ADR home in SSOT/docs.  
- Issue triage column is enough — do not invent a second decision board.
