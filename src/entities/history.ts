import type { HttpMethod } from '@/entities/http'

export type HistoryGroup = 'Today' | 'Yesterday'

export type HistoryItem = {
  id: string
  method: HttpMethod
  url: string
  status: number
  statusText: string
  durationMs: number
  when: string
  group: HistoryGroup
}
