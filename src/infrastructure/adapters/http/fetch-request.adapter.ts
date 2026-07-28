import { useRestlyStore } from '@/app/store/restly-store'
import type { RequestClient } from '@/application/ports/request.port'
import type { MockServer, RequestDraft } from '@/entities'
import type { HttpExchangeResult } from '@/entities/response'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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
            status: 0,
            statusText: 'Cancelled',
            durationMs: mockRoute.delayMs,
            size: '0 B',
            body: 'Request was cancelled.',
            headers: {},
          }
        }

        const bodyStr = mockRoute.responseBody ?? ''
        const bytes = new TextEncoder().encode(bodyStr).length
        return {
          status: mockRoute.status ?? 200,
          statusText: getStatusText(mockRoute.status ?? 200),
          durationMs: mockRoute.delayMs,
          size: formatBytes(bytes),
          body: bodyStr,
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'x-restly-mock': 'true',
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

        // Body handling
        let reqBody: BodyInit | undefined = undefined
        const methodUpper = draft.method.toUpperCase()
        const hasBodyMethod = ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(methodUpper)

        if (hasBodyMethod) {
          if (draft.bodyFiles && draft.bodyFiles.length > 0) {
            const formData = new FormData()
            for (const filePart of draft.bodyFiles) {
              const fieldName = filePart.fieldName?.trim() || 'file'
              const rawFile = (filePart as { file?: File }).file
              if (rawFile) {
                formData.append(fieldName, rawFile, filePart.name)
              } else {
                formData.append(
                  fieldName,
                  new Blob(['mock file content'], { type: 'application/octet-stream' }),
                  filePart.name,
                )
              }
            }
            reqBody = formData
            delete headers['Content-Type']
            delete headers['content-type']
          } else if (draft.body) {
            reqBody = draft.body
            const hasCt = Object.keys(headers).some((k) => k.toLowerCase() === 'content-type')
            if (!hasCt && draft.contentType) {
              headers['Content-Type'] = draft.contentType
            }
          }
        }

        const response = await fetch(fetchUrl, {
          method: methodUpper,
          headers,
          body: reqBody,
          signal,
        })

        const durationMs = Math.round(performance.now() - startTime)
        const responseBodyText = await response.text()
        const bytes = new TextEncoder().encode(responseBodyText).length

        const responseHeaders: Record<string, string> = {}
        response.headers.forEach((val, key) => {
          responseHeaders[key.toLowerCase()] = val
        })

        return {
          status: response.status,
          statusText: response.statusText || getStatusText(response.status),
          durationMs,
          size: formatBytes(bytes),
          body: responseBodyText,
          headers: responseHeaders,
        }
      } catch (err) {
        const durationMs = Math.round(performance.now() - startTime)
        if (err instanceof Error && err.name === 'AbortError') {
          return {
            status: 0,
            statusText: 'Cancelled',
            durationMs,
            size: '0 B',
            body: 'Request was cancelled by user.',
            headers: {},
          }
        }

        return {
          status: 0,
          statusText: 'Network Error',
          durationMs,
          size: '0 B',
          body: err instanceof Error ? err.message : String(err),
          headers: {},
        }
      }
    },
  }
}
