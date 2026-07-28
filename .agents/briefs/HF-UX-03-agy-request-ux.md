# Brief HF-UX-03-agy — Request UX redo (serial wave 1/2)

Role: **agy coder**. Cursor reviews. **Wave 1 only** — opencode starts after you finish.

Baseline commit: `339fdc8`. Do not break light/dark theme toggle.

## User AC (confirmed)

1. Params/Headers: typing must **not** lose focus.
2. Headers key: real autocomplete (filter list + custom allowed). Params key: **no** HTTP header list.
3. Body: Format button; **invalid body blocks Send** (disable + error text).
4. Env like Postman: on **Send** resolve `{{var}}` into url/body/headers/params/auth; on **hover** show tooltip with resolved value.
5–8. Response/resize = **opencode wave 2** — do not implement.

## Hard lessons (do not repeat)

- Use `useRestlyStore.getState()` inside stable `useCallback` for table updates — never close over `params`/`headers` arrays.
- Autocomplete = Popover/filtered list, **not** native `<datalist>`.
- Extract Params table out of `request-workspace.tsx` so wave 2 can own that file.
- Do **not** change theme CSS / `app-top-bar` theme toggle.
- Do **not** install resizable / touch response Pretty/Preview.

## Owned paths

**Create**
- `src/features/request-editor/ui/params-editor.tsx` (move Params table + Add from workspace)
- `src/shared/constants/http-headers.ts`
- `src/shared/ui/env-aware-input.tsx` (Input + Textarea + hover tooltip)
- `src/shared/ui/suggest-input.tsx` (Popover suggest)
- `src/shared/ui/http-key-input.tsx` (SuggestInput + COMMON_HTTP_HEADERS)
- `src/shared/lib/validate-body.ts` + `validate-body.test.ts`

**Edit**
- `param-columns.tsx`, `header-columns.tsx`
- `headers-editor.tsx` (getState updates)
- `body-editor.tsx` (Format + validate UI)
- `auth-editor.tsx` (EnvAwareInput on secret fields)
- `request-url-bar.tsx` (EnvAwareInput + `disabled={isSendDisabled}`)
- `use-send-request.ts` (validate gate; substitute all fields on Send)
- `substitute-env.ts` (+ `hasEnvTokens`, `getEnvResolutionTooltip` + tests)
- `request-workspace.tsx` — **ONLY**: replace Params `TabsContent` body with `<ParamsEditor />`; keep Headers/Body/Auth/Response/split **unchanged**.

## Do not touch

- `response-preview.tsx`, `response-headers.tsx`
- Response Pretty/Raw/Copy UI beyond Send disable
- `resizable`, `react-resizable-panels`, theme/`index.css` shell tokens
- `app-top-bar.tsx`

## Verify

```bash
cd /root/Restly && npm run fmt && npm run lint && npm test && npm run build
```

Manual self-check in notes: Params type without blur; Headers key dropdown; bad JSON disables Send.

## Done

Append to this brief:

```
STATUS: done
```

Vietnamese summary 5–8 lines stdout. Then stop — wait for Cursor to start wave 2.

STATUS: done

