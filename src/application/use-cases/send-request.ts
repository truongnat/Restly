import type { RequestClient } from '@/application/ports/request.port'
import { requestDraftSchema, type RequestDraft } from '@/entities'
import type { HttpExchangeResult } from '@/entities/response'

export type SendRequestInput = unknown
export type SendRequest = (
  input: SendRequestInput,
  signal?: AbortSignal,
) => Promise<HttpExchangeResult>

/** Normalize draft before hitting the transport port. */
export function prepareRequestDraft(draft: RequestDraft): RequestDraft {
  return {
    ...draft,
    url: draft.url.trim(),
    params: draft.params.filter((p) => p.enabled),
    headers: draft.headers.filter((h) => h.enabled),
  }
}

/**
 * Application use-case: validate → prepare → send via RequestClient port.
 * Framework-free; TanStack Query wires this in feature `model/`.
 */
export function createSendRequest(client: RequestClient): SendRequest {
  return async (input, signal) => {
    const draft = requestDraftSchema.parse(input)
    return client.send(prepareRequestDraft(draft), signal)
  }
}
