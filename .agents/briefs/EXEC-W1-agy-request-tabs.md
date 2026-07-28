# Brief EXEC-W1-agy — Request tabs F04/F02/F03/F01 (T-002…T-005)

Owner: **agy** · Model: `gemini-3.1-pro-high`  
Repo: `/root/Restly`  
Session: `.agent-work/sessions/Task-1-workspace-functions-inventory/TASKS.md`

## Intent

Mock-phase UI: make Params / Headers / Body / Auth **editable** on `/workspace`. Schema+store already done (T-001). **No real HTTP.**

## Cards

- **T-002** Params editable  
- **T-003** Headers tab  
- **T-004** Body tab  
- **T-005** Auth tab  

## Owned paths ONLY

- `src/features/request-editor/ui/request-workspace.tsx`
- `src/features/request-editor/model/param-columns.tsx`
- New kebab-case files under `src/features/request-editor/ui/` or `model/` if you split tabs (e.g. `headers-editor.tsx`, `body-editor.tsx`, `auth-editor.tsx`)
- May use existing store setters only — **do not** rewrite `restly-store.ts` unless a tiny helper is required (prefer `setParams`/`setHeaders`/`setBody`/`setContentType`/`setAuth` already present)

## Do

1. **Params:** Checkbox + Input editable; add/remove row; wire `useRestlyStore` params (or sendState if it exposes params from store — prefer store for edits). Fix `param-columns` to accept update callbacks (factory), not read-only spans.
2. **Headers:** Replace placeholder; table like params; badge = `headers.length` (enabled or all — pick all length).
3. **Body:** Textarea + content-type Select bound to store.
4. **Auth:** Select type none/bearer/basic/oauth + fields; OAuth = form only, no network.
5. Remove “coming in next iteration” copy on those tabs.
6. Mark T-002…T-005 `done` + Progress board in TASKS.md when AC met.
7. `npm run fmt && npm run lint && npm run build`

## Don’t

- Don’t edit `use-send-request.ts` / mock adapter / Send wiring (T-006).
- Don’t edit Sidebar, AppTopBar, pages (opencode owns F08).
- Don’t F18/F20.

## AC

- User can edit params/headers/body/auth on `/workspace`; values survive tab switch (Zustand).
- Badges not hardcoded 12.
- Build green. Vietnamese summary.
