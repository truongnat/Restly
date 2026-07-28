import { cva, type VariantProps } from 'class-variance-authority'
import { Tabs as TabsPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

function Tabs({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn('group/tabs flex gap-2 data-horizontal:flex-col', className)}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  [
    'group/tabs-list inline-flex w-fit items-center justify-start text-muted-foreground',
    'group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col',
  ].join(' '),
  {
    variants: {
      variant: {
        /** Segmented control — matches design request-detail tabs */
        default: ['h-9 gap-0.5 rounded-lg bg-muted/70 p-1', 'ring-1 ring-border/40'].join(' '),
        /** Underline tabs — response / secondary surfaces */
        line: ['h-10 gap-0.5 rounded-none bg-transparent p-0', 'border-transparent'].join(' '),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function TabsList({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Base
        'relative inline-flex h-full flex-none items-center justify-center gap-1.5',
        'px-3 text-[12.5px] font-medium tracking-[-0.01em] whitespace-nowrap',
        'text-muted-foreground transition-[color,background-color,box-shadow,transform] duration-150 ease-out',
        'outline-none select-none',
        'hover:text-foreground/80',
        'focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-40',
        'group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        // Badge inside trigger
        '[&_[data-slot=badge]]:ml-0.5 [&_[data-slot=badge]]:h-4 [&_[data-slot=badge]]:min-w-4',
        '[&_[data-slot=badge]]:px-1 [&_[data-slot=badge]]:text-[10px] [&_[data-slot=badge]]:font-semibold',
        // --- default (segmented) ---
        'group-data-[variant=default]/tabs-list:rounded-md',
        'group-data-[variant=default]/tabs-list:data-active:bg-background',
        'group-data-[variant=default]/tabs-list:data-active:text-primary',
        'group-data-[variant=default]/tabs-list:data-active:shadow-sm',
        'group-data-[variant=default]/tabs-list:data-active:ring-1',
        'group-data-[variant=default]/tabs-list:data-active:ring-border/50',
        'dark:group-data-[variant=default]/tabs-list:data-active:bg-background',
        'dark:group-data-[variant=default]/tabs-list:data-active:text-primary',
        'dark:group-data-[variant=default]/tabs-list:data-active:ring-border/60',
        // Active badge pops a bit
        'group-data-[variant=default]/tabs-list:data-active:[&_[data-slot=badge]]:bg-primary/10',
        'group-data-[variant=default]/tabs-list:data-active:[&_[data-slot=badge]]:text-primary',
        // --- line ---
        'group-data-[variant=line]/tabs-list:rounded-none',
        'group-data-[variant=line]/tabs-list:bg-transparent',
        'group-data-[variant=line]/tabs-list:px-2.5',
        'group-data-[variant=line]/tabs-list:data-active:bg-transparent',
        'group-data-[variant=line]/tabs-list:data-active:text-foreground',
        'group-data-[variant=line]/tabs-list:data-active:shadow-none',
        // Underline indicator (line variant)
        'after:pointer-events-none after:absolute after:opacity-0 after:transition-[opacity,transform] after:duration-150',
        'group-data-horizontal/tabs:after:inset-x-2 group-data-horizontal/tabs:after:bottom-0',
        'group-data-horizontal/tabs:after:h-[2px] group-data-horizontal/tabs:after:rounded-full',
        'group-data-horizontal/tabs:after:bg-primary',
        'group-data-vertical/tabs:after:inset-y-1 group-data-vertical/tabs:after:-right-px',
        'group-data-vertical/tabs:after:w-[2px] group-data-vertical/tabs:after:rounded-full',
        'group-data-vertical/tabs:after:bg-primary',
        'group-data-[variant=line]/tabs-list:data-active:after:opacity-100',
        'group-data-[variant=line]/tabs-list:data-active:[&_[data-slot=badge]]:bg-primary/10',
        'group-data-[variant=line]/tabs-list:data-active:[&_[data-slot=badge]]:text-primary',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'flex-1 text-sm outline-none',
        'focus-visible:ring-0',
        'data-[state=inactive]:hidden',
        className,
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
