# Brief HF-UX-01-agy — Request editor UX (focus, autocomplete, body validate-block, Postman env)

Role: **agy coder**. Cursor reviews only. Do **not** edit opencode-owned paths below.

## Goal

Fix workspace **request-side** UX: table focus, HTTP key autocomplete, body format + **block Send when invalid**, Postman-like `{{var}}` (resolve on Send everywhere; hover tooltip shows resolved value).

## Confirmed AC (user 2026-07-28)

1. Body invalid → **block Send** (disable button + show error under editor). Not warn-only.
2. Env vars like Postman: **on Send** substitute real values into request fields; **on hover** over a field containing `{{…}}` show **tooltip with resolved value**.
3. Horizontal resize is **opencode** — do not touch split layout.

## Owned paths (only these)

- `src/features/request-editor/model/param-columns.tsx`
- `src/features/request-editor/model/header-columns.tsx`
- `src/features/request-editor/ui/headers-editor.tsx`
- `src/features/request-editor/ui/body-editor.tsx`
- `src/features/request-editor/ui/auth-editor.tsx`
- `src/features/request-editor/ui/request-url-bar.tsx`
- `src/features/request-editor/model/use-send-request.ts`
- `src/shared/lib/substitute-env.ts` (+ tests)
- `src/shared/constants/http-headers.ts` (**new** — common header names list)
- `src/shared/ui/env-aware-input.tsx` (**new** — input/textarea with env hover tooltip)
- `src/shared/ui/http-key-input.tsx` (**new** — key field with suggestions; create-new allowed)
- `src/shared/lib/validate-body.ts` (**new** + unit tests)
- Minimal store fields **only if needed** in `src/app/store/restly-store.ts` (e.g. `bodyValidationError`) — prefer deriving validation in body-editor + gate in `use-send-request` / url-bar
- Params table lives inside `request-workspace.tsx` — **allowed surgical edits only**: replace Param Inputs with your shared components / fix update callbacks so focus does not remount. Do **not** change response panel, JsonView, Preview, ResponseHeaders, or split `lg:w-[45%]` layout.

## Do not touch

- `response-preview.tsx`, `response-headers.tsx`
- Response Pretty/Raw/copy UX beyond disabling Send
- Resizable panels / installing `react-resizable-panels`
- Real HTTP / Tauri

## Work items

### A. Focus loss (#1)

Root cause: `handleUpdate*` closes over `headers`/`params` → columns remount each keystroke.

- Use functional Zustand updates (`setHeaders((prev) => …)` if store supports it; else `useRestlyStore.getState()` inside stable `useCallback` with `[]` / `[setHeaders]` deps).
- Ensure `useMemo(columns)` does not recreate because of unstable callbacks.
- Verify: type continuously in a new Params/Headers row without losing focus.

### B. HTTP key autocomplete (#2)

- Common header names in `http-headers.ts` (Accept, Authorization, Content-Type, User-Agent, … — ~30–40).
- Key cells in Headers (and optionally Params) use suggest-as-you-type; user can still type a custom key.
- Prefer lightweight Popover + filtered list or native `datalist` if shadcn Combobox missing — keep kebab-case, no raw unstyled chaos.

### C. Body format + validate + block Send (#3)

- Content-Type select stays.
- **Format** button: pretty-print when `application/json` (and XML if trivial/safe); no-op or soft message for plain/multipart.
- `validate-body.ts`: onChange validate by content-type:
  - `application/json` → `JSON.parse`
  - `application/xml` / `text/xml` → basic well-formed check (tag balance or DOMParser in browser; keep testable pure fn where possible)
  - `application/x-www-form-urlencoded` → optional light check
  - `text/plain` / multipart → always valid
- Empty body: treat as **valid** (optional body).
- Show inline error text under editor when invalid.
- `use-send-request` / `RequestUrlBar`: **disable Send** when body invalid; do not mutate.

### D. Postman-like env (#4)

- On Send, substitute `{{key}}` for **url, body, header values, param values, auth token/username/password/client fields** (enabled vars only). Extend `substituteEnv` helpers if needed (e.g. map rows).
- Echo/mock still receives **resolved** draft.
- `EnvAwareInput` (and textarea variant for body if useful): when value matches `{{…}}` (or contains placeholders), **hover Tooltip** shows resolved string from active environment variables (same resolve rules as Send). If unresolved, tooltip shows unresolved token clearly.
- Wire Value columns (params/headers), URL bar, auth secret fields, body editor (tooltip on hover over control is OK).

## Verify

```bash
cd /root/Restly && npm run fmt && npm run lint && npm test && npm run build
```

Manual: add header row → type without focus loss; pick Accept from suggestions; paste invalid JSON → Send disabled; fix + Format → Send works; put `{{base_url}}` in URL/header → hover tooltip shows resolved; Send echo shows resolved values.

## After done

Mark nothing in TASKS unless you add a short note at bottom of this brief: `STATUS: done` + what shipped.

Vietnamese summary in chat stdout: 5–8 lines.

STATUS: done
- Fixed input focus loss in Params and Headers table by stabilizing store update callbacks.
- Added common HTTP header autocomplete suggestions via HttpKeyInput.
- Added body format button, live syntax validation for JSON/XML/urlencoded, inline error message display, and Send button gating on invalid body.
- Added Postman-like {{var}} environment variable substitution on Send for all request fields (URL, headers, params, body, auth).
- Created EnvAwareInput and EnvAwareTextarea with hover tooltips displaying resolved env values or unresolved token notices.

STATUS: rolled_back (2026-07-28 — product had no git commit; restored pre-HF-UX mock-phase sources)
