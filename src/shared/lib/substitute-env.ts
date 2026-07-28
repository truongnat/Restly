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
 * Returns the resolved template string for tooltip preview if `template` contains `{{...}}` tokens,
 * otherwise returns null.
 */
export function getEnvResolutionTooltip(
  template: string,
  vars: EnvVarSubstituteItem[] = [],
): string | null {
  if (!template || !hasEnvTokens(template)) return null
  return substituteEnv(template, vars)
}
