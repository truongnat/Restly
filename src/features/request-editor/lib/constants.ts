export const REQUEST_TABS = ['params', 'auth', 'headers', 'body'] as const
export const RESPONSE_TABS = ['pretty', 'raw', 'preview', 'headers'] as const

export type RequestTabId = (typeof REQUEST_TABS)[number]
export type ResponseTabId = (typeof RESPONSE_TABS)[number]
