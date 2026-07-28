import type { EnvironmentRepository } from '@/application/ports/environment.port'
import type { Environment } from '@/entities'
import { mockEnvironments } from '@/infrastructure/mock/fixtures'

export function createMockEnvironmentRepository(): EnvironmentRepository {
  return {
    async list(): Promise<Environment[]> {
      return mockEnvironments
    },
  }
}
