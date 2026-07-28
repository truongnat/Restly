import { describe, expect, it } from 'vitest'

import { formatBody, validateBody } from './validate-body'

describe('validateBody', () => {
  it('returns valid for empty JSON body', () => {
    expect(validateBody('', 'application/json')).toEqual({ isValid: true, error: null })
    expect(validateBody('   ', 'application/json')).toEqual({ isValid: true, error: null })
  })

  it('returns valid for valid JSON body', () => {
    expect(validateBody('{"key": "value"}', 'application/json')).toEqual({
      isValid: true,
      error: null,
    })
    expect(validateBody('[1, 2, 3]', 'application/json')).toEqual({ isValid: true, error: null })
  })

  it('returns invalid with error message for invalid JSON body', () => {
    const result = validateBody('{"key": }', 'application/json')
    expect(result.isValid).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it('returns valid for non-JSON content types even with arbitrary text', () => {
    expect(validateBody('plain text', 'text/plain')).toEqual({ isValid: true, error: null })
    expect(validateBody('<xml></xml>', 'application/xml')).toEqual({ isValid: true, error: null })
  })
})

describe('formatBody', () => {
  it('formats valid JSON with indentation', () => {
    const input = '{"a":1,"b":2}'
    const result = formatBody(input, 'application/json')
    expect(result.formatted).toBe('{\n  "a": 1,\n  "b": 2\n}')
    expect(result.error).toBeUndefined()
  })

  it('returns original text and error when formatting invalid JSON', () => {
    const input = '{"a":}'
    const result = formatBody(input, 'application/json')
    expect(result.formatted).toBe(input)
    expect(result.error).toBeTruthy()
  })

  it('returns unchanged text for non-JSON content type', () => {
    const input = 'hello world'
    const result = formatBody(input, 'text/plain')
    expect(result.formatted).toBe(input)
  })
})
