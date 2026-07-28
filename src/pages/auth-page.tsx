import { KeyRound } from 'lucide-react'

import { AppShell } from '@/features/shell/ui/app-shell'
import { ContentToolbar } from '@/features/shell/ui/content-toolbar'

export function AuthPage() {
  return (
    <AppShell>
      <ContentToolbar showEnv={false} />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent">
          <KeyRound className="size-7 text-primary" />
        </div>
        <h1 className="text-xl font-semibold">Authentication</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Manage OAuth 2.0, API keys, and other auth providers. Coming in a future release.
        </p>
      </main>
    </AppShell>
  )
}
