# Brief HF-UX-04-agy — Env red/tooltip + Suggest portal + Body color/examples

Role: **agy**. Baseline `d4d0e73`. Do not touch response Pretty/resize/CopyButton (opencode).

## Bugs (user + screenshots)

1. **No datalist/dropdown** on Headers Key — table `overflow-hidden` clips SuggestInput; use **Portal** (or popover fixed) so list shows above table.
2. Unresolved `{{var}}` must render **red** in the field (not purple/primary).
5. Tooltip must show **correct content + position**:
   - Resolved → `Resolved: <value>` (or just the resolved string clearly labeled)
   - Unresolved → `Unresolved: {{token}}` (not echo the whole raw field unchanged)
   - Prefer tooltip anchored near the `{{…}}` token / caret, not useless duplicate of full input when unresolved.

3–4. **Body editor**:
   - JSON needs **syntax colors** (keys/strings/numbers) — not plain black textarea only.
   - When changing Content-Type, show a **per-type example** (placeholder or “Insert example” / auto-fill empty body) and keep format+validate; JSON example colored; XML/text/form simpler OK.

## Owned paths

- `src/shared/ui/suggest-input.tsx` — Portal dropdown; empty focus shows full list; z-index high
- `src/shared/ui/http-key-input.tsx` — if needed
- `src/shared/ui/env-aware-input.tsx` — render value with token spans (red if unresolved); tooltip content via improved helper
- `src/shared/lib/substitute-env.ts` + tests — `getEnvResolutionTooltip` / helpers for unresolved detection
- `src/features/request-editor/ui/body-editor.tsx` — colored JSON editor (lightweight overlay or contentEditable/pre+textarea pattern — **no Monaco** unless already deps); examples map by content-type
- `src/features/request-editor/ui/headers-editor.tsx` — may change `overflow-hidden` → `overflow-visible` on table wrapper if needed for dropdown
- `params-editor.tsx` — overflow fix only if Params key gets suggests later (no HTTP list)

## Do not touch

- `request-workspace.tsx` response/JsonView/Copy/Resizable
- `response-*.tsx`, `copy-button.tsx`, `clipboard.ts`, theme

## Verify

```bash
cd /root/Restly && npm run fmt && npm run lint && npm test && npm run build
```

Manual: Headers Key focus → dropdown visible; `{{token}}` unresolved → red + tooltip Unresolved; Body JSON colored; switch content-type → example.

## Done

```
STATUS: done
```

Vietnamese 5–8 lines.
