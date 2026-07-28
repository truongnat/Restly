# Brief HF-UX-03-opencode — Response UX + horizontal resize (serial wave 2/2)

Role: **opencode coder**. Cursor reviews. **Wave 2** — agy wave 1 already shipped (`ParamsEditor`, env inputs, body validate). Do **not** regress those.

Baseline before this wave: working tree dirty with agy changes — **keep** them. Only edit owned paths below.

## User AC

5. Pretty JSON: readable highlight; expand nested JSON-string values for **display only**.
6. Preview tab: polished HTML iframe + JSON pretty fallback (not ugly bare dump).
7. Copy: shared helper + emerald Check ~2s; response toolbar Copy; Response Headers copy-all + per-row.
8. Horizontal resize Request | Response; **visible** drag handle (not hairline `w-px`).

## Hard lessons

- Handle must be obvious: ≥6px hit area, grip, hover state.
- Panels need `h-full min-h-0` inside flex parent.
- Keep **light theme** working; no forced dark backgrounds.
- `request-workspace.tsx` already uses `<ParamsEditor />` — **keep that**. Do not re-inline Params table.
- Do not edit ParamsEditor / headers-editor / body / auth / url-bar / use-send / env-aware / suggest-input.

## Owned paths

**Create**
- `src/shared/lib/clipboard.ts`
- `src/shared/ui/copy-button.tsx`
- `src/components/ui/resizable.tsx` (Group/Panel/Separator from `react-resizable-panels` v4 API: `Group`, `Panel`, `Separator` — NOT old PanelGroup names)
- may `npm install react-resizable-panels`

**Edit**
- `src/features/request-editor/ui/request-workspace.tsx` — wrap request|response in ResizablePanelGroup horizontal; upgrade Pretty JsonView; wire CopyButton; **preserve** ParamsEditor / HeadersEditor / BodyEditor / AuthEditor tabs
- `response-preview.tsx`
- `response-headers.tsx`

## Do not touch

- `params-editor.tsx`, `param-columns.tsx`, `header-columns.tsx`, `headers-editor.tsx`
- `body-editor.tsx`, `auth-editor.tsx`, `request-url-bar.tsx`, `use-send-request.ts`
- `env-aware-input.tsx`, `suggest-input.tsx`, `http-key-input.tsx`, `validate-body.ts`
- `app-top-bar.tsx`, theme/`index.css` tokens (except if resizable needs zero CSS)

## Verify

```bash
cd /root/Restly && npm run fmt && npm run lint && npm test && npm run build
```

## Done

```
STATUS: done
```
Run complete: fmt ✓ | lint ✓ | test ✓ | build ✓

Vietnamese summary 5–8 lines stdout.
