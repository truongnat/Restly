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
