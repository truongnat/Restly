export type EnvVarSubstituteItem = {
  key: string
  value: string
  enabled?: boolean
}

/**
 * Replaces `{{key}}` placeholders in a template string with values from enabled environment variables.
 */
export function substituteEnv(template: string, vars: EnvVarSubstituteItem[] = []): string {
  if (!template) return template
  let result = template
  for (const v of vars) {
    if (v.enabled === false) continue
    if (!v.key) continue
    const escapedKey = v.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\{\\{\\s*${escapedKey}\\s*\\}\\}`, 'g')
    result = result.replace(regex, () => v.value)
  }
  return result
}

/**
 * Checks if a string contains `{{var}}` placeholders.
 */
export function hasEnvTokens(template: string): boolean {
  if (!template) return false
  return /\{\{\s*[^}\s]+\s*\}\}/.test(template)
}

/**
 * Returns array of unique `{{var}}` token strings matched in template.
 */
export function getEnvTokens(template: string): string[] {
  if (!template) return []
  const matches = template.match(/\{\{\s*[^}\s]+\s*\}\}/g)
  return matches ? Array.from(new Set(matches)) : []
}

/**
 * Returns array of unresolved token strings.
 */
export function getUnresolvedTokens(template: string, vars: EnvVarSubstituteItem[] = []): string[] {
  if (!template) return []
  const tokens = getEnvTokens(template)
  const enabledKeys = new Set(
    vars.filter((v) => v.enabled !== false && Boolean(v.key)).map((v) => v.key.trim()),
  )

  return tokens.filter((token) => {
    const keyMatch = token.match(/\{\{\s*([^}\s]+)\s*\}\}/)
    if (!keyMatch) return false
    const key = keyMatch[1]
    return !enabledKeys.has(key)
  })
}

/**
 * Checks if a template string contains any unresolved `{{var}}` tokens.
 */
export function hasUnresolvedEnvTokens(
  template: string,
  vars: EnvVarSubstituteItem[] = [],
): boolean {
  return getUnresolvedTokens(template, vars).length > 0
}

/**
 * Returns the resolved template string for tooltip preview if `template` contains `{{...}}` tokens,
 * otherwise returns null.
 * - Resolved -> `Resolved: <value>`
 * - Unresolved -> `Unresolved: {{token}}`
 */
export function getEnvResolutionTooltip(
  template: string,
  vars: EnvVarSubstituteItem[] = [],
): string | null {
  if (!template || !hasEnvTokens(template)) return null
  const unresolved = getUnresolvedTokens(template, vars)
  if (unresolved.length > 0) {
    return `Unresolved: ${unresolved.join(', ')}`
  }
  const substituted = substituteEnv(template, vars)
  return `Resolved: ${substituted}`
}
