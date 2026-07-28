# Brief EXEC-T006-agy — Send mock accepts full draft

Owner: **agy** · Model: `gemini-3.1-pro-high`  
Repo: `/root/Restly`  
Session: T-006 in TASKS.md

## Intent

Wire Send to pass **full draft** (method/url/params/headers/body/contentType/auth) into DI use-case; mock adapter **echoes** draft in JSON body (no real HTTP).

## Owned paths

- `src/features/request-editor/model/use-send-request.ts`
- `src/infrastructure/adapters/mock/mock-request.adapter.ts`
- `src/application/use-cases/send-request.test.ts`
- `src/entities/response.ts` **only if** adding optional `headers?: Record<string,string>` for later F05 (prefer yes — return mock response headers)
- Optionally `src/infrastructure/mock/fixtures.ts` if replacing sample body helper

## Do

1. `onSend` mutate `{ method, url, params, headers, body, contentType, auth }` from store.
2. Mock `send(draft)` returns 200 + body = pretty JSON including echoed `draft` (and keep a small `data` sample if desired). Include `headers` on result if type allows (e.g. content-type, x-mock: true).
3. Update unit tests for prepare/send with new fields.
4. Mark T-006 done in TASKS.md.
5. `npm run test && npm run fmt && npm run lint && npm run build`

## Don’t

- Don’t edit request-workspace UI tabs (already done).
- Don’t implement env `{{var}}` (T-008) or Copy/Download UI (T-007) except returning headers in result shape is OK for T-007 later.
- No fetch/Tauri.

## AC

- Change body/auth/header in UI → Send → Pretty shows echo of those fields.
- Tests + build green. Vietnamese summary.
