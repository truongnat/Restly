import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowRight, Clock, FileUp, Layers, Terminal } from 'lucide-react'
import { useRef } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { Button } from '@/components/ui/button'
import type { CollectionFolder } from '@/entities'
import { ROUTES } from '@/shared/constants/app'

const quickLinks = [
  {
    icon: Terminal,
    label: 'New request',
    description: 'Start from scratch',
    to: ROUTES.workspace,
  },
  {
    icon: Clock,
    label: 'Recent history',
    description: 'Pick up where you left off',
    to: ROUTES.history,
  },
  {
    icon: Layers,
    label: 'Environments',
    description: 'Manage variables and secrets',
    to: ROUTES.environments,
  },
] as const

/**
 * WelcomePage — shown at "/" before any request is selected.
 * Friendly developer greeting with import CTA and workspace entry.
 */
export function WelcomePage() {
  const navigate = useNavigate()
  const importCollection = useRestlyStore((s) => s.importCollection)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const content = JSON.parse(event.target?.result as string)
          const name = content.info?.name || content.name || file.name.replace('.json', '')
          const parsedColl: CollectionFolder = {
            id: `coll-imp-${Date.now()}`,
            name: name || 'Imported Collection',
            open: true,
            requests: Array.isArray(content.item)
              ? content.item.map(
                  (
                    item: {
                      name?: string
                      request?: { method?: string; url?: string | { raw?: string } }
                    },
                    idx: number,
                  ) => ({
                    id: `req-imp-${Date.now()}-${idx}`,
                    name: item.name || `Request ${idx + 1}`,
                    method: item.request?.method || 'GET',
                    url:
                      typeof item.request?.url === 'string'
                        ? item.request.url
                        : item.request?.url?.raw || 'https://api.restly.com/v1/resource',
                  }),
                )
              : [
                  {
                    id: `req-imp-${Date.now()}-1`,
                    name: 'GET /v1/products',
                    method: 'GET',
                    url: 'https://api.restly.com/v1/products',
                  },
                ],
          }
          importCollection(parsedColl)
          navigate({ to: ROUTES.workspace })
        } catch {
          importCollection()
          navigate({ to: ROUTES.workspace })
        }
      }
      reader.readAsText(file)
    } else {
      importCollection()
      navigate({ to: ROUTES.workspace })
    }
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center workspace-bg px-8 py-12">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
        aria-label="Import collection file picker"
      />

      <main className="flex w-full max-w-lg flex-col items-center text-center">
        {/* Brand mark */}
        <div className="mb-6 flex size-14 items-center justify-center rounded-[16px] bg-primary shadow-lg shadow-primary/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            className="size-7 fill-white"
            aria-hidden="true"
          >
            <path d="M240-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 43 5.5t38 15.5l74-74q-10-18-15.5-38T374-574q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 43T673-492l74 74q18-10 38-15.5t43-5.5q66 0 113 47t47 113q0 66-47 113t-113 47q-66 0-113-47t-47-113q0-23 5.5-43t15.5-38l-74-74q-18 10-38 15.5T534-420q-23 0-43-5.5T453-441l-74 74q10 18 15.5 38t5.5 43q0 66-47 113t-113 47Zm294-334q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29ZM240-200q33 0 56.5-23.5T320-280q0-33-23.5-56.5T240-360q-33 0-56.5 23.5T160-280q0 33 23.5 56.5T240-200Zm480 0q33 0 56.5-23.5T800-280q0-33-23.5-56.5T720-360q-33 0-56.5 23.5T640-280q0 33 23.5 56.5T720-200Z" />
          </svg>
        </div>

        <h1 className="mb-2 text-[22px] font-semibold tracking-[-0.02em] text-foreground">
          Good to have you back
        </h1>
        <p className="mb-8 max-w-[32ch] text-[14px] leading-relaxed text-muted-foreground">
          Restly is your calm API workspace. Pick up where you left off, or start a new request.
        </p>

        {/* Primary actions */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <Button asChild size="default" className="gap-2 shadow-none" id="btn-start">
            <Link to={ROUTES.workspace}>
              Open workspace
              <ArrowRight className="size-[14px]" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="default"
            onClick={handleImportClick}
            className="gap-2"
            id="btn-import"
          >
            <FileUp className="size-[14px]" />
            Import collection
          </Button>
        </div>

        {/* Quick links */}
        <div className="w-full divide-y divide-border/50 rounded-lg border border-border/60 bg-card">
          {quickLinks.map(({ icon: Icon, label, description, to }) => (
            <Link
              key={label}
              to={to}
              className="group flex items-center gap-3 px-4 py-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-muted/40"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted group-hover:bg-accent">
                <Icon className="size-[15px] text-muted-foreground group-hover:text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-foreground">{label}</p>
                <p className="body-sm text-muted-foreground">{description}</p>
              </div>
              <ArrowRight className="size-[13px] text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
