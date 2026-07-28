# Brief HF-10-opencode — 100% shadcn controls (raw button sweep)

Owner: **opencode** · Model: `opencode/deepseek-v4-flash-free`  
Repo: `/root/Restly`

## Intent (user)

Chuẩn hóa UI: mọi interactive control trong product pages/features dùng **shadcn common** (`@/components/ui/*`), không còn raw `<button>` / `<input>` / `<select>` / `<textarea>` ngoài file primitives.

## Owned paths (ONLY)

- `src/features/shell/ui/Sidebar.tsx`
- `src/pages/SettingsPage.tsx`
- `src/pages/HistoryPage.tsx`
- `src/pages/EnvironmentsPage.tsx`

## Required changes

1. Replace every raw `<button>` với shadcn `Button` (variant `ghost` / appropriate; preserve layout classes via `className`, `type="button"`, handlers, aria).
2. History rows: prefer `MethodBadge` từ `@/shared/ui/MethodBadge` thay span method thủ công nếu dễ (API giữ nguyên).
3. Không thêm CSS framework khác. Chỉ Tailwind + shadcn.
4. Nav-like list items: `Button` với `variant="ghost"` + `className` full-width / justify-start — OK.

## Don’t

- Không sửa: `AppTopBar.tsx`, `MethodBadge.tsx`, `Toast.tsx`, `AppShell.tsx`, `main.tsx`, `components/ui/*` (agy owns those).
- Không đụng `TrafficLights.tsx` (deprecated).
- Không F01+ features.
- Không cài package mới trừ khi bắt buộc (không cần).

## Audit AC

- `rg '<button' src/features src/pages` → **0** matches (sau khi bạn sửa).
- `rg '<input |<select |<textarea' src/features src/pages` → 0 ngoài chỗ đã dùng shadcn Input/Select/Textarea wrappers.
- `npm run fmt && npm run lint && npm run build`
- Vietnamese summary when done.
