# Brief EXEC-W1-opencode — Nav Auth + Mocks F08 (T-011)

Owner: **opencode** · Model: `opencode/deepseek-v4-flash-free`  
Repo: `/root/Restly`  
Session tasks: T-011

## Intent

Wire Sidebar nav items for Auth + Mock Servers to existing routes. Mock-phase only.

## Owned paths ONLY

- `src/features/shell/ui/sidebar.tsx`
- `src/pages/auth-page.tsx` (only if needed for AppShell/toolbar polish)
- `src/pages/mocks-page.tsx` (same)

## Do

1. Add nav entries for Auth + Mock Servers using `ROUTES.auth` / `ROUTES.mocks` (constants already exist).
2. Ensure pages render under AppShell + ContentToolbar with a simple title (no “coming soon” only if already ok).
3. Mark T-011 done in `TASKS.md` Progress board.
4. `npm run fmt && npm run lint && npm run build`

## Don’t

- Don’t touch `request-workspace.tsx` / request-editor (agy).
- Don’t implement real OAuth/mock server backends.

## AC

- Click sidebar → `/auth` and `/mocks` work. Build green. Vietnamese summary.
