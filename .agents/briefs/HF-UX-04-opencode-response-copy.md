# Brief HF-UX-04-opencode — Response expand+color + Copy tick

Role: **opencode**. Start **after** agy HF-UX-04 finishes (or in parallel only if you never edit agy files). Prefer wait — Cursor will dispatch after agy.

Baseline includes agy HF-UX-04 changes — keep them.

## Bugs

6. Pretty response still shows `"body": "{ \"id\": … \n }"` as **escaped string**. Must **deep-expand** JSON-string values that parse as object/array into nested pretty structure (display-only). Screenshot: `echo.body` / draft body still stringified.
7. Copy button: icon must switch to **emerald Check tick** after copy (~2s). Toolbar use **icon-only** (`aria-label`, no forced text label that hides tick UX). Fix `CopyButton` API: e.g. `iconOnly` or default toolbar without visible label text. Ensure `copyToClipboard` success flips state (secure context / fallback OK).

Also: Pretty view needs **clear syntax colors** (key/string/number/bool/null) — current all-black look fails AC #3 for response side.

## Owned paths

- `src/features/request-editor/ui/request-workspace.tsx` — JsonView / formatJsonValue expand fix + colors; CopyButton wiring icon-only
- `src/features/request-editor/ui/response-preview.tsx` — same expand helper if shared; keep light theme
- `src/features/request-editor/ui/response-headers.tsx` — Copy buttons tick
- `src/shared/ui/copy-button.tsx`
- `src/shared/lib/clipboard.ts` — only if needed
- Optional extract `src/shared/lib/json-pretty.ts` for expand+tokenize used by workspace + preview

## Do not touch

- `env-aware-input`, `suggest-input`, `body-editor`, `params-editor`, `headers-editor` columns
- theme / top-bar

## Verify

```bash
cd /root/Restly && npm run fmt && npm run lint && npm test && npm run build
```

Manual: Send mock → Pretty shows nested `body` as object not `\n` string; Copy → tick.

## Done

```
STATUS: done
```

Vietnamese 5–8 lines.
