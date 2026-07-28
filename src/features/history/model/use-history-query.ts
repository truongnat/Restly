import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { restlyKeys } from '@/application/query-keys'
import { groupHistoryByDay } from '@/application/use-cases/list-history'
import type { HistoryItem } from '@/entities'
import { resolve, TOKENS } from '@/infrastructure/di'

export function useHistoryQuery() {
  return useQuery({
    queryKey: restlyKeys.history,
    queryFn: () => resolve(TOKENS.ListHistory)(),
  })
}

export function useGroupedHistory(customItems?: HistoryItem[]) {
  const query = useHistoryQuery()
  const storeHistory = useRestlyStore((s) => s.history)
  const items = useMemo(
    () => customItems ?? storeHistory ?? query.data ?? [],
    [customItems, storeHistory, query.data],
  )
  const groups = useMemo(() => groupHistoryByDay(items), [items])
  return { ...query, groups }
}
