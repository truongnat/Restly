import { Check, Copy } from 'lucide-react'
import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import { copyToClipboard } from '@/shared/lib/clipboard'

interface CopyButtonProps {
  text: string
  label?: string
}

export function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    void copyToClipboard(text).then((ok) => {
      if (ok) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    })
  }, [text])

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      onClick={handleCopy}
      disabled={!text}
      title={copied ? 'Copied!' : label}
    >
      {copied ? (
        <Check className="size-[14px] text-emerald-600" />
      ) : (
        <Copy className="size-[14px]" />
      )}
    </Button>
  )
}
