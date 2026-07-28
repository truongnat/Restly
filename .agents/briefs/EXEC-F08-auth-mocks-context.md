# Brief EXEC-F08 — Auth profiles + Mock Servers (depth) + context menus

Owner: Cursor agent  
Date: 2026-07-28  
Status: **done**

## Intent

Replace `/auth` and `/mocks` placeholders with interactive mock-phase UIs; add context menus on high-value lists; persist new state.

## Shipped

### Auth (`src/pages/auth-page.tsx`)
- Named auth profiles (none / bearer / basic / oauth)
- CRUD, duplicate, confirm delete, context menu
- Apply → request Auth tab + navigate workspace
- `setAuthProfileType` keeps field skeleton clean

### Mock Servers (`src/pages/mocks-page.tsx`)
- Server list + start/stop (mock flag)
- Route cards: method / path / status / delay / body
- Use in request, copy URL, clamp status/delay, path normalize
- Persist + fixtures

### Context menus
- Collections tree, history, welcome recent, environments, auth, mocks
- shadcn `src/components/ui/context-menu.tsx`

### Store / entities
- `AuthProfile`, `MockServer` / `MockRoute`
- Persist fields on `restly.mock.v1`
- Collection/request rename-delete-duplicate (sidebar menus)

## Verify

`npm run check` — fmt, lint, test, build green.

## Don’t (still)

- Real OAuth network, real mock HTTP listener, Tauri, F18.
