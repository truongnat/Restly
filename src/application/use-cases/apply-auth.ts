/**
 * Apply authentication to HTTP requests.
 * FEAT-03: Advanced Auth Profiles & OAuth 2.0 PKCE Flow
 *
 * Supports: Bearer, Basic, API Key, OAuth2
 * SECURITY:REDACT_EVIDENCE — Auth credentials are never logged.
 */

import type { AuthProfile } from '@/entities/auth-profile'
import type { HeaderRow, ParamRow } from '@/entities/request'

export interface AuthenticatedRequest {
  headers: HeaderRow[]
  params: ParamRow[]
}

/**
 * Apply auth profile to request headers/params.
 * Returns new arrays with auth credentials injected.
 */
export function applyAuthToRequest(
  headers: HeaderRow[],
  params: ParamRow[],
  auth: AuthProfile,
): AuthenticatedRequest {
  const newHeaders = [...headers]
  const newParams = [...params]

  switch (auth.auth.type) {
    case 'bearer': {
      if (auth.auth.bearerToken) {
        newHeaders.push({
          id: crypto.randomUUID(),
          enabled: true,
          key: 'Authorization',
          value: `Bearer ${auth.auth.bearerToken}`,
        })
      }
      break
    }

    case 'basic': {
      if (auth.auth.basicUsername !== undefined && auth.auth.basicPassword !== undefined) {
        const credentials = btoa(`${auth.auth.basicUsername}:${auth.auth.basicPassword}`)
        newHeaders.push({
          id: crypto.randomUUID(),
          enabled: true,
          key: 'Authorization',
          value: `Basic ${credentials}`,
        })
      }
      break
    }

    case 'apikey': {
      if (auth.auth.apiKey && auth.auth.apiKeyHeader) {
        if (auth.auth.apiKeyIn === 'query') {
          newParams.push({
            id: crypto.randomUUID(),
            enabled: true,
            key: auth.auth.apiKeyHeader,
            value: auth.auth.apiKey,
            description: 'API Key (auto-injected)',
          })
        } else {
          newHeaders.push({
            id: crypto.randomUUID(),
            enabled: true,
            key: auth.auth.apiKeyHeader,
            value: auth.auth.apiKey,
          })
        }
      }
      break
    }

    case 'oauth': {
      // OAuth2 tokens are applied as Bearer tokens after the flow completes
      // The token should be stored in the auth profile after successful authentication
      if (auth.auth.bearerToken) {
        newHeaders.push({
          id: crypto.randomUUID(),
          enabled: true,
          key: 'Authorization',
          value: `Bearer ${auth.auth.bearerToken}`,
        })
      }
      break
    }

    case 'none':
    default:
      // No auth to apply
      break
  }

  return { headers: newHeaders, params: newParams }
}

/**
 * Check if an auth profile has valid credentials configured.
 */
export function isAuthConfigured(auth: AuthProfile): boolean {
  switch (auth.auth.type) {
    case 'bearer':
      return !!auth.auth.bearerToken
    case 'basic':
      return auth.auth.basicUsername !== undefined
    case 'apikey':
      return !!auth.auth.apiKey && !!auth.auth.apiKeyHeader
    case 'oauth':
      return !!auth.auth.bearerToken // Token present after OAuth flow
    case 'none':
    default:
      return false
  }
}

/**
 * Redact auth credentials for safe display/logging.
 * SECURITY:REDACT_EVIDENCE
 */
export function redactAuthForDisplay(auth: AuthProfile): AuthProfile {
  const redacted = { ...auth, auth: { ...auth.auth } }

  if (redacted.auth.bearerToken) {
    redacted.auth.bearerToken = '[REDACTED]'
  }
  if (redacted.auth.basicPassword) {
    redacted.auth.basicPassword = '[REDACTED]'
  }
  if (redacted.auth.apiKey) {
    redacted.auth.apiKey = '[REDACTED]'
  }
  if (redacted.auth.oauthClientSecret) {
    redacted.auth.oauthClientSecret = '[REDACTED]'
  }

  return redacted
}
