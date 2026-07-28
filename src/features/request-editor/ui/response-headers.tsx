import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ResponseHeadersProps {
  headers?: Record<string, string>
}

export function ResponseHeaders({ headers }: ResponseHeadersProps) {
  const entries = headers ? Object.entries(headers) : []

  if (entries.length === 0) {
    return <div className="p-5 text-xs text-muted-foreground">No response headers available.</div>
  }

  return (
    <div className="p-5">
      <div className="overflow-hidden rounded-md border border-border/60">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-8 label-caps text-muted-foreground/70">Key</TableHead>
              <TableHead className="h-8 label-caps text-muted-foreground/70">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map(([key, value]) => (
              <TableRow key={key} className="hover:bg-muted/30">
                <TableCell className="py-2 font-mono text-xs font-medium text-foreground">
                  {key}
                </TableCell>
                <TableCell className="py-2 font-mono text-xs text-muted-foreground">
                  {value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
