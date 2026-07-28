# Brief EXEC-W4-agy — Env + Settings + Welcome + Persist lite (T-013…T-016)

Owner: **agy** · Model: `gemini-3.1-pro-high`  
Repo: `/root/Restly`  
Cards: **T-013**, **T-014**, **T-015**, **T-016**

## Intent

Finish mock-phase UI remaining cards. No F18/F20. No desktop.

## Owned paths

- `src/pages/environments-page.tsx`
- `src/pages/settings-page.tsx`
- `src/pages/welcome-page.tsx`
- `src/app/store/restly-store.ts` (env CRUD/vars; prefs; persist hydrate)
- `src/shared/lib/*` prefs/persist helpers (kebab-case new files OK)
- `src/app/main.tsx` only if hydrate boot needed
- Mock env fixtures/adapters if needed
- Update TASKS.md Progress for T-013…T-016

## Do

### T-013 Environments
- Create/delete env; edit variables key/value/enabled/secret; toolbar stays SSOT with store.

### T-014 Settings
- Fill Themes / Keyboard / Proxy / Account with interactive mock UI (no “coming next”).
- Persist theme + general toggles to localStorage; hydrate on load.

### T-015 Welcome Import
- Import CTA: file picker or mock; toast success; merge ≥1 mock collection into store tree.

### T-016 F19-lite
- Persist folders + environments + history (+ prefs already) to localStorage key e.g. `restly.mock.v1`; hydrate at boot.

## Verify

`npm run test && npm run fmt && npm run lint && npm run build`

## Don’t

- Real HTTP, Tauri, OAuth network.

## AC

All four cards behaviors work after reload where persist applies; TASKS marked done; build green. Vietnamese summary.
