import type { RequestClient } from '@/application/ports/request.port'
import type { RequestDraft } from '@/entities'
import type { HttpExchangeResult } from '@/entities/response'
import { sampleResponseJson } from '@/infrastructure/mock/fixtures'
import { MOCK_REQUEST_DELAY_MS } from '@/shared/constants/http'

export function createMockRequestClient(): RequestClient {
  return {
    async send(draft: RequestDraft): Promise<HttpExchangeResult> {
      await new Promise((r) => setTimeout(r, MOCK_REQUEST_DELAY_MS))

      let sampleData: unknown
      try {
        sampleData = JSON.parse(sampleResponseJson)
      } catch {
        sampleData = sampleResponseJson
      }

      const responseBodyObj = {
        message: 'Mock response (echoing request draft)',
        echo: draft,
        data: sampleData,
      }

      const bodyText = JSON.stringify(responseBodyObj, null, 2)
      const bytes = new TextEncoder().encode(bodyText).length
      const sizeText = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`

      return {
        status: 200,
        statusText: 'OK',
        durationMs: 45,
        size: sizeText,
        body: bodyText,
        headers: {
          'content-type': 'application/json',
          'x-mock': 'true',
        },
      }
    },
  }
}
