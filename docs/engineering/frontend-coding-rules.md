# Frontend Coding Rules

Status: Accepted  
Scope: React 19, TypeScript, TanStack, Zustand, Zod, Tailwind and shadcn/ui.

## 1. Language and naming

Source identifiers, file names, comments and docstrings use English.

- Files and folders: `kebab-case`.
- Components and types: `PascalCase`.
- Functions and variables: `camelCase`.
- Constants: `UPPER_SNAKE_CASE`.
- Booleans start with `is`, `has`, `can`, `should`, `was` or `did`.
- Collections use plural names.
- IDs identify their entity: `workflowRunId`, not `id` outside a tiny local scope.
- Values with units include the unit: `timeoutMs`, `responseSizeBytes`.
- Functions start with a verb and express domain intent.
- Avoid vague names: `data`, `item`, `info`, `manager`, `helper`, `utils`, `processData`.

Event handlers use `handleXxx`; callback props use `onXxx`. Hooks start with `use`; store actions must not.

Schemas and contracts:

- `xxxSchema`: Zod schema.
- `XxxInput` / `XxxOutput`: use-case or command boundary.
- `XxxState`, `XxxEvent`, `XxxError`: explicit semantic roles.
- Do not prefix interfaces with `I`.

## 2. Architecture and dependency direction

```text
app → pages → features → application/entities
                         ↑
                  infrastructure
```

- `entities`: domain types, Zod schemas and pure domain logic.
- `application/ports`: IO/native interfaces; no React, fetch or Tauri.
- `application/use-cases`: business orchestration; no UI details.
- `pages`: thin route composition.
- `features/*/ui`: presentational React.
- `features/*/model`: TanStack/Form/Zustand wiring and DI resolution.
- `features/*/lib`: feature-specific pure helpers/constants.
- `shared`: genuinely cross-feature primitives.
- `components/ui`: shadcn primitives.
- `infrastructure`: browser/Tauri adapters, query client, persistence and DI.

UI must never import adapters or Tauri APIs directly. DI remains module-level and must not be placed in React Context.

## 3. Feature organization

```text
features/request-editor/
├── ui/
├── model/
├── lib/
└── index.ts
```

Create folders only when needed. External modules import a feature through its `index.ts`; deep imports are internal to the feature.

Do not create generic `common`, `helpers` or `utils` dumping grounds. Place code under its capability, for example `security/redact-headers.ts`.

## 4. Components and state

- One primary responsibility per component.
- Around 150 JSX lines or 3 responsibilities triggers a split review.
- More than 5 `useState` or 3 `useEffect` calls requires an ownership review.
- Do not store derived state.
- `useEffect` connects external systems/lifecycles; it is not a general synchronization tool.
- Server/async state: TanStack Query.
- Form state: TanStack Form.
- URL state: TanStack Router.
- Global shell UI: Zustand.
- Local widget state: `useState`/`useReducer`.
- Business state: domain/use cases.
- Persistent state: repository ports.
- Never mirror server data into Zustand.
- Use semantic HTML, keyboard support and reduced-motion behavior.

## 5. Type safety and validation

- Strict TypeScript; no `any`.
- Use `unknown` and parse at boundaries.
- Validate HTTP, Tauri, filesystem, storage and imported-file data with Zod.
- Do not use assertions to bypass validation.
- Prefer `as const` unions over enums where sufficient.
- Avoid magic strings/numbers.
- Do not create an abstraction before at least two real use cases.

## 6. Complexity thresholds

Thresholds trigger review; exceptions require a reason.

- Function: approximately 30 logic lines.
- Cyclomatic complexity target: at most 8.
- Nesting: at most 3 levels.
- Parameters: at most 4; otherwise use an input object.
- File: approximately 300 lines; above 500 requires explicit justification.
- Separate validation, transformation, IO and state updates.
- Move business branching out of JSX.
- Give complex conditions a domain name.

Generated files and fixtures are exempt from line thresholds.

## 7. Error and security behavior

Expected failures use typed application errors. UI must not render raw adapter errors.

Every error UX answers:

1. What failed?
2. Which target was affected?
3. Was state partially changed?
4. Can the user retry?
5. What should they do next?
6. What reference ID supports debugging?

Secrets are masked by default and must not enter URLs, localStorage, persisted Zustand, history, console logs or exported diagnostics. Sanitize HTML/Markdown; never render untrusted HTML directly.

## 8. Tauri actions and async UX

Only `infrastructure/tauri` may import Tauri APIs. Every native action is asynchronous and accessed through a port/use case.

Short actions return a Promise. Long-running actions use:

```text
start → runId → progress events → persisted terminal result
                         ↘ cancel(runId)
```

Long-running work includes workflows, suites, security scans, load tests, large imports/exports and report generation.

Async states use explicit state machines, not only `isLoading`:

```text
idle → validating → queued → running
                    ↘ cancelling → cancelled
                    ↘ succeeded / failed
```

UX timing:

- Under 150 ms: avoid spinner flicker.
- 150 ms–1 s: inline loading.
- Over 1 s: describe current work and show progress when available.
- Over 10 s: progress/current step, elapsed time, cancel and background behavior are mandatory.

Rules:

- Disable only affected controls.
- Do not mark saved/cancelled before Rust confirms it.
- Component unmount must not cancel a native background job.
- Reconnect to jobs by `runId`.
- Validate event `runId` and `sequence`; ignore stale events.
- Persist terminal state before relying on terminal events.
- Destructive operations are never optimistically updated or silently retried.
- Show partial-result behavior explicitly.
- Use one completion notification per run, not one toast per step.

## 9. Performance

- Measure before adding memoization.
- Virtualize large history/log/message lists.
- Apply response preview/streaming thresholds.
- Move measured CPU-heavy parsing off the main thread or to native execution.
- Avoid rerendering the full workspace for a single field change.

## 10. Testing and Definition of Done

Required as appropriate:

- Pure/domain unit tests.
- Schema and port contract tests.
- Model/use-case integration tests.
- Critical interaction component tests.
- End-to-end business flows.
- Async race, cancellation and stale-event tests.
- Secret-redaction tests.

Before Done:

- Format, lint, tests and build pass.
- Loading/empty/error/disabled states exist.
- Accessibility and keyboard critical flows pass.
- No direct native/adapter import from UI.
- External data is validated.
- Evidence and related docs are linked in Linear.
