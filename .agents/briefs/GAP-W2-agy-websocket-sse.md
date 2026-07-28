# Brief GAP-W2-agy — WebSocket + SSE clients

Owner: **agy** · Model: `gemini-3.1-pro-high`  
Repo: `/root/Restly`  
Cards: **T-037**, **T-038**

## Intent

Add **WebSocket** and **SSE** client pages (browser APIs), linked from sidebar nav (extend nav if needed).

## Owned paths

- `src/pages/websocket-page.tsx` (**new**)
- `src/pages/sse-page.tsx` (**new**)
- `src/app/router.tsx` — register routes
- `src/shared/constants/app.ts` — ROUTES
- `src/features/shell/ui/sidebar.tsx` — nav entries only
- Optional: `src/features/realtime/**` for hooks

## Do

1. WebSocket: URL, connect/disconnect, message log, send text.
2. SSE: URL, connect/disconnect, event log via EventSource.
3. AppShell + ContentToolbar consistent with other pages.
4. No overlap with HTTP adapter / palette / codegen.

## Verify

`npm run check`

## Don’t

Commit/push; scripting; keychain.
