# Brief HF-UX-02-opencode — Hotfix resize handle + response smoke polish

Role: **opencode coder**. Cursor reviews against screenshot. Do **not** rewrite Params/Headers editors.

## Context

HF-UX-01 review **FAIL** UX:
- Screenshot: resize handle nearly invisible (`w-px`, `bg-border/30`) — user cannot tell/drag.
- Response Pretty/Preview/Copy not visually verified (empty state). Ensure after Send they look usable.
- Main response area looks nearly black / hard to read empty state — keep **light** Restly shell (`bg-background` / `bg-card` light tokens). Do **not** introduce dark theme.

## Owned paths (only)

- `src/components/ui/resizable.tsx`
- `src/features/request-editor/ui/request-workspace.tsx` — **only** ResizablePanelGroup / Handle / response panel chrome (empty state, Pretty/Raw tabs wrapper). **Do not** change Params `handleUpdate*` / table body / HeadersEditor/BodyEditor/AuthEditor content.
- `src/features/request-editor/ui/response-preview.tsx`
- `src/features/request-editor/ui/response-headers.tsx`
- `src/shared/ui/copy-button.tsx` — only if tick/copy broken
- `src/shared/lib/clipboard.ts` — only if needed

## Do not touch

- `param-columns.tsx`, `header-columns.tsx`, `headers-editor.tsx`, `body-editor.tsx`, `auth-editor.tsx`
- `http-key-input.tsx`, `env-aware-input.tsx`, `use-send-request.ts`, `request-url-bar.tsx`

## Work items (mandatory)

### 1. Visible horizontal resize handle

- Hit area ≥ ~6–8px wide; visible grip (not hairline).
- Hover/active state clear on light background.
- `orientation="horizontal"` Request | Response; both panels get `min-h-0 h-full` so split works inside flex parent.
- Ensure parent chain gives height (`h-full` / `min-h-0`) so panels are side-by-side, not collapsed.

### 2. Empty / response surface (light)

- Response empty state must sit on light `bg-card` / `bg-background` — not a black void.
- If something forces dark, remove it.

### 3. Pretty / Preview / Copy sanity

- After mock Send, Pretty shows highlighted JSON (nested string expand kept).
- Preview not ugly empty chrome.
- CopyButton still shows emerald Check ~2s; Headers copy all + per-row remain.

### 4. Smoke

If you can run headless, fine; at minimum `npm run build` green and self-check layout classes.

## Verify

```bash
cd /root/Restly && npm run fmt && npm run lint && npm test && npm run build
```

## Done

Append:

```
STATUS: done
```

+ Vietnamese summary 5–8 lines stdout.

```
STATUS: done
```

STATUS: rolled_back (2026-07-28 — product had no git commit; restored pre-HF-UX mock-phase sources)
