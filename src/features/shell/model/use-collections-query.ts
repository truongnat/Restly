import { useQuery } from '@tanstack/react-query'

import { restlyKeys } from '@/application/query-keys'
import { resolve, TOKENS } from '@/infrastructure/di'

export function useCollectionsQuery() {
  return useQuery({
    queryKey: restlyKeys.collections,
    queryFn: () => resolve(TOKENS.ListCollections)(),
  })
}
