import type { CollectionRepository } from '@/application/ports/collection.port'
import type { RequestClient } from '@/application/ports/request.port'
import { createListCollections } from '@/application/use-cases/list-collections'
import { createSendRequest } from '@/application/use-cases/send-request'
import type { RequestDraft } from '@/entities'
import type {
  CollectionFolder,
  CollectionNode,
  FolderNode,
  RequestNode,
  TreeNode,
} from '@/entities'
import { RESPONSE_CONTRACT_VERSION, type HttpExchangeResult } from '@/entities/response'
import { Container } from '@/infrastructure/di/container'
import { TOKENS } from '@/infrastructure/di/tokens'

/** In-memory RequestClient for use-case / DI tests (no React, no network). */
export function createFakeRequestClient(
  result?: Partial<HttpExchangeResult>,
): RequestClient & { lastDraft: RequestDraft | null } {
  const client = {
    lastDraft: null as RequestDraft | null,
    async send(draft: RequestDraft): Promise<HttpExchangeResult> {
      client.lastDraft = draft
      return {
        version: RESPONSE_CONTRACT_VERSION,
        status: 200,
        statusText: 'OK',
        body: '{}',
        headers: {},
        timings: {
          dnsMs: null,
          connectMs: null,
          tlsMs: null,
          ttfbMs: null,
          downloadMs: null,
          totalMs: 1,
        },
        sizes: {
          encodedBodyBytes: 2,
          decodedBodyBytes: 2,
          downloadedBytes: null,
        },
        ...result,
      }
    },
  }
  return client
}

export function createFakeCollectionRepository(
  folders: CollectionFolder[] = [],
): CollectionRepository {
  return {
    async listFolders() {
      return folders
    },
    async getWorkspaceTree(_workspaceId: string): Promise<FolderNode[]> {
      return []
    },
    async listCollections(_workspaceId: string): Promise<CollectionNode[]> {
      return []
    },
    async getCollection(_collectionId: string): Promise<CollectionNode | null> {
      return null
    },
    async saveCollection(_collection: CollectionNode): Promise<void> {},
    async deleteCollection(_collectionId: string): Promise<void> {},
    async saveNode(_workspaceId: string, _node: FolderNode | RequestNode): Promise<void> {},
    async moveNode(
      _nodeId: string,
      _targetParentId: string | null,
      _sortOrder: number,
    ): Promise<void> {},
    async deleteNode(_nodeId: string): Promise<void> {},
    async findNode(_nodeId: string): Promise<TreeNode | null> {
      return null
    },
  }
}

/** Minimal container for a single use-case binding — unit-test friendly. */
export function createTestContainer(overrides?: {
  requestClient?: RequestClient
  collections?: CollectionRepository
}): Container {
  const container = new Container()
  const requestClient = overrides?.requestClient ?? createFakeRequestClient()
  const collections = overrides?.collections ?? createFakeCollectionRepository()

  container
    .register(TOKENS.RequestClient, requestClient)
    .register(TOKENS.CollectionRepository, collections)
    .register(TOKENS.SendRequest, createSendRequest(requestClient))
    .register(TOKENS.ListCollections, createListCollections(collections))

  return container
}
