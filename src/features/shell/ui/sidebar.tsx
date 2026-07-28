import { Link, useRouterState } from '@tanstack/react-router'
import {
  ChevronDown,
  ChevronRight,
  Clock,
  FolderOpen,
  Globe,
  KeyRound,
  Layers,
  Plus,
  Settings,
  Terminal,
} from 'lucide-react'

import { useRestlyStore } from '@/app/store/restly-store'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import type { CollectionFolder } from '@/entities/collection'
import type { NavId } from '@/entities/navigation'
import { useCollectionsQuery } from '@/features/shell/model/use-collections-query'
import { ROUTES } from '@/shared/constants/app'
import { cn } from '@/shared/lib/utils'
import { MethodBadge } from '@/shared/ui/method-badge'

type ExtendedNavId = NavId | 'auth' | 'mocks'

const navItems: {
  id: ExtendedNavId
  label: string
  to: string
  icon: React.ComponentType<{ className?: string }>
  stub?: boolean
}[] = [
  { id: 'collections', label: 'Requests', to: ROUTES.workspace, icon: Terminal },
  { id: 'history', label: 'History', to: ROUTES.history, icon: Clock },
  { id: 'environments', label: 'Environments', to: ROUTES.environments, icon: Layers },
  { id: 'auth', label: 'Auth', to: ROUTES.auth, icon: KeyRound },
  { id: 'mocks', label: 'Mock Servers', to: ROUTES.mocks, icon: Globe },
]

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { data: queryFolders = [] } = useCollectionsQuery()
  const storeFolders = useRestlyStore((s) => s.folders)
  const activeRequestId = useRestlyStore((s) => s.activeRequestId)
  const selectRequest = useRestlyStore((s) => s.selectRequest)
  const toggleFolder = useRestlyStore((s) => s.toggleFolder)
  const searchQuery = useRestlyStore((s) => s.searchQuery)
  const createRequest = useRestlyStore((s) => s.createRequest)
  const createRequestInCollection = useRestlyStore((s) => s.createRequestInCollection)
  const createCollection = useRestlyStore((s) => s.createCollection)
  const renameCollection = useRestlyStore((s) => s.renameCollection)
  const deleteCollection = useRestlyStore((s) => s.deleteCollection)
  const renameRequest = useRestlyStore((s) => s.renameRequest)
  const duplicateRequest = useRestlyStore((s) => s.duplicateRequest)
  const deleteRequest = useRestlyStore((s) => s.deleteRequest)

  const folders = storeFolders.length > 0 ? storeFolders : queryFolders

  const q = searchQuery.trim().toLowerCase()

  const tree = q
    ? folders
        .map((folder) => {
          const folderMatches = folder.name.toLowerCase().includes(q)
          const matchingRequests = folder.requests.filter(
            (req) =>
              req.name.toLowerCase().includes(q) ||
              req.url.toLowerCase().includes(q) ||
              req.method.toLowerCase().includes(q),
          )
          if (folderMatches) {
            return {
              ...folder,
              open: true,
            }
          }
          if (matchingRequests.length > 0) {
            return {
              ...folder,
              open: true,
              requests: matchingRequests,
            }
          }
          return null
        })
        .filter((f): f is CollectionFolder => f !== null)
    : folders

  return (
    <aside
      className="z-20 flex h-full w-(--spacing-sidebar) shrink-0 flex-col border-r border-border/60 text-foreground glass-sidebar"
      aria-label="Main navigation"
    >
      {/* ── Brand ─────────────────────────────────────────── */}
      <div className="shrink-0 px-4 pt-5 pb-4">
        <Link
          to={ROUTES.workspace}
          className="mb-4 flex items-center gap-2.5 no-underline"
          aria-label="Restly home"
        >
          {/* Brand mark — simple API icon, no fake macOS lights */}
          <div className="flex size-[28px] shrink-0 items-center justify-center rounded-[7px] bg-primary shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              className="size-[16px] fill-white"
              aria-hidden="true"
            >
              <path d="M240-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 43 5.5t38 15.5l74-74q-10-18-15.5-38T374-574q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 43T673-492l74 74q18-10 38-15.5t43-5.5q66 0 113 47t47 113q0 66-47 113t-113 47q-66 0-113-47t-47-113q0-23 5.5-43t15.5-38l-74-74q-18 10-38 15.5T534-420q-23 0-43-5.5T453-441l-74 74q10 18 15.5 38t5.5 43q0 66-47 113t-113 47Zm294-334q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29ZM240-200q33 0 56.5-23.5T320-280q0-33-23.5-56.5T240-360q-33 0-56.5 23.5T160-280q0 33 23.5 56.5T240-200Zm480 0q33 0 56.5-23.5T800-280q0-33-23.5-56.5T720-360q-33 0-56.5 23.5T640-280q0 33 23.5 56.5T720-200Z" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">
            Restly
          </span>
        </Link>

        {/* New Request button — low-key, secondary style */}
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-border/70 bg-card text-[13px] font-medium text-foreground shadow-none hover:bg-muted/70"
          size="sm"
          id="btn-new-request"
          onClick={createRequest}
        >
          <Plus className="size-[14px] text-muted-foreground" />
          New request
        </Button>
      </div>

      {/* ── Nav ──────────────────────────────────────────── */}
      <nav
        className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-2 pb-3"
        aria-label="Sidebar navigation"
      >
        {/* Primary nav items */}
        <div className="mb-4 flex flex-col gap-0.5">
          {navItems.map(({ id, label, to, icon: Icon }) => {
            const active =
              pathname === to || (id === 'collections' && pathname === ROUTES.workspace)
            return (
              <Link
                key={id}
                to={to}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] font-medium transition-colors duration-150',
                  active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon
                  className={cn(
                    'size-[15px] shrink-0 transition-colors',
                    active ? 'text-primary' : 'text-muted-foreground',
                  )}
                />
                {label}
              </Link>
            )
          })}
        </div>

        {/* Collections tree — only on /workspace */}
        {pathname === ROUTES.workspace && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="mb-1.5 flex items-center justify-between px-2.5">
              <span className="label-caps text-muted-foreground/60">Collections</span>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={createCollection}
                title="New collection"
                aria-label="New collection"
                id="btn-new-collection"
                className="h-5 w-5 text-muted-foreground/70 hover:text-foreground"
              >
                <Plus className="size-[13px]" />
              </Button>
            </div>
            {tree.length === 0 ? (
              <div className="px-2.5 py-2">
                <p className="body-sm text-muted-foreground/60">
                  {q ? 'No matching collections.' : 'No collections yet.'}
                </p>
              </div>
            ) : (
              tree.map((folder) => (
                <div key={folder.id}>
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => toggleFolder(folder.id)}
                        className="w-full justify-start gap-2 rounded-md px-2 py-[6px] text-foreground hover:bg-muted/60"
                      >
                        {folder.open ? (
                          <ChevronDown className="size-[13px] shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="size-[13px] shrink-0 text-muted-foreground" />
                        )}
                        <FolderOpen className="size-[13px] shrink-0 text-primary/70" />
                        <span className="truncate text-[13px]">{folder.name}</span>
                      </Button>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-48">
                      <ContextMenuItem onClick={() => createRequestInCollection(folder.id)}>
                        New request
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => {
                          const next = window.prompt('Rename collection', folder.name)
                          if (next != null) renameCollection(folder.id, next)
                        }}
                      >
                        Rename
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        variant="destructive"
                        onClick={() => {
                          if (window.confirm(`Delete collection “${folder.name}”?`)) {
                            deleteCollection(folder.id)
                          }
                        }}
                      >
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                  {folder.open && (
                    <div className="ml-6 flex flex-col gap-0.5 border-l border-border/50 pl-2">
                      {folder.requests.map((req) => {
                        const selected = req.id === activeRequestId
                        return (
                          <ContextMenu key={req.id}>
                            <ContextMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                type="button"
                                onClick={() => selectRequest(req.id)}
                                className={cn(
                                  'w-full justify-start gap-2 rounded-md px-2 py-[5px] text-left duration-100',
                                  selected
                                    ? 'bg-accent text-accent-foreground hover:bg-accent'
                                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                                )}
                              >
                                <MethodBadge method={req.method} />
                                <span className="truncate body-sm">{req.name}</span>
                              </Button>
                            </ContextMenuTrigger>
                            <ContextMenuContent className="w-48">
                              <ContextMenuItem onClick={() => selectRequest(req.id)}>
                                Open
                              </ContextMenuItem>
                              <ContextMenuItem onClick={() => duplicateRequest(req.id)}>
                                Duplicate
                              </ContextMenuItem>
                              <ContextMenuItem
                                onClick={() => {
                                  const next = window.prompt('Rename request', req.name)
                                  if (next != null) renameRequest(req.id, next)
                                }}
                              >
                                Rename
                              </ContextMenuItem>
                              <ContextMenuSeparator />
                              <ContextMenuItem
                                variant="destructive"
                                onClick={() => {
                                  if (window.confirm(`Delete “${req.name}”?`)) {
                                    deleteRequest(req.id)
                                  }
                                }}
                              >
                                Delete
                              </ContextMenuItem>
                            </ContextMenuContent>
                          </ContextMenu>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </nav>

      {/* ── Footer — user + settings ─────────────────────── */}
      <div className="shrink-0 border-t border-border/50 px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
            JD
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] leading-none font-medium">Dev workspace</p>
          </div>
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            aria-label="Settings"
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Link to={ROUTES.settings}>
              <Settings className="size-[15px]" />
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}
