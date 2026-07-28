# Standardize before automate (Thinking method)

> **Status:** Session-wide thinking method (same class as **Outcome-first**,
> **Input→Process→Output**, **Make-implicit-explicit**, **Single Source of
> Truth**, **Small-batch**, **Feedback loop**, **Default path first**,
> **Reversible decisions**, **Design for handoff**, **vital few**, and
> **5W1H**).  
> **Not** a report section title. **Not** a separate skill. **Not** a new
> artifact (`AUTOMATE.md` / `STANDARD.md` are forbidden).  
> Fold results into Approach (manual→template→CI phases), Non-goals, Issue
> triage, review checklists, scaffold/CI proposals, new skill/hook requests.  
> Installed path: `.agents/thinking/standardize-before-automate.md`  
> Source: `docs/thinking/standardize-before-automate.md`.  
> Short ops rules: `.agents/SKILL_PREAMBLE.md` → Thinking methods.  
> Policy summary: `.agents/AGENT_POLICY.md` → Thinking methods.  
> **This file** owns the ladder before scripting, CI, bots, or new agent
> automation. **Feedback loop** owns trying manually; **Make-explicit** owns
> writing the checklist; **Reversible decisions** often class org-wide CI as
> Type H; **Design for handoff** needs stable templates for successors.

Agents must treat this file as **normative** when proposing automation.
Automating an unstable process only produces a **messy process that runs
faster**.

---

## 1. Purpose

Correct order:

```text
1. Do it manually (enough times to see variance)
2. Understand what actually matters
3. Standardize (shared steps, owners, Done criteria)
4. Template (checklist / skill template / doc form)
5. Automate (CI, bot, script, agent skill, hook)
```

**Core claim:** Standardization and templates are the bridge from craft to
automation. Skipping them encodes folklore into YAML.

| Stage | Output looks like | Not yet |
| --- | --- | --- |
| **Manual** | 2–3 real runs (PRs, releases, reviews) with notes | Shared rule |
| **Understand** | Vital few checks; known failure modes | Tooling |
| **Standardize** | Named steps + Owner + pass/fail | Enforced CI |
| **Template** | Checklist / `*.template.md` / review list | Blind auto-merge |
| **Automate** | CI job, bot, `lint_*.py`, skill, hook | First invent |

### User example (PR review)

```text
Manual:     review a few PRs by hand
Standard:   agree a short review checklist
Template:   paste checklist in PR / review skill
Automate:   then CI, bot, or AI agent against that checklist
```

---

## 2. Division of labor

| Method | Owns |
| --- | --- |
| **Feedback loop** | Manual try + measure *before* believing a process |
| **Make-implicit-explicit** | Write the standard (checklist rows, owners) |
| **Small-batch** | Don’t mega-automate; automate one verified loop |
| **Default path first** | Automate L1 checks before exotic edge linters |
| **Reversible decisions** | Org-wide CI/bot often **H** — Spike + rationale |
| **Vital few** | Automate only the checks that change outcomes |
| **Standardize before automate** | Gate: no step-5 without evidence of 1–4 |

```text
Bad:  “Add AI code review” while the team has no agreed checklist
Good: Checklist stabilized in 3 PRs → template → then agent/CI
```

---

## 3. Definitions

| Term | Meaning |
| --- | --- |
| **Manual reps** | Real executions used to learn variance (not one toy run) |
| **Standard** | Shared, named steps with Done criteria — still human-runnable |
| **Template** | Reusable form of the standard (markdown checklist, skill template) |
| **Automation** | Machine enforcement or generation (CI, bot, script, agent skill) |
| **Premature automation** | Step 5 while 1–4 incomplete or disputed |
| **Accelerated mess** | Premature automation’s product: same chaos, higher throughput |

---

## 4. Rules (mandatory)

1. **Propose automation only after** a written standard or template exists
   (or this session’s Approach includes “manual → checklist → then CI”).  
2. **Minimum manual reps:** prefer ≥2 real instances before locking a standard;
   one spike may start understanding but does not justify org automation.  
3. **Automate the checklist, not vibes** — each automated check maps to a named
   standard row (Vital few).  
4. **Default path first:** automate happy-path gates before rare-edge bots.  
5. **Reversibility:** new repo-wide CI/bot/agent policy → class **H** unless
   proven easy to disable; record why (ADR/Clarification).  
6. **Kit already templates:** prefer extending existing skill templates /
   `lint_artifacts.py` over inventing parallel automation.  
7. **Path Quick:** do not introduce new org automation; fix the instance.  
8. **Never** create `AUTOMATE.md` or brand `## Standardize before automate`.

---

## 5. Stage gates (when automation is in scope)

| Situation | Required before automate |
| --- | --- |
| New CI check | Checklist row + example failure caught manually |
| Review bot / AI review | Human review checklist stable (review skill / team list) |
| New agent skill / hook | Manual workflow documented; template fields known |
| Release script | Release steps run manually twice; owners clear |
| “Auto-fix everything” | Reject — no standard → no automation |

### Fail closed

- Approach jumps to “add CI/bot/agent” with no checklist/template phase.  
- Automation encodes disputed or dual-interpretation steps (Make-explicit first).  
- Skill/CI added that duplicates an existing kit gate without retiring one (SSOT).  
- Type H automation locked on Path Quick.

---

## 6. Framing order

```text
1. Outcome-first
2. Input → Process → Output
3. Make implicit explicit
4. Single Source of Truth
5. Small-batch
6. Feedback loop              → manual reps / signals
7. Default path first
8. Reversible decisions       → CI/bot often Type H
9. Standardize before automate → ladder before scripts
10. Design for handoff          → six-question successor test
11. Evidence over confidence    → claim only with recorded proof
12. Optimize bottleneck         → relieve the constraint stage first
13. 5W1H (if unclear)
14. Vital few                 → which checks deserve automation
```

| Method | vs this method |
| --- | --- |
| Feedback loop | Get signal from manual work |
| Make-explicit | Write the standard |
| Vital few | Which rows to automate |
| Optimize bottleneck | Automate the constraint stage — not hobby stages |
| Design for handoff | Stable templates make handoff repeatable |
| Reversible decisions | How heavy to lock automation |
| Path / Full ceremony | Don’t over-process tiny work — related but not the ladder |

---

## 7. Where it lands (no new artifacts)

| Behavior | Field / mechanism |
| --- | --- |
| Ladder in plan | Approach phases: manual → checklist → template → CI |
| Deferred automation | Non-goals: “CI later after N manual releases” |
| Checklist | review Quality Standards; DISCUSSION/PLAN DoD |
| New skill/hook request | Must cite existing manual/template standard |
| Premature ask | Issue triage: Blocking until standard written |

---

## 8. Anti-patterns

| Anti-pattern | Why it fails | Do instead |
| --- | --- | --- |
| Automate first | Accelerated mess | Ladder 1→5 |
| One-off script as “standard” | Folklore in bash | Write checklist others can run |
| Automate everything | Noise; thrashing | Vital few rows only |
| Parallel CI + kit lint forever | Two SoTs | Extend or replace one (SSOT) |
| AI agent without checklist | Inconsistent reviews | Template then agent |
| Equating Full Path with automation | Ceremony ≠ CI | Path selects process depth |

---

## 9. Worked examples

### A. PR review (user’s example)

**Bad:** Day-1 GitHub bot comments on style with no team checklist.  
**Good:** 3 manual PR reviews → 8-line checklist → `review` skill / PR template
→ then optional bot against those lines.

### B. Artifact quality in this kit

**Good pattern already:** Readable writing + templates → `lint_artifacts.py`
(automation follows standard). Do not add a second unrelated “quality bot”
without mapping to preamble rules.

### C. Release

**Bad:** Complex release.yml before anyone ships twice by hand.  
**Good:** Manual runbook (standard) → checklist in PLAN DoD → then script/CI.

### D. New Cursor skill

**Bad:** Generate a skill that “always refactors” with no agreed Definition of
Done.  
**Good:** Manual refactor checklist → template sections → then skill.

---

## 10. Agent checklist

- [ ] Automation proposal cites standard or templates it encodes  
- [ ] Manual reps / understanding noted (or Approach includes them first)  
- [ ] Automated checks map 1:1 to vital checklist rows  
- [ ] Org-wide CI/bot classed Reversibility H when appropriate  
- [ ] No duplicate SoT vs existing kit linters/templates  
- [ ] No `AUTOMATE.md` / method-branded heading  
- [ ] Quick Path does not invent new org automation  

---

## 11. Kit author notes

- Install to `.agents/thinking/standardize-before-automate.md`.  
- This kit’s own skills/templates are the “template” rung — protect that
  order when adding CI or new skills.  
- Preamble: ladder one-liner + fail closed on premature CI/bot/skill.
