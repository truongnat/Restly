import type { HttpMethod } from '@/entities/http'

export type MockRoute = {
  id: string
  enabled: boolean
  method: HttpMethod
  path: string
  status: number
  delayMs: number
  responseBody: string
}

export type MockServer = {
  id: string
  name: string
  baseUrl: string
  running: boolean
  description?: string
  routes: MockRoute[]
}
