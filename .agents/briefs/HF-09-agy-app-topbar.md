# Brief HF-09-agy — AppTopBar (search + action icons)

Owner: **agy** · Model: `gemini-3.1-pro-high`  
Repo: `/root/Restly`

## Intent (user)

Hai tầng header trong cột content:

1. **Trên cùng — AppTopBar (bạn làm):** search input + icon actions (thông báo, …) — friendly.
2. **Dưới — ContentToolbar (đã có / opencode wire):** method/URL/Send hoặc title trang.

## Owned paths

- `src/features/shell/ui/AppTopBar.tsx` (**create**)
- `src/features/shell/ui/AppShell.tsx` (render `<AppTopBar />` **above** `{children}` trong cột main)

## UI spec (friendly tool chrome)

```
[ 🔍 Search requests, collections…     ]  [bell] [?] [⋯]   optional compact env later — NOT here
```

- Height ~44–48px, border-b subtle, `bg-background`
- Search: Input with Search icon, `flex-1`, placeholder tiếng Anh ngắn (“Search requests…”)
- Icons (ghost icon buttons, Lucide): **Bell** (notifications stub — badge optional “1”), **CircleHelp** or HelpCircle, **MoreHorizontal** or command menu stub
- No fake traffic lights. No brand (brand ở Sidebar).
- Actions = UI stubs (`aria-label`, onClick noop or toast later) — **không** implement notification backend.

## Don’t

- Don’t move RequestUrlBar into AppTopBar.
- Don’t edit `ContentToolbar.tsx` / `RequestUrlBar.tsx` / pages (opencode wires page order if needed).
- Don’t F01+ features.

## AC

- Every AppShell page shows AppTopBar at top of content column.
- ContentToolbar (children) still appears below it when pages render it.
- `npm run fmt && npm run lint && npm run build`
- Vietnamese summary.
