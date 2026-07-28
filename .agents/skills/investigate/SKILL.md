---
name: investigate
description: "Investigate codebase, bugs, system behavior, or technical questions before implementing. Root-cause analysis, reproduction, impact mapping, and evidence-based recommendations. (Hard contract in this SKILL.md — MUST follow.)"
---

# Investigate

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Source copy: `docs/policy/SKILL_PREAMBLE.md` / `docs/policy/AGENT_WORK.md`.

## Purpose

Find technical truth before deciding to fix, plan, or implement.

When the question involves **docs/specs** (設計書, wiki, README-as-spec, “expected
per document”): run **Doc reality check** — docs ↔ code/runtime — and **ask**
before treating either side as the sole root cause.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| preferred_role | `researcher` (routing hint for multi-CLI; fallback main). |
| Inputs | Problem description, expected/actual behavior, logs/errors/reproduction, screenshots or recordings, codebase context, environment details; **docs/specs when cited or implied**. |
| Outputs | `INVESTIGATE.md` (prefer template) with question, status, evidence, reproduction, observed facts, hypotheses, code path, impact, root cause, recommendation, open questions; **Doc reality check** when docs are in play (or N/A + reason). |
| Safety | Read-only by default. Do NOT modify code unless requested. Do NOT run destructive commands. Do NOT read secrets without a clear reason. Do NOT claim root cause when evidence is insufficient — evidence over confidence (`.agents/thinking/evidence-over-confidence.md`). Do NOT treat wiki/設計書 prose as root cause without code/runtime evidence. When Doc reality Blocking=`Yes`, **Confirm-first**: STOP immediately, classify Ask method, ask in chat (max 3) before closing — do not hand off INVESTIGATE as an open-questions quiz. |

### Required artifacts

#### `INVESTIGATE.md`
- Required: yes
- Prefer seed: `templates/INVESTIGATE.template.md`
- **executive_summary** (required, array): Maximum five bullets with status, likely/confirmed cause, strongest evidence, impact, and next action (include top Doc mismatch if any).
- **developer_overview** (required, object): Investigation status, Doc reality blockers or n/a, strongest hypothesis, evidence gap, next action.
- **keywords** (required, object): Glossary table Term \| Meaning (`settings.language`) \| Where seen for opaque IDs/acronyms/domain names used in the report; or explicit `_(none — plain language)_`. Cap 3–12. Criteria: `.agents/SKILL_PREAMBLE.md` → Keywords.
- **doc_reality_check** (required, object): Table of doc claims vs code/runtime with verdict and Blocking; or explicit N/A with reason when no docs/specs are involved. Clarification checkpoint when Blocking=`Yes`.
- **charts** (optional, array): Mermaid cause/flow chart when useful; otherwise N/A.
- **question** (required, string): The investigation question.
- **status** (required, string): Root Cause Confirmed / Likely Root Cause / Hypotheses Identified / Needs More Evidence / Blocked.
- **context** (optional, string): Environment, version, related setup.
- **evidence** (required, array): Evidence ID, source, observation, supports hypothesis?, confidence.
- **reproduction** (optional, array): Step, action, expected, actual, result.
- **observed_facts** (required, array): Fact with source.
- **hypotheses** (optional, array): Hypothesis, supporting evidence, counter evidence, verification method, confidence.
- **code_path** (optional, array): Layer, file/component, role, observation.
- **root_cause** (optional, string): Confirmed or likely root cause.
- **impact** (required, array): Area affected, impact, confidence.
- **recommendation** (required, string): Fix recommendation / workaround / next investigation / docs refresh.
- **open_questions** (optional, array): Question, owner, blocking status.
- **handoff** (required, string): Ready for planning? Ready for execution? Suggested next skill (`docs`, `detail-design`, `execution`, …).

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## Doc reality check (when docs/specs matter)

| Check | Rule |
|---|---|
| Trigger | User cites 設計書/wiki/spec, or “expected” comes from documents, or bug is “differs from design”. |
| Table | Claim \| Doc evidence \| Code/runtime evidence \| Verdict \| Blocking \| Ask? |
| Verdicts | `Match` / `Mismatch` / `Missing-in-docs` / `Missing-in-code` / `Stale` / `Unknown` |
| Stop | Blocking=`Yes` → Confirm-first; prefer `diagram`/`table`/`html` so the user sees docs vs code/runtime (SSOT); ask which source wins or what to verify next; do not close as Confirmed on doc alone. |
| N/A | Pure runtime/infra with no doc claim → section N/A + one-line reason. |
| Fold | Record Accepted source of truth; update or queue the canonical store. |

## Quality Standards

- [ ] Status is one of the defined taxonomy values.
- [ ] Keywords filled (or none) so a new teammate can read evidence without guessing jargon.
- [ ] Observed facts have explicit sources.
- [ ] Inferences are separated from observed facts with confidence levels.
- [ ] Doc reality filled or N/A with reason; Blocking items asked.
- [ ] If root cause is claimed: evidence is sufficient to explain all observed symptoms.
- [ ] Recommendation distinguishes: fix / workaround / next investigation / docs update.
- [ ] Reproduction steps include environment, preconditions, and both expected and actual results.
- [ ] When video evidence is supplied, keyframes and timestamps are cited; unsampled transitions and audio are documented as limitations.

- [ ] Work nested git: ran `session.sh commit 'docs(investigate): …'` after writing artifacts (or `WORK_COMMIT=clean`). See AGENT_WORK.md.

- [ ] Confirm-first: on Blocking need, STOP immediately; classify Ask method (`confirm`/`choice`/`fact`/`table`/`diagram`/`html`); ask that way; finished artifact is not a quiz — residual Open questions non-blocking only (SKILL_PREAMBLE).

## WRONG vs CORRECT

```markdown
// WRONG — “design says X so code is wrong” with no code cite
Root cause: implementation ignores 画面設計書.

// CORRECT
Doc: FBD13001 §イベント F10 → search all tabs.
Code: Handler only refreshes active tab (path/…).
Verdict: Mismatch. Ask method=diagram (or table for fields): show docs path vs
code path; ask: bug vs intentional? update doc or code?
```

```markdown
// WRONG — no source, no confidence
The bug is probably in the export service.

// CORRECT — evidence-based
Observation: `GET /api/export` returns 500 when user 11716 is in the result set.
Stack trace: `DecryptInitialPassword()` throws on line 42 of `encryption.ts`.
Hypothesis H-001: The encrypted value for this user was set by Keycloak directly (plaintext).
Evidence: Keycloak audit log shows password was reset via admin console for user 11716.
Confidence: Medium.
```

```markdown
// WRONG — claiming root cause without evidence
Root cause: caching issue.

// CORRECT — qualified root cause
Root cause: Likely the encrypted attribute is plaintext, causing decryption to fail.
Confidence: Medium.
Alternative hypothesis: The encryption key changed between runs (low probability, no evidence).
Next step: Inspect the database value for user 11716's password attribute safely.
```

## Edge Cases

| Situation | Handling |
|---|---|
| Cannot reproduce the issue | Status = Needs More Evidence / Not Reproduced. Document conditions tried. |
| Log is truncated or incomplete | Document as limitation. Do NOT over-claim from partial data. |
| Sensitive data in logs (PII, tokens) | Redact before quoting. Document as security risk if exposure is found. |
| Multiple root causes are possible | List as multiple hypotheses with confidence for each. Do NOT pick one arbitrarily. |
| Issue is environment-specific | Document environment differences. Recommend cross-env comparison. |
| Docs stale vs code | Doc reality `Stale`/`Mismatch`; ask refresh docs vs fix code vs accept drift. |
| Screen recording is supplied | Extract session-local keyframes with `.agents/tools/video-keyframes/extract.py`; cite specific frames and do not infer continuous behavior from samples. |


## Limitations

- Does NOT guarantee a fix exists.
- Does NOT replace planning or execution.
- Does NOT replace deep security audit.
- Does NOT treat documentation as authoritative without code/runtime evidence.
