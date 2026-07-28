import type { ReactNode } from 'react'

import { AppTopBar } from './app-top-bar'
import { CommandPalette } from './command-palette'
import { Sidebar } from './sidebar'
import { Toast } from './toast'

interface AppShellProps {
  children: ReactNode
}

/**
 * AppShell — HF-03 Shell option A
 *
 * Layout:
 *   ┌─── sidebar 260px ───┬─── main (flex-1) ───────────┐
 *   │ brand               │ AppTopBar (44px)            │
 *   │ nav + collections   ├─────────────────────────────┤
 *   │                     │ ContentToolbar / page content│
 *   │ footer profile      │                             │
 *   └─────────────────────┴─────────────────────────────┘
 *
 * Sidebar runs full viewport height.
 * No TitleBar brand strip spanning the full width.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppTopBar />
        {children}
      </div>
      <Toast />
      <CommandPalette />
    </div>
  )
}
