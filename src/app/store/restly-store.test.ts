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
})
