import { z } from 'zod'

import type { HttpMethod } from '@/entities/http'

/**
 * Collection entity — N-level nested tree structure.
 * FEAT-01: Multi-Workspace & Nested Collection Storage
 *
 * Structure: Workspace -> Collection -> Folder -> Request
 * Supports unlimited nesting depth with recursive Zod schemas.
 */

// ============================================================================
// Key-Value Row Types
// ============================================================================

export const keyValueRowSchema = z.object({
  key: z.string(),
  value: z.string(),
  enabled: z.boolean(),
})

export type KeyValueRow = z.infer<typeof keyValueRowSchema>

// ============================================================================
// Request Node
// ============================================================================

export const requestNodeSchema = z.object({
  id: z.string(),
  type: z.literal('request'),
  name: z.string().min(1),
  method: z.string() as z.ZodType<HttpMethod>,
  url: z.string(),
  headers: z.array(keyValueRowSchema).default([]),
  params: z.array(keyValueRowSchema).default([]),
  body: z.string().default(''),
  authOverride: z.any().optional(),
  preRequestScript: z.string().optional(),
  postRequestScript: z.string().optional(),
})

export type RequestNode = z.infer<typeof requestNodeSchema>

// ============================================================================
// Folder Node (Recursive)
// ============================================================================

export interface FolderNode {
  id: string
  type: 'folder'
  name: string
  parentId: string | null
  children: Array<FolderNode | RequestNode>
  authOverride?: unknown
  headersOverride?: KeyValueRow[]
}

/**
 * Recursive Zod schema for N-level folder nesting.
 * Uses z.lazy() to handle self-referential structure.
 */
export const folderNodeSchema: z.ZodType<FolderNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: z.literal('folder'),
    name: z.string().min(1),
    parentId: z.string().nullable(),
    children: z.array(z.union([folderNodeSchema, requestNodeSchema])),
    authOverride: z.any().optional(),
    headersOverride: z.array(keyValueRowSchema).optional(),
  }),
)

// ============================================================================
// Collection Node (Root Folder)
// ============================================================================

export const collectionNodeSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  name: z.string().min(1),
  description: z.string().default(''),
  children: z.array(z.union([folderNodeSchema, requestNodeSchema])).default([]),
  createdAt: z.number(),
  updatedAt: z.number(),
})

export type CollectionNode = z.infer<typeof collectionNodeSchema>

// ============================================================================
// Union Type & Guards
// ============================================================================

export type TreeNode = FolderNode | RequestNode

export function isFolderNode(node: TreeNode): node is FolderNode {
  return node.type === 'folder'
}

export function isRequestNode(node: TreeNode): node is RequestNode {
  return node.type === 'request'
}

// ============================================================================
// Tree Operations
// ============================================================================

/**
 * Find a node by ID in the tree (depth-first search).
 */
export function findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (isFolderNode(node)) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

/**
 * Find the parent folder of a node by node ID.
 */
export function findParentOf(nodes: TreeNode[], nodeId: string): FolderNode | null {
  for (const node of nodes) {
    if (isFolderNode(node)) {
      if (node.children.some((c) => c.id === nodeId)) return node
      const found = findParentOf(node.children, nodeId)
      if (found) return found
    }
  }
  return null
}

/**
 * Add a node to a target folder (or root if targetId is null).
 * Returns new tree (immutable).
 */
export function addNodeToTree(
  nodes: TreeNode[],
  newNode: TreeNode,
  targetId: string | null,
): TreeNode[] {
  if (targetId === null) {
    return [...nodes, newNode]
  }
  return nodes.map((node) => {
    if (!isFolderNode(node)) return node
    if (node.id === targetId) {
      return { ...node, children: [...node.children, newNode] }
    }
    return { ...node, children: addNodeToTree(node.children, newNode, targetId) }
  })
}

/**
 * Remove a node from the tree by ID.
 * Returns new tree (immutable).
 */
export function removeNodeFromTree(nodes: TreeNode[], nodeId: string): TreeNode[] {
  return nodes
    .filter((node) => node.id !== nodeId)
    .map((node) => {
      if (!isFolderNode(node)) return node
      return { ...node, children: removeNodeFromTree(node.children, nodeId) }
    })
}

/**
 * Move a node to a new parent folder.
 * Handles reparenting and prevents circular references.
 */
export function moveNodeInTree(
  nodes: TreeNode[],
  nodeId: string,
  newParentId: string | null,
  sortOrder: number,
): TreeNode[] {
  // Find and remove the node
  const nodeToMove = findNodeById(nodes, nodeId)
  if (!nodeToMove) return nodes

  // Prevent moving a folder into its own descendant
  if (newParentId && isFolderNode(nodeToMove)) {
    if (wouldCreateCycle(nodeToMove, newParentId)) {
      throw new Error(`Cannot move folder "${nodeToMove.name}" into its own descendant`)
    }
  }

  // Remove from current location
  const treeWithout = removeNodeFromTree(nodes, nodeId)

  // Update parentId if it's a folder
  const updatedNode: TreeNode = isFolderNode(nodeToMove)
    ? { ...nodeToMove, parentId: newParentId }
    : nodeToMove

  // Insert at new location with sort order
  return insertNodeAtPosition(treeWithout, updatedNode, newParentId, sortOrder)
}

/**
 * Check if moving targetFolder into descendantId would create a cycle.
 */
function wouldCreateCycle(folder: FolderNode, targetId: string): boolean {
  if (folder.id === targetId) return true
  for (const child of folder.children) {
    if (isFolderNode(child)) {
      if (wouldCreateCycle(child, targetId)) return true
    }
  }
  return false
}

/**
 * Insert a node at a specific position within its parent.
 */
function insertNodeAtPosition(
  nodes: TreeNode[],
  newNode: TreeNode,
  parentId: string | null,
  position: number,
): TreeNode[] {
  if (parentId === null) {
    const result = [...nodes]
    result.splice(Math.min(position, result.length), 0, newNode)
    return result
  }
  return nodes.map((node) => {
    if (!isFolderNode(node)) return node
    if (node.id === parentId) {
      const children = [...node.children]
      children.splice(Math.min(position, children.length), 0, newNode)
      return { ...node, children }
    }
    return { ...node, children: insertNodeAtPosition(node.children, newNode, parentId, position) }
  })
}

/**
 * Count total nodes in tree.
 */
export function countNodes(nodes: TreeNode[]): number {
  let count = 0
  for (const node of nodes) {
    count++
    if (isFolderNode(node)) {
      count += countNodes(node.children)
    }
  }
  return count
}

/**
 * Flatten tree to list of all request nodes.
 */
export function flattenRequests(nodes: TreeNode[]): RequestNode[] {
  const result: RequestNode[] = []
  for (const node of nodes) {
    if (isRequestNode(node)) {
      result.push(node)
    } else {
      result.push(...flattenRequests(node.children))
    }
  }
  return result
}

// ============================================================================
// Legacy Compatibility (v1 flat structure)
// ============================================================================

/**
 * Legacy flat folder structure (v1 schema).
 * @deprecated Use FolderNode/RequestNode instead.
 */
export type CollectionFolder = {
  id: string
  name: string
  open: boolean
  requests: Array<{
    id: string
    name: string
    method: HttpMethod
    url: string
  }>
}

/**
 * Migrate legacy v1 CollectionFolder[] to v2 TreeNode[] structure.
 */
export function migrateV1ToV2(folders: CollectionFolder[]): TreeNode[] {
  return folders.map((folder) => ({
    id: folder.id,
    type: 'folder' as const,
    name: folder.name,
    parentId: null,
    children: folder.requests.map((req) => ({
      id: req.id,
      type: 'request' as const,
      name: req.name,
      method: req.method,
      url: req.url,
      headers: [],
      params: [],
      body: '',
    })),
  }))
}
