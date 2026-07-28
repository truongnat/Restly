import { Badge } from '@/components/ui/badge'
import type { HttpMethod } from '@/entities/http'
import { cn, methodColorLight } from '@/shared/lib/utils'

interface MethodBadgeProps {
  method: HttpMethod
  className?: string
}

/**
 * MethodBadge — shared HTTP method label.
 * Uses Stitch label-caps type scale + methodColorLight palette.
 * Reused in: Sidebar (request list), HistoryPage, RequestWorkspace.
 */
export function MethodBadge({ method, className }: MethodBadgeProps) {
  return (
    <Badge
      variant="ghost"
      className={cn(
        'label-caps shrink-0 normal-case h-auto p-0 hover:bg-transparent font-semibold',
        methodColorLight[method],
        className,
      )}
    >
      {method}
    </Badge>
  )
}
