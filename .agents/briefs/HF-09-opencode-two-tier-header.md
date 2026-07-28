# Brief HF-09-opencode — Two-tier header: TopBar then ContentToolbar

Owner: **opencode** · Model: `opencode/deepseek-v4-flash-free`  
Repo: `/root/Restly`

## Intent

User wants:
- **Top** = global search + action icons (`AppTopBar` — agy creates)
- **Below** = ContentToolbar (request URL strip / page title actions)

## Owned paths

- `src/pages/WorkspacePage.tsx`
- `src/pages/HistoryPage.tsx`
- `src/pages/EnvironmentsPage.tsx`
- `src/pages/SettingsPage.tsx`
- `src/pages/AuthPage.tsx` / `MocksPage.tsx` if they use AppShell
- `src/features/shell/ui/ContentToolbar.tsx` — only comments/docs polish if needed; keep URL bar here for workspace

## Do

1. Confirm `AppShell` already injects `AppTopBar` (if agy not done yet, wait or import AppTopBar in AppShell **only if file exists** — if missing, create a thin placeholder importing path agy will fill, OR skip AppShell edit and document dependency). Prefer: **only edit pages** so order is:
   ```tsx
   <AppShell>
     {/* AppTopBar comes from AppShell */}
     <ContentToolbar … />
     <page body />
   </AppShell>
   ```
2. Workspace: keep `ContentToolbar` with `RequestUrlBar` + env **below** top bar (not inside top bar).
3. History/Environments/Settings: ContentToolbar stays for title/actions under AppTopBar.
4. If AppTopBar not in AppShell yet when you start: add import once file `AppTopBar.tsx` exists; if not, end with note “blocked on agy AppTopBar”.
5. `npm run build`

## Don’t

- Don’t redesign AppTopBar internals (agy).
- Don’t put search inside ContentToolbar.
- Don’t remove RequestUrlBar from workspace ContentToolbar.

## AC

- Visual stack: AppTopBar → ContentToolbar → content.
- Build green.
- Vietnamese summary.
