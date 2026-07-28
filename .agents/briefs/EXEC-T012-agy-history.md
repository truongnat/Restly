# Brief EXEC-T012-agy — History F09–F11

Owner: **agy** · Model: `gemini-3.1-pro-high`  
Repo: `/root/Restly` · Card: **T-012**

## Intent

History page mock: search, filter, clear all, reopen on workspace. Optional: append history on Send (store).

## Owned paths

- `src/pages/history-page.tsx`
- `src/app/store/restly-store.ts` (history list in store OR hydrate from query then local overrides — prefer store `historyItems` + actions if query is read-only mock)
- `src/features/history/**` if exists
- `src/features/request-editor/model/use-send-request.ts` **only** to append history on success (minimal)
- Mock history adapter/fixtures if needed under owned infra mock paths

## Do

1. Search input filters list.
2. Filter control (e.g. by method) + Clear All.
3. Click row → navigate `/workspace` + set method/url/(basic draft) from item.
4. On Send success, append a history row (mock).
5. Mark T-012 done. `npm run fmt && npm run lint && npm run build`

## Don’t

- Don’t edit environments-page / settings / welcome.
- No real HTTP.

## AC

History searchable/clearable; reopen works; Send adds row. Build green. Vietnamese summary.
