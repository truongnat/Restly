import { useNavigate } from '@tanstack/react-router'
import { Check, Clock, Filter, Search, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import type { HistoryItem, HttpMethod } from '@/entities'
import { useGroupedHistory } from '@/features/history/model/use-history-query'
import { AppShell } from '@/features/shell/ui/app-shell'
import { ContentToolbar } from '@/features/shell/ui/content-toolbar'
import { ROUTES } from '@/shared/constants/app'
import { cn } from '@/shared/lib/utils'
import { MethodBadge } from '@/shared/ui/method-badge'

export function HistoryPage() {
  const navigate = useNavigate()
  const history = useRestlyStore((s) => s.history)
  const clearHistory = useRestlyStore((s) => s.clearHistory)
  const reopenHistoryItem = useRestlyStore((s) => s.reopenHistoryItem)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<'ALL' | HttpMethod>('ALL')

  const filteredItems = useMemo(() => {
    return history.filter((item) => {
      const matchesMethod = selectedMethod === 'ALL' || item.method === selectedMethod
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        item.url.toLowerCase().includes(q) ||
        item.method.toLowerCase().includes(q) ||
        item.status.toString().includes(q) ||
        item.statusText.toLowerCase().includes(q)
      return matchesMethod && matchesSearch
    })
  }, [history, selectedMethod, searchQuery])

  const { groups } = useGroupedHistory(filteredItems)

  const isHistoryEmpty = history.length === 0
  const isFilteredEmpty = !isHistoryEmpty && filteredItems.length === 0

  const handleRowClick = (item: HistoryItem) => {
    reopenHistoryItem(item)
    void navigate({ to: ROUTES.workspace })
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedMethod('ALL')
  }

  return (
    <AppShell>
      <ContentToolbar
        showEnv={false}
        start={
          <div className="flex max-w-md flex-1 items-center gap-3">
            <span className="shrink-0 text-[14px] font-semibold text-foreground">History</span>
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pr-7 pl-8 text-[12px]"
                id="input-history-search"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </Button>
              )}
            </div>
          </div>
        }
        end={
          <div className="flex items-center gap-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'gap-1.5 text-[12px]',
                    selectedMethod !== 'ALL'
                      ? 'bg-accent/50 font-medium text-primary'
                      : 'text-muted-foreground',
                  )}
                  id="btn-history-filter"
                >
                  <Filter className="size-[13px]" />
                  {selectedMethod === 'ALL' ? 'Filter' : `Method: ${selectedMethod}`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {(['ALL', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const).map((m) => (
                  <DropdownMenuItem
                    key={m}
                    onClick={() => setSelectedMethod(m)}
                    className="flex items-center justify-between text-[12px]"
                  >
                    <span>{m === 'ALL' ? 'All Methods' : m}</span>
                    {selectedMethod === m && <Check className="size-3 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              disabled={isHistoryEmpty}
              className="gap-1.5 text-[12px] text-muted-foreground hover:text-destructive disabled:opacity-40"
              id="btn-history-clear"
            >
              <Trash2 className="size-[13px]" />
              Clear
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-6">
          {isHistoryEmpty ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <Clock className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-foreground">No history yet</p>
                <p className="mt-1 max-w-[28ch] body-sm text-muted-foreground">
                  Every request you send will appear here, grouped by date.
                </p>
              </div>
            </div>
          ) : isFilteredEmpty ? (
            /* Filtered out state */
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <Search className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-foreground">No matching history found</p>
                <p className="mt-1 body-sm text-muted-foreground">
                  Try adjusting your search query or method filter.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="mt-2 text-[12px]"
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {groups.map(({ group, items }) => (
                <section key={group} aria-label={group}>
                  {/* Group header */}
                  <div className="mb-3 flex items-center gap-3">
                    <h2 className="label-caps text-muted-foreground/60">{group}</h2>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>

                  {/* Request rows */}
                  <div className="flex flex-col gap-0.5">
                    {items.map((item) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        type="button"
                        onClick={() => handleRowClick(item)}
                        className="group w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-muted/50"
                      >
                        <MethodBadge method={item.method} className="w-[44px]" />

                        {/* URL + meta */}
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-mono text-[12px] text-foreground">
                            {item.url}
                          </div>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="body-sm text-muted-foreground/60">{item.when}</span>
                            <span className="size-[3px] rounded-full bg-border" />
                            <span className="body-sm text-muted-foreground/60">
                              {item.durationMs}ms
                            </span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <Badge
                          variant="secondary"
                          className={cn(
                            'shrink-0 text-[11px]',
                            item.status < 400
                              ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                              : 'border-rose-100 bg-rose-50 text-rose-700',
                          )}
                        >
                          {item.status}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
