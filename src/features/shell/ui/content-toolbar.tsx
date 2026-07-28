import { useNavigate } from '@tanstack/react-router'
import { ChevronDown, Settings2 } from 'lucide-react'
import type { ReactNode } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/shared/constants/app'
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
  const navigate = useNavigate()
  const environmentId = useRestlyStore((s) => s.environmentId)
  const environments = useRestlyStore((s) => s.environments)
  const setEnvironmentId = useRestlyStore((s) => s.setEnvironmentId)
  const env = environments.find((e) => e.id === environmentId)
  const varCount = env?.variables.length ?? 0

  return (
    <header
      className="z-30 flex h-auto min-h-(--spacing-toolbar) shrink-0 items-center gap-2 border-b border-border/60 bg-background/90 px-(--spacing-window) py-2"
      id="content-toolbar"
    >
      <div className="flex min-w-0 flex-1 items-center">{start}</div>

      {end}

      {showEnv && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 rounded-md px-2.5 text-[12px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              id="env-dropdown"
            >
              <span className={cn('size-2 rounded-full', env?.color ?? 'bg-emerald-500')} />
              <span className="max-w-[9rem] truncate">{env?.name ?? 'No environment'}</span>
              {env && (
                <span className="rounded bg-muted px-1 py-px text-[10px] text-muted-foreground/80">
                  {varCount}
                </span>
              )}
              <ChevronDown className="size-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {environments.length === 0 ? (
              <DropdownMenuItem disabled>No environments</DropdownMenuItem>
            ) : (
              environments.map((e) => (
                <DropdownMenuItem
                  key={e.id}
                  onClick={() => setEnvironmentId(e.id)}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className={cn('size-2 shrink-0 rounded-full', e.color)} />
                    <span className="truncate">{e.name}</span>
                  </span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {e.variables.length} vars
                  </span>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                void navigate({ to: ROUTES.environments })
              }}
              className="gap-2 text-muted-foreground"
            >
              <Settings2 className="size-3.5" />
              Manage environments…
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}
