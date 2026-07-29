# Comment and Trace Rules

Status: Accepted

Comments must explain business flow, rules, invariants and non-obvious behavior. They must not translate obvious code.

Source-code comments use English.

## 1. Feature-scoped tags

A generic `[FLOW]` tag is forbidden. Tags are namespaced:

```text
[TYPE:FEATURE:SUBJECT]
[STEP:FEATURE:FLOW:NN]
```

Approved types:

```text
FLOW STEP RULE INVARIANT ASYNC SECURITY PERF ERROR DATA
COMPAT LIMITATION FOLLOW_UP TRACE
```

Examples:

```text
[FLOW:WORKFLOW:EXECUTE]
[STEP:WORKFLOW:EXECUTE:01]
[RULE:WORKFLOW:UPSTREAM_OUTPUT_ONLY]
[INVARIANT:WORKFLOW:TERMINAL_STATE_IMMUTABLE]
[ASYNC:WORKFLOW:PERSIST_BEFORE_EMIT]
[SECURITY:WORKFLOW:REDACT_STEP_OUTPUT]
[TRACE:WORKFLOW:IT0-19]
```

FEATURE values come from the flow registry. Do not create aliases.

## 2. When comments are required

Level 0, trivial mapping/rendering: no comment.

Level 1, local edge case: use a scoped `WHY` equivalent through RULE/LIMITATION/COMPAT as appropriate.

Level 2, business flow with at least three steps: require FLOW, numbered STEP comments, important RULE/ERROR behavior and a TRACE.

Level 3, critical flow such as migration, workflow execution, security scan, load test, updater or external process: additionally require INVARIANT, ASYNC ordering, SECURITY/PERF boundaries, recovery behavior and ADR/Linear trace.

Place the main flow comment at the orchestration entrypoint. Do not duplicate the complete flow in every helper.

## 3. Flow format

```ts
/**
 * [FLOW:DEPENDENCY:RESOLVE_REQUEST]
 *
 * 1. Validate the immutable request snapshot.
 * 2. Load completed upstream outputs.
 * 3. Resolve environment and workflow variables.
 * 4. Apply authentication.
 * 5. Return the resolved request to the transport.
 *
 * [RULE:DEPENDENCY:UPSTREAM_OUTPUT_ONLY]
 * Only completed upstream steps may provide outputs.
 *
 * [INVARIANT:DEPENDENCY:NO_NETWORK_ON_RESOLUTION_FAILURE]
 * Resolution failure stops before network IO.
 *
 * [SECURITY:DEPENDENCY:REDACT_RESOLUTION_TRACE]
 * Secret values never enter logs, history or diagnostics.
 *
 * [TRACE:DEPENDENCY:IT0-20]
 */
```

Step comments reuse the exact flow ID:

```ts
// [STEP:DEPENDENCY:RESOLVE_REQUEST:01]
const request = requestDraftSchema.parse(input.request);
```

FE and Rust use the same flow ID across the boundary.

## 4. Stable IDs

Flow IDs use `FEATURE:ACTION`, for example:

```text
REQUEST:SEND
WORKFLOW:EXECUTE
OPENAPI:IMPORT
SECURITY:ACTIVE_SCAN
PERFORMANCE:RUN_LOAD_TEST
STORAGE:MIGRATE
```

IDs describe business behavior, not files/functions. Renaming code does not rename a flow. Deprecated/replaced IDs remain documented in the registry.

Rules use stable semantic names, never step numbers:

```text
[RULE:WORKFLOW:DESTRUCTIVE_RETRY_DISABLED]
```

## 5. Async and security comments

Comment ordering, cancellation, retry, idempotency, locks, job spawning, event sequence and component-unmount behavior when non-obvious.

```rust
// [ASYNC:WORKFLOW:PERSIST_BEFORE_EMIT]
// The frontend may receive completion and fetch immediately.
repository.save_terminal_result(&result).await?;
event_publisher.emit_completed(&result).await?;
```

Security comments explain the protected boundary and reason, not unnecessary attack payload details.

Performance comments require measurement/evidence and link the relevant task/report.

## 6. Maintenance

- Incorrect comments are defects.
- Behavior and comments change in the same commit.
- No commented-out code.
- TODO/FIXME without a Linear issue is forbidden.
- Follow-ups use `[FOLLOW_UP:FEATURE:IT0-NNN]`.
- Temporary workarounds state the removal condition.
- Exported APIs with non-obvious contracts use TSDoc/Rust doc comments.
- Tests use business terminology, not fragile step numbers.
