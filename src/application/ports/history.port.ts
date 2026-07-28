import type { HistoryItem } from '@/entities'

/** Driven port — request history. */
export interface HistoryRepository {
  list(): Promise<HistoryItem[]>
}
