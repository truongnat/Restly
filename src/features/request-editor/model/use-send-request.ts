import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { resolveActiveEnvironment } from '@/application/use-cases/list-environments'
import type { HttpExchangeResult } from '@/entities/response'
import { resolve, TOKENS } from '@/infrastructure/di'
import { substituteEnv } from '@/shared/lib/substitute-env'

const INITIAL_META: Omit<HttpExchangeResult, 'body'> = {
  status: 0,
  statusText: '',
  durationMs: 0,
  size: '',
}

const INITIAL_BODY = ''

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
  const auth = useRestlyStore((s) => s.auth)
  const environmentId = useRestlyStore((s) => s.environmentId)
  const environments = useRestlyStore((s) => s.environments)

  const onSend = () => {
    const activeEnv = resolveActiveEnvironment(environments, environmentId)
    const vars = activeEnv?.variables ?? []
    const resolvedUrl = substituteEnv(url, vars)
    const resolvedBody = substituteEnv(body, vars)

    mutation.mutate({
      method,
      url: resolvedUrl,
      params,
      headers,
      body: resolvedBody,
      contentType,
      auth,
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
    onSend,
  }
}

export type SendRequestState = ReturnType<typeof useSendRequestMutation>
