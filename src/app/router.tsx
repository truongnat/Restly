import { QueryClientProvider } from '@tanstack/react-query'
import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'

import { TooltipProvider } from '@/components/ui/tooltip'
import { queryClient } from '@/infrastructure/query/query-client'
import { AuthPage } from '@/pages/auth-page'
import { EnvironmentsPage } from '@/pages/environments-page'
import { HistoryPage } from '@/pages/history-page'
import { MocksPage } from '@/pages/mocks-page'
import { SettingsPage } from '@/pages/settings-page'
import { SsePage } from '@/pages/sse-page'
import { WebsocketPage } from '@/pages/websocket-page'
import { WelcomePage } from '@/pages/welcome-page'
import { WorkspacePage } from '@/pages/workspace-page'
import { ROUTES } from '@/shared/constants/app'

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>
        <div className="h-full min-h-0">
          <Outlet />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

const rootRoute = createRootRoute({
  component: RootLayout,
})

const welcomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.welcome,
  component: WelcomePage,
})

const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.workspace,
  component: WorkspacePage,
})

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.history,
  component: HistoryPage,
})

const environmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.environments,
  component: EnvironmentsPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.settings,
  component: SettingsPage,
})

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.auth,
  component: AuthPage,
})

const mocksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.mocks,
  component: MocksPage,
})

const websocketRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.websocket,
  component: WebsocketPage,
})

const sseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.sse,
  component: SsePage,
})

const routeTree = rootRoute.addChildren([
  welcomeRoute,
  workspaceRoute,
  historyRoute,
  environmentsRoute,
  settingsRoute,
  authRoute,
  mocksRoute,
  websocketRoute,
  sseRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
