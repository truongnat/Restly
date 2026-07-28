# Brief EXEC-T001-agy — Extend request draft schema + store

Owner: **agy** · Model: `gemini-3.1-pro-high`  
Repo: `/root/Restly`  
Session tasks: `.agent-work/sessions/Task-1-workspace-functions-inventory/TASKS.md` → **T-001**

## Intent

Mock-phase UI full features. First card: extend Zod draft + Zustand so Headers/Body/Auth/Params editors can bind later. **No real HTTP. No Tauri.**

## Owned paths

- `src/entities/schemas.ts` (+ related entity types if needed, e.g. `src/entities/request.ts`)
- `src/app/store/restly-store.ts`
- `src/application/use-cases/send-request.ts`
- `src/application/use-cases/send-request.test.ts`
- Optionally thin types only under `src/entities/`

## Do

Follow T-001 Work items exactly:
1. Draft fields: `headers[]` (enabled/key/value), `body` + `contentType`, `auth` `{ type: 'none'|'bearer'|'basic'|'oauth', … }`
2. Store state + setters; seed mock defaults
3. Update `prepareRequestDraft` + unit tests

Keep export/API style; **kebab-case filenames** if creating new files.
Use existing DI — do not add fetch.

## Don’t

- Don’t edit `request-workspace.tsx` / sidebar / pages (later cards).
- Don’t implement F18/F20.
- Don’t rename unrelated files.

## AC

- `npm run test` + `npm run fmt && npm run lint && npm run build` pass
- Draft Zod accepts full shape; store can set headers/body/auth
- Vietnamese summary when done
