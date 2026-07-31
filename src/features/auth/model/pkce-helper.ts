/**
 * PKCE (Proof Key for Code Exchange) helper for OAuth 2.0 Authorization Code Flow.
 * FEAT-03: Advanced Auth Profiles & OAuth 2.0 PKCE Flow
 *
 * Implements RFC 7636 with SHA-256 challenge method.
 * SECURITY:REDACT_EVIDENCE — Never log code_verifier or tokens.
 */

export interface PKCECodes {
  codeVerifier: string
  codeChallenge: string
  codeChallengeMethod: 'S256'
}

/**
 * Generate PKCE code verifier and challenge.
 *
 * Algorithm:
 * 1. Generate 32 random bytes → base64url encode → code_verifier
 * 2. SHA-256 hash code_verifier → base64url encode → code_challenge
 */
export async function generatePKCECodes(): Promise<PKCECodes> {
  // Generate 32 random bytes for code verifier
  const randomBytes = new Uint8Array(32)
  crypto.getRandomValues(randomBytes)
  const codeVerifier = base64UrlEncode(randomBytes)

  // Create SHA-256 hash for code challenge
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const codeChallenge = base64UrlEncode(new Uint8Array(digest))

  return {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod: 'S256',
  }
}

/**
 * Base64URL encode without padding.
 * RFC 4648 §5: URL and filename safe alphabet.
 */
export function base64UrlEncode(buffer: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < buffer.byteLength; i++) {
    binary += String.fromCharCode(buffer[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Generate a cryptographically random state parameter.
 */
export function generateState(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return base64UrlEncode(bytes)
}

/**
 * Build the authorization URL with PKCE parameters.
 */
export function buildAuthorizationUrl(config: {
  authUrl: string
  clientId: string
  redirectUri: string
  scope: string
  state: string
  codeChallenge: string
}): string {
  const url = new URL(config.authUrl)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', config.clientId)
  url.searchParams.set('redirect_uri', config.redirectUri)
  url.searchParams.set('scope', config.scope)
  url.searchParams.set('state', config.state)
  url.searchParams.set('code_challenge', config.codeChallenge)
  url.searchParams.set('code_challenge_method', 'S256')
  return url.toString()
}
