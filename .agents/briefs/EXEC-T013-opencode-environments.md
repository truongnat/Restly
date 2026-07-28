# Brief EXEC-T013-opencode — Environments F12–F13

Owner: **opencode** · Model: `opencode/deepseek-v4-flash-free`  
Repo: `/root/Restly` · Card: **T-013**

## Intent

Environments CRUD + edit variables (mock). Selected env feeds ContentToolbar (already) and T-008 substitute.

## Owned paths ONLY

- `src/pages/environments-page.tsx`
- `src/app/store/restly-store.ts` — **only** env-related actions if needed (`addEnvironment`, `removeEnvironment`, `updateEnvironment`, `setEnvVars`). Avoid rewriting unrelated store slices; merge carefully.
- `src/features/environments/**` if present
- Mock env fixtures/adapter under `src/infrastructure/adapters/mock/mock-environment.adapter.ts` / fixtures **only if needed**

## Do

1. Create / delete environment in UI.
2. Edit variables: key/value/enabled/secret (secret → password input).
3. Ensure toolbar env list updates from same store SSOT.
4. Mark T-013 done in TASKS.md.
5. `npm run fmt && npm run lint && npm run build`

## Don’t

- Don’t edit history-page or use-send-request (agy).
- Don’t touch sidebar/request-workspace.

## AC

CRUD env + edit vars works; build green. Vietnamese summary.

## Conflict note

If you must edit `restly-store.ts`, touch **only** environment fields/actions. agy may also edit store for history — rebase/merge by not deleting their history fields.
