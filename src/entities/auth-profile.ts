import type { RequestAuth } from '@/entities/request'

export type AuthProfile = {
  id: string
  name: string
  description?: string
  auth: RequestAuth
}

export function authTypeLabel(type: RequestAuth['type']): string {
  switch (type) {
    case 'bearer':
      return 'Bearer Token'
    case 'basic':
      return 'Basic Auth'
    case 'oauth':
      return 'OAuth 2.0'
    default:
      return 'No Auth'
  }
}
