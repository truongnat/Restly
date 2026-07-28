export { cn } from '@/lib/utils'
import type { HttpMethod } from '@/entities/http'

export const methodColor: Record<HttpMethod, string> = {
  GET: 'text-emerald-500',
  POST: 'text-sky-400',
  PUT: 'text-amber-500',
  PATCH: 'text-orange-400',
  DELETE: 'text-rose-500',
  HEAD: 'text-purple-400',
  OPTIONS: 'text-indigo-400',
}

export const methodColorLight: Record<HttpMethod, string> = {
  GET: 'text-emerald-600',
  POST: 'text-sky-600',
  PUT: 'text-amber-600',
  PATCH: 'text-orange-600',
  DELETE: 'text-rose-600',
  HEAD: 'text-purple-600',
  OPTIONS: 'text-indigo-600',
}
