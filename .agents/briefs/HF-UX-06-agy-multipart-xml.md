# Brief HF-UX-06-agy — Remove multipart text form; XML format + syntax colors

Role: **agy**. Cursor reviews.

## User AC

1. **Multipart:** remove the “Text / Form Data Boundary” textarea entirely. Only keep multi-file upload UI (list/add/remove). Do **not** dump raw multipart text as the body demo when selecting Multipart — clear body or leave empty; no form-data boundary text UI.
2. **XML Format button must work** — pretty-print XML (use a small lib e.g. `xml-formatter`). Update `formatBody` / validate as needed.
3. **XML syntax colors** like JSON — use a highlight library (prefer **`highlight.js`** or **`lowlight`/`refractor`**; keep deps light, no Monaco). Color XML in the body editor when Content-Type is XML. JSON can keep current custom highlighter OR migrate both to the same lib for consistency (your choice if cleaner).

## Owned paths

- `src/features/request-editor/ui/multipart-files-editor.tsx` — strip text area
- `src/features/request-editor/ui/body-editor.tsx` — XML colored editor; multipart branch; EXAMPLES for multipart empty
- `src/shared/lib/validate-body.ts` (+ tests) — format/validate XML
- `package.json` / lockfile — add `xml-formatter` + highlight lib (e.g. `highlight.js`)

## Do not touch

- Response panel, theme, env-aware (except reuse)

## Verify

```bash
cd /root/Restly && npm run fmt && npm run lint && npm test && npm run build
```

Manual: Multipart = files only, no form text; XML Format pretty-prints; XML shows tag/attr colors.

## Done

```
STATUS: done
```

Vietnamese 5–8 lines.
