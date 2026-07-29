import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { resolveActiveEnvironment } from '@/application/use-cases/list-environments'
import type { HistoryDraftSnapshot, HttpMethod, RequestDraft } from '@/entities'
import type { RequestAuth } from '@/entities/request'
import type { HttpExchangeResult } from '@/entities/response'
import { runScript } from '@/features/request-editor/lib/script-sandbox'
import { createRequestRunCoordinator } from '@/features/request-editor/model/request-run-coordinator'
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

type RequestHistorySnapshot = {
  method: HttpMethod
  url: string
} & Required<HistoryDraftSnapshot>

type RequestExecutionSnapshot = {
  input: RequestDraft
  history: RequestHistorySnapshot
  preRequestScript: string
  testScript: string
  environmentGet: (key: string) => string | undefined
}

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
  if (auth.type === 'apikey') {
    return {
      ...auth,
      apiKey: auth.apiKey ? substituteEnv(auth.apiKey, vars) : auth.apiKey,
      apiKeyHeader: auth.apiKeyHeader ? substituteEnv(auth.apiKeyHeader, vars) : auth.apiKeyHeader,
    }
  }
  return auth
}

function captureRequestExecution(): RequestExecutionSnapshot {
  const state = useRestlyStore.getState()
  const activeEnvironment = resolveActiveEnvironment(state.environments, state.environmentId)
  const variables = (activeEnvironment?.variables ?? []).map((variable) => ({ ...variable }))
  const environmentGet = (key: string) =>
    variables.find((variable) => variable.enabled && variable.key === key)?.value

  const params = state.params.map((param) => ({ ...param }))
  const headers = state.headers.map((header) => ({ ...header }))
  const auth = { ...state.auth }

  return {
    input: {
      method: state.method,
      url: substituteEnv(state.url, variables),
      params: params.map((param) => ({
        ...param,
        key: substituteEnv(param.key, variables),
        value: substituteEnv(param.value, variables),
      })),
      headers: headers.map((header) => ({
        ...header,
        key: substituteEnv(header.key, variables),
        value: substituteEnv(header.value, variables),
      })),
      body: substituteEnv(state.body, variables),
      contentType: state.contentType,
      auth: substituteAuth(auth, variables),
      bodyFiles: state.bodyFiles.map(({ id, fieldName, name, size }) => ({
        id,
        fieldName: fieldName.trim() || 'file',
        name,
        size,
      })),
    },
    history: {
      method: state.method,
      url: state.url,
      params,
      headers,
      body: state.body,
      contentType: state.contentType,
      auth,
    },
    preRequestScript: state.preRequestScript,
    testScript: state.testScript,
    environmentGet,
  }
}

/** Runs one request while keeping response, history, and loading owned by the latest Send action. */
export function useSendRequestMutation() {
  const notifySent = useRestlyStore((s) => s.sendRequest)
  const addHistoryItem = useRestlyStore((s) => s.addHistoryItem)

  const [responseBody, setResponseBody] = useState(INITIAL_BODY)
  const [meta, setMeta] = useState(INITIAL_META)
  const [isPending, setIsPending] = useState(false)
  const runCoordinatorRef = useRef(createRequestRunCoordinator())
  const activeRunRef = useRef<{
    runId: number
    controller: AbortController
  } | null>(null)

  const mutation = useMutation({
    mutationFn: ({ input, signal }: { input: unknown; signal?: AbortSignal }) =>
      resolve(TOKENS.SendRequest)(input, signal),
  })

  const method = useRestlyStore((s) => s.method)
  const setMethod = useRestlyStore((s) => s.setMethod)
  const url = useRestlyStore((s) => s.url)
  const setUrl = useRestlyStore((s) => s.setUrl)
  const params = useRestlyStore((s) => s.params)
  const body = useRestlyStore((s) => s.body)
  const contentType = useRestlyStore((s) => s.contentType)

  const bodyValidation = validateBody(body, contentType)
  const isSendDisabled = isPending || !bodyValidation.isValid

  /**
   * [FLOW:REQUEST:CANCEL]
   *
   * 1. Abort transport work for the active run.
   * 2. Release ownership only if the same run is still latest.
   * 3. End loading without manufacturing a response or history row.
   *
   * [TRACE:REQUEST:IT0-39]
   */
  const onCancel = () => {
    const activeRun = activeRunRef.current
    if (!activeRun) return

    // [STEP:REQUEST:CANCEL:01]
    activeRun.controller.abort()

    // [STEP:REQUEST:CANCEL:02]
    if (runCoordinatorRef.current.cancel(activeRun.runId).accepted) {
      activeRunRef.current = null
      // [STEP:REQUEST:CANCEL:03]
      setIsPending(false)
    }
  }

  /**
   * [FLOW:REQUEST:SEND]
   *
   * 1. Capture an immutable request snapshot and allocate run ownership.
   * 2. Resolve the pre-request script for that snapshot.
   * 3. Execute transport with a run-scoped cancellation signal.
   * 4. Commit response, history, notification, and test script only for the owner.
   *
   * [ASYNC:REQUEST:SEND]
   * Completion order may differ from Send order; only the latest run may update UI state.
   *
   * [TRACE:REQUEST:IT0-39]
   */
  const onSend = () => {
    if (!bodyValidation.isValid) return

    // [STEP:REQUEST:SEND:01]
    const previousRun = activeRunRef.current
    if (previousRun) {
      previousRun.controller.abort()
      runCoordinatorRef.current.cancel(previousRun.runId)
    }

    const snapshot = captureRequestExecution()
    const controller = new AbortController()
    const runId = runCoordinatorRef.current.start()
    activeRunRef.current = { runId, controller }
    setIsPending(true)

    void (async () => {
      // [STEP:REQUEST:SEND:02]
      const pre = await runScript(snapshot.preRequestScript, {
        environment: { get: snapshot.environmentGet },
        request: { url: snapshot.input.url, method: snapshot.input.method },
        console,
      })
      if (pre.error) {
        if (runCoordinatorRef.current.fail(runId).accepted) {
          activeRunRef.current = null
          setIsPending(false)
          useRestlyStore.setState({ toast: `Pre-request: ${pre.error}` })
          window.setTimeout(() => {
            if (useRestlyStore.getState().toast?.startsWith('Pre-request')) {
              useRestlyStore.setState({ toast: null })
            }
          }, 3200)
        }
        return
      }

      if (!runCoordinatorRef.current.isLatest(runId)) return

      try {
        // [STEP:REQUEST:SEND:03]
        const data = await mutation.mutateAsync({
          input: snapshot.input,
          signal: controller.signal,
        })

        if (data.status === 0 && data.statusText === 'Cancelled') {
          if (runCoordinatorRef.current.cancel(runId).accepted) {
            activeRunRef.current = null
            setIsPending(false)
          }
          return
        }

        // [STEP:REQUEST:SEND:04]
        if (!runCoordinatorRef.current.succeed(runId).accepted) return

        activeRunRef.current = null
        setIsPending(false)
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
          ...snapshot.history,
          status: data.status,
          statusText: data.statusText,
          durationMs: data.durationMs,
        })

        void runScript(snapshot.testScript, {
          environment: { get: snapshot.environmentGet },
          request: { url: snapshot.input.url, method: snapshot.input.method },
          response: { code: data.status, body: data.body },
          console,
        }).then((test) => {
          if (test.error && runCoordinatorRef.current.isMostRecent(runId)) {
            useRestlyStore.setState({ toast: `Test script: ${test.error}` })
            window.setTimeout(() => {
              if (useRestlyStore.getState().toast?.startsWith('Test script')) {
                useRestlyStore.setState({ toast: null })
              }
            }, 3200)
          }
        })
      } catch {
        if (runCoordinatorRef.current.fail(runId).accepted) {
          activeRunRef.current = null
          setIsPending(false)
        }
      }
    })()
  }

  return {
    method,
    setMethod,
    url,
    setUrl,
    params,
    responseBody,
    meta,
    isPending,
    isSendDisabled,
    onSend,
    onCancel,
  }
}

export type SendRequestState = ReturnType<typeof useSendRequestMutation>
