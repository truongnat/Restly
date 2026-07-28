import type { CollectionFolder } from '@/entities'

/** Driven port — load collection tree. */
export interface CollectionRepository {
  listFolders(): Promise<CollectionFolder[]>
}
