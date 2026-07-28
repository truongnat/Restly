# Hotfix brief — HF-01 Welcome logo khớp Stitch

Executor: agy. Repo: `/root/Restly`. Scope hẹp — chỉ logo / brand mark.

## Problem

Welcome logo hiện tại **sai so với design**:

| | Design Stitch | App hiện tại |
| --- | --- | --- |
| Icon | Material Symbol **`api`** (FILL 1) — dạng hub/API | Lucide **`Zap`** (sét) |
| Nền tile | `bg-primary-container` (`#3f3bbd`) | `bg-primary` (`#261ca6`) |
| Size icon | ~`text-5xl` trong ô `w-24 h-24` | `size-12` Zap |

Nguồn sự thật:

- `design/html/welcome.html` (khoảng dòng 146–148)
- `design/screenshots/welcome.png`

```html
<div class="w-24 h-24 bg-primary-container rounded-2xl ... rotate-12 ...">
  <span class="material-symbols-outlined text-white text-5xl ..." data-icon="api"
        style="font-variation-settings: 'FILL' 1;">api</span>
</div>
```

## Required fix

1. Tạo shared brand mark, ví dụ `src/shared/ui/RestlyLogo.tsx` (hoặc `BrandMark.tsx`):
   - Ô `size-24` / `rounded-2xl` / `bg-primary-container` / `text-on-primary` / `shadow-2xl` / `rotate-12` + hover `rotate-0` như design.
   - Glyph = Material **`api`** filled (không dùng Zap).
   - Cách implement (chọn 1, ưu tiên A):
     - **A.** Inline SVG path khớp Material Symbol `api` (không phụ thuộc webfont) — preferred cho desktop sau này.
     - **B.** Load Material Symbols Outlined (FILL) trong `index.html` rồi render chữ `api` như Stitch.
2. `WelcomePage.tsx`: thay block Zap bằng `<RestlyLogo />` (giữ motion float nếu đang có).
3. Feature card “Fast Requests” vẫn dùng bolt/Zap — **không** đổi thành logo; chỉ logo hero.
4. Không đụng Auth/History/Env features khác.

## Acceptance

- Welcome hero logo nhìn giống `welcome.png` / welcome.html (API hub icon, không phải lightning).
- Nền tile = primary-container.
- `npm run fmt && npm run lint && npm run build` pass.
- Báo cáo ngắn tiếng Việt: file đổi + cách render icon (SVG vs font).

## Commands

```bash
cd /root/Restly
npm run fmt && npm run lint && npm run build
```
