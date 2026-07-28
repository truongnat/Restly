---
name: review
description: "Review changes after execution: bugs, regression, missing tests, security/data risks, maintainability, and readiness before done/PR. (Hard contract in this SKILL.md — MUST follow.)"
---

# Review

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Source copy: `docs/policy/SKILL_PREAMBLE.md` / `docs/policy/AGENT_WORK.md`.

## Purpose

Evaluate changes after execution before marking done, creating a PR, or handing off.

Compare the diff and `EXECUTION.md` against `PLAN.md` (DoD/scope) and
`TASKS.md` when present (per-task AC and intended files).

**Outcome-first:** Ready / Ready-with-risks requires evidence that maps to DoD
and AC (commands, responses, screenshots, test names) — not “files look
complete” or process milestones alone. See `.agents/thinking/outcome-first.md`
§ Gates C.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| preferred_role | `critic` (routing hint for multi-CLI; fallback main). |
| Inputs | Diff/file changes, PLAN.md, TASKS.md when present, EXECUTION.md, test/check results, verification evidence, scope/context. |
| Outputs | REVIEW.md with scope reviewed, findings, testing gaps, residual risks, recommendation, handoff. |
| Safety | Do NOT auto-fix code if user only requested review. Do NOT create findings without evidence. Do NOT claim safe if verification is missing. Do NOT ignore security/data risks when changes touch input, auth, permission, secrets, files, network, DB, or infra. Do NOT recommend Ready / Ready with risks while `validate_artifacts.py` or `lint_artifacts.py` fails on the active session. Do NOT treat agent confidence as proof — evidence over confidence (`.agents/thinking/evidence-over-confidence.md`). Do NOT propose new review bots/CI as a substitute for an agreed checklist — standardize before automate (`.agents/thinking/standardize-before-automate.md`); prefer bots only if review is the named bottleneck (`.agents/thinking/optimize-bottleneck.md`). |

### Required artifacts

#### `REVIEW.md`
- Required: yes
- **executive_summary** (required, array): Maximum five bullets with recommendation, top findings/risks, verification status, and next action.
- **developer_overview** (required, object): Recommendation, finding counts by severity, verification gaps, next action.
- **charts** (optional, array): Mermaid finding-severity or coverage chart when useful; otherwise N/A.
- **scope_reviewed** (required, string): What changes were reviewed.
- **inputs** (required, array): What was read: PLAN.md, TASKS.md, EXECUTION.md, diff, test results.
- **findings** (optional, array): Finding ID, severity, category, location, evidence, impact, recommendation, confidence.
- **requirement_coverage** (required, array): Requirement/task, covered by change? evidence, notes.
- **verification_reviewed** (required, array): Check, result, evidence, concern.
- **testing_gaps** (optional, array): Gap, risk, suggested follow-up.
- **residual_risks** (optional, array): Risk, impact, acceptance/mitigation.
- **recommendation** (required, string): Ready / Ready with risks / Needs fix / Blocked / Needs more verification.
- **handoff** (required, string): Next action/skill, owner, and blocking status.


### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## Quality Standards

- [ ] Every finding has severity (Critical/High/Medium/Low/Info).
- [ ] Every finding has evidence (file path, line, or diff context).
- [ ] No findings → explicitly state "No findings found" + document residual risks.
- [ ] Security/data/migration risks checked if changes touch those areas.
- [ ] Code comment convention checked against `.agents/CODE_COMMENTS.md`
      (CODE_COMMENTS.md / AGENT_POLICY defaults): public/exported symbols have doc comments;
      comment prose language matches `rules.code.comments.prose_language` (not
      `settings.language`); non-obvious/multi-stage logic has a numbered flow +
      `Step N:` markers;
      business rules/security noted; markers owned; **no stale comment
      contradicting the code** and no obvious-narration/commented-out noise.
- [ ] Recommendation uses one of: Ready / Ready with risks / Needs fix / Blocked / Needs more verification.
- [ ] When TASKS.md exists, check unfinished or unverified task IDs against EXECUTION evidence (Progress board Status / Done / Work item checkboxes must match claimed completion).
- [ ] `python .agents/tools/session/validate_artifacts.py` exits 0 for the active session before Ready / Ready with risks.
- [ ] `python .agents/tools/session/lint_artifacts.py` exits 0 (fix leftover TODOs / missing Dev context / Quick violations).

- [ ] First-pass readable: concrete names (paths/APIs/IDs); no abstract filler.
- [ ] No leftover `_(TODO)_` or placeholder Mermaid in finished sections.
- [ ] Spec/review findings state finding + evidence + verdict (not essays).

- [ ] Work nested git: ran `session.sh commit 'docs(review): …'` after writing artifacts (or `WORK_COMMIT=clean`). See AGENT_WORK.md.

## WRONG vs CORRECT

```markdown
// WRONG — vague, no evidence
Code could be cleaner.

// CORRECT — specific, evidence-based
Finding H-001: Missing server-side permission check.
Location: `src/export/export-handler.ts`, no guard before processing request.
Evidence: UI hides export button, but API endpoint still accepts direct requests.
Impact: Unauthorized users can export data by calling the endpoint directly.
Recommendation: Add server-side permission check + negative API test.
Severity: High
```

```markdown
// WRONG — claiming safe without checking
No security issues found.

// CORRECT — qualified statement
Security check:
- Auth: no changes touched auth middleware.
- Permission: server-side guard not added (Finding H-001).
- Input: existing validation still in place.
- Secrets: no new secrets introduced.
Residual risk: Missing permission check needs to be addressed before merge.
```

## Edge Cases

| Situation | Handling |
|---|---|
| No review findings | State "No findings found" explicitly. Document residual risks. |
| User only asks "is this ready?" | Answer with recommendation status — if blocked, explain why. |
| Review input is incomplete (no diff) | Document limitation in scope. Do NOT claim full review. |
| Pre-existing issue found during review | Document as info finding. Note it's pre-existing, not introduced. |
| Security review without enough context | Document as testing gap. Do NOT claim security is safe. |


## Limitations

- Does NOT auto-fix code.
- Does NOT replace full QA or deep security audit.
- If fixes are needed, return to planning (update PLAN/TASKS) or execution.
