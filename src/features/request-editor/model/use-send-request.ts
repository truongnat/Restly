import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { resolveActiveEnvironment } from '@/application/use-cases/list-environments'
import type { RequestAuth } from '@/entities/request'
import type { HttpExchangeResult } from '@/entities/response'
import { resolve, TOKENS } from '@/infrastructure/di'
import { substituteEnv, type EnvVarSubstituteItem } from '@/shared/lib/substitute-env'
import { validateBody } from '@/shared/lib/validate-body'

const INITIAL_META: Omit<HttpExchangeResult, 'body'> = {
  status: 0,
  statusText: '',
  durationMs: 0,
  size: '',
}

const INITIAL_BODY = ''

function substituteAuth(auth: RequestAuth, vars: EnvVarSubstituteItem[]): RequestAuth {
  if (auth.type === 'bearer') {
    return {
      ...auth,
      bearerToken: auth.bearerToken ? substituteEnv(auth.bearerToken, vars) : auth.bearerToken,
    }
  }
  if (auth.type === 'basic') {
    return {
      ...auth,
      basicUsername: auth.basicUsername
        ? substituteEnv(auth.basicUsername, vars)
        : auth.basicUsername,
      basicPassword: auth.basicPassword
        ? substituteEnv(auth.basicPassword, vars)
        : auth.basicPassword,
    }
  }
  if (auth.type === 'oauth') {
    return {
      ...auth,
      oauthClientId: auth.oauthClientId
        ? substituteEnv(auth.oauthClientId, vars)
        : auth.oauthClientId,
      oauthClientSecret: auth.oauthClientSecret
        ? substituteEnv(auth.oauthClientSecret, vars)
        : auth.oauthClientSecret,
      oauthAuthUrl: auth.oauthAuthUrl ? substituteEnv(auth.oauthAuthUrl, vars) : auth.oauthAuthUrl,
      oauthTokenUrl: auth.oauthTokenUrl
        ? substituteEnv(auth.oauthTokenUrl, vars)
        : auth.oauthTokenUrl,
    }
  }
  return auth
}

export function useSendRequestMutation() {
  const notifySent = useRestlyStore((s) => s.sendRequest)
  const addHistoryItem = useRestlyStore((s) => s.addHistoryItem)

  const [responseBody, setResponseBody] = useState(INITIAL_BODY)
  const [meta, setMeta] = useState(INITIAL_META)

  const mutation = useMutation({
    mutationFn: (input: unknown) => resolve(TOKENS.SendRequest)(input),
    onSuccess: (data) => {
      setResponseBody(data.body)
      setMeta({
        status: data.status,
        statusText: data.statusText,
        durationMs: data.durationMs,
        size: data.size,
        headers: data.headers,
      })
      notifySent()
      addHistoryItem({
        method: useRestlyStore.getState().method,
        url: useRestlyStore.getState().url,
        status: data.status,
        statusText: data.statusText,
        durationMs: data.durationMs,
        params: useRestlyStore.getState().params,
        headers: useRestlyStore.getState().headers,
        body: useRestlyStore.getState().body,
        contentType: useRestlyStore.getState().contentType,
        auth: useRestlyStore.getState().auth,
      })
    },
  })

  const method = useRestlyStore((s) => s.method)
  const setMethod = useRestlyStore((s) => s.setMethod)
  const url = useRestlyStore((s) => s.url)
  const setUrl = useRestlyStore((s) => s.setUrl)
  const params = useRestlyStore((s) => s.params)
  const headers = useRestlyStore((s) => s.headers)
  const body = useRestlyStore((s) => s.body)
  const contentType = useRestlyStore((s) => s.contentType)
  const bodyFiles = useRestlyStore((s) => s.bodyFiles)
  const auth = useRestlyStore((s) => s.auth)
  const environmentId = useRestlyStore((s) => s.environmentId)
  const environments = useRestlyStore((s) => s.environments)

  const bodyValidation = validateBody(body, contentType)
  const isSendDisabled = mutation.isPending || !bodyValidation.isValid

  const onSend = () => {
    if (!bodyValidation.isValid) return

    const activeEnv = resolveActiveEnvironment(environments, environmentId)
    const vars = activeEnv?.variables ?? []
    const resolvedUrl = substituteEnv(url, vars)
    const resolvedBody = substituteEnv(body, vars)
    const resolvedParams = params.map((p) => ({
      ...p,
      key: substituteEnv(p.key, vars),
      value: substituteEnv(p.value, vars),
    }))
    const resolvedHeaders = headers.map((h) => ({
      ...h,
      key: substituteEnv(h.key, vars),
      value: substituteEnv(h.value, vars),
    }))
    const resolvedAuth = substituteAuth(auth, vars)

    mutation.mutate({
      method,
      url: resolvedUrl,
      params: resolvedParams,
      headers: resolvedHeaders,
      body: resolvedBody,
      contentType,
      auth: resolvedAuth,
      bodyFiles: bodyFiles.map(({ id, fieldName, name, size }) => ({
        id,
        fieldName: fieldName.trim() || 'file',
        name,
        size,
      })),
    })
  }

  return {
    method,
    setMethod,
    url,
    setUrl,
    params,
    responseBody,
    meta,
    isPending: mutation.isPending,
    isSendDisabled,
    onSend,
  }
}

export type SendRequestState = ReturnType<typeof useSendRequestMutation>
