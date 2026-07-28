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
 */
export function validateBody(body: string, contentType: string): BodyValidationResult {
  const isJson = contentType.toLowerCase().includes('json')
  if (!isJson) {
    return { isValid: true, error: null }
  }

  const trimmed = body.trim()
  if (!trimmed) {
    return { isValid: true, error: null }
  }

  try {
    JSON.parse(trimmed)
    return { isValid: true, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid JSON format'
    return { isValid: false, error: message }
  }
}

/**
 * Formats request body string (e.g. pretty-prints JSON).
 */
export function formatBody(body: string, contentType: string): BodyFormatResult {
  const isJson = contentType.toLowerCase().includes('json')
  if (!isJson) {
    return { formatted: body }
  }

  const trimmed = body.trim()
  if (!trimmed) {
    return { formatted: body }
  }

  try {
    const parsed = JSON.parse(trimmed)
    return { formatted: JSON.stringify(parsed, null, 2) }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid JSON format'
    return { formatted: body, error: message }
  }
}
