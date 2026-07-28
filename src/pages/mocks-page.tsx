import { useNavigate } from '@tanstack/react-router'
import { Copy, Globe, Play, Plus, Square, Terminal, Trash2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { HttpMethod } from '@/entities'
import { AppShell } from '@/features/shell/ui/app-shell'
import { ContentToolbar } from '@/features/shell/ui/content-toolbar'
import { ROUTES } from '@/shared/constants/app'
import { cn } from '@/shared/lib/utils'
import { MethodBadge } from '@/shared/ui/method-badge'

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

function confirmDelete(name: string): boolean {
  return window.confirm(`Delete “${name}”?`)
}

function statusTone(status: number): string {
  if (status >= 200 && status < 300) return 'text-emerald-600 dark:text-emerald-400'
  if (status >= 300 && status < 400) return 'text-amber-600 dark:text-amber-400'
  if (status >= 400) return 'text-rose-600 dark:text-rose-400'
  return 'text-muted-foreground'
}

export function MocksPage() {
  const navigate = useNavigate()
  const mockServers = useRestlyStore((s) => s.mockServers)
  const mockServerId = useRestlyStore((s) => s.mockServerId)
  const setMockServerId = useRestlyStore((s) => s.setMockServerId)
  const createMockServer = useRestlyStore((s) => s.createMockServer)
  const deleteMockServer = useRestlyStore((s) => s.deleteMockServer)
  const duplicateMockServer = useRestlyStore((s) => s.duplicateMockServer)
  const updateMockServer = useRestlyStore((s) => s.updateMockServer)
  const toggleMockServerRunning = useRestlyStore((s) => s.toggleMockServerRunning)
  const addMockRoute = useRestlyStore((s) => s.addMockRoute)
  const updateMockRoute = useRestlyStore((s) => s.updateMockRoute)
  const deleteMockRoute = useRestlyStore((s) => s.deleteMockRoute)
  const applyMockRouteToRequest = useRestlyStore((s) => s.applyMockRouteToRequest)
  const copyText = useRestlyStore((s) => s.copyText)

  const active = useMemo(
    () => mockServers.find((s) => s.id === mockServerId) ?? mockServers[0] ?? null,
    [mockServers, mockServerId],
  )

  useEffect(() => {
    if (active && active.id !== mockServerId) setMockServerId(active.id)
  }, [active, mockServerId, setMockServerId])

  const removeServer = (id: string, name: string) => {
    if (confirmDelete(name)) deleteMockServer(id)
  }

  const openRoute = (serverId: string, routeId: string) => {
    applyMockRouteToRequest(serverId, routeId)
    void navigate({ to: ROUTES.workspace })
  }

  return (
    <AppShell>
      <ContentToolbar
        showEnv={false}
        start={<span className="text-[14px] font-semibold text-foreground">Mock Servers</span>}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="flex w-64 shrink-0 flex-col border-r border-border/60 bg-background">
          <div className="no-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto p-3">
            {mockServers.length === 0 ? (
              <p className="px-2 py-3 body-sm text-muted-foreground">No mock servers yet.</p>
            ) : (
              mockServers.map((server) => {
                const selected = server.id === (active?.id ?? '')
                const enabledRoutes = server.routes.filter((r) => r.enabled).length
                return (
                  <ContextMenu key={server.id}>
                    <ContextMenuTrigger asChild>
                      <div className="group relative flex items-center">
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => setMockServerId(server.id)}
                          className={cn(
                            'h-auto w-full justify-between rounded-lg px-3.5 py-3 pr-9 text-left',
                            selected
                              ? 'bg-muted text-foreground ring-1 ring-border/60 hover:bg-muted'
                              : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                          )}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span
                              className={cn(
                                'size-2.5 shrink-0 rounded-full',
                                server.running ? 'bg-emerald-500' : 'bg-muted-foreground/35',
                              )}
                              aria-hidden
                            />
                            <div className="min-w-0 space-y-0.5">
                              <span
                                className={cn(
                                  'block truncate text-[13px] leading-snug',
                                  selected ? 'font-semibold' : 'font-medium',
                                )}
                              >
                                {server.name || 'Untitled'}
                              </span>
                              <span className="block truncate text-[11px] leading-snug text-muted-foreground/70">
                                {enabledRoutes}/{server.routes.length} routes ·{' '}
                                {server.running ? 'Running' : 'Stopped'}
                              </span>
                            </div>
                          </div>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          title="Delete mock server"
                          aria-label={`Delete ${server.name}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            removeServer(server.id, server.name)
                          }}
                          className="absolute right-1.5 size-7 rounded-md p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-48">
                      <ContextMenuItem onClick={() => setMockServerId(server.id)}>
                        Open
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => toggleMockServerRunning(server.id)}>
                        {server.running ? 'Stop' : 'Start'}
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => duplicateMockServer(server.id)}>
                        Duplicate
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        variant="destructive"
                        onClick={() => removeServer(server.id, server.name)}
                      >
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                )
              })
            )}
          </div>

          <div className="border-t border-border/50 p-3">
            <Button
              variant="ghost"
              onClick={() => createMockServer()}
              className="h-10 w-full justify-start gap-2 text-[13px] text-muted-foreground hover:text-primary"
              size="sm"
            >
              <Plus className="size-[13px]" />
              New mock server
            </Button>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          {active ? (
            <>
              <header className="flex h-(--spacing-toolbar) shrink-0 items-center justify-between gap-3 border-b border-border/50 px-5">
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <Globe className="size-3.5 shrink-0 text-primary" />
                  <Input
                    value={active.name}
                    onChange={(e) => updateMockServer(active.id, { name: e.target.value })}
                    onBlur={() => {
                      if (!active.name.trim()) {
                        updateMockServer(active.id, { name: 'Untitled mock' })
                      }
                    }}
                    className="h-7 max-w-[240px] min-w-0 flex-1 border-transparent bg-transparent text-[14px] font-semibold text-foreground hover:border-border focus-visible:border-border focus-visible:bg-background"
                    aria-label="Mock server name"
                  />
                  <span
                    className={cn(
                      'shrink-0 rounded-md px-2 py-0.5 label-caps',
                      active.running
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground/70',
                    )}
                  >
                    {active.running ? 'Running' : 'Stopped'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => duplicateMockServer(active.id)}
                    className="h-7 gap-1.5 text-[12px]"
                  >
                    <Copy className="size-3" />
                    Duplicate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeServer(active.id, active.name)}
                    className="h-7 gap-1 text-[12px] text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                    Delete
                  </Button>
                  <Button
                    variant={active.running ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => toggleMockServerRunning(active.id)}
                    className="h-7 gap-1.5 text-[12px]"
                  >
                    {active.running ? (
                      <>
                        <Square className="size-3" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="size-3" />
                        Start
                      </>
                    )}
                  </Button>
                </div>
              </header>

              <div className="flex-1 overflow-auto p-5">
                <div className="mb-6 grid max-w-3xl gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="mock-base" className="text-xs text-muted-foreground">
                      Base URL
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="mock-base"
                        value={active.baseUrl}
                        onChange={(e) => updateMockServer(active.id, { baseUrl: e.target.value })}
                        className="h-8 font-mono text-[12px]"
                        spellCheck={false}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 shrink-0 gap-1.5 px-2.5 text-[12px]"
                        onClick={() => copyText(active.baseUrl, 'Base URL copied')}
                        title="Copy base URL"
                      >
                        <Copy className="size-3" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="mock-desc" className="text-xs text-muted-foreground">
                      Description
                    </Label>
                    <Input
                      id="mock-desc"
                      value={active.description ?? ''}
                      onChange={(e) => updateMockServer(active.id, { description: e.target.value })}
                      placeholder="Optional note"
                      className="h-8 text-[13px]"
                    />
                  </div>
                </div>

                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-[15px] font-semibold text-foreground">Routes</h2>
                    <p className="mt-0.5 body-sm text-muted-foreground">
                      Define mock responses. Use a route in the request editor — no real HTTP
                      listener yet.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addMockRoute(active.id)}
                    className="h-7 gap-1.5 text-[12px]"
                  >
                    <Plus className="size-3" />
                    Add route
                  </Button>
                </div>

                {active.routes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <p className="text-[14px] font-medium text-foreground">No routes yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addMockRoute(active.id)}
                      className="gap-1.5 text-[12px]"
                    >
                      <Plus className="size-3" />
                      Add route
                    </Button>
                  </div>
                ) : (
                  <ul className="flex max-w-3xl flex-col gap-3">
                    {active.routes.map((route) => (
                      <ContextMenu key={route.id}>
                        <ContextMenuTrigger asChild>
                          <li
                            className={cn(
                              'rounded-lg border border-border/50 bg-card/40 p-3 transition-colors',
                              !route.enabled && 'opacity-50',
                            )}
                          >
                            <div className="mb-2.5 flex flex-wrap items-center gap-2">
                              <Checkbox
                                checked={route.enabled}
                                onCheckedChange={(checked) =>
                                  updateMockRoute(active.id, route.id, {
                                    enabled: !!checked,
                                  })
                                }
                                aria-label="Enable route"
                              />
                              <Select
                                value={route.method}
                                onValueChange={(v) =>
                                  updateMockRoute(active.id, route.id, {
                                    method: v as HttpMethod,
                                  })
                                }
                              >
                                <SelectTrigger size="sm" className="h-7 w-[108px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {METHODS.map((m) => (
                                    <SelectItem key={m} value={m}>
                                      <MethodBadge method={m} />
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                value={route.path}
                                onChange={(e) =>
                                  updateMockRoute(active.id, route.id, {
                                    path: e.target.value,
                                  })
                                }
                                onBlur={() => {
                                  if (!route.path.trim()) {
                                    updateMockRoute(active.id, route.id, { path: '/' })
                                  }
                                }}
                                className="h-7 min-w-[140px] flex-1 font-mono text-[12px]"
                                spellCheck={false}
                                aria-label="Route path"
                                placeholder="/path"
                              />
                              <div className="flex items-center gap-1.5">
                                <Input
                                  type="number"
                                  value={route.status}
                                  onChange={(e) =>
                                    updateMockRoute(active.id, route.id, {
                                      status: Number(e.target.value),
                                    })
                                  }
                                  className={cn(
                                    'h-7 w-[72px] font-mono text-[12px]',
                                    statusTone(route.status),
                                  )}
                                  aria-label="Status code"
                                />
                                <div className="relative">
                                  <Input
                                    type="number"
                                    value={route.delayMs}
                                    onChange={(e) =>
                                      updateMockRoute(active.id, route.id, {
                                        delayMs: Number(e.target.value),
                                      })
                                    }
                                    className="h-7 w-[84px] pr-7 font-mono text-[12px]"
                                    aria-label="Delay in milliseconds"
                                  />
                                  <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[10px] text-muted-foreground">
                                    ms
                                  </span>
                                </div>
                              </div>
                              <div className="ml-auto flex items-center gap-0.5">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 gap-1 px-2 text-[11px] text-muted-foreground"
                                  onClick={() => openRoute(active.id, route.id)}
                                  title="Open in request"
                                >
                                  <Terminal className="size-3" />
                                  Use
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteMockRoute(active.id, route.id)}
                                  className="size-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                  title="Delete route"
                                  aria-label="Delete route"
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </div>
                            <Textarea
                              value={route.responseBody}
                              onChange={(e) =>
                                updateMockRoute(active.id, route.id, {
                                  responseBody: e.target.value,
                                })
                              }
                              rows={3}
                              spellCheck={false}
                              placeholder='{ "ok": true }'
                              className="min-h-[72px] resize-y font-mono text-[11px] leading-relaxed"
                              aria-label="Response body"
                            />
                          </li>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-48">
                          <ContextMenuItem onClick={() => openRoute(active.id, route.id)}>
                            Use in request
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={() =>
                              copyText(
                                `${active.baseUrl.replace(/\/$/, '')}${route.path.startsWith('/') ? route.path : `/${route.path}`}`,
                                'URL copied',
                              )
                            }
                          >
                            Copy full URL
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={() =>
                              updateMockRoute(active.id, route.id, {
                                enabled: !route.enabled,
                              })
                            }
                          >
                            {route.enabled ? 'Disable' : 'Enable'}
                          </ContextMenuItem>
                          <ContextMenuSeparator />
                          <ContextMenuItem
                            variant="destructive"
                            onClick={() => deleteMockRoute(active.id, route.id)}
                          >
                            Delete
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <Globe className="size-5 text-muted-foreground" />
              </div>
              <p className="text-[14px] font-medium text-foreground">Select a mock server</p>
              <p className="max-w-[28ch] body-sm text-muted-foreground">
                Define routes and toggle running state for local demos.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => createMockServer()}
                className="mt-2 gap-1.5 text-[12px]"
              >
                <Plus className="size-3" />
                New mock server
              </Button>
            </div>
          )}
        </main>
      </div>
    </AppShell>
  )
}
