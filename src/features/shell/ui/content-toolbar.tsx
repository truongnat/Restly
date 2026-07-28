import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/shared/lib/utils'

interface ContentToolbarProps {
  /** Optional slot rendered left of the spacer */
  start?: ReactNode
  /** Optional slot rendered right of the spacer (before env dropdown) */
  end?: ReactNode
  /** When true the environment pill is shown */
  showEnv?: boolean
}

/**
 * ContentToolbar — thin top bar in the content column.
 * h = --spacing-toolbar (48px). Contains: [start?] ... [end?] [env?]
 */
export function ContentToolbar({ start, end, showEnv = true }: ContentToolbarProps) {
  const environmentId = useRestlyStore((s) => s.environmentId)
  const environments = useRestlyStore((s) => s.environments)
  const setEnvironmentId = useRestlyStore((s) => s.setEnvironmentId)
  const env = environments.find((e) => e.id === environmentId)

  return (
    <header
      className="z-30 flex h-auto min-h-(--spacing-toolbar) shrink-0 items-center gap-2 border-b border-border/60 bg-background/90 px-(--spacing-window) py-2"
      id="content-toolbar"
    >
      {/* Page-specific start slot — flex-1 so RequestUrlBar fills width */}
      <div className="flex min-w-0 flex-1 items-center">{start}</div>

      {/* Page-specific end slot */}
      {end}

      {/* Environment selector */}
      {showEnv && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 rounded-md px-2.5 text-[12px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              id="env-dropdown"
            >
              <span className={cn('size-[6px] rounded-full', env?.color ?? 'bg-emerald-500')} />
              {env?.name ?? 'Production'}
              <ChevronDown className="size-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {environments.map((e) => (
              <DropdownMenuItem key={e.id} onClick={() => setEnvironmentId(e.id)}>
                <span className={cn('mr-2 size-[6px] rounded-full', e.color)} />
                {e.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}
