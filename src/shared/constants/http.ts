export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] as const

export type HttpMethodConst = (typeof HTTP_METHODS)[number]

/** Default fake latency for UI-phase mock send */
export const MOCK_REQUEST_DELAY_MS = 180

export const DEFAULT_QUERY_STALE_TIME_MS = 30_000
