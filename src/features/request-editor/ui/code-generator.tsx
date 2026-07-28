import { Code2, Copy } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CODEGEN_LANGUAGES } from '@/features/request-editor/lib/codegen'
import { cn } from '@/shared/lib/utils'

export function CodeGeneratorButton({ className }: { className?: string }) {
  const method = useRestlyStore((s) => s.method)
  const url = useRestlyStore((s) => s.url)
  const headers = useRestlyStore((s) => s.headers)
  const params = useRestlyStore((s) => s.params)
  const body = useRestlyStore((s) => s.body)
  const contentType = useRestlyStore((s) => s.contentType)
  const auth = useRestlyStore((s) => s.auth)
  const copyText = useRestlyStore((s) => s.copyText)

  const [lang, setLang] = useState<(typeof CODEGEN_LANGUAGES)[number]['id']>('curl')

  const input = useMemo(
    () => ({ method, url, headers, params, body, contentType, auth }),
    [method, url, headers, params, body, contentType, auth],
  )

  const snippet = useMemo(() => {
    const gen = CODEGEN_LANGUAGES.find((l) => l.id === lang)?.generate
    return gen ? gen(input) : ''
  }, [input, lang])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn('h-7 gap-1.5 text-[12px] text-muted-foreground', className)}
        >
          <Code2 className="size-3.5" />
          Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl gap-3">
        <DialogHeader>
          <DialogTitle>Generate code</DialogTitle>
          <DialogDescription>
            Snippets from the current request (method, URL, headers, body, auth).
          </DialogDescription>
        </DialogHeader>
        <Tabs value={lang} onValueChange={(v) => setLang(v as typeof lang)}>
          <div className="flex items-center justify-between gap-2">
            <TabsList variant="default" className="h-8">
              {CODEGEN_LANGUAGES.map((l) => (
                <TabsTrigger key={l.id} value={l.id}>
                  {l.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-[12px]"
              onClick={() => copyText(snippet, 'Snippet copied')}
            >
              <Copy className="size-3" />
              Copy
            </Button>
          </div>
          {CODEGEN_LANGUAGES.map((l) => (
            <TabsContent key={l.id} value={l.id} className="mt-3">
              <pre className="max-h-[50vh] overflow-auto rounded-lg border border-border/60 bg-muted/30 p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                {l.id === lang ? snippet : l.generate(input)}
              </pre>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
