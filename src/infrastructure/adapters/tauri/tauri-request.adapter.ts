/**
 * Tauri HTTP request adapter.
 *
 * Implements the RequestClient port using Tauri's native HTTP engine.
 * This provides:
 * - Full HTTP/1.1 and HTTP/2 support
 * - Proper TLS verification
 * - Request cancellation
 * - Timing instrumentation
 * - Authentication (Basic, Bearer, API Key)
 * - Proxy support
 * - TLS configuration
 *
 * [RULE:TAURI:ADAPTER_BOUNDARY]
 * FE must not call Tauri directly outside infrastructure/adapters/tauri.
 */

import { invoke } from '@tauri-apps/api/core'

import type { RequestClient } from '@/application/ports/request.port'
import type { RequestDraft } from '@/entities'
import type { HttpExchangeResult } from '@/entities/response'

/**
 * Authentication types supported by the HTTP engine.
 */
export type HttpAuth =
  | { type: 'none' }
  | { type: 'basic'; username: string; password: string }
  | { type: 'bearer'; token: string }
  | { type: 'apiKeyHeader'; key: string; value: string }
  | { type: 'apiKeyQuery'; key: string; value: string }

/**
 * Proxy configuration.
 */
export interface ProxyConfig {
  url: string
  username?: string
  password?: string
  bypass?: string[]
}

/**
 * TLS configuration.
 */
export interface TlsConfig {
  verifyCertificates?: boolean
  caCertificate?: string
  clientCertificate?: string
  clientKey?: string
}

/**
 * Input contract for send_http_request command.
 * Must match SendHttpRequestInput in src-tauri/src/contracts/http.rs
 */
interface SendHttpRequestInput {
  runId: string
  method: string
  url: string
  headers: Record<string, string>
  body?: string
  timeoutMs?: number
  maxResponseBytes?: number
  followRedirects?: boolean
  maxRedirects?: number
  auth?: HttpAuth
  proxy?: ProxyConfig
  tls?: TlsConfig
}

/**
 * Output contract for send_http_request command.
 * Must match SendHttpRequestOutput in src-tauri/src/contracts/http.rs
 */
interface SendHttpRequestOutput {
  runId: string
  version: number
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  timings: {
    dnsMs: number | null
    connectMs: number | null
    tlsMs: number | null
    ttfbMs: number | null
    downloadMs: number | null
    totalMs: number | null
  }
  sizes: {
    encodedBodyBytes: number | null
    decodedBodyBytes: number | null
    downloadedBytes: number | null
  }
}

/**
 * Detect if running inside Tauri runtime.
 */
export function isTauriRuntime(): boolean {
  return '__TAURI_INTERNALS__' in window
}

/**
 * Create a Tauri-based request client.
 *
 * This adapter:
 * 1. Converts RequestDraft to Tauri command input
 * 2. Invokes the native send_http_request command
 * 3. Maps the response to HttpExchangeResult
 * 4. Supports cancellation via AbortSignal
 */
export function createTauriRequestClient(): RequestClient {
  return {
    async send(draft: RequestDraft, signal?: AbortSignal): Promise<HttpExchangeResult> {
      const runId = crypto.randomUUID()

      // Build headers from draft
      const headers: Record<string, string> = {}
      for (const h of draft.headers) {
        if (h.enabled && h.key.trim()) {
          headers[h.key.trim()] = h.value
        }
      }

      // Add content-type for body
      if (draft.body && draft.contentType) {
        headers['Content-Type'] = draft.contentType
      }

      const input: SendHttpRequestInput = {
        runId,
        method: draft.method,
        url: draft.url,
        headers,
        body: draft.body || undefined,
        timeoutMs: 30_000,
        maxResponseBytes: 50 * 1024 * 1024,
        followRedirects: true,
        maxRedirects: 10,
      }

      // Register cancellation handler
      const cancelPromise = signal
        ? new Promise<never>((_, reject) => {
            signal.addEventListener('abort', () => {
              // Fire and forget cancellation
              invoke('cancel_http_request', { input: { runId } }).catch(() => {})
              reject(new DOMException('Request cancelled', 'AbortError'))
            })
          })
        : null

      try {
        // Race between request and cancellation
        const output = cancelPromise
          ? await Promise.race([
              invoke<SendHttpRequestOutput>('send_http_request', { input }),
              cancelPromise,
            ])
          : await invoke<SendHttpRequestOutput>('send_http_request', { input })

        // Map to HttpExchangeResult
        return {
          version: 1 as const,
          status: output.status,
          statusText: output.statusText,
          headers: output.headers,
          body: output.body,
          timings: output.timings,
          sizes: output.sizes,
        }
      } catch (error) {
        // Re-throw abort errors as-is
        if (error instanceof DOMException && error.name === 'AbortError') {
          throw error
        }

        // Convert Tauri error to a more useful format
        const message = typeof error === 'string' ? error : String(error)
        throw new Error(`HTTP request failed: ${message}`, { cause: error })
      }
    },
  }
}
