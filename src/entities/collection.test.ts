import { describe, expect, it } from 'vitest'

import {
  addNodeToTree,
  countNodes,
  findNodeById,
  findParentOf,
  flattenRequests,
  isFolderNode,
  isRequestNode,
  migrateV1ToV2,
  moveNodeInTree,
  removeNodeFromTree,
  type CollectionFolder,
  type FolderNode,
  type RequestNode,
  type TreeNode,
} from '@/entities/collection'

// Test fixtures
function createRequest(id: string, name: string): RequestNode {
  return {
    id,
    type: 'request',
    name,
    method: 'GET',
    url: `https://api.example.com/${id}`,
    headers: [],
    params: [],
    body: '',
  }
}

function createFolder(id: string, name: string, children: TreeNode[] = []): FolderNode {
  return {
    id,
    type: 'folder',
    name,
    parentId: null,
    children,
  }
}

describe('collection entity', () => {
  describe('type guards', () => {
    it('identifies folder nodes', () => {
      const folder = createFolder('f1', 'Folder 1')
      const request = createRequest('r1', 'Request 1')

      expect(isFolderNode(folder)).toBe(true)
      expect(isFolderNode(request)).toBe(false)
    })

    it('identifies request nodes', () => {
      const folder = createFolder('f1', 'Folder 1')
      const request = createRequest('r1', 'Request 1')

      expect(isRequestNode(request)).toBe(true)
      expect(isRequestNode(folder)).toBe(false)
    })
  })

  describe('findNodeById', () => {
    const tree: TreeNode[] = [
      createFolder('f1', 'Folder 1', [
        createRequest('r1', 'Request 1'),
        createFolder('f2', 'Folder 2', [createRequest('r2', 'Request 2')]),
      ]),
      createRequest('r3', 'Request 3'),
    ]

    it('finds root-level nodes', () => {
      expect(findNodeById(tree, 'f1')?.name).toBe('Folder 1')
      expect(findNodeById(tree, 'r3')?.name).toBe('Request 3')
    })

    it('finds nested nodes', () => {
      expect(findNodeById(tree, 'r1')?.name).toBe('Request 1')
      expect(findNodeById(tree, 'f2')?.name).toBe('Folder 2')
      expect(findNodeById(tree, 'r2')?.name).toBe('Request 2')
    })

    it('returns null for non-existent nodes', () => {
      expect(findNodeById(tree, 'nonexistent')).toBeNull()
    })
  })

  describe('findParentOf', () => {
    const tree: TreeNode[] = [
      createFolder('f1', 'Folder 1', [
        createRequest('r1', 'Request 1'),
        createFolder('f2', 'Folder 2', [createRequest('r2', 'Request 2')]),
      ]),
    ]

    it('finds parent of nested request', () => {
      expect(findParentOf(tree, 'r1')?.id).toBe('f1')
      expect(findParentOf(tree, 'r2')?.id).toBe('f2')
    })

    it('finds parent of nested folder', () => {
      expect(findParentOf(tree, 'f2')?.id).toBe('f1')
    })

    it('returns null for root-level nodes', () => {
      expect(findParentOf(tree, 'f1')).toBeNull()
    })
  })

  describe('addNodeToTree', () => {
    it('adds node to root when targetId is null', () => {
      const tree: TreeNode[] = [createRequest('r1', 'Request 1')]
      const newRequest = createRequest('r2', 'Request 2')

      const result = addNodeToTree(tree, newRequest, null)

      expect(result).toHaveLength(2)
      expect(result[1].id).toBe('r2')
    })

    it('adds node to specific folder', () => {
      const tree: TreeNode[] = [createFolder('f1', 'Folder 1', [])]
      const newRequest = createRequest('r1', 'Request 1')

      const result = addNodeToTree(tree, newRequest, 'f1')

      const folder = result[0] as FolderNode
      expect(folder.children).toHaveLength(1)
      expect(folder.children[0].id).toBe('r1')
    })

    it('does not mutate original tree', () => {
      const tree: TreeNode[] = [createFolder('f1', 'Folder 1', [])]
      const newRequest = createRequest('r1', 'Request 1')

      addNodeToTree(tree, newRequest, 'f1')

      expect((tree[0] as FolderNode).children).toHaveLength(0)
    })
  })

  describe('removeNodeFromTree', () => {
    it('removes root-level node', () => {
      const tree: TreeNode[] = [createRequest('r1', 'Request 1'), createRequest('r2', 'Request 2')]

      const result = removeNodeFromTree(tree, 'r1')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('r2')
    })

    it('removes nested node', () => {
      const tree: TreeNode[] = [createFolder('f1', 'Folder 1', [createRequest('r1', 'Request 1')])]

      const result = removeNodeFromTree(tree, 'r1')

      expect((result[0] as FolderNode).children).toHaveLength(0)
    })

    it('removes folder with all children', () => {
      const tree: TreeNode[] = [
        createFolder('f1', 'Folder 1', [
          createRequest('r1', 'Request 1'),
          createRequest('r2', 'Request 2'),
        ]),
        createRequest('r3', 'Request 3'),
      ]

      const result = removeNodeFromTree(tree, 'f1')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('r3')
    })
  })

  describe('moveNodeInTree', () => {
    it('moves node to different folder', () => {
      const tree: TreeNode[] = [
        createFolder('f1', 'Folder 1', [createRequest('r1', 'Request 1')]),
        createFolder('f2', 'Folder 2', []),
      ]

      const result = moveNodeInTree(tree, 'r1', 'f2', 0)

      expect((result[0] as FolderNode).children).toHaveLength(0)
      expect((result[1] as FolderNode).children).toHaveLength(1)
    })

    it('moves node to root', () => {
      const tree: TreeNode[] = [createFolder('f1', 'Folder 1', [createRequest('r1', 'Request 1')])]

      const result = moveNodeInTree(tree, 'r1', null, 0)

      // r1 is inserted at position 0, so result is [r1, f1]
      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('r1')
      expect((result[1] as FolderNode).children).toHaveLength(0)
    })

    it('prevents circular reference', () => {
      const tree: TreeNode[] = [
        createFolder('f1', 'Folder 1', [createFolder('f2', 'Folder 2', [])]),
      ]

      expect(() => moveNodeInTree(tree, 'f1', 'f2', 0)).toThrow('Cannot move folder')
    })
  })

  describe('countNodes', () => {
    it('counts all nodes in tree', () => {
      const tree: TreeNode[] = [
        createFolder('f1', 'Folder 1', [
          createRequest('r1', 'Request 1'),
          createFolder('f2', 'Folder 2', [createRequest('r2', 'Request 2')]),
        ]),
        createRequest('r3', 'Request 3'),
      ]

      expect(countNodes(tree)).toBe(5)
    })
  })

  describe('flattenRequests', () => {
    it('extracts all requests from tree', () => {
      const tree: TreeNode[] = [
        createFolder('f1', 'Folder 1', [
          createRequest('r1', 'Request 1'),
          createFolder('f2', 'Folder 2', [createRequest('r2', 'Request 2')]),
        ]),
        createRequest('r3', 'Request 3'),
      ]

      const requests = flattenRequests(tree)

      expect(requests).toHaveLength(3)
      expect(requests.map((r) => r.id)).toEqual(['r1', 'r2', 'r3'])
    })
  })

  describe('migrateV1ToV2', () => {
    it('migrates legacy flat structure to tree', () => {
      const legacy: CollectionFolder[] = [
        {
          id: 'f1',
          name: 'Users',
          open: true,
          requests: [
            { id: 'r1', name: 'Get Users', method: 'GET', url: '/users' },
            { id: 'r2', name: 'Create User', method: 'POST', url: '/users' },
          ],
        },
      ]

      const result = migrateV1ToV2(legacy)

      expect(result).toHaveLength(1)
      expect(isFolderNode(result[0])).toBe(true)

      const folder = result[0] as FolderNode
      expect(folder.name).toBe('Users')
      expect(folder.children).toHaveLength(2)
      expect(folder.children[0].type).toBe('request')
    })
  })
})
