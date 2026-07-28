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
        Sandbox scripts (5s timeout). Use <code className="text-[11px]">pm.environment.get</code>,{' '}
        <code className="text-[11px]">pm.request</code>, and after send{' '}
        <code className="text-[11px]">pm.response</code>.
      </p>
      <Tabs defaultValue="pre" className="flex min-h-0 flex-1 flex-col">
        <TabsList variant="default" className="h-8 w-fit">
          <TabsTrigger value="pre">Pre-request</TabsTrigger>
          <TabsTrigger value="test">Tests</TabsTrigger>
        </TabsList>
        <TabsContent value="pre" className="mt-3 flex min-h-0 flex-1 flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Runs before Send</Label>
          <Textarea
            value={preRequestScript}
            onChange={(e) => setPreRequestScript(e.target.value)}
            placeholder={`// console.log(pm.request.url)`}
            className="min-h-[200px] flex-1 font-mono text-[12px]"
            spellCheck={false}
          />
        </TabsContent>
        <TabsContent value="test" className="mt-3 flex min-h-0 flex-1 flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Runs after response</Label>
          <Textarea
            value={testScript}
            onChange={(e) => setTestScript(e.target.value)}
            placeholder={`// console.log(pm.response?.code)`}
            className="min-h-[200px] flex-1 font-mono text-[12px]"
            spellCheck={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
