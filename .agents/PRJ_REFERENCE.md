# Project Reference

## Executive summary

- Restly là ứng dụng API client desktop-first (thay thế Postman), hỗ trợ các giao thức REST, WebSocket, SSE và GraphQL.
- Kiến trúc hiện tại hoạt động theo cơ chế hybrid: frontend SPA (Vite + React 19 + TypeScript) chạy HTTP `fetch` trực tiếp từ trình duyệt, kết hợp với mock server fixture và backend Tauri (Rust v2) đang được tích hợp cho native capabilities.
- Ràng buộc quan trọng: Dự án bắt buộc sử dụng **bun** làm package manager cho tất cả các thao tác JavaScript/TypeScript (tuyệt đối không dùng npm/yarn/pnpm).
- Quy trình phát triển chính bao gồm viết mã theo Clean Architecture / DI container, kiểm tra định dạng và linter qua oxfmt/oxlint, chạy unit test qua vitest và build qua vite/tauri CLI.
- Rủi ro / Điểm chưa hoàn thiện lớn nhất: Tích hợp nền tảng Tauri (Rust backend, keychain bảo mật, file system native) vẫn đang trong quá trình chuyển đổi từ localStorage (`restly.mock.v1`).

## Project identity

- Purpose: API client mạnh mẽ, nhẹ và nhanh dành cho developer để thiết kế, kiểm thử, mock và tự động hóa các API request.
- Users/stakeholders: Software engineers, API developers, QA automation engineers, DevOps.
- Domain: Developer Tools / API Testing & Management.
- Lifecycle/status: Active development (hybrid Phase, Tauri v2 native layer integration in progress).

## Workspaces / apps (monorepo)

| Path | Type | Stack | Entry point | Key commands | Source |
|---|---|---|---|---|---|
| `.` | app | Vite 8, React 19, TypeScript 6, Tailwind CSS 4, Zustand, TanStack Query | `src/app/main.tsx` | `bun run dev`, `bun run build`, `bun test`, `bun run check` | `package.json` |
| `examples/server` | service | Node.js (ES module), Express 4 | `examples/server/server.js` | `bun run dev` (inside `examples/server`) | `examples/server/package.json` |
| `src-tauri` | app / native host | Rust 1.77+, Tauri v2, Tokio, Reqwest, Axum, Rusqlite | `src-tauri/src/main.rs`, `src-tauri/src/lib.rs` | `bun run tauri:dev`, `bun run tauri:build`, `bun run check:rust` | `src-tauri/Cargo.toml` |

## Technology stack

| Technology | Role | Version | Workspace(s) | Source | Confidence |
|---|---|---|---|---|---|
| Bun | Package manager & runtime | 1.x | root | User rule / environment | confirmed |
| React | Frontend UI library | 19.2.7 | root | `package.json` | confirmed |
| Vite | Build tool & dev server | 8.1.1 | root | `package.json` | confirmed |
| TypeScript | Type checker & language | 6.0.2 | root | `package.json` | confirmed |
| Tailwind CSS | Styling framework | 4.3.3 | root | `package.json` | confirmed |
| TanStack Query / Table / Form / Router | State, table, form & routing | 5.x / 8.x / 1.x | root | `package.json` | confirmed |
| Zustand | Global UI state management | 5.0.14 | root | `package.json` | confirmed |
| Zod | Schema validation | 4.4.3 | root | `package.json` | confirmed |
| Vitest | Frontend unit test runner | 3.2.7 | root | `package.json` | confirmed |
| OXC (oxlint, oxfmt) | Linter & formatter | 1.76 / 0.61 | root | `package.json` | confirmed |
| Tauri | Desktop application framework | 2.11.x | root / `src-tauri` | `package.json`, `src-tauri/Cargo.toml` | confirmed |
| Rust | Native backend language | 1.77+ | `src-tauri` | `src-tauri/Cargo.toml` | confirmed |
| Express | Example mock API server | 4.21.0 | `examples/server` | `examples/server/package.json` | confirmed |

## Architecture and key flows

| Component / flow | Responsibility | Entry point / boundary | Dependencies | Source |
|---|---|---|---|---|
| `app/` | Composition root, DI boot container, providers, router | `src/app/main.tsx` | `application/`, `infrastructure/` | `docs/CODING_STANDARDS.md` |
| `application/ports` | Interfaces định nghĩa I/O và API capabilities | `src/application/ports/` | `entities/` | `docs/CODING_STANDARDS.md` |
| `application/use-cases` | Pure business logic sử dụng các ports | `src/application/use-cases/` | `entities/`, `application/ports` | `docs/CODING_STANDARDS.md` |
| `features/` | UI components và TanStack Query/Form wiring | `src/features/<feature>/` | `application/`, `entities/`, `components/ui` | `docs/CODING_STANDARDS.md` |
| `infrastructure/adapters` | Implementations cho các ports (HTTP fetch, Tauri native) | `src/infrastructure/adapters/` | `application/ports` | `docs/CODING_STANDARDS.md` |
| `REQUEST:SEND` | Thực thi gửi một HTTP request và nhận response | `src/application/use-cases/send-request.ts` | HTTP adapter, env variable substitution | `docs/engineering/flow-registry.md` |
| `REQUEST:CANCEL` | Hủy một HTTP request đang thực thi | AbortController in adapter | `REQUEST:SEND` | `docs/engineering/flow-registry.md` |
| `ENVIRONMENT:RESOLVE_VARIABLES` | Thay thế các biến môi trường dạng `{{var}}` | `src/shared/lib/substitute-env.ts` | Environment store | `docs/engineering/flow-registry.md` |
| `MOCK:START_SERVER` | Chạy mock server hoặc echo adapter nội bộ | `src/infrastructure/mock/` | Zustand mock state | `docs/engineering/flow-registry.md` |
| `STORAGE:MIGRATE` | Quản lý lưu trữ local và chuyển đổi phiên bản schema | `src/shared/lib/persist.ts` | `localStorage` / Rusqlite | `docs/engineering/flow-registry.md` |

## Business rules

| ID | Rule | Affected area | Source | Confidence |
|---|---|---|---|---|
| BR-BUN-ONLY | Tất cả lệnh cài đặt, lint, test, build phải sử dụng package manager `bun` | Repository operations | User global rule | confirmed |
| BR-DI-INWARD | Quản lý phụ thuộc theo nguyên tắc Dependency Injection; `entities` và `application` không được import React hoặc adapters trực tiếp | Architecture / `src/` | `docs/CODING_STANDARDS.md` | confirmed |
| DEPENDENCY:UPSTREAM_OUTPUT_ONLY | Chỉ có các bước upstream đã hoàn thành mới được cung cấp output cho request downstream | Workflow / Request execution | `docs/engineering/flow-registry.md` | confirmed |
| DEPENDENCY:NO_NETWORK_ON_RESOLUTION_FAILURE | Lỗi resolve biến/output sẽ dừng ngay trước khi thực hiện Network I/O | Workflow / Request execution | `docs/engineering/flow-registry.md` | confirmed |
| WORKFLOW:TERMINAL_STATE_IMMUTABLE | Workflow run đã vào trạng thái kết thúc (terminal state) thì không thể quay lại trạng thái running | Workflow execution | `docs/engineering/flow-registry.md` | confirmed |
| SECURITY:REDACT_EVIDENCE | Các phát hiện/bằng chứng an ninh tuyệt đối không được làm lộ secrets hoặc token | Security & Logging | `docs/engineering/flow-registry.md` | confirmed |
| STORAGE:SECRET_REFERENCE_ONLY | Kho lưu trữ chính chỉ chứa reference tới secret, không lưu raw secret | Storage & Auth | `docs/engineering/flow-registry.md` | confirmed |

## Key constraints

| Constraint | Type | Reason/source | Impact |
|---|---|---|---|
| Chỉ sử dụng Bun | Technical / Policy | User rule `RULE[user_global]` | Không sử dụng npm, yarn, pnpm trong bất kỳ lệnh nào. |
| Inward Dependency Rule | Technical / Architecture | `docs/CODING_STANDARDS.md` | `entities` và `application` giữ nguyên tính thuần khiết (pure JS/TS), không phụ thuộc UI hay framework. |
| Hybrid Browser / Native mode | Technical / Platform | `README.md`, `src-tauri/Cargo.toml` | Mã nguồn cần tương thích chạy cả môi trường trình duyệt (Vite fetch) và ứng dụng desktop native (Tauri). |
| Conventional Commits format | Workflow / Version control | `docs/engineering/commit-rules.md` | Commit message phải tuân thủ dạng `<type>(<scope>): <subject>`. |

## Verified commands

| Purpose | Command | Source | Confidence |
|---|---|---|---|
| Setup | `bun install` | User rule & `package.json` | confirmed |
| Run (Web Dev) | `bun run dev` | `package.json` | confirmed |
| Run (Mock Server) | `cd examples/server && bun run dev` | `examples/server/package.json` | confirmed |
| Run (Tauri Dev) | `bun run tauri:dev` | `package.json` | confirmed |
| Test (Frontend) | `bun run test` | `package.json` | confirmed (88 tests passed) |
| Test (Rust) | `bun run check:rust` | `package.json` | confirmed |
| Lint | `bun run lint` | `package.json` | confirmed |
| Format Check | `bun run fmt:check` | `package.json` | confirmed |
| Format Fix | `bun run fmt` | `package.json` | confirmed |
| Build (Frontend) | `bun run build` | `package.json` | confirmed (Vite build OK) |
| Build (Tauri) | `bun run tauri:build` | `package.json` | confirmed |
| Full Check Gate | `bun run check` | `package.json` | confirmed |

## Project conventions

### Code

- Structure/naming: Feature-driven clean architecture (`app`, `pages`, `features`, `entities`, `shared`, `infrastructure`). File tên theo kebab-case hoặc PascalCase cho React components.
- Error handling: Async operations trả về typed errors hoặc ném lỗi có kiểm soát; UI hiển thị toast thông qua Sonner.
- Doc-comment style (detected): TSDoc/JSDoc cho TypeScript, standard doc comments (`///`) cho Rust.
- Flow/rationale comments: Sử dụng Flow ID và Rule ID tags được đăng ký trong `docs/engineering/flow-registry.md`.

### Git

- Branch mode (`direct` / `checkout`): `direct` (hoặc `checkout` theo cấu hình `settings.yaml`).
- Base branch: `main`
- Branch naming: `feat/<slug>`, `fix/<slug>`
- Commit convention: Conventional Commits (`feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `build`, `ci`, `chore`, `style`, `revert`).

### Pull requests

- Title: Conventional commit title format.
- Required description sections: Summary, Business rules, Verification, Refs.
- Required checks: `bun run check` (fmt + lint + test + build) và `bun run check:rust`.

### Reports

- Executive-summary style: Tối đa 5 bullet points ngắn gọn, đi thẳng vào quyết định chính.
- Developer overview panel (inside each real artifact — not a separate OVERVIEW.md): Có mặt trên mọi lifecycle artifact.
- Charts/diagrams (Mermaid): Chỉ sử dụng khi làm rõ thiết kế/luồng hoạt động.
- Progress source of truth: `TASKS.md` + `session.sh status` (không tạo `OVERVIEW.md`).
- Custom sections: Giữ đúng mẫu chuẩn English headings.

### Decision and visual gates

- Critical/blocking question policy: STOP ngay lập tức, xác định Ask method (`confirm`, `choice`, `fact`, `table`, `diagram`, `html`), hỏi người dùng và chờ phản hồi trước khi tiếp tục.
- Preferred diagram format: Mermaid.
- HTML decision-aid policy: Sử dụng `VISUAL_DECISION.html` khi cần làm rõ giao diện/bố cục.

## Security notes

- Tuyệt đối không lưu trữ hoặc commit API keys, tokens, mật khẩu hoặc secrets lên mã nguồn/git.
- Cấu hình lưu trữ secrets sử dụng cơ chế tham chiếu (`STORAGE:SECRET_REFERENCE_ONLY`) và trợ lý mã hóa AES (hoặc OS Keychain khi Tauri hoàn thiện).
- Bằng chứng kiểm thử và nhật ký không được chứa dữ liệu nhạy cảm (`SECURITY:REDACT_EVIDENCE`).

## Authoritative references

| Source | Purpose | Authority |
|---|---|---|
| `README.md` | Tổng quan dự án, kiến trúc và danh sách màn hình | primary |
| `docs/CODING_STANDARDS.md` | Chuẩn mực lập trình TypeScript/React và quy tắc DI | primary |
| `docs/engineering/commit-rules.md` | Quy tắc commit và quy trình kiểm thử trước push | primary |
| `docs/engineering/flow-registry.md` | Danh mục quản lý Flow IDs và Rule IDs của dự án | primary |
| `.agents/settings.yaml` | Cấu hình tham số dành cho các AI agents | primary |
| `AGENTS.md` | Hướng dẫn và quy định làm việc của Agent Kit | primary |

## Agent CLIs

<!-- Generated by detect_agents.py at 2026-07-31T15:14:03Z. No secrets. -->

| CLI id | Status | Path | Auth probe | Notes |
|---|---|---|---|---|
| `claude` | available | `/Users/truongdq/.local/bin/claude` | auth_ok | do not treat auth_unknown as proof of login |
| `codex` | available | `/Users/truongdq/.local/bin/codex` | auth_unknown | do not treat auth_unknown as proof of login |
| `opencode` | available | `/Users/truongdq/.opencode/bin/opencode` | auth_unknown | do not treat auth_unknown as proof of login |
| `cursor` | available | `/Users/truongdq/.local/bin/cursor` | auth_unknown | do not treat auth_unknown as proof of login |
| `antigravity` | missing | `—` | n/a | binary not on PATH |
| `gemini` | available | `/opt/homebrew/bin/gemini` | auth_unknown | do not treat auth_unknown as proof of login |
| `aider` | missing | `—` | n/a | binary not on PATH |

## Unknowns and conflicts

| Question / conflict | Impact | Owner | Blocking |
|---|---|---|---|
| Mức độ sẵn sàng hoàn toàn của Tauri v2 Rust backend để thay thế hoàn toàn browser `localStorage` persist (`restly.mock.v1`) | Native storage & system keychain activation | Tech Lead / Developer | no |

## Freshness

- Mode: refresh
- Generated or updated: 2026-07-31T22:14:30+07:00
- Source commit: 033dd03
- Scope inspected: Root workspace, `src/`, `src-tauri/`, `examples/server/`, `docs/`, `.agents/`
