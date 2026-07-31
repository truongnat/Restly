import { describe, expect, it } from 'vitest'

import {
  base64UrlEncode,
  buildAuthorizationUrl,
  generatePKCECodes,
  generateState,
} from './pkce-helper'

describe('pkce-helper', () => {
  describe('base64UrlEncode', () => {
    it('encodes bytes to base64url without padding', () => {
      const bytes = new Uint8Array([72, 101, 108, 108, 111]) // "Hello"
      const result = base64UrlEncode(bytes)

      expect(result).toBe('SGVsbG8')
      expect(result).not.toContain('+')
      expect(result).not.toContain('/')
      expect(result).not.toContain('=')
    })

    it('replaces + with - and / with _', () => {
      // Bytes that produce + and / in standard base64
      const bytes = new Uint8Array([251, 255, 191])
      const result = base64UrlEncode(bytes)

      expect(result).not.toContain('+')
      expect(result).not.toContain('/')
    })
  })

  describe('generatePKCECodes', () => {
    it('generates valid code verifier and challenge', async () => {
      const { codeVerifier, codeChallenge, codeChallengeMethod } = await generatePKCECodes()

      // Code verifier should be 43 characters (32 bytes base64url encoded)
      expect(codeVerifier.length).toBe(43)
      expect(codeChallengeMethod).toBe('S256')

      // Should only contain URL-safe characters
      expect(codeVerifier).toMatch(/^[A-Za-z0-9_-]+$/)
      expect(codeChallenge).toMatch(/^[A-Za-z0-9_-]+$/)
    })

    it('generates unique codes each time', async () => {
      const codes1 = await generatePKCECodes()
      const codes2 = await generatePKCECodes()

      expect(codes1.codeVerifier).not.toBe(codes2.codeVerifier)
      expect(codes1.codeChallenge).not.toBe(codes2.codeChallenge)
    })

    it('generates different challenge from verifier (SHA-256 hash)', async () => {
      const { codeVerifier, codeChallenge } = await generatePKCECodes()

      // Challenge is SHA-256 hash of verifier, so they must be different
      expect(codeChallenge).not.toBe(codeVerifier)
      // SHA-256 produces 32 bytes = 43 base64url chars
      expect(codeChallenge.length).toBe(43)
    })
  })

  describe('generateState', () => {
    it('generates URL-safe state parameter', () => {
      const state = generateState()

      expect(state).toMatch(/^[A-Za-z0-9_-]+$/)
      expect(state.length).toBeGreaterThan(0)
    })

    it('generates unique state each time', () => {
      const state1 = generateState()
      const state2 = generateState()

      expect(state1).not.toBe(state2)
    })
  })

  describe('buildAuthorizationUrl', () => {
    it('builds correct authorization URL with all parameters', () => {
      const url = buildAuthorizationUrl({
        authUrl: 'https://auth.example.com/authorize',
        clientId: 'my-client-id',
        redirectUri: 'http://localhost:8989/callback',
        scope: 'openid profile email',
        state: 'random-state-123',
        codeChallenge: 'challenge-abc',
      })

      const parsed = new URL(url)

      expect(parsed.origin).toBe('https://auth.example.com')
      expect(parsed.pathname).toBe('/authorize')
      expect(parsed.searchParams.get('response_type')).toBe('code')
      expect(parsed.searchParams.get('client_id')).toBe('my-client-id')
      expect(parsed.searchParams.get('redirect_uri')).toBe('http://localhost:8989/callback')
      expect(parsed.searchParams.get('scope')).toBe('openid profile email')
      expect(parsed.searchParams.get('state')).toBe('random-state-123')
      expect(parsed.searchParams.get('code_challenge')).toBe('challenge-abc')
      expect(parsed.searchParams.get('code_challenge_method')).toBe('S256')
    })

    it('preserves existing query parameters', () => {
      const url = buildAuthorizationUrl({
        authUrl: 'https://auth.example.com/authorize?custom=value',
        clientId: 'client',
        redirectUri: 'http://localhost/callback',
        scope: 'openid',
        state: 'state',
        codeChallenge: 'challenge',
      })

      const parsed = new URL(url)
      expect(parsed.searchParams.get('custom')).toBe('value')
    })
  })
})
