import { ArrowRight, Download } from 'lucide-react'
import { useCallback } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Group, Panel, ResizableHandle } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { RequestTab } from '@/entities/request'
import type { SendRequestState } from '@/features/request-editor/model/use-send-request'
import { AuthEditor } from '@/features/request-editor/ui/auth-editor'
import { BodyEditor } from '@/features/request-editor/ui/body-editor'
import { CodeGeneratorButton } from '@/features/request-editor/ui/code-generator'
import { HeadersEditor } from '@/features/request-editor/ui/headers-editor'
import { ParamsEditor } from '@/features/request-editor/ui/params-editor'
import { ResponseHeaders } from '@/features/request-editor/ui/response-headers'
import { ResponsePreview } from '@/features/request-editor/ui/response-preview'
import { ScriptsEditor } from '@/features/request-editor/ui/scripts-editor'
import { formatJsonValue, getValueType, tryParseJson } from '@/shared/lib/json-pretty'
import { cn } from '@/shared/lib/utils'
import { CopyButton } from '@/shared/ui/copy-button'

const tokenColors: Record<string, string> = {
  string: 'text-amber-600',
  number: 'text-cyan-600',
  boolean: 'text-violet-600',
  null: 'text-rose-500',
  other: 'text-foreground',
}

function JsonView({ text }: { text: string }) {
  let formatted = text
  const parsed = tryParseJson(text)
  if (parsed !== null) {
    formatted = formatJsonValue(parsed)
  }

  const lines = formatted.split('\n')

  return (
    <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground">
      {lines.map((line, i) => {
        const keyMatch = line.match(/^(\s*)"((?:[^"\\]|\\.)*)":\s*(.*)$/)
        if (!keyMatch) {
          const trimmed = line.trim()
          const type = getValueType(trimmed)
          if (type !== 'other') {
            return (
              <div key={i}>
                <span className={tokenColors[type]}>{line}</span>
              </div>
            )
          }
          return <div key={i}>{line}</div>
        }
        const [, indent, key, rest] = keyMatch
        const cleanRest = rest.replace(/,?\s*$/, '')
        const trailingComma = /,\s*$/.test(rest) ? ',' : ''
        const type = getValueType(cleanRest)

        return (
          <div key={i}>
            {indent}
            <span className="text-primary/70">"{key}"</span>:{' '}
            <span className={tokenColors[type]}>{cleanRest}</span>
            {trailingComma}
          </div>
        )
      })}
    </pre>
  )
}

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
  const headers = useRestlyStore((s) => s.headers)
  const requestTab = useRestlyStore((s) => s.requestTab)
  const setRequestTab = useRestlyStore((s) => s.setRequestTab)

  const hasResponse = meta.status > 0

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

  return (
    <main
      className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background"
      aria-label="Request workspace"
    >
      <Group orientation="horizontal" className="flex min-h-0 flex-1">
        <Panel defaultSize={45} minSize={20} className="flex min-h-0 flex-col">
          <section
            className="flex min-h-0 flex-1 flex-col border-r border-border/60"
            aria-label="Request configuration"
          >
            <Tabs
              value={requestTab}
              onValueChange={(val) => setRequestTab(val as RequestTab)}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border/50 bg-muted/20 px-4 py-2">
                <TabsList variant="default" className="h-8">
                  <TabsTrigger value="params">
                    Params
                    {params.length > 0 && (
                      <Badge variant="secondary" className="text-[10px]">
                        {params.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="headers">
                    Headers
                    <Badge variant="secondary" className="text-[10px]">
                      {headers.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="body">Body</TabsTrigger>
                  <TabsTrigger value="auth">Auth</TabsTrigger>
                  <TabsTrigger value="scripts">Scripts</TabsTrigger>
                </TabsList>
                <CodeGeneratorButton />
              </div>
              <TabsContent value="params" className="mt-0 min-h-0 flex-1 overflow-auto">
                <ParamsEditor />
              </TabsContent>
              <TabsContent value="headers" className="mt-0 min-h-0 flex-1 overflow-auto">
                <HeadersEditor />
              </TabsContent>
              <TabsContent
                value="body"
                className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden"
              >
                <BodyEditor />
              </TabsContent>
              <TabsContent value="auth" className="mt-0 min-h-0 flex-1 overflow-auto">
                <AuthEditor />
              </TabsContent>
              <TabsContent
                value="scripts"
                className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden"
              >
                <ScriptsEditor />
              </TabsContent>
            </Tabs>
          </section>
        </Panel>

        <ResizableHandle />

        <Panel defaultSize={55} minSize={20} className="flex min-h-0 flex-col">
          <section className="flex min-h-0 flex-1 flex-col bg-card" aria-label="Response">
            {!hasResponse && !isPending ? (
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
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
                <p className="body-sm text-muted-foreground">Sending request...</p>
              </div>
            ) : (
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
                    <CopyButton text={responseBody} label="Copy response" />
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
                  <div className="flex shrink-0 items-center border-b border-border/50 px-3">
                    <TabsList variant="line" className="h-9">
                      <TabsTrigger value="pretty">Pretty</TabsTrigger>
                      <TabsTrigger value="raw">Raw</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="headers">
                        Headers
                        {headerCount > 0 && (
                          <Badge variant="secondary" className="text-[10px]">
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
                    <ScrollArea className="h-full">
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
        </Panel>
      </Group>
    </main>
  )
}
