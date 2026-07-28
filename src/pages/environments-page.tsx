import { Eye, EyeOff, Key, Layers, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useActiveEnvironment } from '@/features/environments/model/use-environments-query'
import { AppShell } from '@/features/shell/ui/app-shell'
import { ContentToolbar } from '@/features/shell/ui/content-toolbar'
import { cn } from '@/shared/lib/utils'

export function EnvironmentsPage() {
  const { data: environments = [], active, environmentId } = useActiveEnvironment()
  const setEnvironmentId = useRestlyStore((s) => s.setEnvironmentId)
  const createEnvironment = useRestlyStore((s) => s.createEnvironment)
  const deleteEnvironment = useRestlyStore((s) => s.deleteEnvironment)
  const updateEnvironmentName = useRestlyStore((s) => s.updateEnvironmentName)
  const addVariable = useRestlyStore((s) => s.addVariable)
  const updateVariable = useRestlyStore((s) => s.updateVariable)
  const deleteVariable = useRestlyStore((s) => s.deleteVariable)

  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({})

  const toggleSecretVisibility = (varId: string) => {
    setVisibleSecrets((prev) => ({ ...prev, [varId]: !prev[varId] }))
  }

  return (
    <AppShell>
      <ContentToolbar
        showEnv
        start={<span className="text-[14px] font-semibold text-foreground">Environments</span>}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* ── Environment list panel ──────────────────────── */}
        <aside className="flex w-60 shrink-0 flex-col border-r border-border/60 bg-background">
          <div className="no-scrollbar flex-1 overflow-y-auto p-2">
            {environments.length === 0 ? (
              <p className="px-2 py-3 body-sm text-muted-foreground">No environments yet.</p>
            ) : (
              environments.map((env) => {
                const selected = env.id === environmentId
                return (
                  <div key={env.id} className="group relative flex items-center">
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => setEnvironmentId(env.id)}
                      className={cn(
                        'w-full justify-between rounded-md px-3 py-2.5 text-left pr-8',
                        selected
                          ? 'bg-accent text-accent-foreground hover:bg-accent'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={cn(
                            'size-[6px] shrink-0 rounded-full',
                            env.color,
                            !selected && 'opacity-50',
                          )}
                        />
                        <span className={cn('text-[13px] truncate', selected ? 'font-medium' : '')}>
                          {env.name}
                        </span>
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
                      className="absolute right-1 size-6 rounded-md p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                )
              })
            )}
          </div>

          {/* Add button */}
          <div className="border-t border-border/50 p-3">
            <Button
              variant="ghost"
              onClick={() => createEnvironment()}
              className="w-full justify-start gap-2 text-[13px] text-muted-foreground hover:text-primary"
              size="sm"
            >
              <Plus className="size-[13px]" />
              Add environment
            </Button>
          </div>
        </aside>

        {/* ── Environment detail panel ────────────────────── */}
        <main className="flex min-w-0 flex-1 flex-col">
          {active ? (
            <>
              {/* Detail header */}
              <header className="flex h-(--spacing-toolbar) shrink-0 items-center justify-between gap-3 border-b border-border/50 px-5">
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <Layers className="size-[14px] shrink-0 text-primary" />
                  <Input
                    value={active.name}
                    onChange={(e) => updateEnvironmentName(active.id, e.target.value)}
                    className="h-7 w-48 border-transparent bg-transparent text-[14px] font-semibold text-foreground hover:border-border focus-visible:border-border focus-visible:bg-background"
                    aria-label="Environment name"
                  />
                  <span className="shrink-0 label-caps text-muted-foreground/50">
                    {active.variables.length} variable{active.variables.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2">
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

              {/* Variables table */}
              <div className="flex-1 overflow-auto p-4">
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
                ) : (
                  <div className="overflow-hidden rounded-md border border-border/50">
                    <table className="w-full border-collapse text-[13px]">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/40">
                          <th className="w-10 px-3 py-2 text-center" />
                          <th className="px-3 py-2 text-left label-caps text-muted-foreground/70">
                            Variable Key
                          </th>
                          <th className="px-3 py-2 text-left label-caps text-muted-foreground/70">
                            Value
                          </th>
                          <th className="w-24 px-2 py-2 text-center label-caps text-muted-foreground/70">
                            Secret
                          </th>
                          <th className="w-10 px-2 py-2 text-center" />
                        </tr>
                      </thead>
                      <tbody>
                        {active.variables.map((v) => (
                          <tr
                            key={v.id}
                            className="border-b border-border/30 transition-colors last:border-b-0 hover:bg-muted/20"
                          >
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
                                className="h-7 border-transparent bg-transparent font-mono text-[12px] hover:border-border focus-visible:bg-background"
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
                                    title={visibleSecrets[v.id] ? 'Hide password' : 'Show password'}
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
                                    ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                                    : 'text-muted-foreground hover:text-foreground',
                                )}
                                title={v.secret ? 'Secret variable (masked)' : 'Plain text'}
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* No environment selected */
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
