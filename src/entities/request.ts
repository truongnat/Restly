import type { HttpMethod } from '@/entities/http'

export type ParamRow = {
  id: string
  enabled: boolean
  key: string
  value: string
  description: string
}

export type HeaderRow = {
  id: string
  enabled: boolean
  key: string
  value: string
  description?: string
}

export type RequestAuthType = 'none' | 'bearer' | 'basic' | 'oauth'

export type RequestAuth = {
  type: RequestAuthType
  bearerToken?: string
  basicUsername?: string
  basicPassword?: string
  oauthClientId?: string
  oauthClientSecret?: string
  oauthTokenUrl?: string
  oauthAuthUrl?: string
}

export type RequestItem = {
  id: string
  name: string
  method: HttpMethod
  url: string
}

export type RequestTab = 'params' | 'auth' | 'headers' | 'body'
export type ResponseTab = 'pretty' | 'raw' | 'preview' | 'headers'
