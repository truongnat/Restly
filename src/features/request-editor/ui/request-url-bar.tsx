import { SendHorizonal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { HttpMethod } from '@/entities/http'
import type { SendRequestState } from '@/features/request-editor/model/use-send-request'
import { HTTP_METHODS } from '@/shared/constants/http'
import { cn, methodColorLight } from '@/shared/lib/utils'
import { EnvAwareInput } from '@/shared/ui/env-aware-input'

interface RequestUrlBarProps {
  sendState: SendRequestState
}

export function RequestUrlBar({ sendState }: RequestUrlBarProps) {
  const {
    method,
    setMethod,
    url,
    setUrl,
    isPending,
    isSendDisabled,
    requestValidation,
    onSend,
    onCancel,
  } = sendState

  return (
    <div className="flex min-w-0 flex-1 items-start gap-2">
      <Select value={method} onValueChange={(v) => setMethod(v as HttpMethod)}>
        <SelectTrigger
          className={cn(
            'w-[96px] shrink-0 rounded-md border border-border/70 bg-card text-[12px] font-semibold shadow-none',
            methodColorLight[method],
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {HTTP_METHODS.map((m) => (
            <SelectItem
              key={m}
              value={m}
              className={cn('text-[12px] font-semibold', methodColorLight[m])}
            >
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="min-w-0 flex-1">
        <EnvAwareInput
          className="w-full rounded-md border-border/70 bg-card font-mono text-[12px] shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary/40"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/v1/users"
          aria-label="Request URL"
          aria-invalid={Boolean(requestValidation.urlError)}
          aria-describedby={requestValidation.urlError ? 'request-url-error' : undefined}
        />
        {requestValidation.urlError && (
          <p id="request-url-error" className="mt-1 text-xs font-medium text-destructive">
            {requestValidation.urlError}
          </p>
        )}
      </div>

      <Button
        onClick={isPending ? onCancel : onSend}
        disabled={!isPending && isSendDisabled}
        className="min-w-[80px] gap-1.5 rounded-md text-[13px] shadow-none"
        id="btn-send"
      >
        {isPending ? (
          <span className="flex items-center gap-1.5">
            <span className="size-[13px] animate-spin rounded-full border-2 border-current border-t-transparent" />
            Cancel
          </span>
        ) : (
          <>
            Send
            <SendHorizonal className="size-[13px]" />
          </>
        )}
      </Button>
    </div>
  )
}
