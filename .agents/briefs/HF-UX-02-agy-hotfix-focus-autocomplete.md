# Brief HF-UX-02-agy — Hotfix request editor (focus + autocomplete)

Role: **agy coder**. Cursor reviews against AC + screenshot. Do **not** touch response/resize files.

## Context

HF-UX-01 review **FAIL** on request side:
- Params still loses focus (Headers already fixed with `getState()`).
- Autocomplete is native `<datalist>` only — too weak.
- Params key wrongly uses HTTP header suggestion list.

## Owned paths (only)

- `src/features/request-editor/ui/request-workspace.tsx` — **Params handlers only** (`handleUpdateParam` / `handleDeleteParam` / `handleAddParam` + columns memo). Do **not** change Resizable*, response panel, JsonHighlight, CopyButton wiring.
- `src/features/request-editor/ui/headers-editor.tsx` — only if needed for autocomplete wiring
- `src/features/request-editor/model/param-columns.tsx`
- `src/features/request-editor/model/header-columns.tsx`
- `src/shared/ui/http-key-input.tsx` — replace datalist with real suggest UI
- `src/shared/ui/env-aware-input.tsx` — keep tooltip; do not break
- Optional new: `src/shared/ui/suggest-input.tsx` (Popover/Command filtered list)
- `src/shared/constants/http-headers.ts` — ok to extend

## Do not touch

- `resizable.tsx`, `response-preview.tsx`, `response-headers.tsx`, `copy-button.tsx`, `clipboard.ts`
- ResizablePanelGroup / Handle / response Pretty layout in `request-workspace.tsx`
- `use-send-request.ts` (already OK for substitute + block Send) unless Params focus requires zero change there

## Work items (mandatory)

### 1. Fix Params focus (same pattern as Headers)

In `request-workspace.tsx` Params callbacks:

```ts
const handleUpdateParam = useCallback((id, field, value) => {
  const current = useRestlyStore.getState().params
  setParams(current.map(...))
}, [setParams])
```

Same for delete/add. Columns `useMemo` must not depend on unstable closures over `params` array.

**Verify:** type continuously in a new Params row Key/Value — focus must stay.

### 2. Real autocomplete for Headers key

Replace `<datalist>` with filter-as-you-type dropdown (Popover + list, or Command if already in deps). Requirements:

- Type filters `COMMON_HTTP_HEADERS`
- Arrow/click selects
- Custom key still allowed (not forced to list)
- Does not steal focus every keystroke / does not remount input

### 3. Params key suggestions

- Params **Key** must **NOT** use HTTP header list.
- Use plain `EnvAwareInput` or a separate empty/common-query-param list (optional short list: `id`, `page`, `limit`, `q`, `include`) — or no suggestions. Prefer no HTTP headers.

### 4. Keep env tooltip

Do not regress `EnvAwareInput` hover tooltip for `{{var}}`.

## Verify

```bash
cd /root/Restly && npm run fmt && npm run lint && npm test && npm run build
```

Manual: Params type without blur; Headers key shows filtered dropdown; custom header name OK.

## Done

Append to this brief:

```
STATUS: done
```

+ 5–8 line Vietnamese summary to stdout.

STATUS: done

STATUS: rolled_back (2026-07-28 — product had no git commit; restored pre-HF-UX mock-phase sources)
