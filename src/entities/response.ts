import { z } from 'zod'

export const RESPONSE_CONTRACT_VERSION = 1 as const

const nullableDurationSchema = z.number().finite().nonnegative().nullable()
const nullableByteCountSchema = z.number().int().finite().nonnegative().nullable()

/**
 * [RULE:RESPONSE:UNKNOWN_METRICS_NULL]
 * Adapters must use null when the runtime cannot observe a metric. Zero is reserved for a measured
 * zero value and must never stand in for browser or transport limitations.
 *
 * [TRACE:RESPONSE:IT0-93]
 */
export const responseTimingsSchema = z.object({
  dnsMs: nullableDurationSchema,
  connectMs: nullableDurationSchema,
  tlsMs: nullableDurationSchema,
  ttfbMs: nullableDurationSchema,
  downloadMs: nullableDurationSchema,
  totalMs: nullableDurationSchema,
})

export const responseSizesSchema = z.object({
  encodedBodyBytes: nullableByteCountSchema,
  decodedBodyBytes: nullableByteCountSchema,
  downloadedBytes: nullableByteCountSchema,
})

export const httpExchangeResultSchema = z.object({
  version: z.literal(RESPONSE_CONTRACT_VERSION),
  status: z.number().int().min(0).max(599),
  statusText: z.string(),
  headers: z.record(z.string(), z.string()),
  body: z.string(),
  timings: responseTimingsSchema,
  sizes: responseSizesSchema,
})

export type ResponseTimings = z.infer<typeof responseTimingsSchema>
export type ResponseSizes = z.infer<typeof responseSizesSchema>
export type HttpExchangeResult = z.infer<typeof httpExchangeResultSchema>

export function formatResponseBytes(bytes: number | null): string {
  if (bytes === null) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
