import { useNavigate } from '@tanstack/react-router'
import { Copy, KeyRound, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { Button } from '@/components/ui/button'
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
import { authTypeLabel, type RequestAuthType } from '@/entities'
import { AppShell } from '@/features/shell/ui/app-shell'
import { ContentToolbar } from '@/features/shell/ui/content-toolbar'
import { ROUTES } from '@/shared/constants/app'
import { cn } from '@/shared/lib/utils'
import { EnvAwareInput } from '@/shared/ui/env-aware-input'

function confirmDelete(name: string): boolean {
  return window.confirm(`Delete “${name}”?`)
}

export function AuthPage() {
  const navigate = useNavigate()
  const authProfiles = useRestlyStore((s) => s.authProfiles)
  const authProfileId = useRestlyStore((s) => s.authProfileId)
  const setAuthProfileId = useRestlyStore((s) => s.setAuthProfileId)
  const createAuthProfile = useRestlyStore((s) => s.createAuthProfile)
  const deleteAuthProfile = useRestlyStore((s) => s.deleteAuthProfile)
  const duplicateAuthProfile = useRestlyStore((s) => s.duplicateAuthProfile)
  const updateAuthProfile = useRestlyStore((s) => s.updateAuthProfile)
  const setAuthProfileType = useRestlyStore((s) => s.setAuthProfileType)
  const applyAuthProfile = useRestlyStore((s) => s.applyAuthProfile)

  const active = useMemo(
    () => authProfiles.find((p) => p.id === authProfileId) ?? authProfiles[0] ?? null,
    [authProfiles, authProfileId],
  )

  useEffect(() => {
    if (active && active.id !== authProfileId) setAuthProfileId(active.id)
  }, [active, authProfileId, setAuthProfileId])

  const applyAndOpen = (id: string) => {
    applyAuthProfile(id)
    void navigate({ to: ROUTES.workspace })
  }

  const removeProfile = (id: string, name: string) => {
    if (confirmDelete(name)) deleteAuthProfile(id)
  }

  return (
    <AppShell>
      <ContentToolbar
        showEnv={false}
        start={<span className="text-[14px] font-semibold text-foreground">Auth</span>}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="flex w-64 shrink-0 flex-col border-r border-border/60 bg-background">
          <div className="no-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto p-3">
            {authProfiles.length === 0 ? (
              <p className="px-2 py-3 body-sm text-muted-foreground">No auth profiles yet.</p>
            ) : (
              authProfiles.map((profile) => {
                const selected = profile.id === (active?.id ?? '')
                return (
                  <ContextMenu key={profile.id}>
                    <ContextMenuTrigger asChild>
                      <div className="group relative flex items-center">
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => setAuthProfileId(profile.id)}
                          className={cn(
                            'h-auto w-full justify-between rounded-lg px-3.5 py-3 pr-9 text-left',
                            selected
                              ? 'bg-muted text-foreground ring-1 ring-border/60 hover:bg-muted'
                              : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                          )}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <KeyRound
                              className={cn(
                                'size-3.5 shrink-0',
                                selected ? 'text-primary' : 'text-muted-foreground/70',
                              )}
                            />
                            <div className="min-w-0 space-y-0.5">
                              <span
                                className={cn(
                                  'block truncate text-[13px] leading-snug',
                                  selected ? 'font-semibold' : 'font-medium',
                                )}
                              >
                                {profile.name || 'Untitled'}
                              </span>
                              <span className="block truncate text-[11px] leading-snug text-muted-foreground/70">
                                {profile.description?.trim() || authTypeLabel(profile.auth.type)}
                              </span>
                            </div>
                          </div>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          title="Delete profile"
                          aria-label={`Delete ${profile.name}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            removeProfile(profile.id, profile.name)
                          }}
                          className="absolute right-1.5 size-7 rounded-md p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-48">
                      <ContextMenuItem onClick={() => setAuthProfileId(profile.id)}>
                        Open
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => applyAndOpen(profile.id)}>
                        Apply to request
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => duplicateAuthProfile(profile.id)}>
                        Duplicate
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        variant="destructive"
                        onClick={() => removeProfile(profile.id, profile.name)}
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
              onClick={() => createAuthProfile()}
              className="h-10 w-full justify-start gap-2 text-[13px] text-muted-foreground hover:text-primary"
              size="sm"
            >
              <Plus className="size-[13px]" />
              New auth profile
            </Button>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          {active ? (
            <>
              <header className="flex h-(--spacing-toolbar) shrink-0 items-center justify-between gap-3 border-b border-border/50 px-5">
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <KeyRound className="size-3.5 shrink-0 text-primary" />
                  <Input
                    value={active.name}
                    onChange={(e) => updateAuthProfile(active.id, { name: e.target.value })}
                    onBlur={() => {
                      if (!active.name.trim()) {
                        updateAuthProfile(active.id, { name: 'Untitled profile' })
                      }
                    }}
                    className="h-7 max-w-[240px] min-w-0 flex-1 border-transparent bg-transparent text-[14px] font-semibold text-foreground hover:border-border focus-visible:border-border focus-visible:bg-background"
                    aria-label="Auth profile name"
                  />
                  <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 label-caps text-muted-foreground/70">
                    {authTypeLabel(active.auth.type)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => duplicateAuthProfile(active.id)}
                    className="h-7 gap-1.5 text-[12px]"
                  >
                    <Copy className="size-3" />
                    Duplicate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProfile(active.id, active.name)}
                    className="h-7 gap-1 text-[12px] text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => applyAndOpen(active.id)}
                    className="h-7 gap-1.5 text-[12px]"
                  >
                    Apply to request
                  </Button>
                </div>
              </header>

              <div className="flex-1 overflow-auto p-5">
                <div className="mb-5 max-w-xl">
                  <h2 className="text-[15px] font-semibold text-foreground">Credentials</h2>
                  <p className="mt-0.5 body-sm text-muted-foreground">
                    Reusable auth configs for the active request. OAuth is form-only — no network
                    exchange in mock phase.
                  </p>
                </div>

                <div className="flex max-w-xl flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="auth-desc" className="text-xs text-muted-foreground">
                      Description
                    </Label>
                    <Input
                      id="auth-desc"
                      value={active.description ?? ''}
                      onChange={(e) =>
                        updateAuthProfile(active.id, { description: e.target.value })
                      }
                      placeholder="Optional note"
                      className="h-8 text-[13px]"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Label
                      htmlFor="auth-type"
                      className="w-28 shrink-0 text-xs font-medium text-muted-foreground"
                    >
                      Auth Type
                    </Label>
                    <Select
                      value={active.auth.type}
                      onValueChange={(v) => setAuthProfileType(active.id, v as RequestAuthType)}
                    >
                      <SelectTrigger id="auth-type" size="sm" className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Auth</SelectItem>
                        <SelectItem value="bearer">Bearer Token</SelectItem>
                        <SelectItem value="basic">Basic Auth</SelectItem>
                        <SelectItem value="oauth">OAuth 2.0 (Mock)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {active.auth.type === 'none' && (
                    <div className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                      Applying this profile clears authorization on the request.
                    </div>
                  )}

                  {active.auth.type === 'bearer' && (
                    <div className="flex flex-col gap-1.5 rounded-md border border-border/60 p-3">
                      <Label htmlFor="auth-token" className="text-xs">
                        Token
                      </Label>
                      <EnvAwareInput
                        id="auth-token"
                        value={active.auth.bearerToken ?? ''}
                        onChange={(e) =>
                          updateAuthProfile(active.id, {
                            auth: { ...active.auth, bearerToken: e.target.value },
                          })
                        }
                        placeholder="e.g. {{api_key}} or eyJ…"
                        className="font-mono text-xs"
                      />
                    </div>
                  )}

                  {active.auth.type === 'basic' && (
                    <div className="flex flex-col gap-3 rounded-md border border-border/60 p-3">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="auth-user" className="text-xs">
                          Username
                        </Label>
                        <EnvAwareInput
                          id="auth-user"
                          value={active.auth.basicUsername ?? ''}
                          onChange={(e) =>
                            updateAuthProfile(active.id, {
                              auth: { ...active.auth, basicUsername: e.target.value },
                            })
                          }
                          placeholder="Username"
                          className="text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="auth-pass" className="text-xs">
                          Password
                        </Label>
                        <EnvAwareInput
                          id="auth-pass"
                          type="password"
                          value={active.auth.basicPassword ?? ''}
                          onChange={(e) =>
                            updateAuthProfile(active.id, {
                              auth: { ...active.auth, basicPassword: e.target.value },
                            })
                          }
                          placeholder="Password"
                          className="text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {active.auth.type === 'oauth' && (
                    <div className="flex flex-col gap-3 rounded-md border border-border/60 p-3">
                      {(
                        [
                          ['oauthClientId', 'Client ID', 'client_id'],
                          ['oauthClientSecret', 'Client Secret', '••••••••'],
                          ['oauthAuthUrl', 'Auth URL', 'https://…/authorize'],
                          ['oauthTokenUrl', 'Token URL', 'https://…/token'],
                        ] as const
                      ).map(([field, label, placeholder]) => (
                        <div key={field} className="flex flex-col gap-1.5">
                          <Label htmlFor={`auth-${field}`} className="text-xs">
                            {label}
                          </Label>
                          <EnvAwareInput
                            id={`auth-${field}`}
                            type={field === 'oauthClientSecret' ? 'password' : 'text'}
                            value={active.auth[field] ?? ''}
                            onChange={(e) =>
                              updateAuthProfile(active.id, {
                                auth: { ...active.auth, [field]: e.target.value },
                              })
                            }
                            placeholder={placeholder}
                            className="font-mono text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <KeyRound className="size-5 text-muted-foreground" />
              </div>
              <p className="text-[14px] font-medium text-foreground">Select an auth profile</p>
              <p className="max-w-[28ch] body-sm text-muted-foreground">
                Create reusable credentials and apply them to requests.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => createAuthProfile()}
                className="mt-2 gap-1.5 text-[12px]"
              >
                <Plus className="size-3" />
                New auth profile
              </Button>
            </div>
          )}
        </main>
      </div>
    </AppShell>
  )
}
