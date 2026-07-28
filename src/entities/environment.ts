export type EnvVar = {
  id: string
  enabled: boolean
  key: string
  value: string
  secret?: boolean
  /** Optional human note — shown in Environments table (design). */
  description?: string
}

export type Environment = {
  id: string
  name: string
  /** Tailwind bg-* utility used as the env color dot */
  color: string
  variables: EnvVar[]
}

/** Palette for env color dots / cycle. */
export const ENV_COLOR_OPTIONS = [
  'bg-emerald-500',
  'bg-amber-500',
  'bg-sky-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-indigo-500',
] as const
