---
name: tester
description: "Support tester/QA in the agent lifecycle: analyze acceptance criteria, create test plans/cases, map requirements, define test data, and identify gaps. (Hard contract in this SKILL.md — MUST follow.)"
---

# Tester

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Source copy: `docs/policy/SKILL_PREAMBLE.md` / `docs/policy/AGENT_WORK.md`.

## Purpose

Act as a tester/QA in the agent workflow to ensure requirements, plans, or changes have clear verification methods.

Prefer acceptance criteria and verify steps from `TASKS.md` when present; use `PLAN.md` for overall DoD / `test_strategy`. Prefer writing or running automated tests **after** the feature code those tests cover already exists (or against an agreed existing surface).

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | Requirements, TASKS.md (preferred for AC/verify per task), PLAN.md (strategy/DoD), acceptance criteria, user stories, business rules, current/expected behavior, test environment, existing tests, test data, screenshots or test-run recordings. |
| Outputs | `TESTCASES.md` (and optional `TESTCASES.csv`) in the **active session** under `.agent-work/sessions/<Task-…>/` (resolve with `session.sh current`): test cases, traceability matrix, test data, manual verification steps, automated test suggestions, regression checklist, testing gaps. |
| Safety | Do NOT claim pass if not run or no evidence. Do NOT decide expected behavior when requirements are unclear. Do NOT use real/sensitive data as test data without permission. |

### Required artifacts

#### `TESTCASES.md`
- Required: yes; write only under the active session
  (`.agent-work/sessions/<Task-…>/TESTCASES.md`).
- **executive_summary** (required, array): Maximum five bullets with scope, highest-risk coverage, critical gaps, and next action.
- **developer_overview** (required, object): Test scope status, P0 coverage, critical gaps, next action.
- **charts** (optional, array): Mermaid coverage/priority chart when useful; otherwise N/A.
- **session_timestamp** (required, string): ISO 8601 with timezone.
- **test_scope** (required, string): In scope, out of scope, assumptions.
- **applicable_groups** (required, string): Which test groups apply (A/B/C/D) and which are skipped with reasons.
- **test_cases** (required, array): ID, priority, type, title, preconditions, steps, test data, expected result, requirement mapping, verification method, status.
- **regression_checklist** (optional, array): Area, scenario, expected result, priority.
- **test_data** (optional, array): Data, purpose, source/setup, notes.
- **testing_gaps** (optional, array): Gap, risk, suggested follow-up.

#### `TESTCASES.csv`
- Required: no
- CSV file for Excel/Google Sheets import when user requests.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## Quality Standards

- [ ] Each test case has: ID, type (Positive/Negative/Boundary/Security/Concurrency), priority (P0/P1/P2), steps, and expected result.
- [ ] Happy path, negative cases, and edge cases are covered.
- [ ] Acceptance criteria are checked for testability (from TASKS.md cards and/or requirements).
- [ ] Test data does NOT contain real personal information.
- [ ] Manual steps are precise enough to repeat.
- [ ] When TASKS.md exists, map test cases to task IDs / AC where useful.
- [ ] Video evidence cites sampled frames/timestamps and does not substitute for an executed, repeatable test result.
- [ ] `TESTCASES.md` is under the active session; ran
      `session.sh commit 'docs(tester): …'` after writing (or `WORK_COMMIT=clean`).

## WRONG vs CORRECT

```markdown
// WRONG — vague test case
Test login — should work.

// CORRECT — explicit test case
TC-LOGIN-001 | Positive | P0
Precondition: User has valid credentials.
Steps:
1. Open login page.
2. Enter valid email "admin@example.com".
3. Enter valid password.
4. Click Login.
Expected: Redirect to dashboard. User name visible in header.
```

```markdown
// WRONG — mixed test data with real info
Email: john.doe@gmail.com, Password: P@ssw0rd123

// CORRECT — fake, safe data
Email: test-admin@example.com, Password: Test@123
Note: All test data is fake. Emails use safe domain (example.com).
```

## Edge Cases

| Situation | Handling |
|---|---|
| Acceptance criteria are not testable | Document as testing gap. Suggest rewording for testability. |
| User wants CSV export | Create `TESTCASES.csv` with the same columns after the Markdown table. |
| Existing tests already cover some cases | Reference existing tests. Do NOT duplicate them. |
| No test environment available | Document as constraint. Suggest manual verification only. |
| Business rules are missing | Mark as assumption. Recommend business-analysis first. |
| Test-run recording is supplied | Extract keyframes with `.agents/tools/video-keyframes/extract.py`; map relevant frames to test cases and retain sampling/audio limitations. |

## Limitations

- Does NOT replace execution.
- Does NOT guarantee full coverage if requirements are incomplete.
- Does NOT replace code review or deep security audit.
