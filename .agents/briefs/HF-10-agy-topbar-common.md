# Brief HF-10-agy — AppTopBar center search + common primitives

Owner: **agy** · Model: `gemini-3.1-pro-high`  
Repo: `/root/Restly`

## Intent (user)

1. Search ở **AppTopBar**: giới hạn độ dài + **căn giữa**; icon actions **giữ bên phải**.
2. Chuẩn hóa UI về **shadcn / common** — phần bạn sở hữu.

## Owned paths (ONLY)

- `src/features/shell/ui/AppTopBar.tsx`
- `src/shared/ui/MethodBadge.tsx`
- `src/features/shell/ui/Toast.tsx`
- `src/features/shell/ui/AppShell.tsx` (chỉ nếu cần wire Toaster)
- `src/app/main.tsx` (chỉ nếu cần `<Toaster />` từ sonner)
- `src/components/ui/sonner.tsx` (nếu `npx shadcn@latest add sonner` tạo file này)
- `package.json` / lockfile **chỉ** nếu add sonner dependency

## 1) AppTopBar layout

```
[ flex-1 spacer ]  [ Search max-w-md centered ]  [ flex-1 spacer + icons right-aligned ]
```

- Search: `max-w-md` (~448px), vẫn dùng shadcn `Input` + Lucide `Search`.
- Icons **Bell / CircleHelp / MoreHorizontal** vẫn **cạnh phải** (không đổi thứ tự).
- Dùng ghost `Button` `size="icon-sm"` như hiện tại.
- Không đưa URL bar / Send lên đây.

Kỹ thuật gợi ý (không bắt buộc đúng class):
- Grid 3 cột hoặc hai `flex-1` + search absolute/center; icons trong cột phải `justify-end`.

## 2) MethodBadge → shadcn Badge

- Refactor `MethodBadge` để **compose** `@/components/ui/badge` (giữ API `method` + `className`).
- Giữ màu method hiện có (`methodColorLight` / label-caps) qua `className` trên Badge.
- **Không** đổi call sites ngoài file này (Sidebar/History vẫn import MethodBadge).

## 3) Toast → shadcn Sonner

- Thêm Sonner theo shadcn (`npx shadcn@latest add sonner` nếu chưa có).
- Thay / wire `Toast.tsx` + `AppShell` (hoặc `main.tsx`) để dùng common Toaster.
- Giữ behavior hiện có từ Zustand `toast` nếu có (hiện toast khi store set) — hoặc bridge `useRestlyStore.toast` → `sonner` `toast()`; không phá UX.
- Không invent notification backend.

## Don’t

- Không sửa: `Sidebar.tsx`, `SettingsPage.tsx`, `HistoryPage.tsx`, `EnvironmentsPage.tsx`, `ContentToolbar.tsx`, `RequestUrlBar.tsx` (opencode owns raw-button sweep).
- Không F01+ features.

## AC

- Search visually centered, max-w-md; icons flush right.
- MethodBadge renders via shadcn Badge.
- App toast path uses sonner/shadcn Toaster (no one-off motion toast markup unless sonner wrapper needs it).
- `npm run fmt && npm run lint && npm run build`
- Vietnamese summary when done.
