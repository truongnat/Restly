import { z } from 'zod'

import { HTTP_METHODS } from '@/shared/constants/http'

export const httpMethodSchema = z.enum(HTTP_METHODS)

export const paramRowSchema = z.object({
  id: z.string().min(1),
  enabled: z.boolean(),
  key: z.string(),
  value: z.string(),
  description: z.string(),
})

export const headerRowSchema = z.object({
  id: z.string().min(1),
  enabled: z.boolean(),
  key: z.string(),
  value: z.string(),
  description: z.string().optional(),
})

export const requestAuthTypeSchema = z.enum(['none', 'bearer', 'basic', 'oauth', 'apikey'])

export const requestAuthSchema = z.object({
  type: requestAuthTypeSchema,
  bearerToken: z.string().optional(),
  basicUsername: z.string().optional(),
  basicPassword: z.string().optional(),
  oauthClientId: z.string().optional(),
  oauthClientSecret: z.string().optional(),
  oauthTokenUrl: z.string().optional(),
  oauthAuthUrl: z.string().optional(),
  apiKey: z.string().optional(),
  apiKeyHeader: z.string().optional(),
  apiKeyIn: z.enum(['header', 'query']).optional(),
})

export const bodyFilePartSchema = z.object({
  id: z.string().min(1),
  fieldName: z.string(),
  name: z.string(),
  size: z.number().nonnegative(),
})

const TEMPLATE_VARIABLE_PATTERN = /\{\{[^{}]+\}\}/g
const LEADING_TEMPLATE_VARIABLE_PATTERN = /^\s*\{\{[^{}]+\}\}/

function isValidRequestUrl(value: string): boolean {
  const url = value.trim()
  if (!url) return false

  // [RULE:REQUEST:UNRESOLVED_URL_VARIABLE]
  // A leading variable may resolve to the complete base URL at execution time.
  if (LEADING_TEMPLATE_VARIABLE_PATTERN.test(url)) return true

  try {
    const parsed = new URL(url.replace(TEMPLATE_VARIABLE_PATTERN, 'template-value'))
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export const requestDraftSchema = z
  .object({
    method: httpMethodSchema,
    url: z
      .string()
      .min(1, 'URL is required')
      .refine(isValidRequestUrl, 'Enter a valid HTTP or HTTPS URL'),
    params: z.array(paramRowSchema).default([]),
    headers: z.array(headerRowSchema).default([]),
    body: z.string().default(''),
    contentType: z.string().default('application/json'),
    auth: requestAuthSchema.default({ type: 'none' }),
    bodyFiles: z.array(bodyFilePartSchema).default([]),
  })
  .superRefine((draft, ctx) => {
    const firstHeaderIndexByKey = new Map<string, number>()

    draft.headers.forEach((header, index) => {
      const normalizedKey = header.key.trim().toLowerCase()
      if (!header.enabled || !normalizedKey) return

      const firstIndex = firstHeaderIndexByKey.get(normalizedKey)
      if (firstIndex === undefined) {
        firstHeaderIndexByKey.set(normalizedKey, index)
        return
      }

      // [RULE:REQUEST:ENABLED_HEADER_UNIQUENESS]
      // Fetch headers collapse case-insensitive duplicates, so reject every later enabled row.
      ctx.addIssue({
        code: 'custom',
        message: `Duplicate enabled header "${header.key.trim()}"`,
        path: ['headers', index, 'key'],
      })
    })
  })

export const envVarSchema = z.object({
  id: z.string().min(1),
  enabled: z.boolean(),
  key: z.string().min(1),
  value: z.string(),
  secret: z.boolean().optional(),
})

export type RequestDraft = z.infer<typeof requestDraftSchema>
export type ParamRowInput = z.infer<typeof paramRowSchema>
export type HeaderRow = z.infer<typeof headerRowSchema>
export type RequestAuthType = z.infer<typeof requestAuthTypeSchema>
export type RequestAuth = z.infer<typeof requestAuthSchema>
