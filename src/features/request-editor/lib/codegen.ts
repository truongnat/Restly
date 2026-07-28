import type { HeaderRow, HttpMethod, ParamRow, RequestAuth } from '@/entities'

export type CodegenInput = {
  method: HttpMethod
  url: string
  headers: HeaderRow[]
  params: ParamRow[]
  body: string
  contentType: string
  auth: RequestAuth
}

function enabledHeaders(input: CodegenInput): Array<{ key: string; value: string }> {
  const rows = input.headers
    .filter((h) => h.enabled && h.key.trim())
    .map((h) => ({ key: h.key.trim(), value: h.value }))
  const hasCt = rows.some((h) => h.key.toLowerCase() === 'content-type')
  if (!hasCt && input.body && input.contentType && input.contentType !== 'multipart/form-data') {
    rows.push({ key: 'Content-Type', value: input.contentType })
  }
  if (input.auth.type === 'bearer' && input.auth.bearerToken) {
    rows.push({ key: 'Authorization', value: `Bearer ${input.auth.bearerToken}` })
  } else if (input.auth.type === 'basic') {
    const token = btoa(`${input.auth.basicUsername ?? ''}:${input.auth.basicPassword ?? ''}`)
    rows.push({ key: 'Authorization', value: `Basic ${token}` })
  } else if (input.auth.type === 'apikey' && input.auth.apiKey) {
    const name = input.auth.apiKeyHeader?.trim() || 'X-API-Key'
    if ((input.auth.apiKeyIn ?? 'header') === 'header') {
      rows.push({ key: name, value: input.auth.apiKey })
    }
  }
  return rows
}

function withQuery(input: CodegenInput): string {
  try {
    const u = new URL(input.url)
    for (const p of input.params) {
      if (p.enabled && p.key.trim()) u.searchParams.set(p.key.trim(), p.value)
    }
    if (input.auth.type === 'apikey' && input.auth.apiKey && input.auth.apiKeyIn === 'query') {
      u.searchParams.set(input.auth.apiKeyHeader?.trim() || 'api_key', input.auth.apiKey)
    }
    return u.toString()
  } catch {
    return input.url
  }
}

export function generateCurl(input: CodegenInput): string {
  const url = withQuery(input)
  const parts = [`curl -X ${input.method} '${url.replace(/'/g, `'\\''`)}'`]
  for (const h of enabledHeaders(input)) {
    parts.push(`  -H '${h.key}: ${h.value.replace(/'/g, `'\\''`)}'`)
  }
  if (input.body && input.method !== 'GET' && input.method !== 'HEAD') {
    parts.push(`  -d '${input.body.replace(/'/g, `'\\''`)}'`)
  }
  return parts.join(' \\\n')
}

export function generateJavascriptFetch(input: CodegenInput): string {
  const url = withQuery(input)
  const headers = Object.fromEntries(enabledHeaders(input).map((h) => [h.key, h.value]))
  const init: Record<string, unknown> = { method: input.method, headers }
  if (input.body && input.method !== 'GET' && input.method !== 'HEAD') {
    init.body = input.body
  }
  return `const response = await fetch(${JSON.stringify(url)}, ${JSON.stringify(init, null, 2)});\nconst data = await response.text();\nconsole.log(response.status, data);`
}

export function generatePythonRequests(input: CodegenInput): string {
  const url = withQuery(input)
  const headers = Object.fromEntries(enabledHeaders(input).map((h) => [h.key, h.value]))
  const lines = [
    'import requests',
    '',
    `url = ${JSON.stringify(url)}`,
    `headers = ${JSON.stringify(headers, null, 2)}`,
  ]
  if (input.body && input.method !== 'GET' && input.method !== 'HEAD') {
    lines.push(`data = ${JSON.stringify(input.body)}`)
    lines.push(
      `response = requests.request(${JSON.stringify(input.method)}, url, headers=headers, data=data)`,
    )
  } else {
    lines.push(`response = requests.request(${JSON.stringify(input.method)}, url, headers=headers)`)
  }
  lines.push('print(response.status_code)')
  lines.push('print(response.text)')
  return lines.join('\n')
}

export function generateSwiftUrlSession(input: CodegenInput): string {
  const url = withQuery(input)
  const headers = enabledHeaders(input)
  const headerLines = headers
    .map(
      (h) =>
        `request.setValue(${JSON.stringify(h.value)}, forHTTPHeaderField: ${JSON.stringify(h.key)})`,
    )
    .join('\n')
  const bodyBlock =
    input.body && input.method !== 'GET' && input.method !== 'HEAD'
      ? `request.httpBody = Data(${JSON.stringify(input.body)}.utf8)`
      : '// no body'
  return `import Foundation

var request = URLRequest(url: URL(string: ${JSON.stringify(url)})!)
request.httpMethod = ${JSON.stringify(input.method)}
${headerLines || '// no headers'}
${bodyBlock}

let task = URLSession.shared.dataTask(with: request) { data, response, error in
  if let error { print(error); return }
  if let http = response as? HTTPURLResponse { print(http.statusCode) }
  if let data { print(String(data: data, encoding: .utf8) ?? "") }
}
task.resume()`
}

export const CODEGEN_LANGUAGES = [
  { id: 'curl', label: 'cURL', generate: generateCurl },
  { id: 'js', label: 'JavaScript', generate: generateJavascriptFetch },
  { id: 'python', label: 'Python', generate: generatePythonRequests },
  { id: 'swift', label: 'Swift', generate: generateSwiftUrlSession },
] as const
