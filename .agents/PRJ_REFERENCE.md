# Restly — Project Reference

Updated: **2026-07-28** (five-gap wave: real HTTP + UX power + realtime lite).

## Executive summary

Restly is a **desktop-first API client**. Current phase: **hybrid mock + real HTTP** in the browser (Vite). Default Send uses **`fetch`**; optional `VITE_USE_MOCK_HTTP=true`. Running Mock Server routes short-circuit network. **No Tauri / OS Keychain / Sparkle** yet (security-lite AES vault + settings toggles only).

## Feature status

| Gap area | Status |
| --- | --- |
| Real HTTP + HEAD/OPTIONS + cancel | done |
| Mock wire into Send | done |
| API Key auth | done |
| ⌘/Ctrl+K palette | done |
| Codegen (cURL/JS/Python/Swift) | done |
| Postman v2.1 import/export | done |
| GraphQL body mode | done |
| WebSocket / SSE pages | done |
| Pre-request + Test scripts (5s) | done |
| Secrets encrypt helper + auto-update toggle | lite (not OS Keychain / Sparkle) |
| Nested folders / multi-workspace | still partial |
| OAuth real grant + Tauri | out |

## Persist

`restly.mock.v1` — folders, envs, history, auth profiles, mocks, scripts, autoUpdate, prefs.

## Stack

Vite 8, React 19, TS, Tailwind 4, shadcn, TanStack, Zod, Zustand, Vitest, OXC.
