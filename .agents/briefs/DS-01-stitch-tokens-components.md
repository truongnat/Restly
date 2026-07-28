# Task brief for agy — DS-01 Design tokens + common components sync

You are the **executor**. Implement in `/root/Restly`. Do not expand scope into new product features (Auth tab, History search, etc.).

## Goal

Chuẩn hóa **design tokens** và **common / shared UI primitives** cho khớp Stitch Restly (light theme). Sau task này, shell + pages dùng cùng một hệ token, không lệch màu/spacing/typography.

## Source of truth (read first)

| Priority | Path |
| --- | --- |
| 1 | `design/html/request-detail.html` — light glass sidebar + full color map |
| 2 | `design/html/history.html`, `design/html/environments.html`, `design/html/welcome.html`, `design/html/settings.html` |
| 3 | `design/screenshots/*.png` |
| Avoid as sidebar reference | `design/html/main-window.html` dark `glass-sidebar` (`rgba(27,27,28,…)`) — **do not** bring dark sidebar back |

Canonical Stitch light tokens (from request-detail):

- background / surface / surface-bright: `#fcf9f8`
- on-surface: `#1b1b1c`
- on-surface-variant: `#464554`
- primary: `#261ca6`
- primary-container: `#3f3bbd`
- on-primary: `#ffffff`
- secondary: `#4648d4`
- secondary-container: `#6063ee`
- outline: `#777585`
- outline-variant: `#c7c4d6`
- surface-container*: `#f0eded`, `#f6f3f2`, `#eae7e7`, `#e5e2e1`, lowest `#ffffff`
- shell sidebar glass: `rgba(252, 249, 248, 0.72)` + blur 30px
- spacing: toolbar `52px`, sidebar `260px`, gutter `16px`, window margin `20px`, unit `4px`
- radius: DEFAULT 0.25rem, lg 0.5rem, xl 0.75rem
- fonts: Inter + JetBrains Mono (already in `index.html`)

## Current code to change

- `src/shared/styles/index.css` — `@theme` Restly tokens + shadcn `:root` mapping must **agree** with Stitch hex above (today some use `#f9f9fe` / blue-gray surfaces — align to Stitch `#fcf9f8` / warm gray surfaces).
- Keep shadcn working: map `--background`, `--foreground`, `--primary`, `--muted`, `--border`, `--sidebar*`, etc. onto the synced Stitch values (light).
- `src/shared/ui/*` — strengthen common primitives (e.g. `TrafficLights`); add small shared pieces only if reused 2+ times (e.g. MethodBadge, SectionLabel / label-caps).
- `src/shared/lib/utils.ts` — method colors stay; ensure they work on light surfaces.
- Shell consumers to **retokenize** (use semantic classes, not one-off hex):  
  `features/shell/ui/Sidebar.tsx`, `TitleBar.tsx`, `Toast.tsx`  
  and lightly fix pages if they hardcode colors that fight tokens (`SettingsPage` `#f0f0f0` / `#1b1b1c` → tokens).

## Out of scope

- New feature tabs (Auth/Headers/Body), History search, Env CRUD, real HTTP, Tauri
- Rewriting all shadcn component internals unless a token mapping break forces a tiny fix
- Dark mode redesign

## Acceptance criteria

1. Stitch hex values above appear as the app’s light theme source (CSS variables).
2. `--color-shell-sidebar` / `.glass-sidebar` = light glass (not dark).
3. shadcn `:root` tokens mapped so `bg-background`, `text-foreground`, `bg-primary`, `border-border`, sidebar tokens are consistent with Stitch light.
4. Shared spacing theme keys: toolbar / sidebar / gutter / window match Stitch.
5. Typography: document or add utility classes for `headline-md`, `body-sm`, `body-md`, `label-caps`, `mono-code` if missing; use them in shell where obvious.
6. No regressions: `npm run fmt` + `npm run lint` + `npm run build` pass.
7. Short report (Vietnamese OK for chat, English in code comments): files touched + token diff summary.

## Commands

```bash
cd /root/Restly
npm run fmt
npm run lint
npm run build
```

Dev server may already run behind Caddy on `:80` → Vite `:5173`. Do not break that.

## Done when

Build green + tokens synced + shell uses semantic tokens + you pasted a concise change summary.
