import { Bell, CircleHelp, Moon, MoreHorizontal, Search, Sun } from 'lucide-react'
import { useEffect } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ThemeMode } from '@/shared/lib/persist'

function resolveIsDark(theme: ThemeMode): boolean {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function AppTopBar() {
  const searchQuery = useRestlyStore((s) => s.searchQuery)
  const setSearchQuery = useRestlyStore((s) => s.setSearchQuery)
  const theme = useRestlyStore((s) => s.theme)
  const setTheme = useRestlyStore((s) => s.setTheme)

  const isDark = resolveIsDark(theme)

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'T' || e.key === 't')) {
        e.preventDefault()
        const current = useRestlyStore.getState().theme
        const dark = resolveIsDark(current)
        useRestlyStore.getState().setTheme(dark ? 'light' : 'dark')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <header className="z-40 flex h-11 shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-background px-(--spacing-window)">
      <div className="flex-1 basis-0" />
      <div className="relative flex w-full max-w-md items-center">
        <Search className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search requests, collections…"
          className="h-8 border-none bg-muted/50 pl-8 text-[13px] placeholder:text-muted-foreground/50 focus-visible:bg-muted focus-visible:ring-0"
        />
      </div>
      <div className="flex flex-1 basis-0 items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode (Ctrl+Shift+T)' : 'Dark mode (Ctrl+Shift+T)'}
          onClick={toggleTheme}
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Help">
          <CircleHelp className="size-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="More">
          <MoreHorizontal className="size-4" />
        </Button>
      </div>
    </header>
  )
}
