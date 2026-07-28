import type { ColumnDef } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import type { ParamRow } from '@/entities/request'
import { EnvAwareInput } from '@/shared/ui/env-aware-input'

interface ParamColumnCallbacks {
  onUpdate: (id: string, field: keyof ParamRow, value: boolean | string) => void
  onDelete: (id: string) => void
}

export function createParamColumns({
  onUpdate,
  onDelete,
}: ParamColumnCallbacks): ColumnDef<ParamRow>[] {
  return [
    {
      id: 'enabled',
      header: '',
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.enabled}
          onCheckedChange={(checked) => onUpdate(row.original.id, 'enabled', !!checked)}
          aria-label="Toggle parameter"
        />
      ),
      size: 40,
    },
    {
      accessorKey: 'key',
      header: 'Key',
      cell: ({ row }) => (
        <EnvAwareInput
          value={row.original.key}
          onChange={(e) => onUpdate(row.original.id, 'key', e.target.value)}
          placeholder="Key"
          className="h-8 font-mono text-xs"
        />
      ),
    },
    {
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }) => (
        <EnvAwareInput
          value={row.original.value}
          onChange={(e) => onUpdate(row.original.id, 'value', e.target.value)}
          placeholder="Value"
          className="h-8 font-mono text-xs text-primary"
        />
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <Input
          value={row.original.description}
          onChange={(e) => onUpdate(row.original.id, 'description', e.target.value)}
          placeholder="Description"
          className="h-8 text-xs text-muted-foreground"
        />
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(row.original.id)}
          aria-label="Delete parameter"
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
        </Button>
      ),
      size: 40,
    },
  ]
}

export const paramColumns = createParamColumns({
  onUpdate: () => {},
  onDelete: () => {},
})
