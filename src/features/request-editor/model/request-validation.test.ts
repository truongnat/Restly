import { describe, expect, it } from 'vitest'

import { requestDraftSchema, type RequestDraft } from '@/entities'
import { validateRequestEditor } from '@/features/request-editor/model/request-validation'
import { HTTP_METHODS } from '@/shared/constants/http'

function createDraft(overrides: Partial<RequestDraft> = {}): RequestDraft {
  return {
    method: 'GET',
    url: 'https://api.example.com/users',
    params: [],
    headers: [],
    body: '',
    contentType: 'application/json',
    auth: { type: 'none' },
    bodyFiles: [],
    ...overrides,
  }
}

describe('request draft validation contract', () => {
  it.each(HTTP_METHODS)('accepts the shared HTTP method %s', (method) => {
    expect(requestDraftSchema.safeParse(createDraft({ method })).success).toBe(true)
  })

  it.each([
    'https://api.example.com/users',
    'http://localhost:3000/users',
    'https://{{host}}/users',
    '{{baseUrl}}/users',
  ])('accepts supported request URL %s', (url) => {
    expect(requestDraftSchema.safeParse(createDraft({ url })).success).toBe(true)
  })

  it.each(['', 'api.example.com/users', 'ftp://api.example.com/users', 'not a url'])(
    'rejects invalid request URL %s',
    (url) => {
      const result = requestDraftSchema.safeParse(createDraft({ url }))

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.join('.') === 'url')).toBe(true)
      }
    },
  )

  it('rejects duplicate enabled headers case-insensitively with a stable row path', () => {
    const result = requestDraftSchema.safeParse(
      createDraft({
        headers: [
          { id: 'h1', enabled: true, key: 'Content-Type', value: 'application/json' },
          { id: 'h2', enabled: true, key: 'content-type', value: 'text/plain' },
        ],
      }),
    )

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['headers', 1, 'key'],
            message: 'Duplicate enabled header "content-type"',
          }),
        ]),
      )
    }
  })

  it('ignores disabled duplicate headers', () => {
    const result = requestDraftSchema.safeParse(
      createDraft({
        headers: [
          { id: 'h1', enabled: true, key: 'Accept', value: 'application/json' },
          { id: 'h2', enabled: false, key: 'accept', value: 'text/plain' },
        ],
      }),
    )

    expect(result.success).toBe(true)
  })

  it('preserves ordered duplicate query parameters', () => {
    const draft = createDraft({
      params: [
        { id: 'p1', enabled: true, key: 'tag', value: 'one', description: '' },
        { id: 'p2', enabled: true, key: 'tag', value: 'two', description: '' },
      ],
    })
    const result = requestDraftSchema.safeParse(draft)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.params.map(({ key, value }) => [key, value])).toEqual([
        ['tag', 'one'],
        ['tag', 'two'],
      ])
    }
  })
})

describe('request editor validation projection', () => {
  it('projects URL errors for inline rendering and Send blocking', () => {
    expect(validateRequestEditor(createDraft({ url: 'invalid' }))).toEqual({
      isValid: false,
      urlError: 'Enter a valid HTTP or HTTPS URL',
      headerError: undefined,
    })
  })

  it('projects duplicate-header errors for inline rendering and Send blocking', () => {
    const result = validateRequestEditor(
      createDraft({
        headers: [
          { id: 'h1', enabled: true, key: 'X-Trace', value: 'one' },
          { id: 'h2', enabled: true, key: 'x-trace', value: 'two' },
        ],
      }),
    )

    expect(result).toEqual({
      isValid: false,
      urlError: undefined,
      headerError: 'Duplicate enabled header "x-trace"',
    })
  })
})
