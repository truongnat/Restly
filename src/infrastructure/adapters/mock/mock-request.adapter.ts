import type { RequestClient } from '@/application/ports/request.port'
import type { RequestDraft } from '@/entities'
import type { HttpExchangeResult } from '@/entities/response'
import { sampleResponseJson } from '@/infrastructure/mock/fixtures'
import { MOCK_REQUEST_DELAY_MS } from '@/shared/constants/http'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function withAutoContentType(draft: RequestDraft): RequestDraft {
  const hasCt = draft.headers.some((h) => h.key.toLowerCase() === 'content-type')
  if (hasCt) return draft

  const isMultipart = draft.contentType.toLowerCase().includes('multipart')
  if (isMultipart) {
    const boundary = `----RestlyFormBoundary${Date.now().toString(36)}`
    return {
      ...draft,
      headers: [
        ...draft.headers,
        {
          id: 'auto-ct',
          enabled: true,
          key: 'Content-Type',
          value: `multipart/form-data; boundary=${boundary}`,
        },
      ],
    }
  }

  if (draft.contentType) {
    return {
      ...draft,
      headers: [
        ...draft.headers,
        {
          id: 'auto-ct',
          enabled: true,
          key: 'Content-Type',
          value: draft.contentType,
        },
      ],
    }
  }

  return draft
}

function buildMockHeaders(bodyText: string): Record<string, string> {
  const bytes = new TextEncoder().encode(bodyText).length
  const requestId = `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`

  return {
    'content-type': 'application/json; charset=utf-8',
    'content-length': String(bytes),
    date: new Date().toUTCString(),
    server: 'Restly-Mock/1.0',
    'x-request-id': requestId,
    'x-powered-by': 'Restly',
    'cache-control': 'no-store',
    'access-control-allow-origin': '*',
    connection: 'keep-alive',
    'x-mock': 'true',
  }
}

function buildMultipartEcho(draft: RequestDraft) {
  const parts = (draft.bodyFiles ?? []).map((f) => ({
    field: f.fieldName || 'file',
    filename: f.name,
    size: f.size,
    sizeLabel: formatBytes(f.size),
  }))

  const byField = parts.reduce<Record<string, typeof parts>>((acc, part) => {
    const key = part.field
    if (!acc[key]) acc[key] = []
    acc[key].push(part)
    return acc
  }, {})

  return {
    ok: true,
    message: 'Mock multipart upload accepted',
    uploaded: {
      fieldCount: Object.keys(byField).length,
      fileCount: parts.length,
      fields: byField,
      parts,
    },
    request: {
      method: draft.method,
      url: draft.url,
      contentType: draft.contentType,
      headers: Object.fromEntries(draft.headers.map((h) => [h.key, h.value])),
      params: Object.fromEntries(draft.params.map((p) => [p.key, p.value])),
      auth: draft.auth.type,
    },
  }
}

function buildJsonEcho(draft: RequestDraft) {
  let sampleData: unknown
  try {
    sampleData = JSON.parse(sampleResponseJson)
  } catch {
    sampleData = sampleResponseJson
  }

  return {
    ok: true,
    message: 'Mock response (echoing request draft)',
    data: sampleData,
    request: {
      method: draft.method,
      url: draft.url,
      contentType: draft.contentType,
      headers: Object.fromEntries(draft.headers.map((h) => [h.key, h.value])),
      params: Object.fromEntries(draft.params.map((p) => [p.key, p.value])),
      body: draft.body,
      auth: draft.auth.type,
      bodyFiles: (draft.bodyFiles ?? []).map(({ fieldName, name, size }) => ({
        fieldName,
        name,
        size,
      })),
    },
  }
}

export function createMockRequestClient(): RequestClient {
  return {
    async send(draft: RequestDraft): Promise<HttpExchangeResult> {
      await new Promise((r) => setTimeout(r, MOCK_REQUEST_DELAY_MS))

      const echoed = withAutoContentType(draft)
      const isMultipart = echoed.contentType.toLowerCase().includes('multipart')
      const responseBodyObj = isMultipart ? buildMultipartEcho(echoed) : buildJsonEcho(echoed)
      const bodyText = JSON.stringify(responseBodyObj, null, 2)
      const headers = buildMockHeaders(bodyText)
      const bytes = Number(headers['content-length'] ?? 0)

      return {
        status: 200,
        statusText: 'OK',
        durationMs: 42 + Math.floor(Math.random() * 80),
        size: formatBytes(bytes),
        body: bodyText,
        headers,
      }
    },
  }
}
