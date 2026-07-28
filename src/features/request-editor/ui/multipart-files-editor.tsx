import { FileIcon, Paperclip, Upload, X } from 'lucide-react'
import * as React from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function MultipartFilesEditor() {
  const bodyFiles = useRestlyStore((s) => s.bodyFiles)
  const addBodyFiles = useRestlyStore((s) => s.addBodyFiles)
  const removeBodyFile = useRestlyStore((s) => s.removeBodyFile)
  const updateBodyFile = useRestlyStore((s) => s.updateBodyFile)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  /** When set, next file pick(s) use this field name (Add to field). */
  const pendingFieldRef = React.useRef<string | null>(null)

  const openPicker = (fieldName?: string) => {
    pendingFieldRef.current = fieldName ?? null
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fieldName = pendingFieldRef.current ?? undefined
      addBodyFiles(Array.from(e.target.files), fieldName)
      pendingFieldRef.current = null
      e.target.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addBodyFiles(Array.from(e.dataTransfer.files))
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex shrink-0 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <Label className="text-xs font-medium text-muted-foreground">
              Form files ({bodyFiles.length})
            </Label>
            <p className="mt-0.5 text-[11px] text-muted-foreground/80">
              Mỗi file có field name riêng — cùng tên = nhiều file một field, khác tên = nhiều
              fields.
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => openPicker()}
            className="h-7 shrink-0 gap-1.5 text-xs"
          >
            <Upload className="size-3.5" />
            Add Files
          </Button>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex min-h-0 flex-1 flex-col gap-1.5 rounded-lg border p-2 transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'
          }`}
        >
          {bodyFiles.length === 0 ? (
            <div
              onClick={() => openPicker()}
              className="flex cursor-pointer flex-col items-center justify-center gap-1 py-8 text-center text-muted-foreground hover:text-foreground"
            >
              <FileIcon className="size-5 text-muted-foreground/60" />
              <p className="text-xs font-medium">Click or drag & drop files here</p>
              <p className="text-[11px] text-muted-foreground/70">
                Field name mặc định: <span className="font-mono">file</span>
              </p>
            </div>
          ) : (
            <div className="flex max-h-full flex-col gap-1 overflow-auto pr-1">
              <div className="sticky top-0 grid grid-cols-[minmax(7rem,9rem)_1fr_auto] gap-2 px-1 pb-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                <span>Field</span>
                <span>File</span>
                <span className="w-6" />
              </div>
              {bodyFiles.map((file) => (
                <div
                  key={file.id}
                  className="grid grid-cols-[minmax(7rem,9rem)_1fr_auto] items-center gap-2 rounded-md border border-border/60 bg-background px-2 py-1.5 text-xs shadow-2xs"
                >
                  <Input
                    value={file.fieldName}
                    onChange={(e) => updateBodyFile(file.id, { fieldName: e.target.value })}
                    placeholder="field"
                    spellCheck={false}
                    className="h-7 font-mono text-xs"
                    aria-label={`Field name for ${file.name}`}
                    title="multipart field name"
                  />
                  <div className="flex min-w-0 items-center gap-2">
                    <Paperclip className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate font-medium text-foreground" title={file.name}>
                      {file.name}
                    </span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeBodyFile(file.id)}
                    aria-label={`Remove ${file.name}`}
                    title="Remove file"
                    className="size-6 text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openPicker()}
                  className="h-7 text-xs text-muted-foreground"
                >
                  + Add more files
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openPicker(`field_${bodyFiles.length + 1}`)}
                  className="h-7 text-xs text-muted-foreground"
                >
                  + New field + file
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
