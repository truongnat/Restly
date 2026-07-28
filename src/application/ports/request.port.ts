import type { RequestDraft } from '@/entities'
import type { HttpExchangeResult } from '@/entities/response'

/** Driven port — execute an HTTP exchange (mock or real later). */
export interface RequestClient {
  send(draft: RequestDraft, signal?: AbortSignal): Promise<HttpExchangeResult>
}
