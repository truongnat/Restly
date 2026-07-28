/**
 * @deprecated HF-03 — TitleBar has been replaced by ContentToolbar.
 * This file is dead code kept as a tombstone. Do not import.
 * The brand-cell pattern (TitleBar spanning sidebar) was removed in HF-03.
 * Use AppShell + ContentToolbar instead.
 */
import { Link } from '@tanstack/react-router'
import { ChevronDown, RefreshCw, Settings } from 'lucide-react'

import { useRestlyStore } from '@/app/store/restly-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/shared/constants/app'
import { cn } from '@/shared/lib/utils'

export function TitleBar() {
  const environmentId = useRestlyStore((s) => s.environmentId)
  const environments = useRestlyStore((s) => s.environments)
  const setEnvironmentId = useRestlyStore((s) => s.setEnvironmentId)
  const env = environments.find((e) => e.id === environmentId)

  return (
    <header className="z-30 flex h-(--spacing-toolbar) shrink-0 items-center border-b border-border/60 bg-background">
      {/* Brand cell — same width as sidebar so the right edge aligns */}
      <div className="flex w-(--spacing-sidebar) shrink-0 items-center self-stretch border-r border-border/50 px-3">
        <h1 className="headline-md">Restly</h1>
      </div>

      {/* Content / toolbar zone */}
      <div className="flex flex-1 items-center justify-between px-(--spacing-window)">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="gap-1 rounded-full">
              <span className={cn('size-2 rounded-full', env?.color ?? 'bg-emerald-500')} />
              {env?.name ?? 'Production'}
              <ChevronDown className="size-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {environments.map((e) => (
              <DropdownMenuItem key={e.id} onClick={() => setEnvironmentId(e.id)}>
                <span className={cn('mr-2 size-2 rounded-full', e.color)} />
                {e.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            New Request
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Sync">
            <RefreshCw className="size-4" />
          </Button>
          <Button asChild variant="ghost" size="icon-sm" aria-label="Settings">
            <Link to={ROUTES.settings}>
              <Settings className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
