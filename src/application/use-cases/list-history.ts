import type { HistoryRepository } from '@/application/ports/history.port'
import type { HistoryGroup, HistoryItem } from '@/entities'

export type ListHistory = () => Promise<HistoryItem[]>

export function createListHistory(repo: HistoryRepository): ListHistory {
  return () => repo.list()
}

/** Pure biz: group history rows for the history screen. */
export function groupHistoryByDay(
  items: HistoryItem[],
  groups: readonly HistoryGroup[] = ['Today', 'Yesterday', 'Older'],
): { group: HistoryGroup; items: HistoryItem[] }[] {
  return groups
    .map((group) => ({
      group,
      items: items.filter((h) => h.group === group),
    }))
    .filter((g) => g.items.length > 0)
}
