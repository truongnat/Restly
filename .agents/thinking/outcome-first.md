# Outcome-first (Thinking method)

> **Status:** Session-wide thinking method (same class as **vital few** and
> **5W1H**).  
> **Not** a report section title. **Not** a separate skill. **Not** a new
> artifact (`OUTCOME.md` is forbidden).  
> Fold results into existing fields: `Goal`, `Desired outcome`,
> `Definition of done`, task `AC` / `Verify`.  
> Installed path: `.agents/thinking/outcome-first.md`  
> Source: `docs/thinking/outcome-first.md`.  
> Short ops rules: `.agents/SKILL_PREAMBLE.md` → Thinking methods.  
> Policy summary: `.agents/AGENT_POLICY.md` → Thinking methods.

Agents must treat this file as **normative** when writing or reviewing Goal /
Desired outcome / DoD / AC. If this file conflicts with a vague habit
(“start from tasks”), this file wins.

---

## 1. Purpose

Outcome-first forces the session to name **the observable end state** before
listing work, layers, or implementation steps.

Without it, agents and humans default to **activity language**:

- “Write the API”
- “Refactor auth”
- “Fix the bug”
- “Add validation”

Those phrases describe **effort**, not **success**. Two people can “finish”
the same activity and deliver incompatible results. Downstream TASKS, review,
and `done` then check the wrong thing (files touched, PR opened) instead of
the user-visible or system-visible change.

**Outcome-first answers three questions before Approach / TASKS / code:**

1. **What** concrete result exists when we stop?
2. **Who** uses or depends on that result (persona, system, caller)?
3. **How** do we know we may stop (evidence / verify)?

If any answer is missing or only activity-shaped, **STOP** (Confirm-first) —
do not invent Scope, Approach, or cards to paper over it.

---

## 2. Definitions (use these words precisely)

| Term | Meaning in this kit | Lives in |
| --- | --- | --- |
| **Activity** | Work someone does (write, refactor, wire, implement) | Temporary notes only — never final Goal/AC |
| **Outcome** | Observable end state after the work | `Goal`, `Desired outcome`, DoD, AC |
| **Goal** | One-sentence outcome for the **session / path** | `DISCUSSION` / `PLAN` / `QUICK` |
| **Desired outcome** | Expanded “done looks like…” in observable terms | `DISCUSSION` (Lite/Full) |
| **Definition of done (DoD)** | Checklist that proves session Goal is met | `PLAN` |
| **AC (acceptance)** | Observable outcome for **one task card** | `TASKS` card |
| **Verify** | Concrete check that produces evidence for that AC | `TASKS` card / PLAN Verification |
| **Milestone / process outcome** | Repo hygiene (PR merged, docs filed) | May appear in DoD **in addition to**, never **instead of**, real outcome |
| **Non-goal** | Explicitly out of this session’s outcome | `PLAN` Non-goals / `QUICK` Out of scope |

**Hard rule:** A Goal that is only an activity is **invalid**, even if it is
one sentence.

---

## 3. The three-axis test (mandatory)

Every Goal / Desired outcome / DoD item / AC must be checkable on three axes.
Missing an axis = incomplete; treat as Blocking if it would change Scope or
Approach.

```text
WHO          → who receives or depends on the result
WHAT         → what observable change they get
EVIDENCE     → what proves we may stop
```

### Pass examples

| Statement | Who | What | Evidence |
| --- | --- | --- | --- |
| “Empty `parseDate("")` returns `null`; callers no longer throw; unit test covers it.” | Callers of `parseDate` | Null instead of throw | `pnpm test -- date` / assertion |
| “Screen FBD08001 Search returns rows for valid BaseCd; empty BaseCd shows message M-01.” | Operator on FBD08001 | Rows or M-01 | UI check + API sample |
| “Frontend can call `POST /orders` and render 4xx body from problem+json.” | FE order form | Error body displayed | Contract test + manual 400 |

### Fail examples (rewrite before continuing)

| Invalid | Why it fails | Rewrite direction |
| --- | --- | --- |
| “Write order API” | Activity; no who/evidence | Who calls it? Which statuses? How verified? |
| “Improve performance” | Not observable | Which endpoint? What latency/budget? Measured how? |
| “Align with architecture” | Filler / non-observable | Which invariant? Which file/contract proves it? |
| “PR approved” alone | Process milestone only | Pair with user/system observable change |
| “Works per spec” | Circular; no observation | Name the field, status, message, file, or metric |

---

## 4. Translation table (activity → outcome)

Use this when the user (or your first draft) speaks in activities.

| If someone says… | Ask / rewrite toward… |
| --- | --- |
| Write / implement X | After X exists, **who can do what** that they could not before? |
| Refactor Y | **Which behavior is unchanged**, and **which defect/risk is gone**, with what check? |
| Add validation | **Which inputs** are rejected/accepted, with **which message/code**? |
| Fix bug | **Reproduction stops**; state the failing input and the new observable result |
| Support Z | **Caller/system Z succeeds** under named conditions; name the contract |
| Clean up / improve DX | **Named command or workflow** becomes possible/faster; how measured? |
| “Make it production-ready” | Split into outcomes: auth, errors, observability, rollback — each observable |

**Algorithm for the agent:**

1. Take the user’s ask as a **draft activity**.
2. Rewrite into WHO + WHAT + EVIDENCE (one sentence Goal).
3. Expand into Desired outcome / DoD / AC as the path requires.
4. Only then derive Scope, Approach, inventory, and cards **from that outcome**.
5. If rewrite needs a product/domain choice → Confirm-first; do not guess.

---

## 5. Strength ladder (reject weak outcomes)

Prefer the strongest statement that is still true and in scope.

| Strength | Shape | Use? |
| --- | --- | --- |
| **S0 — Activity** | “Implement refresh token” | **Reject** as Goal/AC |
| **S1 — Internal artifact** | “Handler `RefreshAsync` exists” | Weak; OK only as a Work item, not session Goal |
| **S2 — Contract** | “`POST /auth/refresh` returns 200 + new tokens for valid refresh” | Good for API cards |
| **S3 — Consumer** | “SPA stays logged in across access-token expiry without full logout” | Prefer for session Goal |
| **S4 — Evidence-bound** | S3 + “e2e X or manual script Y passes; log shows refresh once” | Prefer for DoD / Verify |

Session **Goal** should usually be **S3** (or S2 when there is no UI consumer yet).  
Task **AC** is often **S2** for backend cards and **S3** for UI cards.  
**DoD** should include at least one **S4** item for the session.

---

## 6. Where Outcome-first lands (artifact map)

Do **not** create new headings named Outcome-first / 80/20 / 5W1H.

| Path | When to apply | Fields that must pass three-axis |
| --- | --- | --- |
| **Quick** | Before writing TASKS | `QUICK.md` Goal; each card AC + Verify; Out of scope |
| **Lite / Full brainstorming** | Step-02 Frame, before Scope/Options | `Goal`, `Desired outcome`; later Scope must serve them |
| **Planning** | Step-02 before Approach/TASKS | `Goal`, Non-goals, DoD, Verification strategy |
| **TASKS** | Step-03 / quick-fix cards | Every AC; Verify must be able to falsify that AC |
| **Sync / Execution** | While coding | Do not redefine Goal; implement toward locked AC/DoD |
| **Review / Done** | Before Ready / Done | Evidence must map to DoD/AC — not “files changed” |

### Field roles (do not collapse them)

- **Goal** = one sentence, session-level, user/system facing when possible.
- **Desired outcome** = multi-bullet expansion of Goal (behaviors, edge of scope, success signals). Still observable — not a task list.
- **DoD** = checklist used by review/done; each box is falsifiable.
- **AC** = per-card slice of the session outcome; must trace upward (Trace / plan_ref).
- **Verify** = how to produce evidence for **this** AC only.
- **Non-goals / Out of scope** = protect the outcome from silent expansion.

If Goal and Desired outcome disagree, **stop and reconcile** (usually Goal is wrong or too narrow).

---

## 7. Path-specific rules

### Quick

- Goal must be S2+ and three-axis complete in **one sentence**.
- 1–3 cards; each AC is a slice of that Goal; Verify is runnable/checkable now.
- If Outcome-first rewrite surfaces product/design ambiguity → **upgrade Path**
  (Lite/Full). Do not keep Path=Quick with a fuzzy Goal.

### Lite

- Brainstorming: Goal + Desired outcome before options.
- Planning: DoD must reference the same outcome language (not a new goal).
- Small inventory OK; AC still cannot be “works”.

### Full

- Same as Lite, plus BA/stories/AC templates when used: story **Then** clauses
  are outcomes (observable), not activities.
- Spec quality Correctness: ask whether specs describe outcomes or only
  activities/layers. Promote “activity-only success criteria” as a Spec quality
  / Issue triage finding when Blocking.

---

## 8. Composition with other Thinking methods

Apply in this order when framing:

```text
1. Outcome-first              → lock WHO / WHAT / EVIDENCE (Output)
2. Input → Process → Output   → bind Input + Process to that Output
3. Make implicit explicit     → classify & surface material implicits
4. Single Source of Truth     → cite canonical stores; no forks
5. Small-batch                → slice into completable, verifiable units
6. Feedback loop              → modality + latency×risk for signals
7. Default path first         → L1→L2→L3→L4 depth order
8. 5W1H (if unclear)          → diagnose gaps; fold into real sections
9. Vital few                  → when summarizing / memory, keep what changes Output
```

| Method | Job | Anti-pattern |
| --- | --- | --- |
| Outcome-first | Define success (Output) | Jumping to TASKS |
| IPO | Bind Input + Process to Output | Process theatre / inventing Input |
| Make-explicit | Surface Assumptions/rules/owners/edges | Silent dual-interpretation pick |
| SSOT | Point facts at one official store | Forking AC/contract across chat/docs/code |
| Small-batch | Size + coding Verify rhythm | Mega-batch / fake-small / deferred verify |
| Feedback loop | Early useful signal (Example/See/Spike) | Abstract AC confirm; polish before preview |
| Default path first | Happy before exception encyclopedia | Exception-first DETAIL/Approach |
| 5W1H | Clarify a hard/unclear outcome | Stamping a 5W1H table |
| Vital few | Prioritize inside a locked outcome | Branding “80/20” on summaries |

Outcome-first does **not** replace Spec quality, Confirm-first, Dev context,
IPO, Make-explicit, SSOT, Small-batch, Feedback loop, or Default path first.
It feeds them: unclear outcome ⇒ Blocking unknown ⇒ Confirm-first ask.
IPO: `.agents/thinking/input-process-output.md`.
Make-explicit: `.agents/thinking/make-implicit-explicit.md`.
SSOT: `.agents/thinking/single-source-of-truth.md`.
Small-batch: `.agents/thinking/small-batch.md`.
Feedback loop: `.agents/thinking/feedback-loop.md`.
Default path first: `.agents/thinking/default-path-first.md`.

---

## 9. Gates (fail closed)

### Gate A — Before Scope / Approach / inventory / code

Refuse to proceed if:

1. Goal is activity-only (S0), or
2. Who **or** Evidence is missing and would change design, or
3. Desired outcome (Lite/Full) is a disguised task list (“1. write API 2. write FE”), or
4. DoD (planning) has only process milestones (lint/PR) with no consumer/contract outcome.

**Action:** rewrite, or Confirm-first with Ask method `confirm` / `choice` /
`fact`. Record answers in Clarification checkpoint / decision gate.

### Gate B — TASKS / Quick cards

A card **FAILS** (same spirit as planning Card specificity) if AC:

- is only “works” / “correct” / “per spec” / “done” / “implemented”, or
- restates the title as activity (“API implemented”), or
- cannot be falsified by the card’s Verify line.

### Gate C — Review / Done

Do not mark review clean / Done=`Done` on “implementation looks complete” alone.
Require evidence rows that map to DoD/AC (command output, screenshot path, API
response, test name). Process milestones are optional extras.

---

## 10. Anti-patterns (recognize and rewrite)

### A. Activity Goal

```text
BAD:  Implement refresh-token endpoint.
GOOD: Valid refresh token yields new access+refresh; invalid refresh returns 401
      with problem+json; covered by API test `RefreshTests`.
```

### B. Layer Goal

```text
BAD:  Finish backend search.
GOOD: FBD08001 Search returns §8-shaped rows for filter set F; over-max returns
      message M-OVER; verified with sample from §11.
```

### C. Process-only DoD

```text
BAD:  [ ] PR opened  [ ] Lint clean  [ ] Reviewed
GOOD: [ ] Consumer outcome … with evidence …
      [ ] Automated/manual verify … recorded
      [ ] PR/lint (optional hygiene) …
```

### D. Desired outcome as backlog

```text
BAD:
- Write DTO
- Write service
- Write controller
- Write UI

GOOD:
- Operator can search by BaseCd and see columns C1–C5
- Empty BaseCd shows M-01; does not call search API
- Export produces file E with columns … (if in scope)
```

### E. AC that cannot fail

```text
BAD:  AC: Search works per design.
GOOD: AC: POST search with sample §11 returns 200 and N≥1 rows with field `baseCd`.
Verify: curl … or unit `Search_Sample11_ReturnsRows`
```

### F. Silent outcome drift during execution

```text
BAD:  While coding, expand Goal to include admin audit because “we’re here anyway”.
GOOD: Keep locked Goal; put audit in Non-goals or a follow-up Unknown; ask if Blocking.
```

### G. Method branding

```text
BAD:  ## Outcome-first
      ## Executive summary (Outcome-first)
GOOD: ## Goal
      ## Desired outcome
      (apply the method silently)
```

---

## 11. Worked examples

### Example 1 — Quick (bugfix)

**User:** “parseDate crashes on empty string.”

| Field | Content |
| --- | --- |
| Goal | `parseDate("")` returns `null` (no throw); non-empty parsing unchanged. |
| Out of scope | Timezone helpers; changing callers’ null handling policy |
| AC | `parseDate("") === null`; existing date fixtures still pass |
| Verify | `pnpm test -- date` |

### Example 2 — Lite/Full (feature)

**User:** “Add order API.”

| Field | Content |
| --- | --- |
| Goal | FE order form can create an order via `POST /orders` and show validation errors from problem+json. |
| Desired outcome | 201 + order id on valid body; 400 with field errors on invalid; 401 when anonymous; OpenAPI matches handlers |
| Non-goals | Order edit/cancel; payment capture |
| DoD | Contract tests for 201/400/401; FE shows error map; OpenAPI diff reviewed |
| Sample AC | `POST /orders` valid body → 201 + `id`; Verify: `dotnet test --filter OrdersCreate` |

### Example 3 — Refactor (easy to get wrong)

**User:** “Refactor auth module.”

| Field | Content |
| --- | --- |
| Goal | Auth entrypoints keep current external behavior (login/refresh/logout contracts unchanged) while `AuthService` split is covered by existing auth tests green. |
| Desired outcome | No public route/status/body change; module boundaries match ADR-…; auth test suite green |
| Non-goals | New MFA; changing token TTLs |
| Evidence | Auth test suite; contract snapshot or golden responses |

If the user actually wanted behavior change, Outcome-first surfaces that as a
Blocking clarification instead of a silent scope creep.

---

## 12. Agent checklist (copy into reasoning — not into reports)

Before writing Goal / Desired outcome / DoD / AC:

- [ ] Draft is not S0 activity-only
- [ ] WHO is named (persona, system, caller, or screen/API consumer)
- [ ] WHAT is observable (status, field, message, file, metric, behavior)
- [ ] EVIDENCE is named or clearly derivable into Verify/DoD
- [ ] Non-goals / out of scope protect against expansion
- [ ] No new method-branded heading
- [ ] If Blocking ambiguity remains → Confirm-first, do not fill Approach/TASKS

Before claiming review/done success:

- [ ] Evidence maps to DoD/AC
- [ ] Not claiming “probably works” without a check

---

## 13. Maintenance notes for kit authors

- Keep this method in **Thinking methods**, not as a skill in `skills/`.
- Prefer tightening template comments + step Done-when checks over new artifacts.
- When adding related methods later (e.g. Evidence-over-confidence), compose
  them here in §8 rather than forking parallel docs.
- Language: this file stays **English** (kit shared form). Thread/report prose
  still follows `settings.language`; headings stay English.
