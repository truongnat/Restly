/**
 * Tauri adapters — native capability implementations.
 *
 * [RULE:TAURI:ADAPTER_BOUNDARY]
 * FE must not call Tauri directly outside infrastructure/adapters/tauri.
 */

export {
  createTauriRequestClient,
  isTauriRuntime,
  type HttpAuth,
  type ProxyConfig,
  type TlsConfig,
} from './tauri-request.adapter'

export {
  createTauriWindowClient,
  type WindowClient,
  type WindowState,
  type WindowSize,
  type WindowPosition,
} from './tauri-window.adapter'

export {
  createTauriMockServerClient,
  type MockServerClient,
  type MockRoute,
  type MockServerStatus,
  type MockServerStats,
} from './tauri-mock-server.adapter'
