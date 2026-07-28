import { useRestlyStore } from '@/app/store/restly-store'
import type { HistoryRepository } from '@/application/ports/history.port'
import type { HistoryItem } from '@/entities'

export function createMockHistoryRepository(): HistoryRepository {
  return {
    async list(): Promise<HistoryItem[]> {
      return useRestlyStore.getState().history
    },
  }
}
