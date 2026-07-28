# Brief HF-11-agy — kebab-case rename (features + shared/ui)

Owner: **agy** · Model: `gemini-3.1-pro-high`  
Repo: `/root/Restly`  
Rule: `.cursor/rules/file-naming.mdc`

## Intent

Migrate PascalCase filenames → **lowercase kebab-case**. You own **features + shared/ui** only.

## Renames (git mv preferred)

| From | To |
| --- | --- |
| `src/features/shell/ui/AppShell.tsx` | `app-shell.tsx` |
| `src/features/shell/ui/AppTopBar.tsx` | `app-top-bar.tsx` |
| `src/features/shell/ui/ContentToolbar.tsx` | `content-toolbar.tsx` |
| `src/features/shell/ui/Sidebar.tsx` | `sidebar.tsx` |
| `src/features/shell/ui/TitleBar.tsx` | `title-bar.tsx` |
| `src/features/shell/ui/Toast.tsx` | `toast.tsx` |
| `src/features/request-editor/ui/RequestUrlBar.tsx` | `request-url-bar.tsx` |
| `src/features/request-editor/ui/RequestWorkspace.tsx` | `request-workspace.tsx` |
| `src/shared/ui/MethodBadge.tsx` | `method-badge.tsx` |
| `src/shared/ui/RestlyLogo.tsx` | `restly-logo.tsx` |
| `src/shared/ui/TrafficLights.tsx` | `traffic-lights.tsx` |

## Also

- Update **all** import paths across the repo that reference the old paths (including `src/pages/*`, `src/app/router.tsx`, relative imports inside shell/request-editor).
- Keep **export symbol names** unchanged (`AppShell`, `MethodBadge`, …).
- Do **not** rename page files (`*Page.tsx`) — opencode owns that next.
- Do not rename `main.tsx`, `index.ts`, `components/ui/*` (already kebab).

## AC

- Old PascalCase paths above no longer exist.
- `rg 'shell/ui/(AppShell|AppTopBar|ContentToolbar|Sidebar|TitleBar|Toast)' src` → 0
- `rg 'RequestUrlBar|RequestWorkspace|MethodBadge|RestlyLogo|TrafficLights' src --glob '*.ts*' -l` may still hit **symbol** names; path imports must use kebab filenames.
- `npm run fmt && npm run lint && npm run build`
- Vietnamese summary.
