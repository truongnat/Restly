import type { Environment } from '@/entities'

/** Driven port — environments. */
export interface EnvironmentRepository {
  list(): Promise<Environment[]>
}
