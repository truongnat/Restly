import { Link } from '@tanstack/react-router'
import {
  Check,
  Download,
  Keyboard,
  LogOut,
  Palette,
  Search,
  Settings,
  Shield,
  User,
} from 'lucide-react'
import { useState } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { AppShell } from '@/features/shell/ui/app-shell'
import { ContentToolbar } from '@/features/shell/ui/content-toolbar'
import { ROUTES } from '@/shared/constants/app'
import type { ThemeMode } from '@/shared/lib/persist'
import { cn } from '@/shared/lib/utils'

const sections = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'themes', label: 'Themes', icon: Palette },
  { id: 'keyboard', label: 'Keyboard shortcuts', icon: Keyboard },
  { id: 'proxy', label: 'Proxy', icon: Shield },
  { id: 'account', label: 'Account', icon: User },
] as const

const generalToggleDefs = [
  { id: 'opt-0', label: 'Confirm before closing unsaved requests' },
  { id: 'opt-1', label: 'Auto-save collections' },
  { id: 'opt-2', label: 'Send anonymous usage analytics' },
  { id: 'opt-3', label: 'Auto-follow HTTP redirects' },
  { id: 'opt-4', label: 'Enable SSL certificate verification' },
  { id: 'opt-auto-update', label: 'Check for updates automatically (desktop)' },
]

const themePresets = [
  { id: 'emerald', name: 'Restly Dark (Emerald)', color: 'bg-emerald-500', hex: '#10b981' },
  { id: 'blue', name: 'Midnight Blue', color: 'bg-blue-500', hex: '#3b82f6' },
  { id: 'violet', name: 'Violet Glow', color: 'bg-violet-500', hex: '#8b5cf6' },
  { id: 'rose', name: 'Rose Velvet', color: 'bg-rose-500', hex: '#f43f5e' },
  { id: 'amber', name: 'Amber Warmth', color: 'bg-amber-500', hex: '#f59e0b' },
]

const shortcutList = [
  { category: 'Request & Workspace', action: 'Send request', keys: ['Ctrl', 'Enter'] },
  { category: 'Request & Workspace', action: 'New request', keys: ['Ctrl', 'N'] },
  { category: 'Request & Workspace', action: 'New collection', keys: ['Ctrl', 'Shift', 'N'] },
  { category: 'Request & Workspace', action: 'Save request', keys: ['Ctrl', 'S'] },
  { category: 'Navigation & Shell', action: 'Quick Search', keys: ['Ctrl', 'K'] },
  { category: 'Navigation & Shell', action: 'Toggle sidebar', keys: ['Ctrl', 'B'] },
  { category: 'Navigation & Shell', action: 'Switch environment', keys: ['Ctrl', 'E'] },
  { category: 'Navigation & Shell', action: 'Open settings', keys: ['Ctrl', ','] },
  { category: 'History & Extras', action: 'Clear history', keys: ['Ctrl', 'Shift', 'H'] },
  { category: 'History & Extras', action: 'Toggle theme', keys: ['Ctrl', 'Shift', 'T'] },
]

export function SettingsPage() {
  const [section, setSection] = useState<(typeof sections)[number]['id']>('general')

  const theme = useRestlyStore((s) => s.theme)
  const setTheme = useRestlyStore((s) => s.setTheme)
  const accentColor = useRestlyStore((s) => s.accentColor)
  const setAccentColor = useRestlyStore((s) => s.setAccentColor)
  const generalToggles = useRestlyStore((s) => s.generalToggles)
  const setGeneralToggle = useRestlyStore((s) => s.setGeneralToggle)
  const autoUpdateEnabled = useRestlyStore((s) => s.autoUpdateEnabled)
  const setAutoUpdateEnabled = useRestlyStore((s) => s.setAutoUpdateEnabled)

  // Section local mock states
  const [shortcutFilter, setShortcutFilter] = useState('')
  const [proxyEnabled, setProxyEnabled] = useState(false)
  const [proxyType, setProxyType] = useState('http')
  const [proxyHost, setProxyHost] = useState('127.0.0.1')
  const [proxyPort, setProxyPort] = useState('8080')
  const [proxyAuth, setProxyAuth] = useState(false)
  const [proxyUser, setProxyUser] = useState('admin')
  const [proxyPass, setProxyPass] = useState('••••••••')

  const [accountName, setAccountName] = useState('Alex Developer')
  const [accountEmail, setAccountEmail] = useState('alex@restly.dev')
  const [syncWorkspace, setSyncWorkspace] = useState(true)

  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    window.setTimeout(() => setToastMsg(null), 3000)
  }

  const filteredShortcuts = shortcutList.filter(
    (s) =>
      s.action.toLowerCase().includes(shortcutFilter.toLowerCase()) ||
      s.category.toLowerCase().includes(shortcutFilter.toLowerCase()) ||
      s.keys.some((k) => k.toLowerCase().includes(shortcutFilter.toLowerCase())),
  )

  return (
    <AppShell>
      <ContentToolbar
        showEnv={false}
        start={<span className="text-[14px] font-semibold text-foreground">Settings</span>}
        end={
          <Button asChild variant="ghost" size="sm" className="text-[13px] text-muted-foreground">
            <Link to={ROUTES.workspace}>Close</Link>
          </Button>
        }
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Toast notification banner */}
        {toastMsg && (
          <div className="absolute right-4 bottom-4 z-50 flex animate-in items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-[13px] text-foreground shadow-lg fade-in slide-in-from-bottom-2">
            <Check className="size-4 text-primary" />
            {toastMsg}
          </div>
        )}

        {/* ── Settings nav ────────────────────────────── */}
        <aside className="w-52 shrink-0 border-r border-border/60 bg-background">
          <nav className="flex flex-col gap-0.5 p-2" aria-label="Settings sections">
            {sections.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant="ghost"
                type="button"
                onClick={() => setSection(id)}
                className={cn(
                  'w-full justify-start gap-2.5 rounded-md px-2.5 py-[7px] text-left text-[13px] font-medium duration-150',
                  section === id
                    ? 'bg-accent text-accent-foreground hover:bg-accent'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                )}
                aria-current={section === id ? 'page' : undefined}
              >
                <Icon
                  className={cn(
                    'size-[14px] shrink-0',
                    section === id ? 'text-primary' : 'text-muted-foreground',
                  )}
                />
                {label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* ── Settings content ─────────────────────── */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-xl px-8 py-8">
            <h1 className="mb-6 text-[18px] font-semibold tracking-[-0.01em] capitalize">
              {sections.find((s) => s.id === section)?.label}
            </h1>

            {/* General Section */}
            {section === 'general' && (
              <div className="space-y-8">
                {/* Appearance */}
                <section aria-labelledby="appearance-heading">
                  <h2 id="appearance-heading" className="mb-4 label-caps text-muted-foreground/60">
                    Appearance
                  </h2>
                  <div className="grid grid-cols-3 gap-3">
                    {(
                      [
                        { id: 'system', label: 'System' },
                        { id: 'light', label: 'Light' },
                        { id: 'dark', label: 'Dark' },
                      ] as const
                    ).map((mode) => {
                      const isActive = theme === mode.id
                      return (
                        <Button
                          key={mode.id}
                          variant="ghost"
                          type="button"
                          onClick={() => setTheme(mode.id as ThemeMode)}
                          className="group h-auto flex-col gap-2 rounded-none border-0 p-0 text-left"
                          aria-pressed={isActive}
                        >
                          <div
                            className={cn(
                              'flex aspect-4/3 overflow-hidden rounded-lg border-2 transition-colors w-full',
                              isActive
                                ? 'border-primary ring-2 ring-primary/20'
                                : 'border-border/50 group-hover:border-border',
                            )}
                          >
                            {mode.id === 'system' && (
                              <>
                                <div className="h-full w-1/2 border-r border-border/30 bg-white" />
                                <div className="h-full w-1/2 bg-[#18181a]" />
                              </>
                            )}
                            {mode.id === 'light' && <div className="h-full w-full bg-white" />}
                            {mode.id === 'dark' && <div className="h-full w-full bg-[#18181a]" />}
                          </div>
                          <span
                            className={cn(
                              'px-0.5 text-[12px]',
                              isActive ? 'font-medium text-foreground' : 'text-muted-foreground',
                            )}
                          >
                            {mode.label}
                          </span>
                        </Button>
                      )
                    })}
                  </div>
                </section>

                {/* Preferences */}
                <section aria-labelledby="preferences-heading">
                  <h2 id="preferences-heading" className="mb-4 label-caps text-muted-foreground/60">
                    Preferences
                  </h2>
                  <div className="flex flex-col gap-3 rounded-lg border border-border/50 bg-card px-4 py-2">
                    {generalToggleDefs.map(({ id, label }) => {
                      const isChecked =
                        id === 'opt-auto-update' ? autoUpdateEnabled : (generalToggles[id] ?? true)
                      return (
                        <div key={id} className="flex items-center justify-between gap-4 py-1.5">
                          <Label
                            htmlFor={id}
                            className="cursor-pointer text-[13px] font-normal text-foreground"
                          >
                            {label}
                          </Label>
                          <Switch
                            id={id}
                            checked={isChecked}
                            onCheckedChange={(val) => {
                              if (id === 'opt-auto-update') setAutoUpdateEnabled(val)
                              else setGeneralToggle(id, val)
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>
                </section>
              </div>
            )}

            {/* Themes Section */}
            {section === 'themes' && (
              <div className="space-y-6">
                <section aria-labelledby="theme-palette-heading">
                  <h2
                    id="theme-palette-heading"
                    className="mb-2 label-caps text-muted-foreground/60"
                  >
                    Accent Presets
                  </h2>
                  <p className="mb-4 body-sm text-muted-foreground">
                    Customize your workspace accent and highlight colors.
                  </p>
                  <div className="space-y-3">
                    {themePresets.map((preset) => {
                      const isSelected = accentColor === preset.id
                      return (
                        <div
                          key={preset.id}
                          onClick={() => {
                            setAccentColor(preset.id)
                            showToast(`Applied ${preset.name}`)
                          }}
                          className={cn(
                            'flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors',
                            isSelected
                              ? 'border-primary bg-accent/30'
                              : 'border-border/50 hover:bg-muted/30',
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={cn('size-4 rounded-full', preset.color)}
                              style={{ backgroundColor: preset.hex }}
                            />
                            <span className="text-[13px] font-medium text-foreground">
                              {preset.name}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[11px] font-medium text-primary">
                              <Check className="size-3.5" />
                              Active
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </section>
              </div>
            )}

            {/* Keyboard Shortcuts Section */}
            {section === 'keyboard' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute top-2.5 left-3 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search shortcuts..."
                    value={shortcutFilter}
                    onChange={(e) => setShortcutFilter(e.target.value)}
                    className="h-8 pl-8 text-[13px]"
                  />
                </div>

                <div className="divide-y divide-border/40 overflow-hidden rounded-lg border border-border/50 bg-card">
                  {filteredShortcuts.length === 0 ? (
                    <div className="p-6 text-center text-[13px] text-muted-foreground">
                      No shortcuts matching "{shortcutFilter}"
                    </div>
                  ) : (
                    filteredShortcuts.map((sc, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-4 py-2.5 text-[13px]"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-foreground">{sc.action}</span>
                          <span className="text-[11px] text-muted-foreground/70">
                            {sc.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          {sc.keys.map((k, keyIdx) => (
                            <kbd
                              key={keyIdx}
                              className="rounded border border-border/60 bg-muted px-1.5 py-0.5 font-sans text-[11px] shadow-2xs"
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Proxy Section */}
            {section === 'proxy' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-4 py-3">
                  <div>
                    <p className="text-[13px] font-medium text-foreground">Enable Proxy</p>
                    <p className="body-sm text-muted-foreground">
                      Route request traffic through a local or custom proxy server.
                    </p>
                  </div>
                  <Switch checked={proxyEnabled} onCheckedChange={setProxyEnabled} />
                </div>

                {proxyEnabled && (
                  <div className="space-y-4 rounded-lg border border-border/50 bg-card p-4">
                    <div>
                      <Label className="mb-1.5 block text-[12px] text-muted-foreground">
                        Protocol
                      </Label>
                      <div className="flex gap-2">
                        {['http', 'https', 'socks5'].map((proto) => (
                          <Button
                            key={proto}
                            type="button"
                            variant={proxyType === proto ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setProxyType(proto)}
                            className="h-7 text-[11px] uppercase"
                          >
                            {proto}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <Label className="mb-1 block text-[12px] text-muted-foreground">
                          Proxy Host
                        </Label>
                        <Input
                          value={proxyHost}
                          onChange={(e) => setProxyHost(e.target.value)}
                          className="h-8 text-[13px]"
                        />
                      </div>
                      <div>
                        <Label className="mb-1 block text-[12px] text-muted-foreground">Port</Label>
                        <Input
                          value={proxyPort}
                          onChange={(e) => setProxyPort(e.target.value)}
                          className="h-8 text-[13px]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/40 pt-3">
                      <Label className="cursor-pointer text-[13px] font-normal text-foreground">
                        Proxy Authentication
                      </Label>
                      <Switch checked={proxyAuth} onCheckedChange={setProxyAuth} />
                    </div>

                    {proxyAuth && (
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <Label className="mb-1 block text-[12px] text-muted-foreground">
                            Username
                          </Label>
                          <Input
                            value={proxyUser}
                            onChange={(e) => setProxyUser(e.target.value)}
                            className="h-8 text-[13px]"
                          />
                        </div>
                        <div>
                          <Label className="mb-1 block text-[12px] text-muted-foreground">
                            Password
                          </Label>
                          <Input
                            type="password"
                            value={proxyPass}
                            onChange={(e) => setProxyPass(e.target.value)}
                            className="h-8 text-[13px]"
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          showToast(
                            `Connected to proxy ${proxyType}://${proxyHost}:${proxyPort} (Ping 14ms)`,
                          )
                        }
                        className="h-8 gap-1.5 text-[12px]"
                      >
                        <Shield className="size-3.5" />
                        Test Connection
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Account Section */}
            {section === 'account' && (
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="flex items-center gap-4 rounded-lg border border-border/50 bg-card p-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-[16px] font-semibold text-primary">
                    AD
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-semibold text-foreground">{accountName}</p>
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-500">
                        Pro Mock
                      </span>
                    </div>
                    <p className="body-sm text-muted-foreground">{accountEmail}</p>
                  </div>
                </div>

                <div className="space-y-4 rounded-lg border border-border/50 bg-card p-4">
                  <div>
                    <Label className="mb-1 block text-[12px] text-muted-foreground">
                      Display Name
                    </Label>
                    <Input
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="h-8 text-[13px]"
                    />
                  </div>

                  <div>
                    <Label className="mb-1 block text-[12px] text-muted-foreground">
                      Email Address
                    </Label>
                    <Input
                      value={accountEmail}
                      onChange={(e) => setAccountEmail(e.target.value)}
                      className="h-8 text-[13px]"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-border/40 pt-3">
                    <div>
                      <p className="text-[13px] font-medium text-foreground">Sync Workspace</p>
                      <p className="body-sm text-muted-foreground">
                        Keep collections and environments synced across devices.
                      </p>
                    </div>
                    <Switch checked={syncWorkspace} onCheckedChange={setSyncWorkspace} />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => showToast('Account data exported as restly-backup.json')}
                    className="h-8 gap-1.5 text-[12px]"
                  >
                    <Download className="size-3.5" />
                    Export Backup
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => showToast('Signed out of mock session')}
                    className="h-8 gap-1.5 text-[12px] text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="size-3.5" />
                    Sign out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </AppShell>
  )
}
