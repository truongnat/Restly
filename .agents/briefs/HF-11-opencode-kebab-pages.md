# Brief HF-11-opencode — kebab-case rename (pages + router)

Owner: **opencode** · Model: `opencode/deepseek-v4-flash-free`  
Repo: `/root/Restly`  
Rule: `.cursor/rules/file-naming.mdc`

## Prerequisite

**agy HF-11 must finish first** (features/shared already kebab). You only rename pages + fix router imports.

## Renames (git mv preferred)

| From | To |
| --- | --- |
| `src/pages/AuthPage.tsx` | `auth-page.tsx` |
| `src/pages/EnvironmentsPage.tsx` | `environments-page.tsx` |
| `src/pages/HistoryPage.tsx` | `history-page.tsx` |
| `src/pages/MocksPage.tsx` | `mocks-page.tsx` |
| `src/pages/SettingsPage.tsx` | `settings-page.tsx` |
| `src/pages/WelcomePage.tsx` | `welcome-page.tsx` |
| `src/pages/WorkspacePage.tsx` | `workspace-page.tsx` |

## Also

- Update `src/app/router.tsx` (and any other imports) to `@/pages/auth-page` etc.
- Keep export names: `WelcomePage`, `WorkspacePage`, …
- Do **not** rename feature/shared files (already done by agy).
- Do not touch `main.tsx`.

## AC

- No `*Page.tsx` PascalCase left under `src/pages/`.
- `rg "pages/(Auth|Environments|History|Mocks|Settings|Welcome|Workspace)Page" src` → 0
- `npm run fmt && npm run lint && npm run build`
- Vietnamese summary.
