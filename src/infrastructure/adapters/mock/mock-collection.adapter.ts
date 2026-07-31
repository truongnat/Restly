import type { CollectionRepository } from '@/application/ports/collection.port'
import type {
  CollectionFolder,
  CollectionNode,
  FolderNode,
  RequestNode,
  TreeNode,
} from '@/entities'
import { mockFolders } from '@/infrastructure/mock/fixtures'

/**
 * Mock collection repository for testing and development.
 * Implements both legacy and new N-level tree interfaces.
 */
export function createMockCollectionRepository(): CollectionRepository {
  // In-memory store for tree operations
  const treeStore: FolderNode[] = []

  return {
    // Legacy method
    async listFolders(): Promise<CollectionFolder[]> {
      return mockFolders
    },

    // New N-level tree methods
    async getWorkspaceTree(_workspaceId: string): Promise<FolderNode[]> {
      return treeStore
    },

    async listCollections(_workspaceId: string): Promise<CollectionNode[]> {
      return []
    },

    async getCollection(_collectionId: string): Promise<CollectionNode | null> {
      return null
    },

    async saveCollection(_collection: CollectionNode): Promise<void> {
      // No-op for mock
    },

    async deleteCollection(_collectionId: string): Promise<void> {
      // No-op for mock
    },

    async saveNode(_workspaceId: string, _node: FolderNode | RequestNode): Promise<void> {
      // No-op for mock
    },

    async moveNode(
      _nodeId: string,
      _targetParentId: string | null,
      _sortOrder: number,
    ): Promise<void> {
      // No-op for mock
    },

    async deleteNode(_nodeId: string): Promise<void> {
      // No-op for mock
    },

    async findNode(_nodeId: string): Promise<TreeNode | null> {
      return null
    },
  }
}
