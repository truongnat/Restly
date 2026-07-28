import type { CollectionRepository } from '@/application/ports/collection.port'
import type { CollectionFolder } from '@/entities'

export type ListCollections = () => Promise<CollectionFolder[]>

export function createListCollections(repo: CollectionRepository): ListCollections {
  return () => repo.listFolders()
}
