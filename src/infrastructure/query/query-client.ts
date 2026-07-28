import { QueryClient } from '@tanstack/react-query'

import { DEFAULT_QUERY_STALE_TIME_MS } from '@/shared/constants/http'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_QUERY_STALE_TIME_MS,
      retry: false,
    },
  },
})
