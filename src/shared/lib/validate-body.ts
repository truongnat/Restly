import xmlFormat from 'xml-formatter'

export interface BodyValidationResult {
  isValid: boolean
  error: string | null
}

export interface BodyFormatResult {
  formatted: string
  error?: string
}

/**
 * Validates request body based on Content-Type.
 * For JSON content types, checks if text parses as valid JSON.
 * For XML content types, checks if text parses as valid XML via xml-formatter.
 */
export function validateBody(body: string, contentType: string): BodyValidationResult {
  const ct = contentType.toLowerCase()
  const isJson = ct.includes('json')
  const isXml = ct.includes('xml')

  if (!isJson && !isXml) {
    return { isValid: true, error: null }
  }

  const trimmed = body.trim()
  if (!trimmed) {
    return { isValid: true, error: null }
  }

  if (isJson) {
    try {
      JSON.parse(trimmed)
      return { isValid: true, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid JSON format'
      return { isValid: false, error: message }
    }
  }

  if (isXml) {
    try {
      xmlFormat(trimmed, { indentation: '  ', collapseContent: true, lineSeparator: '\n' })
      return { isValid: true, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid XML format'
      return { isValid: false, error: message }
    }
  }

  return { isValid: true, error: null }
}

/**
 * Formats request body string (e.g. pretty-prints JSON or XML).
 */
export function formatBody(body: string, contentType: string): BodyFormatResult {
  const ct = contentType.toLowerCase()
  const isJson = ct.includes('json')
  const isXml = ct.includes('xml')

  if (!isJson && !isXml) {
    return { formatted: body }
  }

  const trimmed = body.trim()
  if (!trimmed) {
    return { formatted: body }
  }

  if (isJson) {
    try {
      const parsed = JSON.parse(trimmed)
      return { formatted: JSON.stringify(parsed, null, 2) }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid JSON format'
      return { formatted: body, error: message }
    }
  }

  if (isXml) {
    try {
      const formatted = xmlFormat(trimmed, {
        indentation: '  ',
        collapseContent: true,
        lineSeparator: '\n',
      })
      return { formatted }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid XML format'
      return { formatted: body, error: message }
    }
  }

  return { formatted: body }
}
