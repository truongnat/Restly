# Brief EXEC-T008-opencode — Env var substitute on Send

Owner: **opencode** · Model: `opencode/deepseek-v4-flash-free`  
Repo: `/root/Restly` · Card: **T-008**

## Intent

Before Send, resolve `{{var}}` in URL (and optionally body string) from the **selected environment** variables in Zustand. Mock-phase only.

## Owned paths ONLY

- `src/features/request-editor/model/use-send-request.ts`
- New: `src/shared/lib/substitute-env.ts` (or `src/features/request-editor/lib/substitute-env.ts`)
- `src/application/use-cases/send-request.test.ts` only if adding unit test for substitute (prefer test substitute helper in colocated `*.test.ts` under shared/lib — create `substitute-env.test.ts`)

## Do

1. Implement `substituteEnv(template, vars: {key,value,enabled}[])` → replace `{{key}}` for enabled vars.
2. In `onSend`, read `environmentId` + `environments` from store; resolve url (and body if easy) before mutate.
3. Mark T-008 done in TASKS.md.
4. `npm run test && npm run fmt && npm run lint && npm run build`

## Don’t

- Don’t edit `request-workspace.tsx` (agy T-007).
- Don’t implement Env CRUD (T-013).

## AC

URL with `{{base_url}}` (or fixture var) resolves in echoed Send draft. Build green. Vietnamese summary.
