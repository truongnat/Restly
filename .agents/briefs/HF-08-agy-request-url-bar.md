# Brief HF-08-agy — Request action strip in header

Owner: **agy** · Model: `gemini-3.1-pro-high`  
Repo: `/root/Restly`

## Problem

Workspace header (`ContentToolbar`) thiếu dải action: method / URL input / Send. Hiện URL bar nằm trong body `RequestWorkspace` → cảm giác “không có header actions”.

## Owned paths (only these)

- `src/features/request-editor/ui/RequestUrlBar.tsx` (**create**)
- `src/features/request-editor/ui/RequestWorkspace.tsx` (remove duplicate URL bar block)
- `src/pages/WorkspacePage.tsx` (pass URL bar into toolbar)

## Do

1. Extract URL bar UI (method Select + URL Input + Send) into `RequestUrlBar.tsx` using `useSendRequestMutation()`.
2. On `WorkspacePage`, render:
   ```tsx
   <ContentToolbar showEnv start={<RequestUrlBar />} />
   ```
   (or `start` spanning flex-1 — coordinate with opencode’s ContentToolbar layout).
3. Remove the duplicate URL bar section from `RequestWorkspace` so request/response panels start directly under the header.
4. Keep DI / mock send behavior unchanged.
5. `npm run fmt && npm run lint && npm run build`.

## Don’t

- Don’t rewrite ContentToolbar layout tokens (opencode owns that file).
- Don’t implement Auth/Headers/Body editors (F01+).
- Don’t touch History/Environments/Settings pages.

## AC

- `/workspace`: method + URL + Send visibly in the **top content header** next to env.
- No second URL bar in the panel body.
- Send still works (mock).
- Build green.

Report briefly in Vietnamese when done.
