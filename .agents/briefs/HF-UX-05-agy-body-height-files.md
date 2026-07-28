# Brief HF-UX-05-agy — Body: auto example on select, full height, multipart multi-file UI

Role: **agy**. Baseline includes `e27ed97`. Cursor reviews.

## User AC

1. **No "Insert Example" button.** Changing Content-Type **Select immediately** loads that type’s demo/example into the body (always swap on change — not only when empty).
2. **Body editor height:** grow to fill the Body tab / request panel height (`flex-1 min-h-0 h-full`), not fixed `min-h-[220px]` only. Prefer full height of the request side content area under the toolbar.
3. **Multipart / files:** when Content-Type is `multipart/form-data` (and optionally form-urlencoded stay text), show UI to **upload multiple files** — add files, list them (name + size), remove each. Mock-phase OK (no real network upload); keep File objects in memory / store metadata. Text fields for multipart form parts can stay simple.

## Owned paths

- `src/features/request-editor/ui/body-editor.tsx` (main)
- `src/features/request-editor/ui/multipart-files-editor.tsx` (**new** if cleaner)
- `src/app/store/restly-store.ts` — add `bodyFiles: { id, name, size, file?: File }[]` + setters; **do not** persist File blobs to localStorage (strip/omit in `savePersistedState` / subscribe)
- `src/shared/lib/persist.ts` — ensure files not serialized
- `request-workspace.tsx` — **only if needed** so Body `TabsContent` is `flex flex-col min-h-0 flex-1` and BodyEditor can fill height. Do not change response/resize/Copy.

## Do not touch

- Response Pretty/Preview, CopyButton, env-aware (except using as today), theme

## Verify

```bash
cd /root/Restly && npm run fmt && npm run lint && npm test && npm run build
```

Manual: switch JSON→XML→JSON body swaps example each time; Body panel fills height; multipart shows multi-file picker + list + remove.

## Done

```
STATUS: done
```

Vietnamese 5–8 lines.
