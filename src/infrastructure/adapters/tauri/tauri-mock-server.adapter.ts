/**
 * Tauri mock server adapter.
 *
 * Provides mock server control functions using Tauri's native mock server.
 *
 * [RULE:TAURI:ADAPTER_BOUNDARY]
 * FE must not call Tauri directly outside infrastructure/adapters/tauri.
 */

import { invoke } from '@tauri-apps/api/core'

/**
 * A mock route definition.
 */
export interface MockRoute {
  id: string
  method: string
  path: string
  status: number
  headers?: Record<string, string>
  body?: string
  delayMs?: number
  enabled?: boolean
}

/**
 * Mock server statistics.
 */
export interface MockServerStats {
  totalRequests: number
  matchedRequests: number
  notFoundRequests: number
}

/**
 * Mock server status.
 */
export interface MockServerStatus {
  running: boolean
  port: number | null
  baseUrl: string | null
  routeCount: number
  stats: MockServerStats | null
}

/**
 * Mock server client.
 */
export interface MockServerClient {
  start(port?: number): Promise<MockServerStatus>
  stop(): Promise<void>
  getStatus(): Promise<MockServerStatus>
  addRoute(route: MockRoute): Promise<void>
  removeRoute(id: string): Promise<boolean>
  listRoutes(): Promise<MockRoute[]>
  clearRoutes(): Promise<number>
  getStats(): Promise<MockServerStats>
  resetStats(): Promise<void>
}

/**
 * Create a Tauri-based mock server client.
 */
export function createTauriMockServerClient(): MockServerClient {
  return {
    async start(port?: number): Promise<MockServerStatus> {
      return invoke<MockServerStatus>('start_mock_server', {
        input: port ? { port } : undefined,
      })
    },

    async stop(): Promise<void> {
      await invoke('stop_mock_server')
    },

    async getStatus(): Promise<MockServerStatus> {
      return invoke<MockServerStatus>('get_mock_server_status')
    },

    async addRoute(route: MockRoute): Promise<void> {
      await invoke('add_mock_route', { route })
    },

    async removeRoute(id: string): Promise<boolean> {
      return invoke<boolean>('remove_mock_route', { id })
    },

    async listRoutes(): Promise<MockRoute[]> {
      return invoke<MockRoute[]>('list_mock_routes')
    },

    async clearRoutes(): Promise<number> {
      return invoke<number>('clear_mock_routes')
    },

    async getStats(): Promise<MockServerStats> {
      return invoke<MockServerStats>('get_mock_server_stats')
    },

    async resetStats(): Promise<void> {
      await invoke('reset_mock_server_stats')
    },
  }
}
