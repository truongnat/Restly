import { FileCode, FileText } from 'lucide-react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { formatJsonValue, tryParseJson } from '@/shared/lib/json-pretty'

interface ResponsePreviewProps {
  body: string
}

function isHtmlContent(text: string): boolean {
  const trimmed = text.trim()
  return (
    trimmed.startsWith('<!DOCTYPE html') ||
    trimmed.startsWith('<!doctype html') ||
    trimmed.startsWith('<html') ||
    /<[a-z][\s\S]*>/i.test(trimmed)
  )
}

export function ResponsePreview({ body }: ResponsePreviewProps) {
  if (!body) {
    return (
      <div className="flex h-full items-center justify-center p-5 text-xs text-muted-foreground">
        No response body to preview.
      </div>
    )
  }

  const isHtml = isHtmlContent(body)

  if (isHtml) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-border/50 px-4 py-2">
          <FileCode className="size-3.5 text-muted-foreground" />
          <span className="text-[11px] font-medium text-muted-foreground">HTML Preview</span>
        </div>
        <div className="min-h-0 flex-1 p-4">
          <iframe
            srcDoc={body}
            title="Response HTML Preview"
            className="h-full w-full rounded-md border border-border bg-white shadow-sm"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    )
  }

  const parsed = tryParseJson(body)
  const contentToDisplay = parsed !== null ? formatJsonValue(parsed) : body
  const isJson = parsed !== null

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-2">
        <FileText className="size-3.5 text-muted-foreground" />
        <span className="text-[11px] font-medium text-muted-foreground">
          {isJson ? 'Formatted JSON' : 'Plain Text'}
        </span>
      </div>
      <ScrollArea className="min-h-0 flex-1 p-5">
        <pre
          className={
            isJson
              ? 'font-mono text-xs leading-relaxed whitespace-pre-wrap'
              : 'font-mono text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground'
          }
        >
          {contentToDisplay}
        </pre>
      </ScrollArea>
    </div>
  )
}
