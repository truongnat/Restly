import { beforeEach, describe, expect, it } from 'vitest'

import { useRestlyStore } from './restly-store'

function createLocalStorageMock() {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    length: 0,
    key: () => null,
  }
}

describe('useRestlyStore remaining mock cards actions', () => {
  beforeEach(() => {
    globalThis.localStorage = createLocalStorageMock() as unknown as Storage
    globalThis.window = {
      setTimeout: () => {},
      matchMedia: () => ({ matches: false }),
    } as unknown as Window & typeof globalThis
    const classList = new Set<string>()
    globalThis.document = {
      documentElement: {
        classList: {
          add: (c: string) => classList.add(c),
          remove: (c: string) => classList.delete(c),
          contains: (c: string) => classList.has(c),
        },
      },
    } as unknown as Document
  })

  it('handles environment CRUD and variable management (T-013)', () => {
    const store = useRestlyStore.getState()
    const initialCount = store.environments.length

    // Create environment
    store.createEnvironment('Staging Env')
    let state = useRestlyStore.getState()
    expect(state.environments.length).toBe(initialCount + 1)
    const newEnv = state.environments.find((e) => e.name === 'Staging Env')
    expect(newEnv).toBeDefined()
    expect(state.environmentId).toBe(newEnv!.id)

    // Update environment name
    store.updateEnvironmentName(newEnv!.id, 'Staging QA')
    state = useRestlyStore.getState()
    expect(state.environments.find((e) => e.id === newEnv!.id)?.name).toBe('Staging QA')

    // Add variable
    store.addVariable(newEnv!.id)
    state = useRestlyStore.getState()
    const envVars = state.environments.find((e) => e.id === newEnv!.id)!.variables
    const addedVar = envVars[envVars.length - 1]
    expect(addedVar).toBeDefined()

    // Update variable
    store.updateVariable(newEnv!.id, addedVar.id, {
      key: 'API_URL',
      value: 'https://qa.api.com',
      secret: true,
    })
    state = useRestlyStore.getState()
    const updatedVar = state.environments
      .find((e) => e.id === newEnv!.id)!
      .variables.find((v) => v.id === addedVar.id)
    expect(updatedVar?.key).toBe('API_URL')
    expect(updatedVar?.value).toBe('https://qa.api.com')
    expect(updatedVar?.secret).toBe(true)

    // Delete variable
    store.deleteVariable(newEnv!.id, addedVar.id)
    state = useRestlyStore.getState()
    const finalVars = state.environments.find((e) => e.id === newEnv!.id)!.variables
    expect(finalVars.some((v) => v.id === addedVar.id)).toBe(false)

    // Delete environment
    store.deleteEnvironment(newEnv!.id)
    state = useRestlyStore.getState()
    expect(state.environments.some((e) => e.id === newEnv!.id)).toBe(false)
  })

  it('duplicates environment and updates color', () => {
    const store = useRestlyStore.getState()
    const sourceId = store.environments[0]?.id
    expect(sourceId).toBeTruthy()
    const sourceVars = store.environments.find((e) => e.id === sourceId)!.variables.length
    const before = store.environments.length

    store.duplicateEnvironment(sourceId!)
    let state = useRestlyStore.getState()
    expect(state.environments.length).toBe(before + 1)
    const copy = state.environments.find((e) => e.name.endsWith(' Copy'))
    expect(copy).toBeTruthy()
    expect(copy!.variables.length).toBe(sourceVars)
    expect(state.environmentId).toBe(copy!.id)

    store.updateEnvironmentColor(copy!.id, 'bg-rose-500')
    state = useRestlyStore.getState()
    expect(state.environments.find((e) => e.id === copy!.id)?.color).toBe('bg-rose-500')
  })

  it('handles theme, accent, and general toggles (T-014)', () => {
    const store = useRestlyStore.getState()

    store.setTheme('light')
    expect(useRestlyStore.getState().theme).toBe('light')

    store.setAccentColor('violet')
    expect(useRestlyStore.getState().accentColor).toBe('violet')

    store.setGeneralToggle('opt-2', true)
    expect(useRestlyStore.getState().generalToggles['opt-2']).toBe(true)
  })

  it('handles collection import (T-015)', () => {
    const store = useRestlyStore.getState()
    const initialFoldersCount = store.folders.length

    store.importCollection()
    const state = useRestlyStore.getState()
    expect(state.folders.length).toBe(initialFoldersCount + 1)
    expect(state.folders[0].name).toBe('Imported API Collection')
    expect(state.toast).toContain('Imported')
  })

  it('handles bodyFiles state management', () => {
    const store = useRestlyStore.getState()
    const dummyFile = new File(['hello content'], 'test.txt', { type: 'text/plain' })

    store.addBodyFiles([dummyFile])
    let state = useRestlyStore.getState()
    expect(state.bodyFiles.length).toBe(1)
    expect(state.bodyFiles[0].name).toBe('test.txt')
    expect(state.bodyFiles[0].fieldName).toBe('file')

    const fileId = state.bodyFiles[0].id
    store.updateBodyFile(fileId, { fieldName: 'avatar' })
    state = useRestlyStore.getState()
    expect(state.bodyFiles[0].fieldName).toBe('avatar')

    store.addBodyFiles([new File(['x'], 'doc.pdf', { type: 'application/pdf' })], 'documents')
    state = useRestlyStore.getState()
    expect(state.bodyFiles.length).toBe(2)
    expect(state.bodyFiles[1].fieldName).toBe('documents')

    store.removeBodyFile(fileId)
    state = useRestlyStore.getState()
    expect(state.bodyFiles.length).toBe(1)
  })

  it('history snapshot, remove, reopen, and trim', () => {
    const store = useRestlyStore.getState()
    store.clearHistory()

    store.addHistoryItem({
      method: 'POST',
      url: 'https://api.example.com/echo',
      status: 200,
      statusText: 'OK',
      durationMs: 42,
      body: '{"ok":true}',
      contentType: 'application/json',
      params: [{ id: 'p1', enabled: true, key: 'q', value: '1', description: '' }],
      headers: [{ id: 'h1', enabled: true, key: 'Accept', value: 'application/json' }],
      auth: { type: 'bearer', bearerToken: 'tok' },
    })

    let state = useRestlyStore.getState()
    expect(state.history.length).toBe(1)
    expect(state.history[0].body).toBe('{"ok":true}')
    expect(state.history[0].auth?.type).toBe('bearer')

    const id = state.history[0].id
    store.reopenHistoryItem(state.history[0])
    state = useRestlyStore.getState()
    expect(state.method).toBe('POST')
    expect(state.url).toBe('https://api.example.com/echo')
    expect(state.body).toBe('{"ok":true}')
    expect(state.params[0]?.key).toBe('q')
    expect(state.headers[0]?.key).toBe('Accept')
    expect(state.auth.type).toBe('bearer')
    expect(state.toast).toBe('Request restored successfully')

    store.removeHistoryItem(id)
    state = useRestlyStore.getState()
    expect(state.history.length).toBe(0)

    for (let i = 0; i < 105; i++) {
      store.addHistoryItem({
        method: 'GET',
        url: `https://api.example.com/${i}`,
        status: 200,
        statusText: 'OK',
        durationMs: 1,
      })
    }
    state = useRestlyStore.getState()
    expect(state.history.length).toBe(100)
  })

  it('handles collection and request CRUD for context menus', () => {
    const store = useRestlyStore.getState()
    const folderId = store.folders[0]!.id
    const before = store.folders.find((f) => f.id === folderId)!.requests.length

    store.createRequestInCollection(folderId)
    let state = useRestlyStore.getState()
    const folder = state.folders.find((f) => f.id === folderId)!
    expect(folder.requests.length).toBe(before + 1)
    const created = folder.requests[folder.requests.length - 1]!
    expect(state.activeRequestId).toBe(created.id)

    store.renameRequest(created.id, 'Renamed Req')
    state = useRestlyStore.getState()
    expect(
      state.folders.find((f) => f.id === folderId)!.requests.find((r) => r.id === created.id)?.name,
    ).toBe('Renamed Req')

    store.duplicateRequest(created.id)
    state = useRestlyStore.getState()
    expect(state.folders.find((f) => f.id === folderId)!.requests.length).toBe(before + 2)
    expect(state.toast).toBe('Request duplicated')

    store.renameCollection(folderId, 'Renamed Folder')
    state = useRestlyStore.getState()
    expect(state.folders.find((f) => f.id === folderId)?.name).toBe('Renamed Folder')

    const dupId = state.folders
      .find((f) => f.id === folderId)!
      .requests.find((r) => r.name === 'Renamed Req Copy')!.id
    store.deleteRequest(dupId)
    state = useRestlyStore.getState()
    expect(state.folders.find((f) => f.id === folderId)!.requests.some((r) => r.id === dupId)).toBe(
      false,
    )

    store.createCollection()
    state = useRestlyStore.getState()
    const empty = state.folders.find((f) => f.name === 'New Collection')!
    expect(empty).toBeDefined()
    store.deleteCollection(empty.id)
    state = useRestlyStore.getState()
    expect(state.folders.some((f) => f.id === empty.id)).toBe(false)
  })

  it('handles auth profiles and mock servers CRUD (F08)', () => {
    const store = useRestlyStore.getState()
    const authCount = store.authProfiles.length
    const mockCount = store.mockServers.length

    store.createAuthProfile('CI Token')
    let state = useRestlyStore.getState()
    expect(state.authProfiles.length).toBe(authCount + 1)
    const profile = state.authProfiles.find((p) => p.name === 'CI Token')!
    expect(profile.auth.type).toBe('bearer')

    store.updateAuthProfile(profile.id, {
      auth: { type: 'basic', basicUsername: 'ci', basicPassword: 'secret' },
    })
    state = useRestlyStore.getState()
    expect(state.authProfiles.find((p) => p.id === profile.id)?.auth.type).toBe('basic')

    store.applyAuthProfile(profile.id)
    state = useRestlyStore.getState()
    expect(state.auth.type).toBe('basic')
    expect(state.auth.basicUsername).toBe('ci')
    expect(state.requestTab).toBe('auth')
    expect(state.authProfileId).toBe(profile.id)

    store.setAuthProfileType(profile.id, 'bearer')
    state = useRestlyStore.getState()
    expect(state.authProfiles.find((p) => p.id === profile.id)?.auth.type).toBe('bearer')

    store.duplicateAuthProfile(profile.id)
    state = useRestlyStore.getState()
    expect(state.authProfiles.some((p) => p.name === 'CI Token Copy')).toBe(true)

    store.createMockServer('Demo Mock')
    state = useRestlyStore.getState()
    expect(state.mockServers.length).toBe(mockCount + 1)
    const server = state.mockServers.find((s) => s.name === 'Demo Mock')!
    expect(server.running).toBe(false)
    expect(server.routes.length).toBe(1)

    store.toggleMockServerRunning(server.id)
    state = useRestlyStore.getState()
    expect(state.mockServers.find((s) => s.id === server.id)?.running).toBe(true)

    store.addMockRoute(server.id)
    state = useRestlyStore.getState()
    const routes = state.mockServers.find((s) => s.id === server.id)!.routes
    expect(routes.length).toBe(2)
    const last = routes[routes.length - 1]!
    store.updateMockRoute(server.id, last.id, {
      method: 'POST',
      path: 'echo',
      status: 999,
      delayMs: -5,
    })
    state = useRestlyStore.getState()
    const updated = state.mockServers
      .find((s) => s.id === server.id)!
      .routes.find((r) => r.id === last.id)!
    expect(updated.method).toBe('POST')
    expect(updated.path).toBe('/echo')
    expect(updated.status).toBe(599)
    expect(updated.delayMs).toBe(0)

    store.applyMockRouteToRequest(server.id, last.id)
    state = useRestlyStore.getState()
    expect(state.method).toBe('POST')
    expect(state.url).toContain('/echo')

    store.deleteMockRoute(server.id, last.id)
    state = useRestlyStore.getState()
    expect(
      state.mockServers.find((s) => s.id === server.id)!.routes.some((r) => r.id === last.id),
    ).toBe(false)

    store.deleteMockServer(server.id)
    state = useRestlyStore.getState()
    expect(state.mockServers.some((s) => s.id === server.id)).toBe(false)

    store.deleteAuthProfile(profile.id)
    state = useRestlyStore.getState()
    expect(state.authProfiles.some((p) => p.id === profile.id)).toBe(false)
  })
})
