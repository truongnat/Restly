import { create } from 'zustand'

import type {
  CollectionFolder,
  Environment,
  EnvVar,
  HeaderRow,
  HistoryItem,
  HistoryDraftSnapshot,
  HttpMethod,
  NavId,
  ParamRow,
  RequestAuth,
  RequestItem,
  RequestTab,
  ResponseTab,
} from '@/entities'
import { ENV_COLOR_OPTIONS } from '@/entities/environment'
import { HISTORY_BODY_MAX_CHARS, HISTORY_MAX_ITEMS } from '@/entities/history'
import {
  mockAuth,
  mockBody,
  mockContentType,
  mockEnvironments,
  mockFolders,
  mockHeaders,
  mockHistory,
  mockParams,
} from '@/infrastructure/mock/fixtures'
import {
  applyTheme,
  loadPersistedState,
  savePersistedState,
  type ThemeMode,
} from '@/shared/lib/persist'

const initialPersisted = loadPersistedState()
const initialTheme: ThemeMode = initialPersisted?.theme ?? 'light'

function resolveInitialHistory(): HistoryItem[] {
  const persisted = initialPersisted?.history
  if (!persisted || persisted.length === 0) return mockHistory
  // Upgrade legacy rows that never stored a draft snapshot.
  const hasSnapshot = persisted.some(
    (h) => h.contentType != null || h.body != null || (h.params != null && h.params.length > 0),
  )
  return hasSnapshot ? persisted : mockHistory
}

function resolveInitialEnvironments(): Environment[] {
  const persisted = initialPersisted?.environments
  if (!persisted || persisted.length === 0) return mockEnvironments
  // Upgrade fixtures that still store bullet-glyph “secrets” (not substitutable).
  const hasBulletSecret = persisted.some((e) => e.variables.some((v) => /•/.test(v.value)))
  return hasBulletSecret ? mockEnvironments : persisted
}

// Always apply on boot so <html> matches store (avoids light shell + dark tokens mix).
applyTheme(initialTheme)

export type BodyFileItem = {
  id: string
  name: string
  size: number
  /** multipart form-data field name (`name="…"`) */
  fieldName: string
  file?: File
}

type UiState = {
  showWelcome: boolean
  activeNav: NavId
  activeRequestId: string
  requestTab: RequestTab
  responseTab: ResponseTab
  environmentId: string
  method: HttpMethod
  url: string
  params: ParamRow[]
  headers: HeaderRow[]
  body: string
  contentType: string
  bodyFiles: BodyFileItem[]
  auth: RequestAuth
  toast: string | null
  folders: CollectionFolder[]
  history: HistoryItem[]
  environments: Environment[]
  searchQuery: string
  theme: ThemeMode
  accentColor: string
  generalToggles: Record<string, boolean>
  setShowWelcome: (v: boolean) => void
  setActiveNav: (v: NavId) => void
  selectRequest: (id: string) => void
  setRequestTab: (v: RequestTab) => void
  setResponseTab: (v: ResponseTab) => void
  setEnvironmentId: (v: string) => void
  setMethod: (v: HttpMethod) => void
  setUrl: (v: string) => void
  setParams: (v: ParamRow[]) => void
  setHeaders: (v: HeaderRow[]) => void
  setBody: (v: string) => void
  setContentType: (v: string) => void
  addBodyFiles: (files: File[], fieldName?: string) => void
  removeBodyFile: (id: string) => void
  updateBodyFile: (id: string, patch: Partial<Pick<BodyFileItem, 'fieldName'>>) => void
  setBodyFiles: (files: BodyFileItem[]) => void
  setAuth: (v: RequestAuth) => void
  toggleFolder: (id: string) => void
  sendRequest: () => void
  clearToast: () => void
  setSearchQuery: (query: string) => void
  clearHistory: () => void
  removeHistoryItem: (id: string) => void
  addHistoryItem: (
    item: {
      method: HttpMethod
      url: string
      status: number
      statusText: string
      durationMs: number
    } & HistoryDraftSnapshot,
  ) => void
  reopenHistoryItem: (item: HistoryItem) => void
  createRequest: () => void
  createCollection: () => void
  importCollection: (collection?: CollectionFolder) => void
  createEnvironment: (name?: string) => void
  deleteEnvironment: (id: string) => void
  duplicateEnvironment: (id: string) => void
  updateEnvironmentName: (id: string, name: string) => void
  updateEnvironmentColor: (id: string, color: string) => void
  addVariable: (envId: string) => void
  updateVariable: (envId: string, varId: string, patch: Partial<EnvVar>) => void
  deleteVariable: (envId: string, varId: string) => void
  setTheme: (theme: ThemeMode) => void
  setAccentColor: (color: string) => void
  setGeneralToggle: (id: string, value: boolean) => void
}

export const useRestlyStore = create<UiState>((set, get) => ({
  showWelcome: true,
  activeNav: 'collections',
  activeRequestId: 'req-get-user',
  requestTab: 'params',
  responseTab: 'pretty',
  environmentId: initialPersisted?.environmentId ?? 'env-prod',
  method: 'GET',
  url: 'https://api.restly.com/v1/user',
  params: mockParams,
  headers: mockHeaders,
  body: mockBody,
  contentType: mockContentType,
  bodyFiles: (initialPersisted?.bodyFiles ?? []).map((f) => ({
    id: f.id,
    name: f.name,
    size: f.size,
    fieldName: f.fieldName?.trim() || 'file',
  })),
  auth: mockAuth,
  toast: null,
  folders: initialPersisted?.folders ?? mockFolders,
  history: resolveInitialHistory(),
  environments: resolveInitialEnvironments(),
  searchQuery: '',
  theme: initialTheme,
  accentColor: initialPersisted?.accentColor ?? 'emerald',
  generalToggles: initialPersisted?.generalToggles ?? {
    'opt-0': true,
    'opt-1': true,
    'opt-2': false,
    'opt-3': true,
    'opt-4': true,
  },

  setShowWelcome: (showWelcome) => set({ showWelcome }),
  setActiveNav: (activeNav) => set({ activeNav }),
  selectRequest: (id) => {
    const req = get()
      .folders.flatMap((f) => f.requests)
      .find((r) => r.id === id)
    if (!req) return
    set({
      activeRequestId: id,
      activeNav: 'collections',
      method: req.method,
      url: req.url,
    })
  },
  setRequestTab: (requestTab) => set({ requestTab }),
  setResponseTab: (responseTab) => set({ responseTab }),
  setEnvironmentId: (environmentId) => set({ environmentId }),
  setMethod: (method) => set({ method }),
  setUrl: (url) => set({ url }),
  setParams: (params) => set({ params }),
  setHeaders: (headers) => set({ headers }),
  setBody: (body) => set({ body }),
  setContentType: (contentType) => set({ contentType }),
  addBodyFiles: (newFiles, fieldName) => {
    const resolvedField = fieldName?.trim() || 'file'
    const items: BodyFileItem[] = newFiles.map((file) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: file.name,
      size: file.size,
      fieldName: resolvedField,
      file,
    }))
    set((s) => ({ bodyFiles: [...s.bodyFiles, ...items] }))
  },
  removeBodyFile: (id) => set((s) => ({ bodyFiles: s.bodyFiles.filter((f) => f.id !== id) })),
  updateBodyFile: (id, patch) =>
    set((s) => ({
      bodyFiles: s.bodyFiles.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    })),
  setBodyFiles: (bodyFiles) => set({ bodyFiles }),
  setAuth: (auth) => set({ auth }),
  toggleFolder: (id) =>
    set({
      folders: get().folders.map((f) => (f.id === id ? { ...f, open: !f.open } : f)),
    }),
  sendRequest: () => {
    set({ toast: 'Request sent successfully' })
    window.setTimeout(() => {
      if (get().toast === 'Request sent successfully') set({ toast: null })
    }, 2800)
  },
  clearToast: () => set({ toast: null }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  clearHistory: () => set({ history: [] }),
  removeHistoryItem: (id) => set((s) => ({ history: s.history.filter((h) => h.id !== id) })),
  addHistoryItem: (item) => {
    const rawBody = item.body ?? ''
    const body =
      rawBody.length > HISTORY_BODY_MAX_CHARS
        ? `${rawBody.slice(0, HISTORY_BODY_MAX_CHARS)}\n/* …truncated */`
        : rawBody

    const newItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      method: item.method,
      url: item.url,
      status: item.status,
      statusText: item.statusText,
      durationMs: item.durationMs,
      when: 'Just now',
      group: 'Today',
      params: item.params,
      headers: item.headers,
      body,
      contentType: item.contentType,
      auth: item.auth,
    }
    set({ history: [newItem, ...get().history].slice(0, HISTORY_MAX_ITEMS) })
  },
  reopenHistoryItem: (item) => {
    // Step 1: restore URL bar
    // Step 2: restore draft tabs when snapshot exists
    set({
      method: item.method,
      url: item.url,
      activeNav: 'collections',
      showWelcome: false,
      params: item.params ?? [],
      headers: item.headers ?? [],
      body: item.body ?? '',
      contentType: item.contentType ?? 'application/json',
      auth: item.auth ?? { type: 'none' },
      toast: 'Request restored successfully',
    })
    window.setTimeout(() => {
      if (get().toast === 'Request restored successfully') set({ toast: null })
    }, 2800)
  },
  createCollection: () => {
    const newFolder: CollectionFolder = {
      id: `coll-${Date.now()}`,
      name: 'New Collection',
      open: true,
      requests: [],
    }
    set({ folders: [...get().folders, newFolder] })
  },
  createRequest: () => {
    const { folders, activeRequestId } = get()
    const newReqId = `req-${Date.now()}`
    const newReq: RequestItem = {
      id: newReqId,
      name: 'Untitled Request',
      method: 'GET',
      url: 'https://',
    }

    let targetFolderId: string | null = null
    const activeFolder = folders.find((f) => f.requests.some((r) => r.id === activeRequestId))
    if (activeFolder) {
      targetFolderId = activeFolder.id
    } else {
      const openFolder = folders.find((f) => f.open)
      if (openFolder) {
        targetFolderId = openFolder.id
      } else if (folders.length > 0) {
        targetFolderId = folders[0].id
      }
    }

    let updatedFolders: CollectionFolder[]
    if (targetFolderId) {
      updatedFolders = folders.map((f) =>
        f.id === targetFolderId ? { ...f, open: true, requests: [...f.requests, newReq] } : f,
      )
    } else {
      const newFolder: CollectionFolder = {
        id: `coll-${Date.now()}`,
        name: 'New Collection',
        open: true,
        requests: [newReq],
      }
      updatedFolders = [newFolder]
    }

    set({
      folders: updatedFolders,
      activeRequestId: newReqId,
      activeNav: 'collections',
      method: 'GET',
      url: 'https://',
      params: [],
      headers: [],
      body: '',
      contentType: 'application/json',
      auth: { type: 'none' },
    })
  },
  importCollection: (collection) => {
    const newColl: CollectionFolder = collection || {
      id: `coll-imported-${Date.now()}`,
      name: 'Imported API Collection',
      open: true,
      requests: [
        {
          id: `req-imp-${Date.now()}-1`,
          name: 'GET /v1/products',
          method: 'GET',
          url: 'https://api.restly.com/v1/products',
        },
        {
          id: `req-imp-${Date.now()}-2`,
          name: 'POST /v1/orders',
          method: 'POST',
          url: 'https://api.restly.com/v1/orders',
        },
      ],
    }
    const updatedFolders = [newColl, ...get().folders]
    const firstReq = newColl.requests[0]
    set({
      folders: updatedFolders,
      toast: `Imported "${newColl.name}" successfully`,
      activeRequestId: firstReq ? firstReq.id : get().activeRequestId,
      method: firstReq ? firstReq.method : get().method,
      url: firstReq ? firstReq.url : get().url,
    })
    window.setTimeout(() => {
      if (get().toast?.startsWith('Imported')) set({ toast: null })
    }, 3500)
  },
  createEnvironment: (name) => {
    const randomColor = ENV_COLOR_OPTIONS[Math.floor(Math.random() * ENV_COLOR_OPTIONS.length)]
    const newEnv: Environment = {
      id: `env-${Date.now()}`,
      name: name?.trim() || 'New Environment',
      color: randomColor ?? 'bg-emerald-500',
      variables: [
        {
          id: `var-${Date.now()}-1`,
          enabled: true,
          key: 'API_KEY',
          value: 'mock_key_123',
          secret: true,
          description: 'Default API key',
        },
      ],
    }
    set({
      environments: [...get().environments, newEnv],
      environmentId: newEnv.id,
      toast: 'Environment created',
    })
    window.setTimeout(() => {
      if (get().toast === 'Environment created') set({ toast: null })
    }, 2800)
  },
  deleteEnvironment: (id) => {
    const nextEnvs = get().environments.filter((e) => e.id !== id)
    let nextEnvId = get().environmentId
    if (nextEnvId === id) {
      nextEnvId = nextEnvs[0]?.id ?? ''
    }
    set({
      environments: nextEnvs,
      environmentId: nextEnvId,
      toast: 'Environment deleted',
    })
    window.setTimeout(() => {
      if (get().toast === 'Environment deleted') set({ toast: null })
    }, 2800)
  },
  duplicateEnvironment: (id) => {
    const source = get().environments.find((e) => e.id === id)
    if (!source) return
    const stamp = Date.now()
    const clone: Environment = {
      id: `env-${stamp}`,
      name: `${source.name} Copy`,
      color: source.color,
      variables: source.variables.map((v, i) => ({
        ...v,
        id: `var-${stamp}-${i}`,
      })),
    }
    set({
      environments: [...get().environments, clone],
      environmentId: clone.id,
      toast: 'Environment duplicated',
    })
    window.setTimeout(() => {
      if (get().toast === 'Environment duplicated') set({ toast: null })
    }, 2800)
  },
  updateEnvironmentName: (id, name) => {
    set({
      environments: get().environments.map((e) => (e.id === id ? { ...e, name } : e)),
    })
  },
  updateEnvironmentColor: (id, color) => {
    set({
      environments: get().environments.map((e) => (e.id === id ? { ...e, color } : e)),
    })
  },
  addVariable: (envId) => {
    const newVar: EnvVar = {
      id: `var-${Date.now()}`,
      enabled: true,
      key: '',
      value: '',
      secret: false,
      description: '',
    }
    set({
      environments: get().environments.map((e) =>
        e.id === envId ? { ...e, variables: [...e.variables, newVar] } : e,
      ),
    })
  },
  updateVariable: (envId, varId, patch) => {
    set({
      environments: get().environments.map((e) =>
        e.id === envId
          ? {
              ...e,
              variables: e.variables.map((v) => (v.id === varId ? { ...v, ...patch } : v)),
            }
          : e,
      ),
    })
  },
  deleteVariable: (envId, varId) => {
    set({
      environments: get().environments.map((e) =>
        e.id === envId
          ? {
              ...e,
              variables: e.variables.filter((v) => v.id !== varId),
            }
          : e,
      ),
    })
  },
  setTheme: (theme) => {
    applyTheme(theme)
    set({ theme })
  },
  setAccentColor: (accentColor) => set({ accentColor }),
  setGeneralToggle: (id, value) =>
    set((s) => ({
      generalToggles: { ...s.generalToggles, [id]: value },
    })),
}))

if (typeof window !== 'undefined') {
  useRestlyStore.subscribe((state) => {
    savePersistedState({
      folders: state.folders,
      environments: state.environments,
      history: state.history,
      environmentId: state.environmentId,
      theme: state.theme,
      accentColor: state.accentColor,
      generalToggles: state.generalToggles,
      bodyFiles: state.bodyFiles.map(({ id, name, size, fieldName }) => ({
        id,
        name,
        size,
        fieldName,
      })),
    })
  })
}
