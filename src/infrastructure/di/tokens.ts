import type { CollectionRepository } from '@/application/ports/collection.port'
import type { EnvironmentRepository } from '@/application/ports/environment.port'
import type { HistoryRepository } from '@/application/ports/history.port'
import type { RequestClient } from '@/application/ports/request.port'
import type { ListCollections } from '@/application/use-cases/list-collections'
import type { ListEnvironments } from '@/application/use-cases/list-environments'
import type { ListHistory } from '@/application/use-cases/list-history'
import type { SendRequest } from '@/application/use-cases/send-request'

/**
 * String tokens (not Symbols) so `TokenMap[K]` stays precise under TS.
 * Resolve via `resolve(TOKENS.X)` / `container.resolve(TOKENS.X)`.
 */
export const TOKENS = {
  CollectionRepository: 'CollectionRepository',
  HistoryRepository: 'HistoryRepository',
  EnvironmentRepository: 'EnvironmentRepository',
  RequestClient: 'RequestClient',
  ListCollections: 'ListCollections',
  ListHistory: 'ListHistory',
  ListEnvironments: 'ListEnvironments',
  SendRequest: 'SendRequest',
} as const

export type TokenMap = {
  CollectionRepository: CollectionRepository
  HistoryRepository: HistoryRepository
  EnvironmentRepository: EnvironmentRepository
  RequestClient: RequestClient
  ListCollections: ListCollections
  ListHistory: ListHistory
  ListEnvironments: ListEnvironments
  SendRequest: SendRequest
}

export type AppToken = (typeof TOKENS)[keyof typeof TOKENS]
