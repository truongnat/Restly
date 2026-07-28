import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { ArrowRight, Check, Copy, Download, Plus } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ParamRow, RequestTab } from '@/entities/request'
import { createParamColumns } from '@/features/request-editor/model/param-columns'
import type { SendRequestState } from '@/features/request-editor/model/use-send-request'
import { AuthEditor } from '@/features/request-editor/ui/auth-editor'
import { BodyEditor } from '@/features/request-editor/ui/body-editor'
import { HeadersEditor } from '@/features/request-editor/ui/headers-editor'
import { ResponseHeaders } from '@/features/request-editor/ui/response-headers'
import { ResponsePreview } from '@/features/request-editor/ui/response-preview'
import { cn } from '@/shared/lib/utils'

/** Minimal syntax highlight for JSON responses */
function JsonView({ text }: { text: string }) {
  return (
    <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground">
      {text.split('\n').map((line, i) => {
        const keyMatch = line.match(/^(\s*)"([^"]+)":\s*(.*)$/)
        if (!keyMatch) return <div key={i}>{line}</div>
        const [, indent, key, rest] = keyMatch
        const isString = rest.startsWith('"')
        const isActive = rest.includes('"active"')
        return (
          <div key={i}>
            {indent}
            <span className="text-primary/70">"{key}"</span>
            {': '}
            <span
              className={cn(
                isActive ? 'text-emerald-600' : isString ? 'text-amber-700' : 'text-foreground',
              )}
            >
              {rest.replace(/,?$/, '')}
            </span>
            {rest.endsWith(',') ? ',' : ''}
          </div>
        )
      })}
    </pre>
  )
}

/** Status badge colour based on HTTP status code */
function StatusBadge({ status, statusText }: { status: number; statusText: string }) {
  const ok = status > 0 && status < 400
  const warn = status >= 400 && status < 500
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-semibold',
        ok && 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60',
        warn && 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60',
        !ok && !warn && 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/60',
        status === 0 && 'bg-muted text-muted-foreground ring-0',
      )}
    >
      {status > 0 ? `${status} ${statusText}` : 'No response'}
    </span>
  )
}

interface RequestWorkspaceProps {
  sendState: SendRequestState
}

export function RequestWorkspace({ sendState }: RequestWorkspaceProps) {
  const { responseBody, meta, isPending } = sendState

  const params = useRestlyStore((s) => s.params)
  const setParams = useRestlyStore((s) => s.setParams)
  const headers = useRestlyStore((s) => s.headers)
  const requestTab = useRestlyStore((s) => s.requestTab)
  const setRequestTab = useRestlyStore((s) => s.setRequestTab)

  const hasResponse = meta.status > 0
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    if (!responseBody) return
    void navigator.clipboard.writeText(responseBody)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [responseBody])

  const handleDownload = useCallback(() => {
    if (!responseBody) return
    const isJson = responseBody.trim().startsWith('{') || responseBody.trim().startsWith('[')
    const isHtml = /^\s*<(!DOCTYPE|html|head|body|div|p)/i.test(responseBody)
    const extension = isJson ? 'json' : isHtml ? 'html' : 'txt'
    const mimeType = isJson ? 'application/json' : isHtml ? 'text/html' : 'text/plain'

    const blob = new Blob([responseBody], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `response.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [responseBody])

  const headerCount = meta.headers ? Object.keys(meta.headers).length : 0

  const handleUpdateParam = useCallback(
    (id: string, field: keyof ParamRow, value: boolean | string) => {
      setParams(params.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
    },
    [params, setParams],
  )

  const handleDeleteParam = useCallback(
    (id: string) => {
      setParams(params.filter((p) => p.id !== id))
    },
    [params, setParams],
  )

  const handleAddParam = () => {
    const newParam: ParamRow = {
      id: `param-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      enabled: true,
      key: '',
      value: '',
      description: '',
    }
    setParams([...params, newParam])
  }

  const columns = useMemo(
    () => createParamColumns({ onUpdate: handleUpdateParam, onDelete: handleDeleteParam }),
    [handleUpdateParam, handleDeleteParam],
  )

  const table = useReactTable({
    data: params,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <main
      className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background"
      aria-label="Request workspace"
    >
      {/* ── Split pane: request tabs + response ─────────── */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Request panel */}
        <section
          className="flex min-h-0 flex-col border-b border-border/60 lg:w-[45%] lg:border-r lg:border-b-0"
          aria-label="Request configuration"
        >
          <Tabs
            value={requestTab}
            onValueChange={(val) => setRequestTab(val as RequestTab)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="border-b border-border/50 px-4">
              <TabsList variant="line" className="h-10">
                <TabsTrigger value="params">
                  Params
                  {params.length > 0 && (
                    <Badge variant="secondary" className="ml-1.5 text-[10px]">
                      {params.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="headers">
                  Headers
                  <Badge variant="secondary" className="ml-1.5 text-[10px]">
                    {headers.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="body">Body</TabsTrigger>
                <TabsTrigger value="auth">Auth</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="params"
              className="mt-0 flex min-h-0 flex-1 flex-col overflow-auto p-2"
            >
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((hg) => (
                      <TableRow key={hg.id} className="hover:bg-transparent">
                        {hg.headers.map((h) => (
                          <TableHead key={h.id} className="h-9 label-caps text-muted-foreground/70">
                            {h.isPlaceholder
                              ? null
                              : flexRender(h.column.columnDef.header, h.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-4 text-center text-xs text-muted-foreground"
                        >
                          No parameters specified.
                        </TableCell>
                      </TableRow>
                    ) : (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} className="hover:bg-muted/30">
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="py-1.5">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="px-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddParam}
                  className="h-7 text-xs"
                >
                  <Plus className="mr-1 size-3.5" />
                  Add Param
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="headers" className="mt-0 min-h-0 flex-1 overflow-auto">
              <HeadersEditor />
            </TabsContent>

            <TabsContent value="body" className="mt-0 min-h-0 flex-1 overflow-auto">
              <BodyEditor />
            </TabsContent>

            <TabsContent value="auth" className="mt-0 min-h-0 flex-1 overflow-auto">
              <AuthEditor />
            </TabsContent>
          </Tabs>
        </section>

        {/* Response panel */}
        <section className="flex min-h-0 flex-1 flex-col bg-card" aria-label="Response">
          {!hasResponse && !isPending ? (
            /* Empty state — guided, inviting */
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <ArrowRight className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-foreground">No response yet</p>
                <p className="mt-1 max-w-[22ch] body-sm text-muted-foreground">
                  Enter a URL above and press Send to see the response here.
                </p>
              </div>
            </div>
          ) : isPending ? (
            /* Loading state */
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
              <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
              <p className="body-sm text-muted-foreground">Sending request...</p>
            </div>
          ) : (
            /* Response content */
            <>
              <div className="flex h-(--spacing-toolbar) shrink-0 items-center justify-between border-b border-border/60 px-4">
                <div className="flex items-center gap-3">
                  <StatusBadge status={meta.status} statusText={meta.statusText} />
                  {meta.durationMs ? (
                    <span className="body-sm text-muted-foreground">{meta.durationMs}ms</span>
                  ) : null}
                  {meta.size ? (
                    <span className="body-sm text-muted-foreground">{meta.size}</span>
                  ) : null}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Copy response"
                    onClick={handleCopy}
                    disabled={!responseBody}
                    title={copied ? 'Copied!' : 'Copy response'}
                  >
                    {copied ? (
                      <Check className="size-[14px] text-emerald-600" />
                    ) : (
                      <Copy className="size-[14px]" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Download response"
                    onClick={handleDownload}
                    disabled={!responseBody}
                    title="Download response"
                  >
                    <Download className="size-[14px]" />
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="pretty" className="flex min-h-0 flex-1 flex-col">
                <div className="flex items-center border-b border-border/50 px-4">
                  <TabsList variant="line" className="h-10">
                    <TabsTrigger value="pretty">Pretty</TabsTrigger>
                    <TabsTrigger value="raw">Raw</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="headers">
                      Headers
                      {headerCount > 0 && (
                        <Badge variant="secondary" className="ml-1.5 text-[10px]">
                          {headerCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="pretty" className="mt-0 min-h-0 flex-1">
                  <ScrollArea className="h-full p-5">
                    <JsonView text={responseBody} />
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="raw" className="mt-0 min-h-0 flex-1 p-5">
                  <ScrollArea className="h-full p-5">
                    <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground">
                      {responseBody}
                    </pre>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="preview" className="mt-0 min-h-0 flex-1">
                  <ResponsePreview body={responseBody} />
                </TabsContent>
                <TabsContent value="headers" className="mt-0 min-h-0 flex-1">
                  <ResponseHeaders headers={meta.headers} />
                </TabsContent>
              </Tabs>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
