import { useRestlyStore } from '@/app/store/restly-store'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

export function ScriptsEditor() {
  const preRequestScript = useRestlyStore((s) => s.preRequestScript)
  const testScript = useRestlyStore((s) => s.testScript)
  const setPreRequestScript = useRestlyStore((s) => s.setPreRequestScript)
  const setTestScript = useRestlyStore((s) => s.setTestScript)

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
      <p className="body-sm text-muted-foreground">
        Sandbox scripts (5s timeout). Use <code className="text-[11px]">rl.environment.get</code>,{' '}
        <code className="text-[11px]">rl.request</code>, and after send{' '}
        <code className="text-[11px]">rl.response</code>. Output appears in the console below.
      </p>
      <Tabs defaultValue="pre" className="flex min-h-0 flex-1 flex-col">
        <TabsList variant="default" className="h-8 w-fit">
          <TabsTrigger value="pre">Pre-request</TabsTrigger>
          <TabsTrigger value="test">Tests</TabsTrigger>
          <TabsTrigger value="console">Console</TabsTrigger>
        </TabsList>
        <TabsContent value="pre" className="mt-3 flex min-h-0 flex-1 flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Runs before Send</Label>
          <Textarea
            value={preRequestScript}
            onChange={(e) => setPreRequestScript(e.target.value)}
            placeholder={`// Example:\n// const token = rl.environment.get('api_key')\n// rl.request.headers.add('X-Custom', token)\n// console.log('Pre-request executed')`}
            className="min-h-[200px] flex-1 font-mono text-[12px]"
            spellCheck={false}
          />
        </TabsContent>
        <TabsContent value="test" className="mt-3 flex min-h-0 flex-1 flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Runs after response</Label>
          <Textarea
            value={testScript}
            onChange={(e) => setTestScript(e.target.value)}
            placeholder={`// Example:\n// console.log('Status:', rl.response?.code)\n// console.log('Body:', rl.response?.json())\n// rl.test('Status is 200', () => rl.response.code === 200)`}
            className="min-h-[200px] flex-1 font-mono text-[12px]"
            spellCheck={false}
          />
        </TabsContent>
        <TabsContent value="console" className="mt-3 flex min-h-0 flex-1 flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Script output (read-only)</Label>
          <div className="min-h-[200px] flex-1 overflow-auto rounded-md border border-border/60 bg-muted/30 p-3 font-mono text-[12px] text-muted-foreground">
            <p className="italic">
              Console output will appear here after running a request with scripts.
            </p>
            <p className="mt-2 text-muted-foreground/60">
              Tip: Use <code>console.log()</code> in your scripts to see output here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
