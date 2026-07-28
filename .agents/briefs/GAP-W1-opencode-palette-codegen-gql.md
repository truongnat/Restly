# Brief GAP-W1-opencode — Palette + Codegen + Postman export + GraphQL

Owner: **opencode** · Model: `opencode/deepseek-v4-flash-free`  
Repo: `/root/Restly`  
Cards: **T-033**, **T-034**, **T-035**, **T-036**

## Intent

Ship power UX: **Ctrl/Cmd+K command palette**, **code generator** snippets, **Postman Collection v2.1 export**, and a **GraphQL** request body mode — without touching HTTP adapter / auth store core (agy owns those).

## Owned paths (ONLY — no overlap with agy)

- `src/features/shell/ui/command-palette.tsx` (**new**)
- `src/features/shell/ui/app-shell.tsx` — mount palette only
- `src/features/shell/ui/app-top-bar.tsx` — open palette on search focus / ⌘K hint only if needed
- `src/features/request-editor/ui/code-generator.tsx` (**new**) + wire into response or request chrome under:
  - `src/features/request-editor/ui/request-workspace.tsx` — **only** add a Codegen entry / dialog trigger (do not rewrite Params/Headers/Body editors logic)
- `src/shared/lib/codegen-*.ts` or `src/features/request-editor/lib/codegen.ts` (**new**)
- `src/shared/lib/postman-collection.ts` (**new**) — serialize + optional harden parse
- `src/pages/welcome-page.tsx` — Export button / improve import using shared lib
- `src/pages/workspace` or collections export entry if exists — prefer Welcome + Collections toolbar; may add Export on sidebar collections header in `src/features/shell/ui/sidebar.tsx` **only** an Export control calling shared lib
- GraphQL: `src/features/request-editor/ui/body-editor.tsx` and/or new `graphql-editor.tsx` under same feature folder; content-type `application/graphql` or JSON GraphQL POST shape
- `src/pages/settings-page.tsx` — only if fixing shortcut list text for ⌘K (optional)

## Do

### T-033 Command Palette
1. Dialog/cmdk-like list: navigate routes (Workspace, History, Environments, Auth, Mocks, Settings), New request, Clear history, Toggle theme if easy.
2. Bind **Ctrl+K** and **Meta+K** globally when app focused.
3. Filter by query; Enter runs action; Esc closes.

### T-034 Code generator
1. From current method/url/headers/body/auth (read store), generate **cURL**, **JavaScript fetch**, **Python requests**, **Swift URLSession** snippets.
2. UI: dialog or sheet with language tabs + Copy.

### T-035 Postman export
1. Export current `folders` as Collection **v2.1** JSON download.
2. Reuse/harden welcome import to map `item` request.url/method/body when present (best-effort).

### T-036 GraphQL
1. When content-type or mode is GraphQL: query textarea + variables JSON.
2. Send body as `{"query":"...","variables":{...}}` with `Content-Type: application/json` (standard).

## Don’t

- Touch `fetch-request.adapter`, `mock-request.adapter`, `use-send-request.ts`, `entities/request.ts` auth types, DI HTTP registration (agy).
- Tauri / WS / SSE pages (Wave 2).
- Commit / push.

## Verify

```bash
cd /root/Restly && npm run check
```

Vietnamese summary.

## AC

- ⌘/Ctrl+K opens palette and navigates.
- Codegen copies valid-looking snippets.
- Export downloads v2.1 JSON; import still works.
- GraphQL mode produces JSON body for Send.
