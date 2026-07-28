# Brief GAP-W1-agy — Real HTTP + Mock wire + API Key

Owner: **agy** · Model: `gemini-3.1-pro-high`  
Repo: `/root/Restly`  
Cards: **T-030**, **T-031**, **T-032**

## Intent

Replace mock-only Send with a **real `fetch` adapter** (cancelable), extend methods, apply **API Key** auth, and when a Mock Server is **running** and URL+method matches a route, return canned response without network.

## Owned paths (ONLY these — do not touch others)

- `src/entities/http.ts`
- `src/shared/constants/http.ts` (if method lists live here)
- `src/entities/request.ts` (+ schemas if auth enum)
- `src/entities/schemas.ts` (auth/API key fields only)
- `src/application/ports/*` related to HTTP send (read first)
- `src/application/use-cases/send-request.ts` (+ tests)
- `src/infrastructure/adapters/mock/mock-request.adapter.ts` — keep as fallback OR rename role
- **New:** `src/infrastructure/adapters/http/fetch-request.adapter.ts` (or similar kebab)
- `src/infrastructure/di/*` — register real adapter; allow env/flag `VITE_USE_MOCK_HTTP=true` to force mock
- `src/features/request-editor/model/use-send-request.ts`
- `src/features/request-editor/ui/auth-editor.tsx` — API Key fields only
- `src/features/request-editor/ui/request-url-bar.tsx` — method select HEAD/OPTIONS if here
- `src/app/store/restly-store.ts` — only if needed for API key on `RequestAuth` / cancel token plumbing (minimal)
- Tests under matching `*.test.ts`

## Do

### T-030 Real HTTP
1. Confirm ports/`HttpExchangeResult` / draft types.
2. Implement fetch adapter: method, URL, headers, body, auth → Authorization / custom headers.
3. Support **AbortController**; wire cancel from UI if a cancel button exists or add small Cancel while sending in owned send hook only.
4. Add **HEAD** and **OPTIONS** to `HttpMethod` + UI selects you own.
5. Map network errors / non-OK into existing response UI shape (status, headers, body text).
6. Default: **real fetch**. If `import.meta.env.VITE_USE_MOCK_HTTP === 'true'`, use mock adapter.

### T-031 Mock wire
1. Before fetch: look up `useRestlyStore.getState().mockServers` for `running===true`, match `baseUrl+path` (normalize) and method + enabled route.
2. On match: delay `delayMs`, return canned `status` + `responseBody` + mock headers — **no network**.
3. Unit test: matching route short-circuits.

### T-032 API Key
1. Extend `RequestAuthType` with `'apikey'`.
2. Fields: `apiKey` / `apiKeyHeader` (default `X-API-Key`) / `apiKeyIn: 'header' | 'query'`.
3. Auth editor UI for API Key.
4. Adapter applies key to header or query string.

## Don’t

- Edit `auth-page.tsx`, `mocks-page.tsx`, command palette, codegen, GraphQL UI, welcome export, sidebar chrome (except method constants if shared).
- Tauri / Keychain / Sparkle.
- OAuth network flows.
- Commit git / push.

## Verify

```bash
cd /root/Restly && npm run check
```

Vietnamese summary of files changed.

## AC

- Send can hit a real URL (e.g. https://httpbin.org/get) when mock not forced.
- HEAD/OPTIONS selectable.
- Running mock route wins over network.
- API Key auth applies header or query.
- Tests green.
