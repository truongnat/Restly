# Brief EXEC-T007-agy — Response F05 + Copy/Download

Owner: **agy** · Model: `gemini-3.1-pro-high`  
Repo: `/root/Restly` · Card: **T-007**

## Intent

Response panel: real Headers tab, Preview tab, Copy + Download. Mock-phase. `sendState.meta.headers` already exists from T-006.

## Owned paths ONLY

- `src/features/request-editor/ui/request-workspace.tsx`
- New kebab files under `src/features/request-editor/ui/` if needed (e.g. `response-headers.tsx`)

## Do

1. Response Headers tab: render `sendState.meta.headers` (key/value); badge = count; remove hardcode “8” / “next iteration”.
2. Preview tab: if body looks like HTML show in iframe/srcDoc or pre; else show formatted JSON/text.
3. Copy button → clipboard `responseBody`; Download → Blob file `response.json` or `.txt`.
4. Mark T-007 done in TASKS.md.
5. `npm run fmt && npm run lint && npm run build`

## Don’t

- Don’t edit `use-send-request.ts` / mock adapter (opencode T-008).
- No real network.

## AC

After Send: Headers/Preview usable; Copy/Download work. Build green. Vietnamese summary.
