import { describe, expect, it } from 'vitest'

import type { RequestDraft } from '@/entities'
import { serializeRequestBody } from '@/infrastructure/adapters/http/serialize-request-body'

const baseDraft: RequestDraft = {
  method: 'POST',
  url: 'https://api.example.com/upload',
  params: [],
  headers: [],
  body: '',
  contentType: 'application/json',
  auth: { type: 'none' },
  bodyFiles: [],
}

describe('serializeRequestBody', () => {
  it.each([
    ['application/json', '{"ok":true}'],
    ['text/plain', 'hello'],
    ['application/x-www-form-urlencoded', 'name=Restly&enabled=true'],
  ])('preserves %s editor text', (contentType, body) => {
    expect(serializeRequestBody({ ...baseDraft, contentType, body })).toEqual({
      body,
      contentType,
    })
  })

  it('preserves real file bytes and lets the runtime own the multipart boundary', async () => {
    const bytes = new Uint8Array([0, 1, 2, 254, 255])
    const file = new File([bytes], 'payload.bin', { type: 'application/octet-stream' })

    const result = serializeRequestBody({
      ...baseDraft,
      contentType: 'multipart/form-data',
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

    expect(result.contentType).toBeUndefined()
    expect(result.body).toBeInstanceOf(FormData)
    const serializedFile = (result.body as FormData).get('artifact')
    expect(serializedFile).toBeInstanceOf(File)
    expect(Array.from(new Uint8Array(await (serializedFile as File).arrayBuffer()))).toEqual([
      0, 1, 2, 254, 255,
    ])
  })

  it('serializes binary mode as the selected file', async () => {
    const file = new File(['actual file bytes'], 'payload.dat')
    const result = serializeRequestBody({
      ...baseDraft,
      contentType: 'application/octet-stream',
      bodyFiles: [
        {
          id: 'file-1',
          fieldName: 'file',
          name: file.name,
          size: file.size,
          file,
        },
      ],
    })

    expect(result.body).toBe(file)
    expect(result.contentType).toBe('application/octet-stream')
    expect(await (result.body as File).text()).toBe('actual file bytes')
  })

  it('rejects persisted file metadata without inventing file content', () => {
    expect(() =>
      serializeRequestBody({
        ...baseDraft,
        contentType: 'multipart/form-data',
        bodyFiles: [
          {
            id: 'file-1',
            fieldName: 'file',
            name: 'missing.bin',
            size: 42,
          },
        ],
      }),
    ).toThrow('Select "missing.bin" again before sending')
  })
})
