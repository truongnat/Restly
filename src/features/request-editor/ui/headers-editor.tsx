import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useCallback, useMemo } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { HeaderRow } from '@/entities/request'
import { createHeaderColumns } from '@/features/request-editor/model/header-columns'

interface HeadersEditorProps {
  error?: string
}

export function HeadersEditor({ error }: HeadersEditorProps) {
  const headers = useRestlyStore((s) => s.headers)

  const handleUpdateHeader = useCallback(
    (id: string, field: keyof HeaderRow, value: boolean | string) => {
      const currentHeaders = useRestlyStore.getState().headers
      const updated = currentHeaders.map((h) => (h.id === id ? { ...h, [field]: value } : h))
      useRestlyStore.getState().setHeaders(updated)
    },
    [],
  )

  const handleDeleteHeader = useCallback((id: string) => {
    const currentHeaders = useRestlyStore.getState().headers
    const updated = currentHeaders.filter((h) => h.id !== id)
    useRestlyStore.getState().setHeaders(updated)
  }, [])

  const handleAddHeader = useCallback(() => {
    const currentHeaders = useRestlyStore.getState().headers
    const newHeader: HeaderRow = {
      id: `header-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      enabled: true,
      key: '',
      value: '',
      description: '',
    }
    useRestlyStore.getState().setHeaders([...currentHeaders, newHeader])
  }, [])

  const columns = useMemo(
    () => createHeaderColumns({ onUpdate: handleUpdateHeader, onDelete: handleDeleteHeader }),
    [handleUpdateHeader, handleDeleteHeader],
  )

  const table = useReactTable({
    data: headers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex flex-col gap-2 p-2">
      {error && (
        <p className="px-2 text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="overflow-visible">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="h-9 label-caps text-muted-foreground/70">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-4 text-center text-xs text-muted-foreground">
                  No headers specified.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/30">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-1.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="px-2">
        <Button variant="outline" size="sm" onClick={handleAddHeader} className="h-7 text-xs">
          <Plus className="mr-1 size-3.5" />
          Add Header
        </Button>
      </div>
    </div>
  )
}
