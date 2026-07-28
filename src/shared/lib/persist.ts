import type { CollectionFolder, Environment, HistoryItem } from '@/entities'

export const PERSIST_KEY = 'restly.mock.v1'

export type ThemeMode = 'system' | 'light' | 'dark'

export type PersistedState = {
  folders?: CollectionFolder[]
  environments?: Environment[]
  history?: HistoryItem[]
  environmentId?: string
  theme?: ThemeMode
  accentColor?: string
  generalToggles?: Record<string, boolean>
}

export function loadPersistedState(): PersistedState | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedState
  } catch (err) {
    console.warn('Failed to load persisted state:', err)
    return null
  }
}

export function savePersistedState(state: PersistedState): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(PERSIST_KEY, JSON.stringify(state))
  } catch (err) {
    console.warn('Failed to save persisted state:', err)
  }
}

export function applyTheme(theme: ThemeMode): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  } else {
    const prefersDark =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }
}
