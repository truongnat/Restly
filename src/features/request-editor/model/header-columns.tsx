import type { ColumnDef } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import type { HeaderRow } from '@/entities/request'
import { EnvAwareInput } from '@/shared/ui/env-aware-input'
import { HttpKeyInput } from '@/shared/ui/http-key-input'

interface HeaderColumnCallbacks {
  onUpdate: (id: string, field: keyof HeaderRow, value: boolean | string) => void
  onDelete: (id: string) => void
}

export function createHeaderColumns({
  onUpdate,
  onDelete,
}: HeaderColumnCallbacks): ColumnDef<HeaderRow>[] {
  return [
    {
      id: 'enabled',
      header: '',
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.enabled}
          onCheckedChange={(checked) => onUpdate(row.original.id, 'enabled', !!checked)}
          aria-label="Toggle header"
        />
      ),
      size: 40,
    },
    {
      accessorKey: 'key',
      header: 'Key',
      cell: ({ row }) => (
        <HttpKeyInput
          value={row.original.key}
          onChange={(val) => onUpdate(row.original.id, 'key', val)}
          placeholder="Header"
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
          value={row.original.description ?? ''}
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
          aria-label="Delete header"
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
        </Button>
      ),
      size: 40,
    },
  ]
}
