import { useRestlyStore } from '@/app/store/restly-store'
import type { RequestClient } from '@/application/ports/request.port'
import type { MockServer, RequestDraft } from '@/entities'
import {
  RESPONSE_CONTRACT_VERSION,
  type HttpExchangeResult,
  type ResponseSizes,
  type ResponseTimings,
} from '@/entities/response'
import { serializeRequestBody } from '@/infrastructure/adapters/http/serialize-request-body'

function utf8ByteLength(value: string): number {
  return new TextEncoder().encode(value).length
}

function browserTimings(values: {
  ttfbMs?: number
  downloadMs?: number
  totalMs: number
}): ResponseTimings {
  return {
    dnsMs: null,
    connectMs: null,
    tlsMs: null,
    ttfbMs: values.ttfbMs ?? null,
    downloadMs: values.downloadMs ?? null,
    totalMs: values.totalMs,
  }
}

function browserSizes(decodedBodyBytes: number): ResponseSizes {
  return {
    encodedBodyBytes: null,
    decodedBodyBytes,
    downloadedBytes: null,
  }
}

function getStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    204: 'No Content',
    301: 'Moved Permanently',
    302: 'Found',
    304: 'Not Modified',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
  }
  return statusTexts[status] ?? (status >= 200 && status < 300 ? 'OK' : 'Response')
}

function normalizeUrlPath(urlStr: string): string {
  try {
    const u = new URL(urlStr)
    let p = u.origin.toLowerCase() + u.pathname.replace(/\/+$/, '')
    if (p.endsWith('/')) p = p.slice(0, -1)
    return p
  } catch {
    let s = urlStr.toLowerCase().trim()
    if (s.endsWith('/')) s = s.slice(0, -1)
    return s
  }
}

export function findMatchingMockRoute(draft: RequestDraft, mockServers: MockServer[]) {
  const runningServers = mockServers.filter((s) => s.running)
  if (runningServers.length === 0) return null

  const reqNorm = normalizeUrlPath(draft.url)

  for (const server of runningServers) {
    const baseNorm = server.baseUrl.replace(/\/+$/, '')
    for (const route of server.routes) {
      if (!route.enabled) continue
      if (route.method.toUpperCase() !== draft.method.toUpperCase()) continue

      const routePath = route.path.startsWith('/') ? route.path : `/${route.path}`
      const mockFullUrl = `${baseNorm}${routePath}`
      const mockNorm = normalizeUrlPath(mockFullUrl)

      if (reqNorm === mockNorm) {
        return route
      }
    }
  }

  return null
}

export function createFetchRequestClient(): RequestClient {
  return {
    async send(draft: RequestDraft, signal?: AbortSignal): Promise<HttpExchangeResult> {
      // T-031 Mock wire check before real network
      const mockServers = useRestlyStore.getState().mockServers
      const mockRoute = findMatchingMockRoute(draft, mockServers)

      if (mockRoute) {
        if (mockRoute.delayMs > 0) {
          await new Promise<void>((resolve, reject) => {
            const timer = setTimeout(() => resolve(), mockRoute.delayMs)
            if (signal) {
              signal.addEventListener('abort', () => {
                clearTimeout(timer)
                reject(new DOMException('Aborted', 'AbortError'))
              })
            }
          }).catch((err) => {
            if (err?.name === 'AbortError') {
              throw err
            }
          })
        }

        if (signal?.aborted) {
          return {
            version: RESPONSE_CONTRACT_VERSION,
            status: 0,
            statusText: 'Cancelled',
            body: 'Request was cancelled.',
            headers: {},
            timings: browserTimings({ totalMs: mockRoute.delayMs }),
            sizes: browserSizes(utf8ByteLength('Request was cancelled.')),
          }
        }

        const bodyStr = mockRoute.responseBody ?? ''
        const bytes = utf8ByteLength(bodyStr)
        return {
          version: RESPONSE_CONTRACT_VERSION,
          status: mockRoute.status ?? 200,
          statusText: getStatusText(mockRoute.status ?? 200),
          body: bodyStr,
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'x-restly-mock': 'true',
          },
          timings: browserTimings({ totalMs: mockRoute.delayMs }),
          sizes: {
            encodedBodyBytes: bytes,
            decodedBodyBytes: bytes,
            downloadedBytes: null,
          },
        }
      }

      // Real fetch logic
      const startTime = performance.now()

      try {
        let fetchUrl = draft.url
        const headers: Record<string, string> = {}

        // Add user defined headers
        for (const h of draft.headers) {
          if (h.enabled && h.key) {
            headers[h.key] = h.value
          }
        }

        // Apply Auth
        if (draft.auth.type === 'bearer' && draft.auth.bearerToken) {
          headers['Authorization'] = `Bearer ${draft.auth.bearerToken}`
        } else if (
          draft.auth.type === 'basic' &&
          (draft.auth.basicUsername || draft.auth.basicPassword)
        ) {
          const credentials = `${draft.auth.basicUsername ?? ''}:${draft.auth.basicPassword ?? ''}`
          headers['Authorization'] = `Basic ${btoa(credentials)}`
        } else if (draft.auth.type === 'apikey' && draft.auth.apiKey) {
          const keyName = draft.auth.apiKeyHeader?.trim() || 'X-API-Key'
          const keyIn = draft.auth.apiKeyIn ?? 'header'
          if (keyIn === 'query') {
            try {
              const u = new URL(fetchUrl)
              u.searchParams.append(keyName, draft.auth.apiKey)
              fetchUrl = u.toString()
            } catch {
              const sep = fetchUrl.includes('?') ? '&' : '?'
              fetchUrl += `${sep}${encodeURIComponent(keyName)}=${encodeURIComponent(draft.auth.apiKey)}`
            }
          } else {
            headers[keyName] = draft.auth.apiKey
          }
        }

        // Apply params to URL
        if (draft.params.length > 0) {
          const enabledParams = draft.params.filter((p) => p.enabled && p.key)
          if (enabledParams.length > 0) {
            try {
              const u = new URL(fetchUrl)
              for (const p of enabledParams) {
                u.searchParams.append(p.key, p.value)
              }
              fetchUrl = u.toString()
            } catch {
              const queryStr = enabledParams
                .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
                .join('&')
              const sep = fetchUrl.includes('?') ? '&' : '?'
              fetchUrl += sep + queryStr
            }
          }
        }

        const methodUpper = draft.method.toUpperCase()
        const hasBodyMethod = ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(methodUpper)
        const serializedBody = hasBodyMethod
          ? serializeRequestBody(draft)
          : { body: undefined, contentType: undefined }

        if (draft.contentType.toLowerCase().includes('multipart/form-data')) {
          for (const key of Object.keys(headers)) {
            if (key.toLowerCase() === 'content-type') delete headers[key]
          }
        } else if (
          serializedBody.contentType &&
          !Object.keys(headers).some((key) => key.toLowerCase() === 'content-type')
        ) {
          headers['Content-Type'] = serializedBody.contentType
        }

        const response = await fetch(fetchUrl, {
          method: methodUpper,
          headers,
          body: serializedBody.body,
          signal,
        })

        const responseStartTime = performance.now()
        const responseBodyText = await response.text()
        const endTime = performance.now()
        const bytes = utf8ByteLength(responseBodyText)

        const responseHeaders: Record<string, string> = {}
        response.headers.forEach((val, key) => {
          responseHeaders[key.toLowerCase()] = val
        })

        return {
          version: RESPONSE_CONTRACT_VERSION,
          status: response.status,
          statusText: response.statusText || getStatusText(response.status),
          body: responseBodyText,
          headers: responseHeaders,
          timings: browserTimings({
            ttfbMs: responseStartTime - startTime,
            downloadMs: endTime - responseStartTime,
            totalMs: endTime - startTime,
          }),
          sizes: browserSizes(bytes),
        }
      } catch (err) {
        const totalMs = performance.now() - startTime
        if (err instanceof Error && err.name === 'AbortError') {
          const body = 'Request was cancelled by user.'
          return {
            version: RESPONSE_CONTRACT_VERSION,
            status: 0,
            statusText: 'Cancelled',
            body,
            headers: {},
            timings: browserTimings({ totalMs }),
            sizes: browserSizes(utf8ByteLength(body)),
          }
        }

        const body = err instanceof Error ? err.message : String(err)
        return {
          version: RESPONSE_CONTRACT_VERSION,
          status: 0,
          statusText: 'Network Error',
          body,
          headers: {},
          timings: browserTimings({ totalMs }),
          sizes: browserSizes(utf8ByteLength(body)),
        }
      }
    },
  }
}
