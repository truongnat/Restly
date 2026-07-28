import { GripVertical } from 'lucide-react'

import { cn } from '@/lib/utils'

export { Group, Panel } from 'react-resizable-panels'
import { Separator as ResizableSeparator } from 'react-resizable-panels'

interface ResizableHandleProps {
  className?: string
  disabled?: boolean
}

export function ResizableHandle({ className, disabled }: ResizableHandleProps) {
  return (
    <ResizableSeparator
      className={cn(
        'relative flex w-2 shrink-0 items-center justify-center bg-transparent outline-none transition-colors data-[separator]:cursor-col-resize',
        'hover:bg-accent/50 data-[resize-handle-active]:bg-accent',
        disabled && 'cursor-default hover:bg-transparent',
        className,
      )}
      disabled={disabled}
    >
      <div className="flex h-8 w-[3px] items-center justify-center rounded-full bg-border">
        <GripVertical className="size-3 text-muted-foreground/40" />
      </div>
    </ResizableSeparator>
  )
}

export { ResizableSeparator }
