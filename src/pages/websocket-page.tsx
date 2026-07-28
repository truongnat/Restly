import { Radio, SendHorizontal, WifiOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AppShell } from '@/features/shell/ui/app-shell'
import { ContentToolbar } from '@/features/shell/ui/content-toolbar'
import { cn } from '@/shared/lib/utils'

type LogLine = { id: string; at: string; kind: 'in' | 'out' | 'sys'; text: string }

export function WebsocketPage() {
  const [url, setUrl] = useState('wss://echo.websocket.events')
  const [draft, setDraft] = useState('{"hello":"restly"}')
  const [connected, setConnected] = useState(false)
  const [logs, setLogs] = useState<LogLine[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  const push = (kind: LogLine['kind'], text: string) => {
    setLogs((prev) =>
      [
        { id: `${Date.now()}-${Math.random()}`, at: new Date().toLocaleTimeString(), kind, text },
        ...prev,
      ].slice(0, 200),
    )
  }

  const disconnect = () => {
    wsRef.current?.close()
    wsRef.current = null
    setConnected(false)
  }

  const connect = () => {
    disconnect()
    try {
      const ws = new WebSocket(url)
      wsRef.current = ws
      ws.onopen = () => {
        setConnected(true)
        push('sys', 'Connected')
      }
      ws.onclose = () => {
        setConnected(false)
        push('sys', 'Disconnected')
      }
      ws.onerror = () => push('sys', 'Socket error')
      ws.onmessage = (ev) => push('in', String(ev.data))
    } catch (err) {
      push('sys', err instanceof Error ? err.message : 'Failed to connect')
    }
  }

  useEffect(() => () => disconnect(), [])

  const send = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    wsRef.current.send(draft)
    push('out', draft)
  }

  return (
    <AppShell>
      <ContentToolbar
        showEnv={false}
        start={<span className="text-[14px] font-semibold text-foreground">WebSocket</span>}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-8 min-w-[240px] flex-1 font-mono text-[12px]"
            spellCheck={false}
            aria-label="WebSocket URL"
          />
          {connected ? (
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={disconnect}>
              <WifiOff className="size-3.5" />
              Disconnect
            </Button>
          ) : (
            <Button size="sm" className="h-8 gap-1.5" onClick={connect}>
              <Radio className="size-3.5" />
              Connect
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="h-8 flex-1 font-mono text-[12px]"
            disabled={!connected}
            onKeyDown={(e) => {
              if (e.key === 'Enter') send()
            }}
            aria-label="Message"
          />
          <Button size="sm" className="h-8 gap-1.5" disabled={!connected} onClick={send}>
            <SendHorizontal className="size-3.5" />
            Send
          </Button>
        </div>
        <ul className="min-h-0 flex-1 overflow-auto rounded-lg border border-border/50 bg-card p-2 font-mono text-[11px]">
          {logs.length === 0 ? (
            <li className="px-2 py-8 text-center text-muted-foreground">No messages yet</li>
          ) : (
            logs.map((line) => (
              <li
                key={line.id}
                className={cn(
                  'border-b border-border/30 px-2 py-1.5 last:border-0',
                  line.kind === 'in' && 'text-emerald-700 dark:text-emerald-400',
                  line.kind === 'out' && 'text-sky-700 dark:text-sky-400',
                  line.kind === 'sys' && 'text-muted-foreground',
                )}
              >
                <span className="mr-2 text-muted-foreground/70">{line.at}</span>
                <span className="mr-2 uppercase opacity-70">{line.kind}</span>
                {line.text}
              </li>
            ))
          )}
        </ul>
      </div>
    </AppShell>
  )
}
