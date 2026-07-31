import { isDynamicVariable, resolveDynamicVariable } from './dynamic-generators'

export type EnvVarSubstituteItem = {
  key: string
  value: string
  enabled?: boolean
}

/** Maximum recursion depth for nested variable resolution */
const MAX_RECURSION_DEPTH = 10

/** Error thrown when circular variable reference is detected */
export class CircularVariableError extends Error {
  readonly chain: string[]

  constructor(chain: string[]) {
    super(`Circular variable reference detected: ${chain.join(' -> ')}`)
    this.name = 'CircularVariableError'
    this.chain = chain
  }
}

/**
 * Replaces `{{key}}` placeholders in a template string with values from enabled environment variables.
 * Supports:
 * - Static variables from the provided list
 * - Dynamic variables ({{$guid}}, {{$timestamp}}, etc.)
 * - Recursive resolution ({{varA}} containing {{varB}})
 * - Circular reference detection
 */
export function substituteEnv(template: string, vars: EnvVarSubstituteItem[] = []): string {
  if (!template) return template

  const varMap = new Map<string, string>()
  for (const v of vars) {
    if (v.enabled === false) continue
    if (!v.key) continue
    varMap.set(v.key.trim(), v.value)
  }

  return resolveTemplate(template, varMap, [], 0)
}

/**
 * Internal recursive resolver with circular reference detection.
 */
function resolveTemplate(
  template: string,
  varMap: Map<string, string>,
  resolutionChain: string[],
  depth: number,
): string {
  if (depth > MAX_RECURSION_DEPTH) {
    throw new CircularVariableError([...resolutionChain, `depth>${MAX_RECURSION_DEPTH}`])
  }

  return template.replace(/\{\{\s*([\w$.-]+)\s*\}\}/g, (match, key: string) => {
    // Check for circular reference
    if (resolutionChain.includes(key)) {
      throw new CircularVariableError([...resolutionChain, key])
    }

    // Try dynamic variable first ({{$guid}}, {{$timestamp}}, etc.)
    if (isDynamicVariable(key)) {
      return resolveDynamicVariable(key) ?? match
    }

    // Try static variable
    const value = varMap.get(key)
    if (value === undefined) {
      return match // Leave unresolved tokens as-is
    }

    // Recursively resolve nested variables
    return resolveTemplate(value, varMap, [...resolutionChain, key], depth + 1)
  })
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
