import { FileIcon, Paperclip, Upload, X } from 'lucide-react'
import * as React from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { EnvAwareTextarea } from '@/shared/ui/env-aware-input'

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function MultipartFilesEditor({
  body,
  onBodyChange,
  placeholder,
}: {
  body: string
  onBodyChange: (val: string) => void
  placeholder?: string
}) {
  const bodyFiles = useRestlyStore((s) => s.bodyFiles)
  const addBodyFiles = useRestlyStore((s) => s.addBodyFiles)
  const removeBodyFile = useRestlyStore((s) => s.removeBodyFile)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addBodyFiles(Array.from(e.target.files))
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
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground">
            Form Files ({bodyFiles.length})
          </Label>
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
            onClick={() => fileInputRef.current?.click()}
            className="h-7 gap-1.5 text-xs"
          >
            <Upload className="size-3.5" />
            Add Files
          </Button>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col gap-1.5 rounded-lg border p-2 transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'
          }`}
        >
          {bodyFiles.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-1 py-3 text-center text-muted-foreground hover:text-foreground"
            >
              <FileIcon className="size-5 text-muted-foreground/60" />
              <p className="text-xs font-medium">Click or drag & drop files here to attach</p>
            </div>
          ) : (
            <div className="flex max-h-[140px] flex-col gap-1 overflow-auto pr-1">
              {bodyFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-border/60 bg-background px-2.5 py-1.5 text-xs shadow-2xs"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Paperclip className="size-3.5 shrink-0 text-muted-foreground" />
                    <span
                      className="max-w-[220px] truncate font-medium text-foreground"
                      title={file.name}
                    >
                      {file.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
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
            </div>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          Text / Form Data Boundary
        </Label>
        <EnvAwareTextarea
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          placeholder={placeholder || 'Enter form-data text parts...'}
          className="h-full min-h-0 flex-1 font-mono text-xs leading-relaxed"
        />
      </div>
    </div>
  )
}
