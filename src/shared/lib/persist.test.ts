import { beforeEach, describe, expect, it } from 'vitest'

import { applyTheme, loadPersistedState, PERSIST_KEY, savePersistedState } from './persist'

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

describe('persist helper', () => {
  beforeEach(() => {
    const mockStorage = createLocalStorageMock()
    globalThis.localStorage = mockStorage as unknown as Storage
    globalThis.window = {
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

  it('saves and loads state from localStorage', () => {
    const mockState = {
      theme: 'dark' as const,
      environmentId: 'env-test',
      generalToggles: { 'opt-0': false },
    }
    savePersistedState(mockState)
    expect(localStorage.getItem(PERSIST_KEY)).toContain('env-test')

    const loaded = loadPersistedState()
    expect(loaded?.theme).toBe('dark')
    expect(loaded?.environmentId).toBe('env-test')
    expect(loaded?.generalToggles?.['opt-0']).toBe(false)
  })

  it('returns null if key not in localStorage', () => {
    expect(loadPersistedState()).toBeNull()
  })

  it('applies dark and light theme classes to document element', () => {
    applyTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    applyTheme('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
