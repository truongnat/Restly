# Commit Rules

Status: Accepted

## 1. Format

Use Conventional Commits:

```text
<type>(<scope>): <imperative summary>
```

Allowed types:

```text
feat fix refactor perf test docs build ci chore style revert
```

Scopes use domain/capability names, for example:

```text
request response workflow openapi security performance report
tauri http storage keychain filesystem process mock-server runtime
migration updater build ci release deps
```

Subject rules:

- English.
- Imperative present tense.
- Lowercase after the colon.
- No trailing period.
- Prefer at most 72 characters.
- Describe behavior, not “update”, “changes”, “fix bug” or “WIP”.

## 2. Atomicity

One commit has one primary outcome and is independently reviewable/revertible. Do not mix:

- unrelated features/tasks;
- repository-wide formatting with behavior;
- unrelated dependency upgrades;
- large renames with hidden logic changes;
- UI redesign with native transport work.

Code, tests and docs for one small outcome may remain in one commit.

Local WIP commits are allowed but must be squashed/fixed up before merge.

## 3. Body

A body is required for business-rule, migration, security, async-contract, performance and breaking changes.

```text
feat(workflow): add saved-result dependency resolver

Resolve named outputs from completed upstream requests before applying
authentication.

Business rules:
- Reject missing outputs before network IO.
- Reject circular dependencies during validation.
- Redact secret outputs before persistence.

Verification:
- Added extractor and graph-validation tests.
- Added Login → Create User integration fixture.

Refs: IT0-20
```

The body explains why, changed behavior, protected rules/invariants, verification, limitations and migration/rollback impact.

## 4. Linear references

Use `Refs: IT0-NNN` for related work. Use `Closes: IT0-NNN` only when all acceptance criteria are satisfied.

Keep ticket IDs out of the scope/subject unless tooling explicitly requires them.

## 5. Breaking changes and migrations

Use `!` and a `BREAKING CHANGE:` footer for command/event, persistence, report/export, workflow or public API contract breaks.

Migration commits document:

- old and new versions;
- preserved/transformed data;
- recovery/backup behavior;
- tested fixtures;
- rollback notes.

Never edit an already released migration; add a new one.

## 6. Security and performance

Security subjects describe the protected boundary without exposing unnecessary exploit detail. Never commit raw sensitive scanner output.

A `perf` commit requires before/after measurements, fixture/environment and benchmark link.

## 7. Pre-commit checklist

Frontend:

```bash
npm run fmt
npm run lint
npm run test
```

Before push/PR:

```bash
npm run check
```

Rust:

```bash
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test
```

Also verify:

- no secrets or debug payloads;
- no commented-out code;
- no follow-up without Linear ID;
- flow comments and docs match behavior;
- tests and verification evidence exist;
- breaking/migration impact is documented.
