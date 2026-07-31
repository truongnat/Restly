import { create } from 'zustand'

import type {
  AuthProfile,
  CollectionFolder,
  Environment,
  EnvVar,
  HeaderRow,
  HistoryItem,
  HistoryDraftSnapshot,
  HttpMethod,
  MockRoute,
  MockServer,
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
  mockAuthProfiles,
  mockBody,
  mockContentType,
  mockEnvironments,
  mockFolders,
  mockHeaders,
  mockHistory,
  mockParams,
  mockServers as mockServerFixtures,
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

function flashToast(
  get: () => { toast: string | null },
  set: (partial: { toast: string | null }) => void,
  message: string,
  stillActive: (toast: string | null) => boolean = (t) => t === message,
) {
  set({ toast: message })
  window.setTimeout(() => {
    if (stillActive(get().toast)) set({ toast: null })
  }, 2800)
}

function authSkeleton(type: RequestAuth['type'], prev?: RequestAuth): RequestAuth {
  switch (type) {
    case 'bearer':
      return { type, bearerToken: prev?.bearerToken ?? '' }
    case 'basic':
      return {
        type,
        basicUsername: prev?.basicUsername ?? '',
        basicPassword: prev?.basicPassword ?? '',
      }
    case 'oauth':
      return {
        type,
        oauthClientId: prev?.oauthClientId ?? '',
        oauthClientSecret: prev?.oauthClientSecret ?? '',
        oauthAuthUrl: prev?.oauthAuthUrl ?? '',
        oauthTokenUrl: prev?.oauthTokenUrl ?? '',
      }
    case 'apikey':
      return {
        type,
        apiKey: prev?.apiKey ?? '',
        apiKeyHeader: prev?.apiKeyHeader ?? 'X-API-Key',
        apiKeyIn: prev?.apiKeyIn ?? 'header',
      }
    default:
      return { type: 'none' }
  }
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
  preRequestScript: string
  testScript: string
  toast: string | null
  folders: CollectionFolder[]
  history: HistoryItem[]
  environments: Environment[]
  authProfiles: AuthProfile[]
  authProfileId: string
  mockServers: MockServer[]
  mockServerId: string
  searchQuery: string
  theme: ThemeMode
  accentColor: string
  generalToggles: Record<string, boolean>
  autoUpdateEnabled: boolean
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
  setPreRequestScript: (v: string) => void
  setTestScript: (v: string) => void
  setAutoUpdateEnabled: (v: boolean) => void
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
      durationMs: number | null
    } & HistoryDraftSnapshot,
  ) => void
  reopenHistoryItem: (item: HistoryItem) => void
  createRequest: () => void
  createRequestInCollection: (folderId: string) => void
  createCollection: () => void
  renameCollection: (folderId: string, name: string) => void
  deleteCollection: (folderId: string) => void
  renameRequest: (requestId: string, name: string) => void
  duplicateRequest: (requestId: string) => void
  deleteRequest: (requestId: string) => void
  importCollection: (collection?: CollectionFolder) => void
  createEnvironment: (name?: string) => void
  deleteEnvironment: (id: string) => void
  duplicateEnvironment: (id: string) => void
  updateEnvironmentName: (id: string, name: string) => void
  updateEnvironmentColor: (id: string, color: string) => void
  addVariable: (envId: string) => void
  updateVariable: (envId: string, varId: string, patch: Partial<EnvVar>) => void
  deleteVariable: (envId: string, varId: string) => void
  setAuthProfileId: (id: string) => void
  createAuthProfile: (name?: string) => void
  deleteAuthProfile: (id: string) => void
  duplicateAuthProfile: (id: string) => void
  updateAuthProfile: (id: string, patch: Partial<Omit<AuthProfile, 'id'>>) => void
  applyAuthProfile: (id: string) => void
  setAuthProfileType: (id: string, type: RequestAuth['type']) => void
  setMockServerId: (id: string) => void
  createMockServer: (name?: string) => void
  deleteMockServer: (id: string) => void
  duplicateMockServer: (id: string) => void
  updateMockServer: (id: string, patch: Partial<Omit<MockServer, 'id' | 'routes'>>) => void
  toggleMockServerRunning: (id: string) => void
  addMockRoute: (serverId: string) => void
  updateMockRoute: (serverId: string, routeId: string, patch: Partial<MockRoute>) => void
  deleteMockRoute: (serverId: string, routeId: string) => void
  applyMockRouteToRequest: (serverId: string, routeId: string) => void
  copyText: (text: string, label?: string) => void
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
  environmentId: initialPersisted?.environmentId ?? 'env-local',
  method: 'GET',
  url: 'http://localhost:3000/api/users',
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
  authProfiles: initialPersisted?.authProfiles?.length
    ? initialPersisted.authProfiles
    : mockAuthProfiles,
  authProfileId: initialPersisted?.authProfileId ?? mockAuthProfiles[0]?.id ?? '',
  mockServers: initialPersisted?.mockServers?.length
    ? initialPersisted.mockServers
    : mockServerFixtures,
  mockServerId: initialPersisted?.mockServerId ?? mockServerFixtures[0]?.id ?? '',
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
  autoUpdateEnabled: initialPersisted?.autoUpdateEnabled ?? false,
  preRequestScript: initialPersisted?.preRequestScript ?? '',
  testScript: initialPersisted?.testScript ?? '',

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
  setPreRequestScript: (preRequestScript) => set({ preRequestScript }),
  setTestScript: (testScript) => set({ testScript }),
  setAutoUpdateEnabled: (autoUpdateEnabled) => set({ autoUpdateEnabled }),
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
  renameCollection: (folderId, name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    set({
      folders: get().folders.map((f) => (f.id === folderId ? { ...f, name: trimmed } : f)),
    })
  },
  deleteCollection: (folderId) => {
    const { folders, activeRequestId } = get()
    const folder = folders.find((f) => f.id === folderId)
    if (!folder) return
    const nextFolders = folders.filter((f) => f.id !== folderId)
    const activeWasInside = folder.requests.some((r) => r.id === activeRequestId)
    const fallback = nextFolders.flatMap((f) => f.requests)[0]
    set({
      folders: nextFolders,
      ...(activeWasInside
        ? {
            activeRequestId: fallback?.id ?? '',
            method: fallback?.method ?? get().method,
            url: fallback?.url ?? get().url,
          }
        : {}),
      toast: `Deleted “${folder.name}”`,
    })
    window.setTimeout(() => {
      if (get().toast?.startsWith('Deleted')) set({ toast: null })
    }, 2800)
  },
  createRequestInCollection: (folderId) => {
    const newReqId = `req-${Date.now()}`
    const newReq: RequestItem = {
      id: newReqId,
      name: 'Untitled Request',
      method: 'GET',
      url: 'https://',
    }
    set({
      folders: get().folders.map((f) =>
        f.id === folderId ? { ...f, open: true, requests: [...f.requests, newReq] } : f,
      ),
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
  renameRequest: (requestId, name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    set({
      folders: get().folders.map((f) => ({
        ...f,
        requests: f.requests.map((r) => (r.id === requestId ? { ...r, name: trimmed } : r)),
      })),
    })
  },
  duplicateRequest: (requestId) => {
    const { folders } = get()
    let clone: RequestItem | null = null
    let parentId: string | null = null
    for (const f of folders) {
      const found = f.requests.find((r) => r.id === requestId)
      if (found) {
        parentId = f.id
        clone = {
          ...found,
          id: `req-${Date.now()}`,
          name: `${found.name} Copy`,
        }
        break
      }
    }
    if (!clone || !parentId) return
    const cloned = clone
    set({
      folders: folders.map((f) =>
        f.id === parentId ? { ...f, open: true, requests: [...f.requests, cloned] } : f,
      ),
      activeRequestId: cloned.id,
      method: cloned.method,
      url: cloned.url,
      toast: 'Request duplicated',
    })
    window.setTimeout(() => {
      if (get().toast === 'Request duplicated') set({ toast: null })
    }, 2800)
  },
  deleteRequest: (requestId) => {
    const { folders, activeRequestId } = get()
    let removedName = 'Request'
    const nextFolders = folders.map((f) => {
      const hit = f.requests.find((r) => r.id === requestId)
      if (hit) removedName = hit.name
      return { ...f, requests: f.requests.filter((r) => r.id !== requestId) }
    })
    const fallback = nextFolders.flatMap((f) => f.requests)[0]
    set({
      folders: nextFolders,
      ...(activeRequestId === requestId
        ? {
            activeRequestId: fallback?.id ?? '',
            method: fallback?.method ?? 'GET',
            url: fallback?.url ?? 'https://',
          }
        : {}),
      toast: `Deleted “${removedName}”`,
    })
    window.setTimeout(() => {
      if (get().toast?.startsWith('Deleted')) set({ toast: null })
    }, 2800)
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
  setAuthProfileId: (id) => set({ authProfileId: id }),
  createAuthProfile: (name) => {
    const id = `auth-${Date.now()}`
    const profile: AuthProfile = {
      id,
      name: name?.trim() || 'New Auth Profile',
      description: '',
      auth: authSkeleton('bearer'),
    }
    set({
      authProfiles: [...get().authProfiles, profile],
      authProfileId: id,
    })
    flashToast(get, set, 'Auth profile created')
  },
  deleteAuthProfile: (id) => {
    const next = get().authProfiles.filter((p) => p.id !== id)
    const fallback = next[0]
    set({
      authProfiles: next,
      authProfileId: get().authProfileId === id ? (fallback?.id ?? '') : get().authProfileId,
    })
    flashToast(get, set, 'Auth profile deleted')
  },
  duplicateAuthProfile: (id) => {
    const source = get().authProfiles.find((p) => p.id === id)
    if (!source) return
    const clone: AuthProfile = {
      ...source,
      id: `auth-${Date.now()}`,
      name: `${source.name} Copy`,
      auth: { ...source.auth },
    }
    set({
      authProfiles: [...get().authProfiles, clone],
      authProfileId: clone.id,
    })
    flashToast(get, set, 'Auth profile duplicated')
  },
  updateAuthProfile: (id, patch) => {
    set({
      authProfiles: get().authProfiles.map((p) => {
        if (p.id !== id) return p
        const nextName = patch.name !== undefined ? patch.name : p.name
        return {
          ...p,
          ...patch,
          name: nextName,
          auth: patch.auth ? { ...p.auth, ...patch.auth } : p.auth,
        }
      }),
    })
  },
  setAuthProfileType: (id, type) => {
    set({
      authProfiles: get().authProfiles.map((p) =>
        p.id === id ? { ...p, auth: authSkeleton(type, p.auth) } : p,
      ),
    })
  },
  applyAuthProfile: (id) => {
    const profile = get().authProfiles.find((p) => p.id === id)
    if (!profile) return
    set({
      authProfileId: id,
      auth: { ...profile.auth },
      requestTab: 'auth',
    })
    flashToast(get, set, `Applied “${profile.name}” to request`, (t) =>
      Boolean(t?.startsWith('Applied')),
    )
  },
  setMockServerId: (id) => set({ mockServerId: id }),
  createMockServer: (name) => {
    const id = `mock-${Date.now()}`
    const server: MockServer = {
      id,
      name: name?.trim() || 'New Mock Server',
      baseUrl: `https://mock.restly.local/${id.slice(-4)}`,
      running: false,
      description: '',
      routes: [
        {
          id: `mr-${Date.now()}`,
          enabled: true,
          method: 'GET',
          path: '/',
          status: 200,
          delayMs: 0,
          responseBody: '{\n  "ok": true\n}',
        },
      ],
    }
    set({
      mockServers: [...get().mockServers, server],
      mockServerId: id,
    })
    flashToast(get, set, 'Mock server created')
  },
  deleteMockServer: (id) => {
    const next = get().mockServers.filter((s) => s.id !== id)
    const fallback = next[0]
    set({
      mockServers: next,
      mockServerId: get().mockServerId === id ? (fallback?.id ?? '') : get().mockServerId,
    })
    flashToast(get, set, 'Mock server deleted')
  },
  duplicateMockServer: (id) => {
    const source = get().mockServers.find((s) => s.id === id)
    if (!source) return
    const stamp = Date.now()
    const clone: MockServer = {
      ...source,
      id: `mock-${stamp}`,
      name: `${source.name} Copy`,
      running: false,
      routes: source.routes.map((r, i) => ({ ...r, id: `mr-${stamp}-${i}` })),
    }
    set({
      mockServers: [...get().mockServers, clone],
      mockServerId: clone.id,
    })
    flashToast(get, set, 'Mock server duplicated')
  },
  updateMockServer: (id, patch) => {
    set({
      mockServers: get().mockServers.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    })
  },
  toggleMockServerRunning: (id) => {
    const server = get().mockServers.find((s) => s.id === id)
    if (!server) return
    const running = !server.running
    set({
      mockServers: get().mockServers.map((s) => (s.id === id ? { ...s, running } : s)),
    })
    flashToast(
      get,
      set,
      running ? `“${server.name}” is running` : `“${server.name}” stopped`,
      (t) => Boolean(t?.includes('running') || t?.includes('stopped')),
    )
  },
  addMockRoute: (serverId) => {
    const route: MockRoute = {
      id: `mr-${Date.now()}`,
      enabled: true,
      method: 'GET',
      path: '/new',
      status: 200,
      delayMs: 0,
      responseBody: '{\n  "ok": true\n}',
    }
    set({
      mockServers: get().mockServers.map((s) =>
        s.id === serverId ? { ...s, routes: [...s.routes, route] } : s,
      ),
    })
  },
  updateMockRoute: (serverId, routeId, patch) => {
    const cleaned: Partial<MockRoute> = { ...patch }
    if (typeof cleaned.status === 'number') {
      cleaned.status = Math.min(599, Math.max(100, Math.round(cleaned.status) || 200))
    }
    if (typeof cleaned.delayMs === 'number') {
      cleaned.delayMs = Math.max(0, Math.round(cleaned.delayMs) || 0)
    }
    if (
      typeof cleaned.path === 'string' &&
      cleaned.path.length > 0 &&
      !cleaned.path.startsWith('/')
    ) {
      cleaned.path = `/${cleaned.path}`
    }
    set({
      mockServers: get().mockServers.map((s) =>
        s.id === serverId
          ? {
              ...s,
              routes: s.routes.map((r) => (r.id === routeId ? { ...r, ...cleaned } : r)),
            }
          : s,
      ),
    })
  },
  deleteMockRoute: (serverId, routeId) => {
    set({
      mockServers: get().mockServers.map((s) =>
        s.id === serverId ? { ...s, routes: s.routes.filter((r) => r.id !== routeId) } : s,
      ),
    })
  },
  applyMockRouteToRequest: (serverId, routeId) => {
    const server = get().mockServers.find((s) => s.id === serverId)
    const route = server?.routes.find((r) => r.id === routeId)
    if (!server || !route) return
    const base = server.baseUrl.replace(/\/$/, '')
    const path = route.path.startsWith('/') ? route.path : `/${route.path}`
    set({
      method: route.method,
      url: `${base}${path}`,
      requestTab: 'params',
      activeNav: 'collections',
    })
    flashToast(get, set, `Opened ${route.method} ${path} in request`, (t) =>
      Boolean(t?.startsWith('Opened')),
    )
  },
  copyText: (text, label = 'Copied') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(text).then(
        () => flashToast(get, set, label),
        () => flashToast(get, set, 'Copy failed'),
      )
      return
    }
    flashToast(get, set, 'Copy unavailable')
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
      authProfiles: state.authProfiles,
      authProfileId: state.authProfileId,
      mockServers: state.mockServers,
      mockServerId: state.mockServerId,
      autoUpdateEnabled: state.autoUpdateEnabled,
      preRequestScript: state.preRequestScript,
      testScript: state.testScript,
    })
  })
}
