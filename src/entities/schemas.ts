import { z } from 'zod'

export const httpMethodSchema = z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'])

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

export const requestDraftSchema = z.object({
  method: httpMethodSchema,
  url: z.string().min(1, 'URL is required'),
  params: z.array(paramRowSchema).default([]),
  headers: z.array(headerRowSchema).default([]),
  body: z.string().default(''),
  contentType: z.string().default('application/json'),
  auth: requestAuthSchema.default({ type: 'none' }),
  bodyFiles: z.array(bodyFilePartSchema).default([]),
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
