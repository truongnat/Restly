import type {
  CollectionFolder,
  CollectionNode,
  FolderNode,
  RequestNode,
  TreeNode,
} from '@/entities/collection'

/**
 * Collection port — N-level tree operations.
 * FEAT-01: Multi-Workspace & Nested Collection Storage
 */
export interface CollectionRepository {
  /** Get the full tree for a workspace. */
  getWorkspaceTree(workspaceId: string): Promise<FolderNode[]>

  /** List all collections in a workspace. */
  listCollections(workspaceId: string): Promise<CollectionNode[]>

  /** Get a single collection by ID. */
  getCollection(collectionId: string): Promise<CollectionNode | null>

  /** Save (create or update) a collection. */
  saveCollection(collection: CollectionNode): Promise<void>

  /** Delete a collection and all its children. */
  deleteCollection(collectionId: string): Promise<void>

  /** Save a node (folder or request) within a collection. */
  saveNode(workspaceId: string, node: FolderNode | RequestNode): Promise<void>

  /** Move a node to a new parent folder. */
  moveNode(nodeId: string, targetParentId: string | null, sortOrder: number): Promise<void>

  /** Delete a node and all its children (if folder). */
  deleteNode(nodeId: string): Promise<void>

  /** Find a node by ID across all collections. */
  findNode(nodeId: string): Promise<TreeNode | null>

  /**
   * Legacy method for backward compatibility.
   * @deprecated Use getWorkspaceTree instead.
   */
  listFolders(): Promise<CollectionFolder[]>
}

/**
 * Legacy interface for backward compatibility.
 * @deprecated Use CollectionRepository instead.
 */
export interface LegacyCollectionRepository {
  listFolders(): Promise<
    Array<{
      id: string
      name: string
      open: boolean
      requests: Array<{ id: string; name: string; method: string; url: string }>
    }>
  >
}
