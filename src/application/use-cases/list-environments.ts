import type { EnvironmentRepository } from '@/application/ports/environment.port'
import type { Environment } from '@/entities'

export type ListEnvironments = () => Promise<Environment[]>

export function createListEnvironments(repo: EnvironmentRepository): ListEnvironments {
  return () => repo.list()
}

/** Pure biz: pick active env with fallback to first. */
export function resolveActiveEnvironment(
  environments: Environment[],
  environmentId: string | null | undefined,
): Environment | undefined {
  return environments.find((e) => e.id === environmentId) ?? environments[0]
}
