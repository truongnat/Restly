import { describe, expect, it } from 'vitest'

import { getEnvResolutionTooltip, hasEnvTokens, substituteEnv } from './substitute-env'

describe('substituteEnv', () => {
  it('replaces enabled key placeholder with value', () => {
    const vars = [
      { key: 'base_url', value: 'https://api.restly.com', enabled: true },
      { key: 'tenant', value: 'acme', enabled: true },
    ]
    const template = '{{base_url}}/v1/{{tenant}}/users'
    expect(substituteEnv(template, vars)).toBe('https://api.restly.com/v1/acme/users')
  })

  it('ignores disabled environment variables', () => {
    const vars = [{ key: 'base_url', value: 'https://api.restly.com', enabled: false }]
    const template = '{{base_url}}/v1/users'
    expect(substituteEnv(template, vars)).toBe('{{base_url}}/v1/users')
  })

  it('handles spaces inside template placeholders', () => {
    const vars = [{ key: 'base_url', value: 'https://api.restly.com', enabled: true }]
    const template = '{{  base_url  }}/v1/users'
    expect(substituteEnv(template, vars)).toBe('https://api.restly.com/v1/users')
  })

  it('handles empty or missing template and vars', () => {
    expect(substituteEnv('', [])).toBe('')
    expect(substituteEnv('https://api.com', [])).toBe('https://api.com')
  })

  it('handles special regex characters in variable values gracefully', () => {
    const vars = [{ key: 'token', value: '$100$price', enabled: true }]
    const template = 'Bearer {{token}}'
    expect(substituteEnv(template, vars)).toBe('Bearer $100$price')
  })
})

describe('hasEnvTokens', () => {
  it('returns true when text contains {{var}} tokens', () => {
    expect(hasEnvTokens('https://{{host}}/api')).toBe(true)
    expect(hasEnvTokens('{{ token }}')).toBe(true)
  })

  it('returns false when text does not contain {{var}} tokens', () => {
    expect(hasEnvTokens('https://api.example.com')).toBe(false)
    expect(hasEnvTokens('')).toBe(false)
  })
})

describe('getEnvResolutionTooltip', () => {
  it('returns null when no env tokens exist', () => {
    const vars = [{ key: 'host', value: 'example.com', enabled: true }]
    expect(getEnvResolutionTooltip('https://api.com', vars)).toBeNull()
    expect(getEnvResolutionTooltip('', vars)).toBeNull()
  })

  it('returns substituted text when env tokens exist', () => {
    const vars = [{ key: 'host', value: 'example.com', enabled: true }]
    expect(getEnvResolutionTooltip('https://{{host}}/api', vars)).toBe('https://example.com/api')
  })
})
