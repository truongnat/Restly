# Brief HF-UX-01-opencode — Response Pretty/Preview/Copy + horizontal resize

Role: **opencode coder**. Cursor reviews only. Do **not** edit agy-owned request-editor column/body/auth/send paths.

## Goal

Polish **response** side + **horizontal** resizable Request | Response split. Shared clipboard helper with green check after copy.

## Confirmed AC (user 2026-07-28)

- Resize: **horizontal only** for now (Request | Response).
- Copy: real clipboard + **green tick** after success (common helper).
- Response Headers tab needs **copy** (per row and/or copy all).

## Owned paths (only these)

- `src/features/request-editor/ui/request-workspace.tsx` — **layout split + response tabs/JsonView/copy wiring only**. Do not rewrite Params/Headers/Body/Auth tab **editors** (agy owns those). You may wrap left/right sections in Resizable panels; keep Tabs triggers for request tabs intact.
- `src/features/request-editor/ui/response-preview.tsx`
- `src/features/request-editor/ui/response-headers.tsx`
- `src/shared/lib/clipboard.ts` (**new**) + optional tiny test if easy
- `src/shared/ui/copy-button.tsx` (**new** — ghost icon Copy → Check emerald ~2s)
- `package.json` / lockfile **only if** adding `react-resizable-panels` (preferred for shadcn-style split)
- Optional: `src/components/ui/resizable.tsx` if you add the shadcn resizable wrapper

## Do not touch

- `param-columns.tsx`, `header-columns.tsx`, `headers-editor.tsx`, `body-editor.tsx`, `auth-editor.tsx`
- `use-send-request.ts`, `request-url-bar.tsx` (except you must not break imports)
- `substitute-env.ts`, env-aware inputs
- Real HTTP / Tauri

## Work items

### 1. Horizontal resize (#8)

- Replace fixed `lg:w-[45%]` with resizable horizontal panels (desktop). Mobile can stay stacked.
- Default ~45/55; persist ratio optional (nice-to-have localStorage); not required.
- Drag handle visible, accessible.

### 2. Pretty JSON (#5)

- Replace naive `JsonView` with something that:
  - `JSON.parse` whole body when possible → pretty `JSON.stringify(..., null, 2)`
  - Syntax highlight keys/strings/numbers/booleans/null cleanly (keep lightweight — no heavy Monaco unless already in deps)
  - If a **string value** is itself JSON (starts with `{`/`[`), optionally show **expanded nested** pretty block or parse-and-replace for display only (do not mutate stored `responseBody`)
- Raw tab stays exact string.

### 3. Preview (#6)

- HTML: iframe preview with clearer chrome (border, min-height, empty state).
- JSON: use same pretty formatter as Pretty (or tree), not a bare dull dump.
- Non-HTML non-JSON: readable monospace fallback.

### 4. Copy UX (#7)

- `clipboard.ts`: `copyText(text): Promise<boolean>` using `navigator.clipboard.writeText` with fallback.
- `CopyButton`: shows Copy icon → Check `text-emerald-600` for ~2s on success.
- Response toolbar Copy uses `CopyButton` / helper (replace ad-hoc state if cleaner).
- **Response Headers** tab: Copy all headers (e.g. `Key: Value\n…`) button; optional per-row copy.

## Verify

```bash
cd /root/Restly && npm run fmt && npm run lint && npm test && npm run build
```

Manual: drag split; Send mock → Pretty nested-looking JSON readable; Preview OK; Copy body → green tick; Headers copy works.

## After done

Add `STATUS: done` + short note at bottom of this brief.

Vietnamese summary in stdout: 5–8 lines.

STATUS: done

## Thực hiện bởi HF-UX-01 (2026-07-28)

- Cài `react-resizable-panels`, tạo wrapper shadcn `resizable.tsx`
- Thay `lg:w-[45%]` bằng `ResizablePanelGroup` kéo ngang (45/55 mặc định)
- Clipboard helper `clipboard.ts` + `CopyButton` (Copy → check emerald ~2s)
- Refactor `JsonView` → `JsonHighlight`: tô màu key/string/number/boolean/null + expand JSON lồng
- `ResponsePreview`: HTML iframe, JSON highlight, fallback monospace
- `ResponseHeaders`: nút Copy all + CopyButton từng dòng
- Toolbar Copy dùng `CopyButton` thay ad-hoc state

STATUS: rolled_back (2026-07-28 — product had no git commit; restored pre-HF-UX mock-phase sources)
