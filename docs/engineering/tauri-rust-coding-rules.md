# Rust and Tauri Coding Rules

Status: Accepted  
Scope: the Tauri desktop runtime, native capabilities and long-running execution.

## 1. Naming

Use standard Rust conventions:

- Modules/files/functions/variables: `snake_case`.
- Structs/enums/traits: `PascalCase`.
- Constants: `SCREAMING_SNAKE_CASE`.
- Units appear in names: `timeout_ms`, `response_size_bytes`.
- Tauri commands use `<verb>_<domain_object>`: `send_http_request`, `cancel_workflow_run`.
- Avoid vague names such as `manager`, `helper`, `utils`, `execute` or `process` without domain context.

Runtime events use `<domain>:<entity>:<event>`, for example `workflow:run:completed`.

## 2. Architecture

```text
commands → application → domain
              ↑
        infrastructure
```

Suggested organization:

```text
src-tauri/src/
├── bootstrap/
├── commands/
├── contracts/
├── domain/
├── application/
│   ├── ports/
│   └── services/
├── infrastructure/
│   ├── http/
│   ├── storage/
│   ├── secure_store/
│   ├── filesystem/
│   ├── process/
│   └── mock_server/
├── runtime/
├── security/
└── error/
```

- Commands validate boundary input, call a service and map safe output.
- Commands do not contain business orchestration or direct IO.
- Domain does not depend on Tauri, HTTP, storage or filesystem.
- Application defines ports and orchestration.
- Infrastructure implements ports.
- `main.rs` only boots dependencies, plugins, state and commands.
- Core services must be testable without starting Tauri.
- Do not create generic `utils.rs`, `helpers.rs` or `common.rs`.

## 3. Command and event contracts

All commands are async and return typed serializable DTOs.

```rust
#[tauri::command]
pub async fn send_http_request(
    state: State<'_, AppState>,
    input: SendHttpRequestInput,
) -> Result<SendHttpRequestOutput, CommandError>
```

- Never expose database entities across the boundary.
- Command/event contracts are versioned when persisted or externally consumed.
- Long-running commands return a stable `run_id` quickly.
- Cancellation uses `run_id`.
- Runtime events include version, run ID, sequence, timestamp and payload.
- Breaking command/event changes require migration notes.

## 4. Complexity

Thresholds trigger review:

- Command handler: approximately 15–20 lines.
- Function: approximately 40 logic lines.
- Cyclomatic complexity target: at most 8.
- Nesting: at most 3 levels.
- More than 4–5 arguments uses an input struct.
- File: approximately 400 lines.
- Prefer early returns.
- Separate validation, IO, transformation, persistence and event publication.
- Avoid multi-capability “manager” services.

## 5. Error handling

- No `unwrap`, `expect` or `panic!` in production paths.
- Use typed errors, typically with `thiserror`.
- Infrastructure errors are mapped to application/command errors.
- Frontend errors must be safe to serialize.
- Do not expose raw paths, stack traces, credentials or sensitive payloads.
- Attach correlation/run IDs.
- Test error mappings and partial-failure behavior.

## 6. Async and managed jobs

- Do not block Tokio; use async APIs or `spawn_blocking`.
- Never hold a mutex guard across `.await`.
- No unmanaged spawned tasks.
- Every long-running job has a stable ID, cancellation token, timeout, resource budget, terminal state and cleanup.
- Concurrency is bounded with queues/semaphores.
- Retry is an explicit policy and considers idempotency.
- Shutdown cancels or safely finishes managed jobs.
- Persist terminal results before emitting terminal events.
- Cancellation must be confirmed before the frontend marks a run cancelled.

## 7. Managed state

- State contains service handles, repositories, job registries and immutable configuration.
- Do not store UI state in Rust.
- No mutable global statics.
- Keep lock scopes short.
- Ownership and concurrency behavior must be explicit.

## 8. Native capabilities

### HTTP

Reuse clients. Explicitly define timeout, redirects, proxy, TLS, cookie and response-size policies. TLS verification is never disabled by default. Bound redirect hops and response sizes. Redact headers and payloads before logs.

### Persistence

Commands access repositories/services, never files/databases directly. Every schema is versioned. Migrations are ordered, transactional where possible, recoverable and tested from old fixtures. Main storage never contains raw secrets; use OS secure storage and persist references.

### Filesystem

Canonicalize and validate paths. Bound import size. Handle overwrite explicitly. Clean temporary files. Prevent traversal and archive extraction attacks.

### External processes

Never build shell strings or use `sh -c`. Pass arguments separately. Validate executable path/version. Limit environment, output size, runtime and resources. Kill the process group on cancellation. Redact commands/logs. Security tools require authorized scope, allowlists and safe mode.

### Mock server

Bind to `127.0.0.1` by default. LAN/public binding requires confirmation. Bound headers/bodies/connections. Release ports on shutdown. Do not expose filesystem/process execution to mock routes.

### Load testing

No unlimited concurrency, duration, response size, samples or connections. Document warm-up/exclusion policy. Compute percentiles from raw/histogram samples, never averages. Aggregate without retaining payloads. Support prompt cancellation.

## 9. Logging and security

Use structured `tracing`, not `println!`. Include correlation/run IDs. Do not log raw secrets or full payloads by default. Export diagnostics only after redaction.

Active security testing is authorized-target only and requires allowlist, confirmation, safe mode, rate/request budget, audit log and kill switch. Stealth, persistence, credential theft and uncontrolled denial of service are excluded.

## 10. Quality and Definition of Done

Required gates:

```bash
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test
```

Also require dependency/license/security review appropriate to the change.

Before Done:

- No production-path unwrap or unmanaged/unbounded task.
- Contracts and errors are validated.
- Cancellation, timeout and cleanup are tested.
- Redaction tests pass.
- Permissions/capabilities are minimal.
- Migration/ADR/runbook is updated.
- Platform-specific changes have cross-platform evidence.
