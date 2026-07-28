import * as React from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { resolveActiveEnvironment } from '@/application/use-cases/list-environments'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getEnvResolutionTooltip } from '@/shared/lib/substitute-env'

export interface EnvAwareInputProps extends React.ComponentProps<typeof Input> {}

export const EnvAwareInput = React.forwardRef<HTMLInputElement, EnvAwareInputProps>(
  ({ value, ...props }, ref) => {
    const environmentId = useRestlyStore((s) => s.environmentId)
    const environments = useRestlyStore((s) => s.environments)

    const activeEnv = resolveActiveEnvironment(environments, environmentId)
    const vars = activeEnv?.variables ?? []

    const strValue = typeof value === 'string' ? value : ''
    const tooltipText = getEnvResolutionTooltip(strValue, vars)

    const inputEl = <Input ref={ref} value={value} {...props} />

    if (!tooltipText) {
      return inputEl
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{inputEl}</TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs font-mono text-xs break-all">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    )
  },
)

EnvAwareInput.displayName = 'EnvAwareInput'

export interface EnvAwareTextareaProps extends React.ComponentProps<typeof Textarea> {}

export const EnvAwareTextarea = React.forwardRef<HTMLTextAreaElement, EnvAwareTextareaProps>(
  ({ value, ...props }, ref) => {
    const environmentId = useRestlyStore((s) => s.environmentId)
    const environments = useRestlyStore((s) => s.environments)

    const activeEnv = resolveActiveEnvironment(environments, environmentId)
    const vars = activeEnv?.variables ?? []

    const strValue = typeof value === 'string' ? value : ''
    const tooltipText = getEnvResolutionTooltip(strValue, vars)

    const textareaEl = <Textarea ref={ref} value={value} {...props} />

    if (!tooltipText) {
      return textareaEl
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{textareaEl}</TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs font-mono text-xs break-all">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    )
  },
)

EnvAwareTextarea.displayName = 'EnvAwareTextarea'
