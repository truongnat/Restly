export type HttpExchangeResult = {
  status: number
  statusText: string
  durationMs: number
  size: string
  body: string
  headers?: Record<string, string>
}
