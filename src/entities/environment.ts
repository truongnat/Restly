export type EnvVar = {
  id: string
  enabled: boolean
  key: string
  value: string
  secret?: boolean
}

export type Environment = {
  id: string
  name: string
  color: string
  variables: EnvVar[]
}
