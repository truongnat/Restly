# Brief HF-03 — Shell option A (sidebar full-height, light)

Executor: **agy**. Repo: `/root/Restly`.  
Canonical design: `design/html/request-detail.html` + `design/screenshots/request-detail.png` (+ history sidebar pattern).  
**Do not** follow `main-window` dark sidebar / titlebar-on-top.

## Decision (user locked)

Shell = **A**: sidebar full-height light; brand lives **inside** sidebar; chrome toolbar only over **main content**.

## Goal

Restructure workspace / history / environments chrome so layout matches request-detail IA. Tokens already light (DS-01) — this is **structure**, not a new palette.

## Target layout

```
┌──────────── sidebar 260px ────────────┬──────────── main (flex-1) ────────────┐
│ Restly                                │ ContentToolbar (h=52)                  │
│ API Development                       │  [env?] [method+url+Send…] [Save Sync] │
│ [ + New Collection ]                  ├────────────────────────────────────────┤
│ Collections / History / Environments  │ page content                           │
│ Auth / Mock Servers (UI stub ok)      │                                        │
│ ─────────────────────────────────     │                                        │
│ JD · John Doe · Pro · ⚙ → /settings   │                                        │
└───────────────────────────────────────┴────────────────────────────────────────┘
```

**Web phase:** **no** macOS traffic lights (user rejected fake dots). Leave space/padding equivalent to design `pt-12` brand offset without rendering lights.

## Files to change (expected)

- Add `src/features/shell/ui/AppShell.tsx` — `flex h-full`: `<Sidebar />` + `<div className="flex min-w-0 flex-1 flex-col">{children}</div>`
- Rewrite `Sidebar.tsx` per request-detail:
  - Brand: `Restly` + subtitle `API Development`
  - **New Collection** button near **top** (not bottom)
  - Nav links: existing 3 + **Auth** + **Mock Servers** as stub routes or `button` disabled / `#` with `opacity` + toast-or-noop (add routes `/auth`, `/mocks` thin placeholder pages OR link that stays on page — prefer thin placeholder pages under `pages/`)
  - Collections tree only when on `/workspace` (keep current behavior under nav)
  - Footer profile mock: avatar initials, name, plan, Settings → `ROUTES.settings`
- Replace full-width `TitleBar` usage:
  - `WorkspacePage`: `AppShell` → children = content toolbar + `RequestWorkspace`
  - `HistoryPage` / `EnvironmentsPage`: `AppShell` → content header/toolbar appropriate to page (search/actions stay in main; **no** duplicate Restly brand in a top bar spanning sidebar)
- Refactor or replace `TitleBar.tsx` → e.g. `ContentToolbar.tsx`:
  - **Workspace:** env dropdown + (optional) move Sync/Settings here; method/URL/Send may stay inside `RequestWorkspace` for this ticket **or** lift URL bar into toolbar to mirror request-detail — **prefer lifting URL bar + Send + Save Request + Sync + Settings into ContentToolbar** if low-risk; else keep URL in RequestWorkspace and only put env + Sync + Settings in toolbar. Minimum: env + Sync + Settings in content toolbar; Save Request button UI stub OK.
- Delete dead brand-cell TitleBar pattern from HF-02.

## Out of scope (next tickets)

- **HF-04:** Params | Response horizontal split
- **HF-05:** Empty response state polish, full Save logic
- Editable params / Auth tab content (F01–F04)
- Real HTTP / Tauri

## Acceptance

1. `/workspace`, `/history`, `/environments`: sidebar runs **full viewport height**; no TitleBar brand strip above sidebar.
2. Brand “Restly” / “API Development” only in sidebar.
3. New Collection control near top of sidebar.
4. No traffic-light dots on shell.
5. Settings reachable from sidebar footer gear → `/settings`.
6. Light glass sidebar (`glass-sidebar` / shell tokens) unchanged in spirit.
7. `npm run fmt && npm run lint && npm run build` pass.
8. Short Vietnamese report: layout decisions + files touched.

## Commands

```bash
cd /root/Restly
npm run fmt && npm run lint && npm run build
```

Live: http://127.0.0.1/workspace
