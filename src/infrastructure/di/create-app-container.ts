import { createListCollections } from '@/application/use-cases/list-collections'
import { createListEnvironments } from '@/application/use-cases/list-environments'
import { createListHistory } from '@/application/use-cases/list-history'
import { createSendRequest } from '@/application/use-cases/send-request'
import { createMockCollectionRepository } from '@/infrastructure/adapters/mock/mock-collection.adapter'
import { createMockEnvironmentRepository } from '@/infrastructure/adapters/mock/mock-environment.adapter'
import { createMockHistoryRepository } from '@/infrastructure/adapters/mock/mock-history.adapter'
import { createMockRequestClient } from '@/infrastructure/adapters/mock/mock-request.adapter'
import { Container } from '@/infrastructure/di/container'
import { TOKENS } from '@/infrastructure/di/tokens'

/**
 * Build a fresh container (mock adapters by default).
 * Does not mutate the global runtime — call `bootContainer(createAppContainer())` to activate.
 */
export function createAppContainer(): Container {
  const container = new Container()

  const collections = createMockCollectionRepository()
  const history = createMockHistoryRepository()
  const environments = createMockEnvironmentRepository()
  const requestClient = createMockRequestClient()

  container
    .register(TOKENS.CollectionRepository, collections)
    .register(TOKENS.HistoryRepository, history)
    .register(TOKENS.EnvironmentRepository, environments)
    .register(TOKENS.RequestClient, requestClient)
    .register(TOKENS.ListCollections, createListCollections(collections))
    .register(TOKENS.ListHistory, createListHistory(history))
    .register(TOKENS.ListEnvironments, createListEnvironments(environments))
    .register(TOKENS.SendRequest, createSendRequest(requestClient))

  return container
}
