import type { CollectionRepository } from '@/application/ports/collection.port'
import type { CollectionFolder } from '@/entities'
import { mockFolders } from '@/infrastructure/mock/fixtures'

export function createMockCollectionRepository(): CollectionRepository {
  return {
    async listFolders(): Promise<CollectionFolder[]> {
      return mockFolders
    },
  }
}
