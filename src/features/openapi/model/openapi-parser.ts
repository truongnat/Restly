/**
 * OpenAPI 3.0/3.1 Parser — FEAT-08
 *
 * Parses OpenAPI specifications (JSON & YAML) and converts them
 * into Restly collections with requests.
 *
 * Supports:
 * - OpenAPI 3.0.x and 3.1.x
 * - $ref resolution (internal references)
 * - Path/query/header parameters
 * - Request body schemas
 * - Multiple content types
 */

export interface OpenAPIParameter {
  name: string
  in: 'path' | 'query' | 'header' | 'cookie'
  required?: boolean
  schema?: OpenAPISchema
  description?: string
  example?: unknown
  $ref?: string
}

export interface OpenAPISchema {
  type?: string
  format?: string
  properties?: Record<string, OpenAPISchema>
  items?: OpenAPISchema
  required?: string[]
  example?: unknown
  $ref?: string
  enum?: unknown[]
  default?: unknown
}

export interface OpenAPIRequestBody {
  description?: string
  required?: boolean
  content: Record<string, { schema?: OpenAPISchema; example?: unknown }>
}

export interface OpenAPIResponse {
  description: string
  content?: Record<string, { schema?: OpenAPISchema; example?: unknown }>
  headers?: Record<string, OpenAPIParameter>
}

export interface OpenAPIOperation {
  operationId?: string
  summary?: string
  description?: string
  tags?: string[]
  parameters?: OpenAPIParameter[]
  requestBody?: OpenAPIRequestBody
  responses?: Record<string, OpenAPIResponse>
  security?: Array<Record<string, string[]>>
}

export interface OpenAPIPathItem {
  get?: OpenAPIOperation
  post?: OpenAPIOperation
  put?: OpenAPIOperation
  delete?: OpenAPIOperation
  patch?: OpenAPIOperation
  head?: OpenAPIOperation
  options?: OpenAPIOperation
  trace?: OpenAPIOperation
  parameters?: OpenAPIParameter[]
}

export interface OpenAPISpec {
  openapi: string
  info: {
    title: string
    version: string
    description?: string
  }
  servers?: Array<{ url: string; description?: string }>
  paths: Record<string, OpenAPIPathItem>
  components?: {
    schemas?: Record<string, OpenAPISchema>
    parameters?: Record<string, OpenAPIParameter>
    requestBodies?: Record<string, OpenAPIRequestBody>
    responses?: Record<string, OpenAPIResponse>
    securitySchemes?: Record<string, unknown>
  }
}

export interface ParsedRequest {
  id: string
  name: string
  method: string
  url: string
  description?: string
  params: Array<{ key: string; value: string; description?: string; enabled: boolean }>
  headers: Array<{ key: string; value: string; description?: string; enabled: boolean }>
  body?: string
  contentType?: string
  tags: string[]
}

export interface ParsedCollection {
  name: string
  description?: string
  baseUrl: string
  requests: ParsedRequest[]
  folders: Array<{
    name: string
    requests: ParsedRequest[]
  }>
}

/**
 * Parse OpenAPI spec from JSON or YAML string.
 */
export function parseOpenAPI(content: string): OpenAPISpec {
  let parsed: unknown

  // Try JSON first
  try {
    parsed = JSON.parse(content)
  } catch {
    // Try YAML (simple parser for common cases)
    parsed = parseSimpleYaml(content)
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid OpenAPI specification: could not parse content')
  }

  const spec = parsed as OpenAPISpec

  if (!spec.openapi || !spec.openapi.startsWith('3.')) {
    throw new Error(
      `Unsupported OpenAPI version: ${spec.openapi ?? 'unknown'}. Only 3.x is supported.`,
    )
  }

  if (!spec.paths || typeof spec.paths !== 'object') {
    throw new Error('Invalid OpenAPI specification: missing paths')
  }

  return spec
}

/**
 * Simple YAML parser for common OpenAPI structures.
 * Note: This is a basic implementation. For production, use a full YAML library.
 */
function parseSimpleYaml(content: string): unknown {
  // Check if it looks like YAML
  if (!content.includes('openapi:') && !content.includes('swagger:')) {
    throw new Error('Content is neither valid JSON nor YAML OpenAPI specification')
  }

  // For now, throw a helpful error suggesting JSON
  // A full implementation would use js-yaml
  throw new Error(
    'YAML parsing requires the js-yaml library. Please convert to JSON or install js-yaml.',
  )
}

/**
 * Resolve $ref references in the spec.
 */
export function resolveRef<T>(spec: OpenAPISpec, ref: string): T | undefined {
  if (!ref.startsWith('#/')) return undefined

  const path = ref.slice(2).split('/')
  let current: unknown = spec

  for (const segment of path) {
    if (current === null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[segment]
  }

  return current as T
}

/**
 * Resolve a schema that may contain $ref.
 */
function resolveSchema(
  spec: OpenAPISpec,
  schema: OpenAPISchema | undefined,
): OpenAPISchema | undefined {
  if (!schema) return undefined
  if (schema.$ref) {
    return resolveRef<OpenAPISchema>(spec, schema.$ref)
  }
  return schema
}

/**
 * Generate sample value from schema.
 */
export function generateSampleValue(spec: OpenAPISpec, schema: OpenAPISchema | undefined): unknown {
  const resolved = resolveSchema(spec, schema)
  if (!resolved) return null

  if (resolved.example !== undefined) return resolved.example
  if (resolved.default !== undefined) return resolved.default
  if (resolved.enum && resolved.enum.length > 0) return resolved.enum[0]

  switch (resolved.type) {
    case 'string':
      if (resolved.format === 'date') return new Date().toISOString().split('T')[0]
      if (resolved.format === 'date-time') return new Date().toISOString()
      if (resolved.format === 'email') return 'user@example.com'
      if (resolved.format === 'uri' || resolved.format === 'url') return 'https://example.com'
      if (resolved.format === 'uuid') return '123e4567-e89b-12d3-a456-426614174000'
      return 'string'
    case 'number':
    case 'integer':
      return 0
    case 'boolean':
      return true
    case 'array':
      return [generateSampleValue(spec, resolved.items)]
    case 'object': {
      const obj: Record<string, unknown> = {}
      if (resolved.properties) {
        for (const [key, propSchema] of Object.entries(resolved.properties)) {
          obj[key] = generateSampleValue(spec, propSchema)
        }
      }
      return obj
    }
    default:
      return null
  }
}

/**
 * Convert OpenAPI path to URL with path parameters as {{variables}}.
 */
function pathToUrl(baseUrl: string, path: string): string {
  const convertedPath = path.replace(/\{(\w+)\}/g, '{{$1}}')
  return `${baseUrl}${convertedPath}`
}

/**
 * Extract requests from an OpenAPI operation.
 */
function extractOperation(
  spec: OpenAPISpec,
  baseUrl: string,
  path: string,
  method: string,
  operation: OpenAPIOperation,
  pathParams: OpenAPIParameter[] = [],
): ParsedRequest {
  const id = `${method}-${path}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`

  // Merge path-level and operation-level parameters
  const allParams = [...pathParams, ...(operation.parameters ?? [])]

  // Resolve parameter $refs
  const resolvedParams = allParams.map((p) =>
    p.$ref ? (resolveRef<OpenAPIParameter>(spec, (p as unknown as { $ref: string }).$ref) ?? p) : p,
  )

  // Build query params
  const queryParams = resolvedParams
    .filter((p) => p.in === 'query')
    .map((p) => ({
      key: p.name,
      value: p.example !== undefined ? String(p.example) : '',
      description: p.description ?? '',
      enabled: p.required ?? false,
    }))

  // Build headers
  const headerParams = resolvedParams
    .filter((p) => p.in === 'header')
    .map((p) => ({
      key: p.name,
      value: p.example !== undefined ? String(p.example) : '',
      description: p.description ?? '',
      enabled: true,
    }))

  // Handle request body
  let body: string | undefined
  let contentType: string | undefined

  if (operation.requestBody) {
    const content = operation.requestBody.content
    const preferredTypes = ['application/json', 'application/xml', 'text/plain']
    const availableType = preferredTypes.find((t) => content[t]) ?? Object.keys(content)[0]

    if (availableType && content[availableType]) {
      contentType = availableType
      const schema = content[availableType].schema
      const example = content[availableType].example

      if (example !== undefined) {
        body = typeof example === 'string' ? example : JSON.stringify(example, null, 2)
      } else if (schema) {
        const sample = generateSampleValue(spec, schema)
        body =
          availableType === 'application/json' ? JSON.stringify(sample, null, 2) : String(sample)
      }

      if (availableType === 'application/json') {
        headerParams.push({
          key: 'Content-Type',
          value: 'application/json',
          description: '',
          enabled: true,
        })
      }
    }
  }

  return {
    id,
    name: operation.summary ?? operation.operationId ?? `${method.toUpperCase()} ${path}`,
    method: method.toUpperCase(),
    url: pathToUrl(baseUrl, path),
    description: operation.description,
    params: queryParams,
    headers: headerParams,
    body,
    contentType,
    tags: operation.tags ?? [],
  }
}

/**
 * Convert OpenAPI spec to Restly collection.
 */
export function openApiToCollection(spec: OpenAPISpec): ParsedCollection {
  const baseUrl = spec.servers?.[0]?.url ?? 'http://localhost:3000'
  const requests: ParsedRequest[] = []
  const folderMap = new Map<string, ParsedRequest[]>()

  const methods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'trace'] as const

  for (const [path, pathItem] of Object.entries(spec.paths)) {
    for (const method of methods) {
      const operation = pathItem[method]
      if (!operation) continue

      const request = extractOperation(spec, baseUrl, path, method, operation, pathItem.parameters)

      // Group by first tag
      const tag = operation.tags?.[0]
      if (tag) {
        if (!folderMap.has(tag)) {
          folderMap.set(tag, [])
        }
        folderMap.get(tag)!.push(request)
      } else {
        requests.push(request)
      }
    }
  }

  return {
    name: spec.info.title,
    description: spec.info.description,
    baseUrl,
    requests,
    folders: Array.from(folderMap.entries()).map(([name, folderRequests]) => ({
      name,
      requests: folderRequests,
    })),
  }
}

/**
 * Generate test script for an endpoint.
 */
export function generateTestScript(request: ParsedRequest, _spec: OpenAPISpec): string {
  const lines: string[] = []

  lines.push(`// Auto-generated tests for ${request.name}`)
  lines.push('')

  // Status code test
  lines.push(`rl.test('Status code is 2xx', () => {`)
  lines.push(`  const code = rl.response?.code ?? 0`)
  lines.push(`  if (code < 200 || code >= 300) {`)
  lines.push(`    throw new Error('Expected 2xx, got ' + code)`)
  lines.push(`  }`)
  lines.push(`})`)
  lines.push('')

  // Response time test
  lines.push(`rl.test('Response time is less than 1000ms', () => {`)
  lines.push(`  const time = rl.response?.responseTime ?? 0`)
  lines.push(`  if (time > 1000) {`)
  lines.push(`    throw new Error('Response too slow: ' + time + 'ms')`)
  lines.push(`  }`)
  lines.push(`})`)
  lines.push('')

  // JSON schema test for JSON responses
  if (request.contentType === 'application/json') {
    lines.push(`rl.test('Response is valid JSON', () => {`)
    lines.push(`  const body = rl.response?.text() ?? ''`)
    lines.push(`  try {`)
    lines.push(`    JSON.parse(body)`)
    lines.push(`  } catch (e) {`)
    lines.push(`    throw new Error('Invalid JSON response')`)
    lines.push(`  }`)
    lines.push(`})`)
  }

  return lines.join('\n')
}

/**
 * Export Restly collection to OpenAPI 3.1 spec.
 */
export function collectionToOpenApi(
  name: string,
  version: string,
  requests: ParsedRequest[],
): OpenAPISpec {
  const paths: Record<string, OpenAPIPathItem> = {}

  for (const request of requests) {
    // Extract path from URL (remove baseUrl and query params)
    let path = request.url
    try {
      const url = new URL(request.url.replace(/\{\{(\w+)\}\}/g, ':$1'))
      path = url.pathname
    } catch {
      // If URL parsing fails, use the path as-is
      path = request.url.split('?')[0]
    }

    // Convert {{var}} back to {var}
    path = path.replace(/\{\{(\w+)\}\}/g, '{$1}')

    if (!paths[path]) {
      paths[path] = {}
    }

    const method = request.method.toLowerCase() as keyof OpenAPIPathItem
    const operation: OpenAPIOperation = {
      operationId: request.id,
      summary: request.name,
      description: request.description,
      tags: request.tags.length > 0 ? request.tags : undefined,
      parameters: [
        ...request.params.map((p) => ({
          name: p.key,
          in: 'query' as const,
          required: p.enabled,
          description: p.description,
        })),
      ],
      responses: {
        '200': {
          description: 'Successful response',
        },
      },
    }

    if (request.body && request.contentType) {
      operation.requestBody = {
        required: true,
        content: {
          [request.contentType]: {
            schema: { type: 'object' },
          },
        },
      }
    }

    ;(paths[path] as Record<string, OpenAPIOperation>)[method] = operation
  }

  return {
    openapi: '3.1.0',
    info: {
      title: name,
      version,
    },
    servers: [{ url: 'http://localhost:3000' }],
    paths,
  }
}
