import { useNavigate } from '@tanstack/react-router'
import {
  Clock,
  Globe,
  KeyRound,
  Layers,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  Terminal,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/shared/constants/app'
import { cn } from '@/shared/lib/utils'

type PaletteAction = {
  id: string
  label: string
  hint?: string
  group: string
  run: () => void
}

export function CommandPalette() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const createRequest = useRestlyStore((s) => s.createRequest)
  const clearHistory = useRestlyStore((s) => s.clearHistory)
  const theme = useRestlyStore((s) => s.theme)
  const setTheme = useRestlyStore((s) => s.setTheme)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setActive(0)
      return
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 10)
    return () => window.clearTimeout(t)
  }, [open])

  const actions = useMemo<PaletteAction[]>(() => {
    const go = (to: string) => () => {
      void navigate({ to })
      setOpen(false)
    }
    return [
      {
        id: 'nav-workspace',
        label: 'Workspace',
        hint: 'Request editor',
        group: 'Navigate',
        run: go(ROUTES.workspace),
      },
      {
        id: 'nav-history',
        label: 'History',
        hint: 'Past requests',
        group: 'Navigate',
        run: go(ROUTES.history),
      },
      {
        id: 'nav-env',
        label: 'Environments',
        hint: 'Variables',
        group: 'Navigate',
        run: go(ROUTES.environments),
      },
      {
        id: 'nav-auth',
        label: 'Auth',
        hint: 'Profiles',
        group: 'Navigate',
        run: go(ROUTES.auth),
      },
      {
        id: 'nav-mocks',
        label: 'Mock Servers',
        hint: 'Canned routes',
        group: 'Navigate',
        run: go(ROUTES.mocks),
      },
      {
        id: 'nav-ws',
        label: 'WebSocket',
        hint: 'Realtime',
        group: 'Navigate',
        run: go(ROUTES.websocket),
      },
      {
        id: 'nav-sse',
        label: 'SSE',
        hint: 'Event stream',
        group: 'Navigate',
        run: go(ROUTES.sse),
      },
      {
        id: 'nav-settings',
        label: 'Settings',
        hint: 'Prefs',
        group: 'Navigate',
        run: go(ROUTES.settings),
      },
      {
        id: 'nav-welcome',
        label: 'Welcome',
        hint: 'Home',
        group: 'Navigate',
        run: go(ROUTES.welcome),
      },
      {
        id: 'act-new',
        label: 'New request',
        group: 'Actions',
        run: () => {
          createRequest()
          void navigate({ to: ROUTES.workspace })
          setOpen(false)
        },
      },
      {
        id: 'act-clear-history',
        label: 'Clear history',
        group: 'Actions',
        run: () => {
          clearHistory()
          setOpen(false)
        },
      },
      {
        id: 'act-theme',
        label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
        group: 'Actions',
        run: () => {
          setTheme(theme === 'dark' ? 'light' : 'dark')
          setOpen(false)
        },
      },
    ]
  }, [clearHistory, createRequest, navigate, setTheme, theme])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return actions
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.hint?.toLowerCase().includes(q) ||
        a.group.toLowerCase().includes(q),
    )
  }, [actions, query])

  useEffect(() => {
    setActive(0)
  }, [query])

  const iconFor = (id: string) => {
    if (id.includes('history')) return Clock
    if (id.includes('env')) return Layers
    if (id.includes('auth')) return KeyRound
    if (id.includes('mocks')) return Globe
    if (id.includes('settings')) return Settings
    if (id.includes('theme')) return theme === 'dark' ? Sun : Moon
    if (id.includes('new')) return Plus
    return Terminal
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="top-[20%] max-w-lg translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-lg"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Command palette</DialogTitle>
          <DialogDescription>Search actions and navigate</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 border-b border-border/60 px-3">
          <Search className="size-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActive((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive((i) => Math.max(i - 1, 0))
              } else if (e.key === 'Enter') {
                e.preventDefault()
                filtered[active]?.run()
              }
            }}
            placeholder="Type a command or search…"
            className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0"
            aria-label="Command palette search"
          />
          <kbd className="rounded border border-border/70 px-1.5 py-0.5 text-[10px] text-muted-foreground">
            esc
          </kbd>
        </div>
        <ul className="max-h-72 overflow-y-auto p-1.5" role="listbox">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-[13px] text-muted-foreground">No matches</li>
          ) : (
            filtered.map((action, idx) => {
              const Icon = iconFor(action.id)
              return (
                <li key={action.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={idx === active}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px]',
                      idx === active
                        ? 'bg-accent text-accent-foreground'
                        : 'text-foreground hover:bg-muted/60',
                    )}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => action.run()}
                  >
                    <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate font-medium">{action.label}</span>
                    {action.hint ? (
                      <span className="truncate text-[11px] text-muted-foreground">
                        {action.hint}
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })
          )}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
