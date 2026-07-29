import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useRestlyStore } from '@/app/store/restly-store'
import type { RequestDraft } from '@/entities'

import { createFetchRequestClient, findMatchingMockRoute } from './fetch-request.adapter'

const baseDraft: RequestDraft = {
  method: 'GET',
  url: 'https://api.example.com/v1/users',
  params: [],
  headers: [],
  body: '',
  contentType: 'application/json',
  auth: { type: 'none' },
  bodyFiles: [],
}

describe('fetch-request.adapter', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    useRestlyStore.setState({
      mockServers: [
        {
          id: 'mock-1',
          name: 'Test Server',
          baseUrl: 'https://api.example.com',
          running: true,
          description: '',
          routes: [
            {
              id: 'r-1',
              enabled: true,
              method: 'GET',
              path: '/v1/users',
              status: 200,
              delayMs: 0,
              responseBody: '{"mocked": true}',
            },
            {
              id: 'r-2',
              enabled: true,
              method: 'HEAD',
              path: '/v1/users',
              status: 204,
              delayMs: 0,
              responseBody: '',
            },
            {
              id: 'r-3',
              enabled: true,
              method: 'OPTIONS',
              path: '/v1/users',
              status: 200,
              delayMs: 0,
              responseBody: '',
            },
          ],
        },
      ],
    })
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.restoreAllMocks()
  })

  describe('findMatchingMockRoute', () => {
    it('matches running mock route by method and url path', () => {
      const mockServers = useRestlyStore.getState().mockServers
      const route = findMatchingMockRoute(baseDraft, mockServers)
      expect(route?.id).toBe('r-1')
    })

    it('returns null if mock server is not running', () => {
      useRestlyStore.setState({
        mockServers: [
          {
            ...useRestlyStore.getState().mockServers[0]!,
            running: false,
          },
        ],
      })
      const mockServers = useRestlyStore.getState().mockServers
      const route = findMatchingMockRoute(baseDraft, mockServers)
      expect(route).toBeNull()
    })
  })

  describe('createFetchRequestClient - Mock Wire Interception (T-031)', () => {
    it('returns canned mock response without calling network when mock server is running', async () => {
      const fetchSpy = vi.fn()
      global.fetch = fetchSpy

      const client = createFetchRequestClient()
      const res = await client.send(baseDraft)

      expect(fetchSpy).not.toHaveBeenCalled()
      expect(res.status).toBe(200)
      expect(res.body).toBe('{"mocked": true}')
      expect(res.headers?.['x-restly-mock']).toBe('true')
    })

    it('supports HEAD and OPTIONS mock routes', async () => {
      const client = createFetchRequestClient()

      const headRes = await client.send({ ...baseDraft, method: 'HEAD' })
      expect(headRes.status).toBe(204)

      const optionsRes = await client.send({ ...baseDraft, method: 'OPTIONS' })
      expect(optionsRes.status).toBe(200)
    })
  })

  describe('createFetchRequestClient - Real HTTP (T-030)', () => {
    it('performs real fetch when no mock server matches', async () => {
      useRestlyStore.setState({ mockServers: [] })

      const mockResponse = new Response('{"success": true}', {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      })
      const fetchSpy = vi.fn().mockResolvedValue(mockResponse)
      global.fetch = fetchSpy

      const client = createFetchRequestClient()
      const res = await client.send(baseDraft)

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.example.com/v1/users',
        expect.objectContaining({
          method: 'GET',
        }),
      )
      expect(res.status).toBe(200)
      expect(res.body).toBe('{"success": true}')
    })

    it('maps network errors gracefully', async () => {
      useRestlyStore.setState({ mockServers: [] })
      global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'))

      const client = createFetchRequestClient()
      const res = await client.send(baseDraft)

      expect(res.status).toBe(0)
      expect(res.statusText).toBe('Network Error')
      expect(res.body).toBe('Failed to fetch')
    })

    it('sends actual multipart file bytes without a caller-defined boundary', async () => {
      useRestlyStore.setState({ mockServers: [] })
      const fetchSpy = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }))
      global.fetch = fetchSpy
      const file = new File([new Uint8Array([1, 2, 3, 255])], 'payload.bin', {
        type: 'application/octet-stream',
      })

      const client = createFetchRequestClient()
      await client.send({
        ...baseDraft,
        method: 'POST',
        contentType: 'multipart/form-data',
        headers: [
          {
            id: 'content-type',
            enabled: true,
            key: 'content-type',
            value: 'multipart/form-data; boundary=fake',
          },
        ],
        bodyFiles: [
          {
            id: 'file-1',
            fieldName: 'artifact',
            name: file.name,
            size: file.size,
            file,
          },
        ],
      })

      const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit]
      expect(init.body).toBeInstanceOf(FormData)
      expect(
        Object.keys(init.headers as Record<string, string>).some(
          (key) => key.toLowerCase() === 'content-type',
        ),
      ).toBe(false)
      const sentFile = (init.body as FormData).get('artifact') as File
      expect(Array.from(new Uint8Array(await sentFile.arrayBuffer()))).toEqual([1, 2, 3, 255])
    })
  })

  describe('createFetchRequestClient - API Key Auth (T-032)', () => {
    it('applies API Key as header when apiKeyIn is header', async () => {
      useRestlyStore.setState({ mockServers: [] })
      const fetchSpy = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }))
      global.fetch = fetchSpy

      const client = createFetchRequestClient()
      await client.send({
        ...baseDraft,
        auth: {
          type: 'apikey',
          apiKey: 'my-secret-key',
          apiKeyHeader: 'X-Custom-Key',
          apiKeyIn: 'header',
        },
      })

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.example.com/v1/users',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Key': 'my-secret-key',
          }),
        }),
      )
    })

    it('applies API Key in query string when apiKeyIn is query', async () => {
      useRestlyStore.setState({ mockServers: [] })
      const fetchSpy = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }))
      global.fetch = fetchSpy

      const client = createFetchRequestClient()
      await client.send({
        ...baseDraft,
        auth: {
          type: 'apikey',
          apiKey: 'my-secret-key',
          apiKeyHeader: 'api_key',
          apiKeyIn: 'query',
        },
      })

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.example.com/v1/users?api_key=my-secret-key',
        expect.anything(),
      )
    })
  })
})
