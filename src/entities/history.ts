import type { HttpMethod } from '@/entities/http'
import type { HeaderRow, ParamRow, RequestAuth } from '@/entities/request'

export type HistoryGroup = 'Today' | 'Yesterday' | 'Older'

/** Optional request draft captured at Send time for History reopen. */
export type HistoryDraftSnapshot = {
  params?: ParamRow[]
  headers?: HeaderRow[]
  body?: string
  contentType?: string
  auth?: RequestAuth
}

export type HistoryItem = {
  id: string
  method: HttpMethod
  url: string
  status: number
  statusText: string
  durationMs: number | null
  when: string
  group: HistoryGroup
} & HistoryDraftSnapshot

/** Soft cap for persisted history rows (localStorage). */
export const HISTORY_MAX_ITEMS = 100

/** Truncate oversized bodies before persist. */
export const HISTORY_BODY_MAX_CHARS = 100_000
