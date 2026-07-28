import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { restlyKeys } from '@/application/query-keys'
import { resolveActiveEnvironment } from '@/application/use-cases/list-environments'
import { resolve, TOKENS } from '@/infrastructure/di'

export function useEnvironmentsQuery() {
  const storeEnvironments = useRestlyStore((s) => s.environments)
  return useQuery({
    queryKey: restlyKeys.environments,
    queryFn: () => resolve(TOKENS.ListEnvironments)(),
    initialData: storeEnvironments,
  })
}

export function useActiveEnvironment() {
  const environments = useRestlyStore((s) => s.environments)
  const environmentId = useRestlyStore((s) => s.environmentId)
  const active = useMemo(
    () => resolveActiveEnvironment(environments, environmentId),
    [environments, environmentId],
  )
  return { data: environments, active, environmentId }
}
