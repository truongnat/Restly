import { useSendRequestMutation } from '@/features/request-editor/model/use-send-request'
import { RequestUrlBar } from '@/features/request-editor/ui/request-url-bar'
import { RequestWorkspace } from '@/features/request-editor/ui/request-workspace'
import { AppShell } from '@/features/shell/ui/app-shell'
import { ContentToolbar } from '@/features/shell/ui/content-toolbar'

export function WorkspacePage() {
  const sendState = useSendRequestMutation()

  return (
    <AppShell>
      <ContentToolbar showEnv start={<RequestUrlBar sendState={sendState} />} />
      <RequestWorkspace sendState={sendState} />
    </AppShell>
  )
}
