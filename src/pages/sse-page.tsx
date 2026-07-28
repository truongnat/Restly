import { Radio, WifiOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AppShell } from '@/features/shell/ui/app-shell'
import { ContentToolbar } from '@/features/shell/ui/content-toolbar'
import { cn } from '@/shared/lib/utils'

type LogLine = { id: string; at: string; kind: 'evt' | 'sys'; text: string }

export function SsePage() {
  const [url, setUrl] = useState('https://sse.dev/test')
  const [connected, setConnected] = useState(false)
  const [logs, setLogs] = useState<LogLine[]>([])
  const esRef = useRef<EventSource | null>(null)

  const push = (kind: LogLine['kind'], text: string) => {
    setLogs((prev) =>
      [
        { id: `${Date.now()}-${Math.random()}`, at: new Date().toLocaleTimeString(), kind, text },
        ...prev,
      ].slice(0, 200),
    )
  }

  const disconnect = () => {
    esRef.current?.close()
    esRef.current = null
    setConnected(false)
  }

  const connect = () => {
    disconnect()
    try {
      const es = new EventSource(url)
      esRef.current = es
      setConnected(true)
      push('sys', 'Listening…')
      es.onmessage = (ev) => push('evt', ev.data)
      es.onerror = () => {
        push('sys', 'SSE error / closed')
        disconnect()
      }
    } catch (err) {
      push('sys', err instanceof Error ? err.message : 'Failed to connect')
    }
  }

  useEffect(() => () => disconnect(), [])

  return (
    <AppShell>
      <ContentToolbar
        showEnv={false}
        start={
          <span className="text-[14px] font-semibold text-foreground">Server-Sent Events</span>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-8 min-w-[240px] flex-1 font-mono text-[12px]"
            spellCheck={false}
            aria-label="SSE URL"
          />
          {connected ? (
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={disconnect}>
              <WifiOff className="size-3.5" />
              Stop
            </Button>
          ) : (
            <Button size="sm" className="h-8 gap-1.5" onClick={connect}>
              <Radio className="size-3.5" />
              Listen
            </Button>
          )}
        </div>
        <ul className="min-h-0 flex-1 overflow-auto rounded-lg border border-border/50 bg-card p-2 font-mono text-[11px]">
          {logs.length === 0 ? (
            <li className="px-2 py-8 text-center text-muted-foreground">No events yet</li>
          ) : (
            logs.map((line) => (
              <li
                key={line.id}
                className={cn(
                  'border-b border-border/30 px-2 py-1.5 last:border-0',
                  line.kind === 'evt' && 'text-emerald-700 dark:text-emerald-400',
                  line.kind === 'sys' && 'text-muted-foreground',
                )}
              >
                <span className="mr-2 text-muted-foreground/70">{line.at}</span>
                {line.text}
              </li>
            ))
          )}
        </ul>
      </div>
    </AppShell>
  )
}
