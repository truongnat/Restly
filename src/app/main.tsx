import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { router } from '@/app/router'
import { bootContainer } from '@/infrastructure/di'

import '@/shared/styles/index.css'

// DI boots outside React — available to hooks, non-UI code, and tests via setContainer.
bootContainer()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
