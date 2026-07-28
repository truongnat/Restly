# Brief EXEC-W3-agy — New Request/Collection + TopBar search (T-009, T-010)

Owner: **agy** · Model: `gemini-3.1-pro-high`  
Repo: `/root/Restly` · Cards: **T-009**, **T-010**

## Intent

Mock-phase: Sidebar “New request” + new collection; AppTopBar search filters collections/requests on workspace.

## Owned paths

- `src/features/shell/ui/sidebar.tsx`
- `src/features/shell/ui/app-top-bar.tsx`
- `src/app/store/restly-store.ts` (add actions: `createRequest`, `createCollection`, `searchQuery`/`setSearchQuery` as needed)
- Fixtures only if required under `src/infrastructure/mock/fixtures.ts`

## Do

### T-009
1. New request button: create blank request in active/open folder (or new untitled under first folder); set as active; reset method GET, url `https://`, empty params/headers/body, auth none.
2. Add “New collection” control (or long-press/overflow — prefer small + button near Collections label) adding folder `{ id, name: 'New Collection', open: true, requests: [] }`.

### T-010
1. Controlled search in AppTopBar bound to store `searchQuery`.
2. Sidebar filters folders/requests by name/url/method substring (case-insensitive). Empty query = all.

3. Mark T-009 + T-010 done in TASKS.md.
4. `npm run fmt && npm run lint && npm run build`

## Don’t

- Don’t edit request-workspace / send hook.
- No F18/F20.

## AC

Create request/collection visible in tree; search filters tree. Build green. Vietnamese summary.
