# Brief GAP-W2-opencode — Scripts sandbox + secrets encrypt + settings

Owner: **opencode** · Model: `opencode/deepseek-v4-flash-free`  
Repo: `/root/Restly`  
Cards: **T-039**, **T-040**

## Intent

1. **Pre-request + Test** script tabs (sandbox, 5s timeout) on workspace — mock-safe `console` + `pm`-lite stubs (`environment.get`, `response.code` after send).
2. **Encrypt secret env values** at rest in persist (Web Crypto AES-GCM with key in sessionStorage or derived constant labeled DEV-ONLY).
3. Settings: **Auto-update** toggle + ensure telemetry toggle persists (no Sparkle binary).

## Owned paths

- `src/features/request-editor/ui/scripts-editor.tsx` (**new**)
- `src/features/request-editor/ui/request-workspace.tsx` — add Scripts tab(s) only
- `src/features/request-editor/lib/script-sandbox.ts` (**new**)
- `src/features/request-editor/model/use-send-request.ts` — call pre-request before send / tests after (**coordinate**: if agy changed this file in W1, rebase carefully; only add script hooks)
- `src/shared/lib/persist.ts` + secret encrypt helpers (**new** `src/shared/lib/secret-vault.ts`)
- `src/pages/settings-page.tsx` — auto-update toggle
- `src/app/store/restly-store.ts` — script fields + autoUpdate pref only

## Don’t

Touch fetch adapter, mocks matching, command palette, codegen, WS/SSE pages.

## Verify

`npm run check`
