# Flow and Business Rule Registry

Status: Accepted

This registry prevents comment tags from drifting. Add or change IDs in the same commit as the affected flow/rule.

## Approved feature namespaces

```text
APP DESKTOP REQUEST RESPONSE COLLECTION HISTORY ENVIRONMENT AUTH
WEBSOCKET SSE MOCK DEPENDENCY WORKFLOW OPENAPI DOCS SECURITY
PERFORMANCE REPORT STORAGE MIGRATION UPDATE RELEASE
```

Do not create aliases such as `SWAGGER`, `OPEN_API` or `API_SPEC`; use `OPENAPI`.

## Initial flow IDs

| Flow ID | Purpose | Primary Linear epic |
|---|---|---|
| `REQUEST:SEND` | Send one HTTP request | IT0-8 |
| `REQUEST:CANCEL` | Cancel a request run | IT0-8 |
| `RESPONSE:INSPECT` | Inspect/render a response | IT0-10 |
| `COLLECTION:SAVE_REQUEST` | Persist a request in a collection | IT0-11 |
| `HISTORY:REPLAY_REQUEST` | Recreate a draft from history | IT0-11 |
| `ENVIRONMENT:RESOLVE_VARIABLES` | Resolve scoped variables | IT0-13 |
| `AUTH:APPLY_PROFILE` | Apply auth to a resolved request | IT0-13 |
| `WEBSOCKET:CONNECT` | Open/manage a WebSocket connection | IT0-15 |
| `SSE:CONNECT` | Open/manage an SSE stream | IT0-15 |
| `MOCK:START_SERVER` | Start the local mock server | IT0-16 |
| `DEPENDENCY:RESOLVE_REQUEST` | Resolve upstream outputs | IT0-20 |
| `WORKFLOW:EXECUTE` | Execute an API workflow | IT0-19 |
| `WORKFLOW:CANCEL` | Cancel a workflow run | IT0-19 |
| `OPENAPI:IMPORT` | Import/normalize an API spec | IT0-22 |
| `OPENAPI:REIMPORT` | Diff/update an imported spec | IT0-22 |
| `OPENAPI:RUN_SUITE` | Run generated API cases | IT0-21 |
| `DOCS:GENERATE` | Generate meaningful API docs | IT0-18 |
| `SECURITY:PASSIVE_SCAN` | Evaluate passive security rules | IT0-24 |
| `SECURITY:ACTIVE_SCAN` | Run an authorized active scan | IT0-25 |
| `PERFORMANCE:RUN_LOAD_TEST` | Run a bounded load scenario | IT0-26 |
| `REPORT:GENERATE_QUALITY_REPORT` | Produce the unified report | IT0-27 |
| `STORAGE:MIGRATE` | Migrate local storage | IT0-9 |
| `UPDATE:INSTALL` | Install a trusted update | IT0-17 |
| `RELEASE:PUBLISH` | Build and publish a release | IT0-17 |

## Initial critical rule IDs

| Rule ID | Meaning |
|---|---|
| `DEPENDENCY:UPSTREAM_OUTPUT_ONLY` | Only completed upstream steps provide outputs |
| `DEPENDENCY:NO_NETWORK_ON_RESOLUTION_FAILURE` | Resolution failure stops before IO |
| `WORKFLOW:TERMINAL_STATE_IMMUTABLE` | A terminal run cannot return to running |
| `WORKFLOW:DESTRUCTIVE_RETRY_DISABLED` | Unsafe operations are not silently retried |
| `WORKFLOW:PERSIST_BEFORE_EMIT` | Persist terminal result before event publication |
| `SECURITY:AUTHORIZED_TARGET_ONLY` | Active checks require confirmed scope |
| `SECURITY:REDACT_EVIDENCE` | Findings/evidence never expose secrets |
| `PERFORMANCE:BOUNDED_CONCURRENCY` | Load execution always has hard bounds |
| `STORAGE:SECRET_REFERENCE_ONLY` | Main storage contains references, not raw secrets |
| `UPDATE:TRUSTED_METADATA_ONLY` | Updates require trusted/signed metadata |

## Registry rules

- A STEP tag references an existing flow ID.
- FE and Rust share IDs for the same end-to-end flow.
- IDs do not contain file/function names.
- Renames do not silently change IDs.
- Replaced IDs are marked deprecated with their replacement.
- Important new rules/invariants are registered before merge.
