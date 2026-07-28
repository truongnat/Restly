export function tryParseJson(value: string): unknown {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export function formatJsonValue(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent)
  if (value === null) return 'null'
  if (typeof value === 'string') {
    const parsed = tryParseJson(value)
    if (parsed !== null && (typeof parsed === 'object' || Array.isArray(parsed))) {
      const formatted = formatJsonValue(parsed, indent)
      const lines = formatted.split('\n')
      if (lines.length === 1) return formatted
      return lines.map((l, i) => (i === 0 ? `${pad}${l}` : l)).join('\n')
    }
    return JSON.stringify(value)
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const items = value.map((item) => `${pad}  ${formatJsonValue(item, indent + 1)}`)
    return `[\n${items.join(',\n')}\n${pad}]`
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return '{}'
    const props = entries.map(
      ([k, v]) => `${pad}  ${JSON.stringify(k)}: ${formatJsonValue(v, indent + 1)}`,
    )
    return `{\n${props.join(',\n')}\n${pad}}`
  }
  return String(value)
}

export type JsonTokenType = 'key' | 'string' | 'number' | 'boolean' | 'null' | 'other'

export function getValueType(raw: string): JsonTokenType {
  const val = raw.replace(/,?\s*$/, '')
  if (val.startsWith('"')) return 'string'
  if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(val)) return 'number'
  if (val === 'true' || val === 'false') return 'boolean'
  if (val === 'null') return 'null'
  return 'other'
}
