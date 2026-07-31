/**
 * OAuth 2.0 service — token exchange, refresh, and management.
 * FEAT-03: Advanced Auth Profiles & OAuth 2.0 PKCE Flow
 *
 * SECURITY:REDACT_EVIDENCE — Tokens are never logged in plain text.
 */

import { buildAuthorizationUrl, generatePKCECodes, generateState } from './pkce-helper'

export interface OAuth2Config {
  grantType: 'authorization_code_pkce'
  clientId: string
  authUrl: string
  tokenUrl: string
  redirectUri: string
  scope: string
}

export interface OAuth2Tokens {
  accessToken: string
  refreshToken?: string
  expiresAt: number // Unix timestamp ms
  tokenType: string
  scope?: string
}

export interface OAuth2FlowState {
  state: string
  codeVerifier: string
  config: OAuth2Config
}

/**
 * OAuth2 service for PKCE authorization code flow.
 */
export class OAuth2Service {
  private pendingFlow: OAuth2FlowState | null = null

  /**
   * Initiate the OAuth2 PKCE flow.
   * Returns the authorization URL to open in browser/webview.
   */
  async initiateFlow(config: OAuth2Config): Promise<string> {
    const pkce = await generatePKCECodes()
    const state = generateState()

    // Store flow state for callback verification
    this.pendingFlow = {
      state,
      codeVerifier: pkce.codeVerifier,
      config,
    }

    return buildAuthorizationUrl({
      authUrl: config.authUrl,
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      scope: config.scope,
      state,
      codeChallenge: pkce.codeChallenge,
    })
  }

  /**
   * Handle the OAuth2 callback with authorization code.
   * Exchanges the code for tokens using the stored code_verifier.
   */
  async handleCallback(callbackUrl: string): Promise<OAuth2Tokens> {
    if (!this.pendingFlow) {
      throw new Error('No pending OAuth2 flow. Call initiateFlow first.')
    }

    const url = new URL(callbackUrl)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const error = url.searchParams.get('error')

    if (error) {
      const errorDescription = url.searchParams.get('error_description') || 'Unknown error'
      throw new Error(`OAuth2 error: ${error} - ${errorDescription}`)
    }

    if (!code) {
      throw new Error('No authorization code in callback URL')
    }

    if (state !== this.pendingFlow.state) {
      throw new Error('State mismatch — possible CSRF attack')
    }

    const tokens = await this.exchangeCodeForTokens(
      code,
      this.pendingFlow.codeVerifier,
      this.pendingFlow.config,
    )

    // Clear pending flow
    this.pendingFlow = null

    return tokens
  }

  /**
   * Exchange authorization code for tokens.
   */
  private async exchangeCodeForTokens(
    code: string,
    codeVerifier: string,
    config: OAuth2Config,
  ): Promise<OAuth2Tokens> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      code_verifier: codeVerifier,
    })

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: body.toString(),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Token exchange failed: ${response.status} - ${errorBody}`)
    }

    const data = await response.json()
    return this.parseTokenResponse(data)
  }

  /**
   * Refresh an expired access token.
   */
  async refreshTokens(refreshToken: string, config: OAuth2Config): Promise<OAuth2Tokens> {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: config.clientId,
    })

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: body.toString(),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Token refresh failed: ${response.status} - ${errorBody}`)
    }

    const data = await response.json()
    return this.parseTokenResponse(data)
  }

  /**
   * Check if tokens need refresh (within 60 seconds of expiry).
   */
  isTokenExpiringSoon(tokens: OAuth2Tokens, bufferMs = 60_000): boolean {
    return Date.now() + bufferMs >= tokens.expiresAt
  }

  /**
   * Parse the token response from the OAuth2 server.
   */
  private parseTokenResponse(data: Record<string, unknown>): OAuth2Tokens {
    const accessToken = data.access_token as string
    if (!accessToken) {
      throw new Error('No access_token in response')
    }

    const expiresIn = (data.expires_in as number) || 3600
    return {
      accessToken,
      refreshToken: data.refresh_token as string | undefined,
      expiresAt: Date.now() + expiresIn * 1000,
      tokenType: (data.token_type as string) || 'Bearer',
      scope: data.scope as string | undefined,
    }
  }

  /**
   * Clear any pending flow state.
   */
  clearPendingFlow(): void {
    this.pendingFlow = null
  }
}

/**
 * Singleton OAuth2 service instance.
 */
export const oauth2Service = new OAuth2Service()
