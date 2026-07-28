import { useRestlyStore } from '@/app/store/restly-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatBody, validateBody } from '@/shared/lib/validate-body'
import { EnvAwareTextarea } from '@/shared/ui/env-aware-input'

const CONTENT_TYPES = [
  { label: 'JSON (application/json)', value: 'application/json' },
  { label: 'Text (text/plain)', value: 'text/plain' },
  { label: 'XML (application/xml)', value: 'application/xml' },
  { label: 'Form URL Encoded', value: 'application/x-www-form-urlencoded' },
  { label: 'Multipart Form', value: 'multipart/form-data' },
]

export function BodyEditor() {
  const body = useRestlyStore((s) => s.body)
  const contentType = useRestlyStore((s) => s.contentType)
  const setBody = useRestlyStore((s) => s.setBody)
  const setContentType = useRestlyStore((s) => s.setContentType)

  const validation = validateBody(body, contentType)

  const handleFormat = () => {
    const res = formatBody(body, contentType)
    setBody(res.formatted)
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Label
            htmlFor="content-type-select"
            className="text-xs font-medium text-muted-foreground"
          >
            Content-Type:
          </Label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger id="content-type-select" size="sm" className="w-[240px]">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_TYPES.map((ct) => (
                <SelectItem key={ct.value} value={ct.value}>
                  {ct.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={handleFormat} className="h-8 text-xs">
          Format
        </Button>
      </div>

      <div className="flex flex-col gap-1.5">
        <EnvAwareTextarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Enter request body here..."
          className="min-h-[220px] font-mono text-xs leading-relaxed"
        />
        {!validation.isValid && validation.error && (
          <p className="text-xs font-medium text-destructive">{validation.error}</p>
        )}
      </div>
    </div>
  )
}
