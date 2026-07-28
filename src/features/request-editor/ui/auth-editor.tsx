import { useRestlyStore } from '@/app/store/restly-store'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { RequestAuth, RequestAuthType } from '@/entities/request'
import { EnvAwareInput } from '@/shared/ui/env-aware-input'

export function AuthEditor() {
  const auth = useRestlyStore((s) => s.auth)
  const setAuth = useRestlyStore((s) => s.setAuth)

  const handleTypeChange = (type: RequestAuthType) => {
    setAuth({
      ...auth,
      type,
    })
  }

  const handleFieldChange = (field: keyof Omit<RequestAuth, 'type'>, value: string) => {
    setAuth({
      ...auth,
      [field]: value,
    })
  }

  return (
    <div className="flex max-w-lg flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <Label
          htmlFor="auth-type-select"
          className="w-28 shrink-0 text-xs font-medium text-muted-foreground"
        >
          Auth Type:
        </Label>
        <Select value={auth.type} onValueChange={(v) => handleTypeChange(v as RequestAuthType)}>
          <SelectTrigger id="auth-type-select" size="sm" className="w-[200px]">
            <SelectValue placeholder="Select Auth Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Auth</SelectItem>
            <SelectItem value="bearer">Bearer Token</SelectItem>
            <SelectItem value="basic">Basic Auth</SelectItem>
            <SelectItem value="oauth">OAuth 2.0 (Mock)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {auth.type === 'none' && (
        <div className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
          This request does not use any authorization headers or credentials.
        </div>
      )}

      {auth.type === 'bearer' && (
        <div className="flex flex-col gap-3 rounded-md border border-border/60 p-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bearer-token" className="text-xs">
              Token
            </Label>
            <EnvAwareInput
              id="bearer-token"
              value={auth.bearerToken ?? ''}
              onChange={(e) => handleFieldChange('bearerToken', e.target.value)}
              placeholder="e.g. eyJhbGciOi..."
              className="font-mono text-xs"
            />
          </div>
        </div>
      )}

      {auth.type === 'basic' && (
        <div className="flex flex-col gap-3 rounded-md border border-border/60 p-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="basic-username" className="text-xs">
              Username
            </Label>
            <EnvAwareInput
              id="basic-username"
              value={auth.basicUsername ?? ''}
              onChange={(e) => handleFieldChange('basicUsername', e.target.value)}
              placeholder="Username"
              className="text-xs"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="basic-password" className="text-xs">
              Password
            </Label>
            <EnvAwareInput
              id="basic-password"
              type="password"
              value={auth.basicPassword ?? ''}
              onChange={(e) => handleFieldChange('basicPassword', e.target.value)}
              placeholder="Password"
              className="text-xs"
            />
          </div>
        </div>
      )}

      {auth.type === 'oauth' && (
        <div className="flex flex-col gap-3 rounded-md border border-border/60 p-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="oauth-client-id" className="text-xs">
              Client ID
            </Label>
            <EnvAwareInput
              id="oauth-client-id"
              value={auth.oauthClientId ?? ''}
              onChange={(e) => handleFieldChange('oauthClientId', e.target.value)}
              placeholder="client_id_123"
              className="font-mono text-xs"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="oauth-client-secret" className="text-xs">
              Client Secret
            </Label>
            <EnvAwareInput
              id="oauth-client-secret"
              type="password"
              value={auth.oauthClientSecret ?? ''}
              onChange={(e) => handleFieldChange('oauthClientSecret', e.target.value)}
              placeholder="••••••••"
              className="font-mono text-xs"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="oauth-auth-url" className="text-xs">
              Auth URL
            </Label>
            <EnvAwareInput
              id="oauth-auth-url"
              value={auth.oauthAuthUrl ?? ''}
              onChange={(e) => handleFieldChange('oauthAuthUrl', e.target.value)}
              placeholder="https://auth.example.com/oauth/authorize"
              className="font-mono text-xs"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="oauth-token-url" className="text-xs">
              Access Token URL
            </Label>
            <EnvAwareInput
              id="oauth-token-url"
              value={auth.oauthTokenUrl ?? ''}
              onChange={(e) => handleFieldChange('oauthTokenUrl', e.target.value)}
              placeholder="https://auth.example.com/oauth/token"
              className="font-mono text-xs"
            />
          </div>
        </div>
      )}
    </div>
  )
}
