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
import type { ParamRow } from '@/entities/request'
import { createParamColumns } from '@/features/request-editor/model/param-columns'

export function ParamsEditor() {
  const params = useRestlyStore((s) => s.params)

  const handleUpdateParam = useCallback(
    (id: string, field: keyof ParamRow, value: boolean | string) => {
      const currentParams = useRestlyStore.getState().params
      const updated = currentParams.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      useRestlyStore.getState().setParams(updated)
    },
    [],
  )

  const handleDeleteParam = useCallback((id: string) => {
    const currentParams = useRestlyStore.getState().params
    const updated = currentParams.filter((p) => p.id !== id)
    useRestlyStore.getState().setParams(updated)
  }, [])

  const handleAddParam = useCallback(() => {
    const currentParams = useRestlyStore.getState().params
    const newParam: ParamRow = {
      id: `param-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      enabled: true,
      key: '',
      value: '',
      description: '',
    }
    useRestlyStore.getState().setParams([...currentParams, newParam])
  }, [])

  const columns = useMemo(
    () => createParamColumns({ onUpdate: handleUpdateParam, onDelete: handleDeleteParam }),
    [handleUpdateParam, handleDeleteParam],
  )

  const table = useReactTable({
    data: params,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="overflow-hidden">
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
                  No parameters specified.
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
        <Button variant="outline" size="sm" onClick={handleAddParam} className="h-7 text-xs">
          <Plus className="mr-1 size-3.5" />
          Add Param
        </Button>
      </div>
    </div>
  )
}
