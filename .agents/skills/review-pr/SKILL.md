---
name: review-pr
description: "Review pull requests, merge requests, or branch diffs as a responsible code reviewer. Quality gate before merge. (Hard contract in this SKILL.md — MUST follow.)"
---

# Review PR

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing**) before Purpose, Contract, or
steps. Do not skip it; do not reuse a cached `language`. Write so a teammate
understands on first pass — concrete paths/IDs, no filler, no method branding.
Artifacts go under `.agent-work/` (sessions + memory), not `.agents/`.
Source copy: `docs/policy/SKILL_PREAMBLE.md` / `docs/policy/AGENT_WORK.md`.

## Purpose

Review a PR/MR or branch diff as a quality-responsible reviewer before merge.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | Base ref, head ref (branch/PR/commit), PR description when available, changed files, test/CI results, codebase context. Head may differ from the currently checked-out branch. |
| Outputs | REVIEW_PR.md with review mode, base/head, findings, testing gaps, residual risks, PR description coverage, merge recommendation. |
| Safety | Do NOT `checkout`, `stash`, reset, edit `.gitignore`, or otherwise change the current branch or working tree. Do NOT auto-fix the PR if the user only requested review. Do NOT approve on behalf of the user. Do NOT create findings without evidence. Do NOT claim merge-safe if verification is missing. Do NOT ignore security/data risks. Create review worktrees outside the repository, or use an existing ignored location. Never force-remove a dirty worktree. |

### Required artifacts

#### `REVIEW_PR.md`
- Required: yes
- **executive_summary** (required, array): Maximum five bullets with merge recommendation, top findings/risks, verification status, and next action.
- **developer_overview** (required, object): Merge recommendation, finding counts, verification status, next action.
- **charts** (optional, array): Mermaid finding/coverage chart when useful; otherwise N/A.
- **review_mode** (required, string): remote-diff / worktree / current-branch.
- **base** (required, string): Base branch or commit (e.g. `origin/develop`).
- **head** (required, string): Head branch or commit being reviewed (e.g. `origin/A`).
- **pr_description_accuracy** (required, string): Does the diff match the description? yes/partial/no.
- **changed_areas** (required, array): Area, files, risk level, notes.
- **findings** (optional, array): Finding ID, severity, category, location, evidence, impact, recommendation, confidence.
- **verification_reviewed** (required, array): Check, result (pass/fail/skipped/missing), evidence, concern.
- **testing_gaps** (optional, array): Gap, risk, suggested follow-up.
- **residual_risks** (optional, array): Risk, impact, acceptance/mitigation.
- **merge_recommendation** (required, string): Approve / Approve with comments / Request changes / Needs more info / Needs more verification / Blocked.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## Workflow (step by step)

Reviewing a PR must never disturb the current branch or its uncommitted work.

### Step 1 — Resolve base and head

1. `git fetch origin` to get the latest refs.
2. Base = the PR target branch (e.g. `origin/develop`), not the currently
   checked-out branch. Ask the user if ambiguous.
3. Head = the branch/PR under review (e.g. `origin/A` or a PR number).
4. If GitHub CLI is available, pull PR metadata:

```bash
gh pr view <number-or-url> --json title,body,baseRefName,headRefName,files,statusCheckRollup
```

### Step 2 — Choose review mode

| Situation | Mode |
|---|---|
| Only need to read the diff | `remote-diff` (default) |
| Need to run tests / build / inspect full source of head | `worktree` |
| Head PR is already the currently checked-out branch and tree is clean | `current-branch` |

Default to `remote-diff`. Escalate to `worktree` only when runtime
verification is required. Record the chosen mode in `REVIEW_PR.md`.

### Step 3 — Get the diff

`remote-diff` (no checkout, no worktree):

```bash
git diff --find-renames origin/develop...origin/A
git diff --find-renames --stat origin/develop...origin/A
```

`worktree` (isolated, for tests/full source — current branch untouched):

```bash
repo_root=$(git rev-parse --show-toplevel)
review_root="$(dirname "$repo_root")/.$(basename "$repo_root")-worktrees"
mkdir -p "$review_root"
git worktree add --detach "$review_root/review-A" origin/A
cd "$review_root/review-A"
git diff --find-renames origin/develop...HEAD
```

An existing project-local `.worktrees/` may be used only when
`git check-ignore -q .worktrees` succeeds. Never edit `.gitignore` as part of a
review.

`current-branch` (only if head is already checked out and tree is clean):

```bash
git status --porcelain   # must be empty
git diff --find-renames origin/develop...HEAD
```

Use three-dot (`base...head`) so the diff is scoped to what head added since
the merge-base.

### Step 4 — Verification evidence

- `remote-diff`: rely on CI/PR status checks; mark local runtime checks
  `skipped` (never false-pass).
- `worktree` / `current-branch`: run the project-appropriate test/build command
  and record results. Distinguish pre-existing failures from PR-introduced ones.

### Step 5 — Write the artifact and clean up

1. Write `REVIEW_PR.md` to the **active** session
   (`.agent-work/sessions/<Task-N-short-description>/` from `session.sh current`;
   the repo root `.agents/` is git-ignored — never write it inside a worktree).
2. Work nested git: run
   `bash .agents/tools/session/session.sh commit 'docs(review-pr): …'`
   after writing the artifact (or confirm `WORK_COMMIT=clean`).
3. If a worktree was created, remove it:

```bash
cd <main-repo-root>
git -C <review-worktree-path> status --porcelain
git worktree remove <review-worktree-path>
```

If the worktree is dirty, do not use `--force`; report the cleanup blocker.
Confirm the current branch and working tree are unchanged.

## Quality Standards

- [ ] Review mode (remote-diff / worktree / current-branch) is recorded with base and head.
- [ ] Base is the PR target ref, not assumed from the current branch.
- [ ] Current branch and uncommitted work are untouched; any worktree is outside the repo (or already ignored) and safely removed.
- [ ] PR description is checked against actual diff (coverage column).
- [ ] Each finding has severity, file/location, evidence, and recommendation.
- [ ] Finding severity is one of: Critical / High / Medium / Low / Info.
- [ ] Merge recommendation is one of the defined taxonomy.
- [ ] Security/auth/permission is reviewed if changes touch those areas.
- [ ] Code comment convention checked against `.agents/CODE_COMMENTS.md`: public symbols documented, non-obvious flow explained, markers owned, no stale/contradicting comments.
- [ ] Testing gaps are documented even when no blocker findings exist.
- [ ] Work nested git: ran `session.sh commit 'docs(review-pr): …'` after writing
      `REVIEW_PR.md` (or `WORK_COMMIT=clean`).

## WRONG vs CORRECT

```markdown
// WRONG — no severity, no location
LGTM but there's a minor issue with the naming.

// CORRECT — structured finding
Finding PR-001: Medium — Export button text is misleading for unauthorized users.
Location: `src/features/export/export-button.tsx`, line 15.
Evidence: Button reads "Export All" but the endpoint rejects the request for unauthorized users.
Impact: UX confusion — users see an enabled button that will fail.
Recommendation: Disable the button text to "Export (not available)" for unauthorized roles.
Confidence: High.
```

```markdown
// WRONG — ignoring missing tests
No tests changed, but that's fine.

// CORRECT — calling out testing gaps
Testing gap: No new tests for the export permission check.
Risk: Regression may not be caught.
Follow-up: Add a negative API permission test.
```

## Edge Cases

| Situation | Handling |
|---|---|
| PR has no description | Document as an issue. PR description should explain what and why. |
| Diff is very large (>20 files) | Group by area. Note the size risk. Flag if changes are too broad. |
| Lockfile changes without manifest changes | Flag as potential unintended dependency change. |
| Binary files in the diff | Note they cannot be code-reviewed. Flag if large or unexpected. |
| CI evidence is missing | Note as testing gap. If changes are high-risk, recommend Needs more verification. |
| Head is a different branch while current branch has WIP | Use `remote-diff`, or a detached external worktree. Never checkout/stash/edit `.gitignore`. |
| Runtime verification needed but sandbox blocks worktree | Fall back to `remote-diff`, mark runtime checks `skipped`, and say so. |

## Limitations

- Does NOT auto-fix the PR.
- Does NOT replace deep security audit.
- Does NOT guarantee finding all bugs if evidence is insufficient.
