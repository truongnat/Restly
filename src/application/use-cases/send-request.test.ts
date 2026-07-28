import { afterEach, describe, expect, it } from 'vitest'

import { createSendRequest, prepareRequestDraft } from '@/application/use-cases/send-request'
import type { RequestDraft } from '@/entities'
import {
  createFakeRequestClient,
  createTestContainer,
  resetContainer,
  resolve,
  setContainer,
  TOKENS,
} from '@/infrastructure/di'

const draft: RequestDraft = {
  method: 'GET',
  url: '  https://api.example.com/user  ',
  params: [
    { id: '1', enabled: true, key: 'id', value: '1', description: '' },
    { id: '2', enabled: false, key: 'debug', value: '1', description: '' },
  ],
  headers: [
    { id: 'h1', enabled: true, key: 'Accept', value: 'application/json' },
    { id: 'h2', enabled: false, key: 'X-Debug', value: 'true' },
  ],
  body: '{"test":true}',
  contentType: 'application/json',
  auth: { type: 'bearer', bearerToken: 'my-token' },
  bodyFiles: [],
}

afterEach(() => {
  resetContainer()
})

describe('prepareRequestDraft', () => {
  it('trims url and drops disabled params and headers', () => {
    const prepared = prepareRequestDraft(draft)
    expect(prepared.url).toBe('https://api.example.com/user')
    expect(prepared.params).toHaveLength(1)
    expect(prepared.params[0]?.key).toBe('id')
    expect(prepared.headers).toHaveLength(1)
    expect(prepared.headers[0]?.key).toBe('Accept')
    expect(prepared.body).toBe('{"test":true}')
    expect(prepared.contentType).toBe('application/json')
    expect(prepared.auth.type).toBe('bearer')
  })
})

describe('createSendRequest (no React)', () => {
  it('validates, prepares, then calls RequestClient', async () => {
    const client = createFakeRequestClient({ body: '{"ok":true}' })
    const send = createSendRequest(client)

    const result = await send(draft)

    expect(client.lastDraft?.url).toBe('https://api.example.com/user')
    expect(client.lastDraft?.params).toHaveLength(1)
    expect(client.lastDraft?.headers).toHaveLength(1)
    expect(client.lastDraft?.auth.type).toBe('bearer')
    expect(result.body).toBe('{"ok":true}')
  })
})

describe('module-level DI resolve (no React)', () => {
  it('resolves SendRequest from a test container', async () => {
    const client = createFakeRequestClient({ status: 201, statusText: 'Created' })
    setContainer(createTestContainer({ requestClient: client }))

    const result = await resolve(TOKENS.SendRequest)({
      method: 'POST',
      url: 'https://api.example.com',
      params: [],
    })

    expect(result.status).toBe(201)
    expect(result.statusText).toBe('Created')
  })
})

describe('createMockRequestClient', () => {
  it('echoes draft in response body and returns mock headers', async () => {
    const { createMockRequestClient } =
      await import('@/infrastructure/adapters/mock/mock-request.adapter')
    const mockClient = createMockRequestClient()
    const res = await mockClient.send(draft)
    expect(res.status).toBe(200)
    expect(res.headers?.['content-type']).toBe('application/json; charset=utf-8')
    expect(res.headers?.['server']).toBe('Restly-Mock/1.0')
    expect(res.headers?.['x-request-id']).toBeTruthy()

    const parsed = JSON.parse(res.body)
    expect(parsed.request.method).toBe('GET')
    expect(parsed.request.auth).toBe('bearer')
    expect(parsed.request.headers['Content-Type']).toBe('application/json')
  })

  it('echoes multipart field names and returns rich headers', async () => {
    const { createMockRequestClient } =
      await import('@/infrastructure/adapters/mock/mock-request.adapter')
    const mockClient = createMockRequestClient()
    const res = await mockClient.send({
      ...draft,
      method: 'POST',
      contentType: 'multipart/form-data',
      body: '',
      bodyFiles: [
        { id: '1', fieldName: 'avatar', name: 'me.png', size: 1200 },
        { id: '2', fieldName: 'docs', name: 'a.pdf', size: 4000 },
        { id: '3', fieldName: 'docs', name: 'b.pdf', size: 5000 },
      ],
    })

    expect(res.status).toBe(200)
    expect(res.headers?.['content-length']).toBeTruthy()
    expect(res.headers?.date).toBeTruthy()

    const parsed = JSON.parse(res.body)
    expect(parsed.uploaded.fieldCount).toBe(2)
    expect(parsed.uploaded.fileCount).toBe(3)
    expect(parsed.uploaded.fields.avatar).toHaveLength(1)
    expect(parsed.uploaded.fields.docs).toHaveLength(2)
    expect(parsed.request.headers['Content-Type']).toMatch(/^multipart\/form-data; boundary=/)
  })
})
