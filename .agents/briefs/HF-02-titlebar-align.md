# Hotfix brief — HF-02 TitleBar: bỏ traffic lights + căn line với sidebar

Executor: agy. Repo: `/root/Restly`. Scope: shell TitleBar layout only.

## User feedback (screenshot)

1. **3 chấm macOS/iOS (TrafficLights) trên TitleBar là sai** — app đang xem trên web (Caddy), không phải cửa sổ native. Bỏ fake window controls khỏi TitleBar (và mọi chỗ shell workspace dùng cùng pattern). Có thể giữ component `TrafficLights.tsx` cho Settings modal / phase Tauri sau, nhưng **không render trên TitleBar workspace**.
2. **Đường kẻ dọc sau “Restly” phải thẳng hàng với cạnh phải sidebar** — hiện divider nằm sau brand+lights nên lệch phải so với `border-r` của sidebar (`--spacing-sidebar` = 260px).

## Required layout

TitleBar chia 2 vùng ngang:

```
|←—— w = --spacing-sidebar (260px) ——→|←———— flex-1 content toolbar ————→|
|  Restly (brand)                      | env pill ···     New Request · Sync · Settings |
|  (border-r trùng sidebar)            |
```

Dưới TitleBar:

```
| Sidebar 260px                        | Main |
```

→ Cạnh phải brand zone **trùng** cạnh phải sidebar (một đường dọc liên tục).

### Implementation hints

- `src/features/shell/ui/TitleBar.tsx`:
  - Remove `<TrafficLights />`.
  - Left brand cell: `w-(--spacing-sidebar) shrink-0` + `border-r border-border/60` (cùng token sidebar), pad ngang khớp sidebar (`px-3` hoặc `px-(--spacing-window)` — **ưu tiên** cạnh phải trùng pixel với aside).
  - Phần còn lại: env dropdown + actions; bỏ `w-px` divider cũ (đã có `border-r` của brand cell).
  - Header ngoài: cân nhắc bỏ `px-(--spacing-window)` full-bleed nếu nó làm lệch 260px; brand cell tự padding, content zone tự padding.
- `Sidebar.tsx`: đảm bảo `w-(--spacing-sidebar)` không đổi; border-r cùng style với brand cell.
- `SettingsPage` nếu vẫn dùng TrafficLights trong modal giả macOS — **OK giữ** (không phải workspace chrome). Không đụng feature F01+.

## Acceptance

1. Workspace `/workspace` (và History/Env dùng TitleBar): **không còn** 3 chấm đỏ/vàng/xanh.
2. Cạnh phải cột “Restly” trên TitleBar **thẳng** với cạnh phải Sidebar (đo bằng `--spacing-sidebar`).
3. Env dropdown bắt đầu ngay trong vùng content (bên phải line).
4. `npm run fmt && npm run lint && npm run build` pass.
5. Báo cáo ngắn tiếng Việt.

## Commands

```bash
cd /root/Restly
npm run fmt && npm run lint && npm run build
```

Live check: http://127.0.0.1/workspace
