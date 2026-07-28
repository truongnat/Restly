import { Copy, Eye, EyeOff, Key, Layers, Plus, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

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
import { ENV_COLOR_OPTIONS } from '@/entities/environment'
import { useActiveEnvironment } from '@/features/environments/model/use-environments-query'
import { AppShell } from '@/features/shell/ui/app-shell'
import { ContentToolbar } from '@/features/shell/ui/content-toolbar'
import { cn } from '@/shared/lib/utils'

function cycleColor(current: string): string {
  const idx = ENV_COLOR_OPTIONS.indexOf(current as (typeof ENV_COLOR_OPTIONS)[number])
  const next = ENV_COLOR_OPTIONS[(idx + 1) % ENV_COLOR_OPTIONS.length]
  return next ?? ENV_COLOR_OPTIONS[0]!
}

export function EnvironmentsPage() {
  const { data: environments = [], active, environmentId } = useActiveEnvironment()
  const setEnvironmentId = useRestlyStore((s) => s.setEnvironmentId)
  const createEnvironment = useRestlyStore((s) => s.createEnvironment)
  const deleteEnvironment = useRestlyStore((s) => s.deleteEnvironment)
  const duplicateEnvironment = useRestlyStore((s) => s.duplicateEnvironment)
  const updateEnvironmentName = useRestlyStore((s) => s.updateEnvironmentName)
  const updateEnvironmentColor = useRestlyStore((s) => s.updateEnvironmentColor)
  const addVariable = useRestlyStore((s) => s.addVariable)
  const updateVariable = useRestlyStore((s) => s.updateVariable)
  const deleteVariable = useRestlyStore((s) => s.deleteVariable)

  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({})
  const [varSearch, setVarSearch] = useState('')

  const toggleSecretVisibility = (varId: string) => {
    setVisibleSecrets((prev) => ({ ...prev, [varId]: !prev[varId] }))
  }

  const filteredVars = useMemo(() => {
    if (!active) return []
    const q = varSearch.trim().toLowerCase()
    if (!q) return active.variables
    return active.variables.filter(
      (v) =>
        v.key.toLowerCase().includes(q) ||
        v.value.toLowerCase().includes(q) ||
        (v.description ?? '').toLowerCase().includes(q),
    )
  }, [active, varSearch])

  return (
    <AppShell>
      <ContentToolbar
        showEnv
        start={<span className="text-[14px] font-semibold text-foreground">Environments</span>}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="flex w-64 shrink-0 flex-col border-r border-border/60 bg-background">
          <div className="no-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto p-3">
            {environments.length === 0 ? (
              <p className="px-2 py-3 body-sm text-muted-foreground">No environments yet.</p>
            ) : (
              environments.map((env) => {
                const selected = env.id === environmentId
                return (
                  <ContextMenu key={env.id}>
                    <ContextMenuTrigger asChild>
                      <div className="group relative flex items-center">
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => setEnvironmentId(env.id)}
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
                                env.color,
                                selected && 'shadow-[0_0_8px_rgba(16,185,129,0.45)]',
                              )}
                            />
                            <div className="min-w-0 space-y-0.5">
                              <span
                                className={cn(
                                  'block truncate text-[13px] leading-snug',
                                  selected ? 'font-semibold' : 'font-medium',
                                )}
                              >
                                {env.name}
                              </span>
                              <span className="block text-[11px] leading-snug text-muted-foreground/70">
                                {env.variables.length} var{env.variables.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          title="Delete environment"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteEnvironment(env.id)
                          }}
                          className="absolute right-1.5 size-7 rounded-md p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-44">
                      <ContextMenuItem onClick={() => setEnvironmentId(env.id)}>
                        Open
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => duplicateEnvironment(env.id)}>
                        Duplicate
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => {
                          const next = window.prompt('Rename environment', env.name)
                          if (next != null && next.trim()) {
                            updateEnvironmentName(env.id, next.trim())
                          }
                        }}
                      >
                        Rename
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        variant="destructive"
                        onClick={() => {
                          if (window.confirm(`Delete “${env.name}”?`)) {
                            deleteEnvironment(env.id)
                          }
                        }}
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
              onClick={() => createEnvironment()}
              className="h-10 w-full justify-start gap-2 text-[13px] text-muted-foreground hover:text-primary"
              size="sm"
            >
              <Plus className="size-[13px]" />
              Create environment
            </Button>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          {active ? (
            <>
              <header className="flex h-(--spacing-toolbar) shrink-0 items-center justify-between gap-3 border-b border-border/50 px-5">
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <button
                    type="button"
                    title="Cycle color"
                    onClick={() => updateEnvironmentColor(active.id, cycleColor(active.color))}
                    className={cn(
                      'size-3 shrink-0 rounded-full ring-2 ring-background transition-transform hover:scale-110',
                      active.color,
                    )}
                    aria-label="Change environment color"
                  />
                  <Input
                    value={active.name}
                    onChange={(e) => updateEnvironmentName(active.id, e.target.value)}
                    className="h-7 w-52 border-transparent bg-transparent text-[14px] font-semibold text-foreground hover:border-border focus-visible:border-border focus-visible:bg-background"
                    aria-label="Environment name"
                  />
                  <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 label-caps text-muted-foreground/70">
                    {active.variables.length} variable{active.variables.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative hidden sm:block">
                    <Search className="absolute top-1/2 left-2 size-3 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={varSearch}
                      onChange={(e) => setVarSearch(e.target.value)}
                      placeholder="Search variables…"
                      className="h-7 w-44 pl-7 text-[12px]"
                      aria-label="Search variables"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => duplicateEnvironment(active.id)}
                    className="h-7 gap-1.5 text-[12px]"
                    title="Duplicate environment"
                  >
                    <Copy className="size-3" />
                    Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addVariable(active.id)}
                    className="h-7 gap-1.5 text-[12px]"
                  >
                    <Plus className="size-3" />
                    Add variable
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteEnvironment(active.id)}
                    className="h-7 gap-1 text-[12px] text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                    Delete
                  </Button>
                </div>
              </header>

              <div className="flex-1 overflow-auto p-5">
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-[15px] font-semibold text-foreground">
                      Environment Variables
                    </h2>
                    <p className="mt-0.5 body-sm text-muted-foreground">
                      Keys substitute into URLs, headers, and bodies via {'{{name}}'}.
                    </p>
                  </div>
                </div>

                {active.variables.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <p className="text-[14px] font-medium text-foreground">No variables yet</p>
                    <p className="max-w-[30ch] body-sm text-muted-foreground">
                      Add key-value pairs to substitute into your request URLs, headers, and bodies.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addVariable(active.id)}
                      className="mt-2 gap-1.5 text-[12px]"
                    >
                      <Plus className="size-3" />
                      Add variable
                    </Button>
                  </div>
                ) : filteredVars.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                    <p className="text-[14px] font-medium text-foreground">No matching variables</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setVarSearch('')}
                      className="text-[12px]"
                    >
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-border/50">
                    <table className="w-full border-collapse text-[13px]">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/40">
                          <th className="w-10 px-3 py-2 text-center" />
                          <th className="min-w-[140px] px-3 py-2 text-left label-caps text-muted-foreground/70">
                            Variable
                          </th>
                          <th className="min-w-[160px] px-3 py-2 text-left label-caps text-muted-foreground/70">
                            Value
                          </th>
                          <th className="min-w-[160px] px-3 py-2 text-left label-caps text-muted-foreground/70">
                            Description
                          </th>
                          <th className="w-24 px-2 py-2 text-center label-caps text-muted-foreground/70">
                            Secret
                          </th>
                          <th className="w-10 px-2 py-2 text-center" />
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVars.map((v) => (
                          <ContextMenu key={v.id}>
                            <ContextMenuTrigger asChild>
                              <tr className="border-b border-border/30 transition-colors last:border-b-0 hover:bg-muted/20">
                                <td className="px-3 py-1.5 text-center">
                                  <Checkbox
                                    checked={v.enabled}
                                    onCheckedChange={(checked) =>
                                      updateVariable(active.id, v.id, { enabled: !!checked })
                                    }
                                    aria-label="Enable variable"
                                  />
                                </td>
                                <td className="px-2 py-1.5 font-mono text-[12px]">
                                  <Input
                                    value={v.key}
                                    onChange={(e) =>
                                      updateVariable(active.id, v.id, { key: e.target.value })
                                    }
                                    placeholder="VARIABLE_NAME"
                                    className="h-7 border-transparent bg-transparent font-mono text-[12px] text-primary hover:border-border focus-visible:bg-background"
                                  />
                                </td>
                                <td className="px-2 py-1.5 font-mono text-[12px]">
                                  <div className="relative flex items-center">
                                    <Input
                                      type={v.secret && !visibleSecrets[v.id] ? 'password' : 'text'}
                                      value={v.value}
                                      onChange={(e) =>
                                        updateVariable(active.id, v.id, { value: e.target.value })
                                      }
                                      placeholder="value"
                                      className="h-7 border-transparent bg-transparent pr-8 font-mono text-[12px] hover:border-border focus-visible:bg-background"
                                    />
                                    {v.secret && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleSecretVisibility(v.id)}
                                        className="absolute right-1 size-6 rounded-md p-0 text-muted-foreground hover:text-foreground"
                                        title={visibleSecrets[v.id] ? 'Hide' : 'Show'}
                                      >
                                        {visibleSecrets[v.id] ? (
                                          <EyeOff className="size-3" />
                                        ) : (
                                          <Eye className="size-3" />
                                        )}
                                      </Button>
                                    )}
                                  </div>
                                </td>
                                <td className="px-2 py-1.5">
                                  <Input
                                    value={v.description ?? ''}
                                    onChange={(e) =>
                                      updateVariable(active.id, v.id, {
                                        description: e.target.value,
                                      })
                                    }
                                    placeholder="Optional note"
                                    className="h-7 border-transparent bg-transparent text-[12px] text-muted-foreground italic hover:border-border focus-visible:bg-background focus-visible:text-foreground focus-visible:not-italic"
                                  />
                                </td>
                                <td className="px-2 py-1.5 text-center">
                                  <Button
                                    type="button"
                                    variant={v.secret ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() =>
                                      updateVariable(active.id, v.id, { secret: !v.secret })
                                    }
                                    className={cn(
                                      'h-6 gap-1 px-2 text-[11px]',
                                      v.secret
                                        ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400'
                                        : 'text-muted-foreground hover:text-foreground',
                                    )}
                                    title={v.secret ? 'Secret (masked)' : 'Plain text'}
                                  >
                                    <Key className="size-3" />
                                    {v.secret ? 'Secret' : 'Plain'}
                                  </Button>
                                </td>
                                <td className="px-2 py-1.5 text-center">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteVariable(active.id, v.id)}
                                    className="size-6 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                    title="Delete variable"
                                  >
                                    <Trash2 className="size-3" />
                                  </Button>
                                </td>
                              </tr>
                            </ContextMenuTrigger>
                            <ContextMenuContent className="w-48">
                              <ContextMenuItem
                                onClick={() =>
                                  updateVariable(active.id, v.id, { enabled: !v.enabled })
                                }
                              >
                                {v.enabled ? 'Disable' : 'Enable'}
                              </ContextMenuItem>
                              <ContextMenuItem
                                onClick={() =>
                                  updateVariable(active.id, v.id, { secret: !v.secret })
                                }
                              >
                                {v.secret ? 'Unmark secret' : 'Mark as secret'}
                              </ContextMenuItem>
                              <ContextMenuSeparator />
                              <ContextMenuItem
                                variant="destructive"
                                onClick={() => deleteVariable(active.id, v.id)}
                              >
                                Delete
                              </ContextMenuItem>
                            </ContextMenuContent>
                          </ContextMenu>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {active.variables.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addVariable(active.id)}
                    className="mt-4 h-8 gap-1.5 border-dashed text-[12px] text-muted-foreground hover:border-primary hover:text-primary"
                  >
                    <Plus className="size-3.5" />
                    Add variable
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <Layers className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-foreground">Select an environment</p>
                <p className="mt-1 max-w-[28ch] body-sm text-muted-foreground">
                  Choose an environment on the left or create a new one to manage its variables.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => createEnvironment()}
                  className="mt-4 gap-1.5 text-[12px]"
                >
                  <Plus className="size-3" />
                  Create environment
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </AppShell>
  )
}
