import { Copy } from 'lucide-react'
import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { copyToClipboard } from '@/shared/lib/clipboard'
import { cn } from '@/shared/lib/utils'
import { CopyButton } from '@/shared/ui/copy-button'

function CopyCell({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    void copyToClipboard(value).then((ok) => {
      if (ok) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    })
  }, [value])

  return (
    <div className="flex items-center gap-1">
      <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy value'}
        className="shrink-0 opacity-0 group-hover/row:opacity-100"
      >
        <Copy className={cn('size-3', copied ? 'text-emerald-600' : 'text-muted-foreground')} />
      </Button>
    </div>
  )
}

interface ResponseHeadersProps {
  headers?: Record<string, string>
}

export function ResponseHeaders({ headers }: ResponseHeadersProps) {
  const entries = headers ? Object.entries(headers) : []

  if (entries.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-5 text-xs text-muted-foreground">
        No response headers available.
      </div>
    )
  }

  const allHeadersText = entries.map(([key, value]) => `${key}: ${value}`).join('\n')

  return (
    <div className="flex h-full flex-col p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="label-caps text-muted-foreground/70">
          {entries.length} header{entries.length !== 1 ? 's' : ''}
        </span>
        <CopyButton text={allHeadersText} label="Copy all" />
      </div>
      <div className="min-h-0 flex-1 overflow-auto rounded-md border border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-8 w-[35%] label-caps text-muted-foreground/70">Key</TableHead>
              <TableHead className="h-8 label-caps text-muted-foreground/70">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map(([key, value]) => (
              <TableRow key={key} className="group/row hover:bg-muted/30">
                <TableCell className="py-2 font-mono text-xs font-medium text-foreground">
                  {key}
                </TableCell>
                <TableCell className="py-2">
                  <CopyCell value={value} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
