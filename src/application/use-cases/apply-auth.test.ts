import { describe, expect, it } from 'vitest'

import type { AuthProfile } from '@/entities/auth-profile'
import type { HeaderRow, ParamRow } from '@/entities/request'

import { applyAuthToRequest, isAuthConfigured, redactAuthForDisplay } from './apply-auth'

describe('apply-auth', () => {
  const emptyHeaders: HeaderRow[] = []
  const emptyParams: ParamRow[] = []

  describe('applyAuthToRequest', () => {
    it('applies bearer token to headers', () => {
      const auth: AuthProfile = {
        id: '1',
        name: 'Bearer Auth',
        auth: { type: 'bearer', bearerToken: 'my-secret-token' },
      }

      const result = applyAuthToRequest(emptyHeaders, emptyParams, auth)

      expect(result.headers).toHaveLength(1)
      expect(result.headers[0].key).toBe('Authorization')
      expect(result.headers[0].value).toBe('Bearer my-secret-token')
      expect(result.headers[0].enabled).toBe(true)
    })

    it('applies basic auth to headers', () => {
      const auth: AuthProfile = {
        id: '1',
        name: 'Basic Auth',
        auth: { type: 'basic', basicUsername: 'admin', basicPassword: 'secret123' },
      }

      const result = applyAuthToRequest(emptyHeaders, emptyParams, auth)

      expect(result.headers).toHaveLength(1)
      expect(result.headers[0].key).toBe('Authorization')
      // btoa('admin:secret123') = 'YWRtaW46c2VjcmV0MTIz'
      expect(result.headers[0].value).toBe('Basic YWRtaW46c2VjcmV0MTIz')
    })

    it('applies API key to headers by default', () => {
      const auth: AuthProfile = {
        id: '1',
        name: 'API Key',
        auth: {
          type: 'apikey',
          apiKey: 'rk_live_123',
          apiKeyHeader: 'X-API-Key',
          apiKeyIn: 'header',
        },
      }

      const result = applyAuthToRequest(emptyHeaders, emptyParams, auth)

      expect(result.headers).toHaveLength(1)
      expect(result.headers[0].key).toBe('X-API-Key')
      expect(result.headers[0].value).toBe('rk_live_123')
      expect(result.params).toHaveLength(0)
    })

    it('applies API key to query params when configured', () => {
      const auth: AuthProfile = {
        id: '1',
        name: 'API Key Query',
        auth: { type: 'apikey', apiKey: 'rk_live_123', apiKeyHeader: 'api_key', apiKeyIn: 'query' },
      }

      const result = applyAuthToRequest(emptyHeaders, emptyParams, auth)

      expect(result.headers).toHaveLength(0)
      expect(result.params).toHaveLength(1)
      expect(result.params[0].key).toBe('api_key')
      expect(result.params[0].value).toBe('rk_live_123')
    })

    it('does not modify original arrays', () => {
      const headers: HeaderRow[] = [
        { id: '1', enabled: true, key: 'Content-Type', value: 'application/json' },
      ]
      const auth: AuthProfile = {
        id: '1',
        name: 'Bearer',
        auth: { type: 'bearer', bearerToken: 'token' },
      }

      applyAuthToRequest(headers, emptyParams, auth)

      expect(headers).toHaveLength(1)
    })

    it('handles none auth type', () => {
      const auth: AuthProfile = {
        id: '1',
        name: 'No Auth',
        auth: { type: 'none' },
      }

      const result = applyAuthToRequest(emptyHeaders, emptyParams, auth)

      expect(result.headers).toHaveLength(0)
      expect(result.params).toHaveLength(0)
    })
  })

  describe('isAuthConfigured', () => {
    it('returns true for configured bearer', () => {
      const auth: AuthProfile = {
        id: '1',
        name: 'Bearer',
        auth: { type: 'bearer', bearerToken: 'token' },
      }
      expect(isAuthConfigured(auth)).toBe(true)
    })

    it('returns false for empty bearer', () => {
      const auth: AuthProfile = {
        id: '1',
        name: 'Bearer',
        auth: { type: 'bearer' },
      }
      expect(isAuthConfigured(auth)).toBe(false)
    })

    it('returns true for configured basic', () => {
      const auth: AuthProfile = {
        id: '1',
        name: 'Basic',
        auth: { type: 'basic', basicUsername: 'user', basicPassword: '' },
      }
      expect(isAuthConfigured(auth)).toBe(true)
    })

    it('returns false for none auth', () => {
      const auth: AuthProfile = {
        id: '1',
        name: 'None',
        auth: { type: 'none' },
      }
      expect(isAuthConfigured(auth)).toBe(false)
    })
  })

  describe('redactAuthForDisplay', () => {
    it('redacts bearer token', () => {
      const auth: AuthProfile = {
        id: '1',
        name: 'Bearer',
        auth: { type: 'bearer', bearerToken: 'super-secret-token' },
      }

      const redacted = redactAuthForDisplay(auth)

      expect(redacted.auth.bearerToken).toBe('[REDACTED]')
    })

    it('redacts basic password', () => {
      const auth: AuthProfile = {
        id: '1',
        name: 'Basic',
        auth: { type: 'basic', basicUsername: 'admin', basicPassword: 'secret123' },
      }

      const redacted = redactAuthForDisplay(auth)

      expect(redacted.auth.basicUsername).toBe('admin')
      expect(redacted.auth.basicPassword).toBe('[REDACTED]')
    })

    it('redacts API key', () => {
      const auth: AuthProfile = {
        id: '1',
        name: 'API Key',
        auth: { type: 'apikey', apiKey: 'rk_live_secret', apiKeyHeader: 'X-API-Key' },
      }

      const redacted = redactAuthForDisplay(auth)

      expect(redacted.auth.apiKey).toBe('[REDACTED]')
      expect(redacted.auth.apiKeyHeader).toBe('X-API-Key')
    })

    it('does not mutate original auth', () => {
      const auth: AuthProfile = {
        id: '1',
        name: 'Bearer',
        auth: { type: 'bearer', bearerToken: 'original-token' },
      }

      redactAuthForDisplay(auth)

      expect(auth.auth.bearerToken).toBe('original-token')
    })
  })
})
