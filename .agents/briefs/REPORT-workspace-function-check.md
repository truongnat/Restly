# Brief REPORT — Workspace function check (orchestrator)

Role: **Cursor = brief / review only** (updated after F08 depth).

Date: 2026-07-28  
Sessions: Task-1…Task-4 + Auth/Mocks/context-menu wave  
Canvas: `.cursor/projects/root-Restly/canvases/restly-workspace-function-check.canvas.tsx` (may be stale)

## Verdict

Mock-phase UI **complete** for planned surface: F01–F16 + **F08 depth** (Auth profiles + Mock Servers) + F19-lite persist + context menus. Màn chính `/workspace` đủ editors + Send mock echo + env substitute. `/auth` và `/mocks` không còn placeholder.

| Metric | Value |
| --- | --- |
| Unit tests | `npm run check` green (39+) |
| Persist | `restly.mock.v1` incl. authProfiles + mockServers |
| Out of scope | F17 Stitch sync / F18 real HTTP / F20 Tauri |

## `/workspace` — function matrix

| ID | Function | Status | Evidence |
| --- | --- | --- | --- |
| F01 | Auth tab | mock done | `auth-editor.tsx` |
| F02 | Headers tab | mock done | `headers-editor.tsx` |
| F03 | Body tab | mock done | `body-editor.tsx` (+ multipart / XML) |
| F04 | Params editable | mock done | `param-columns.tsx` |
| F05 | Response Headers/Preview/Copy/Download | mock done | `response-*.tsx` |
| L1 | Send full draft echo | mock done | `mock-request.adapter.ts` |
| L2 | `{{var}}` substitute | mock done | `substitute-env.ts` + env pill |
| F06 | New Request | mock done | `sidebar` `createRequest` |
| F07 | New Collection | mock done | `sidebar` + context menu CRUD |
| T-010 | TopBar search filter | mock done | `searchQuery` → tree |
| chrome | Method/URL/Env/select | mock done | url-bar + toolbar |
| — | Bell / Help / More | **stub** | icons, no handlers |

## Off-workspace

| ID | Status | Note |
| --- | --- | --- |
| F08 | **mock done** | Auth profiles + Mock Servers |
| F09–F11 | mock done | History |
| F12–F13 | mock done | Environments |
| F14–F15 | mock done | Settings + prefs |
| F16 | mock done | Welcome Import/Export |
| F18 | **hybrid done** | Real `fetch` Send + cancel; `VITE_USE_MOCK_HTTP` fallback; mock-route wire |
| F19-lite | mock done | localStorage persist |
| Power UX | done | ⌘K, codegen, GraphQL mode, WS/SSE, scripts sandbox |
| F17 / F20 | **out** | Stitch sync / Tauri+Keychain+Sparkle |

## Next options

- **B+** — deepen OAuth / nested collections / wire secret-vault into env persist
- **F20** — Tauri + OS Keychain + Sparkle
- **D** — Bell / Help / More menus
