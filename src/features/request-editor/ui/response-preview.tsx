import { ScrollArea } from '@/components/ui/scroll-area'

interface ResponsePreviewProps {
  body: string
}

/** Check if text looks like HTML */
function isHtmlContent(text: string): boolean {
  const trimmed = text.trim()
  return (
    trimmed.startsWith('<!DOCTYPE html') ||
    trimmed.startsWith('<!doctype html') ||
    trimmed.startsWith('<html') ||
    /<[a-z][\s\S]*>/i.test(trimmed)
  )
}

/** Formatted JSON preview if valid JSON */
function tryFormatJson(text: string): string | null {
  try {
    const parsed = JSON.parse(text)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return null
  }
}

export function ResponsePreview({ body }: ResponsePreviewProps) {
  if (!body) {
    return <div className="p-5 text-xs text-muted-foreground">No response body to preview.</div>
  }

  const isHtml = isHtmlContent(body)

  if (isHtml) {
    return (
      <div className="h-full w-full p-4">
        <iframe
          srcDoc={body}
          title="Response HTML Preview"
          className="h-full w-full rounded-md border border-border bg-white shadow-sm"
          sandbox="allow-same-origin"
        />
      </div>
    )
  }

  const formattedJson = tryFormatJson(body)
  const contentToDisplay = formattedJson ?? body

  return (
    <ScrollArea className="h-full p-5">
      <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground">
        {contentToDisplay}
      </pre>
    </ScrollArea>
  )
}
