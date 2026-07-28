import { useEffect } from 'react'
import { toast as sonnerToast } from 'sonner'

import { useRestlyStore } from '@/app/store/restly-store'
import { Toaster } from '@/components/ui/sonner'

export function Toast() {
  const toastMessage = useRestlyStore((s) => s.toast)

  useEffect(() => {
    if (toastMessage) {
      sonnerToast.success(toastMessage)
    }
  }, [toastMessage])

  return <Toaster position="bottom-center" />
}
