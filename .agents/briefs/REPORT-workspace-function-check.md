# Brief REPORT — Workspace function check (orchestrator)

Role: **Cursor = brief / review only**. Coders: **agy** + **opencode** (đã có trên VPS).

Date: 2026-07-28  
Session: `.agent-work/sessions/Task-1-workspace-functions-inventory`  
Canvas: `.cursor/projects/root-Restly/canvases/restly-workspace-function-check.canvas.tsx`

## Verdict

Mock-phase UI **đã xong** theo PLAN (F01–F16 + F19-lite). Màn chính `/workspace` đủ editors + Send mock echo + env substitute. Không còn trạng thái “UI shell + stub tabs” như `INVESTIGATE.md` cũ.

| Metric | Value |
| --- | --- |
| TASKS cards | 16/16 `done` (`session.sh status` COMPLETE) |
| Unit tests | 15/15 pass |
| Product git | chưa commit (untracked) |
| Session archive | chưa |

## `/workspace` — function matrix

| ID | Function | Status | Evidence |
| --- | --- | --- | --- |
| F01 | Auth tab | mock done | `auth-editor.tsx` |
| F02 | Headers tab | mock done | `headers-editor.tsx` |
| F03 | Body tab | mock done | `body-editor.tsx` |
| F04 | Params editable | mock done | `param-columns.tsx` |
| F05 | Response Headers/Preview/Copy/Download | mock done | `response-*.tsx` |
| L1 | Send full draft echo | mock done | `mock-request.adapter.ts` |
| L2 | `{{var}}` substitute | mock done | `substitute-env.ts` + env pill |
| F06 | New Request | mock done | `sidebar` `createRequest` |
| F07 | New Collection | mock done | `sidebar` `createCollection` |
| T-010 | TopBar search filter | mock done | `searchQuery` → tree |
| chrome | Method/URL/Env/select | mock done | url-bar + toolbar |
| — | Bell / Help / More | **stub** | icons, no handlers |

## Off-workspace (cùng phase)

| ID | Status | Note |
| --- | --- | --- |
| F08 | **nav only** | Route OK; `/auth` `/mocks` vẫn placeholder |
| F09–F11 | mock done | History |
| F12–F13 | mock done | Environments |
| F14–F15 | mock done | Settings + prefs |
| F16 | mock done | Welcome Import mock |
| F19-lite | mock done | localStorage persist |
| F17 / F18 / F20 | **out** | Stitch sync / real HTTP / Tauri |

## Simple Skills lifecycle

`investigate` → `brainstorming` → `planning` → `sync` PASS → `execution` (swarm) = **complete**.  
Pending hygiene: `done` + `session.sh archive`; optionally refresh INVESTIGATE + `restly-ui-status.canvas.tsx` (stale).

## Không dispatch coder trừ khi user chọn

- **A** — docs/archive only (có thể Cursor housekeeping hoặc brief nhỏ)
- **B** — F18 Real HTTP → split agy (adapter) / opencode (wire UI cancel/error)
- **C** — F08 depth Auth/Mocks mock pages
- **D** — Bell/Help/More menus

Chờ user chọn trước khi viết brief execution mới.
