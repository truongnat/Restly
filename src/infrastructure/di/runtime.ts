import type { Container } from '@/infrastructure/di/container'
import { createAppContainer } from '@/infrastructure/di/create-app-container'
import type { AppToken, TokenMap } from '@/infrastructure/di/tokens'

/**
 * Module-level DI runtime — not React Context.
 * Boot once at app entry; tests call `setContainer` / `bootContainer` in setup.
 */
let active: Container | null = null

/** Composition-root bootstrap (call from `main.tsx` before render). */
export function bootContainer(container: Container = createAppContainer()): Container {
  active = container
  return active
}

export function getContainer(): Container {
  if (!active) {
    throw new Error('DI: container not booted. Call bootContainer() in main or test setup.')
  }
  return active
}

/** Replace the active container (tests / alternate compositions). */
export function setContainer(container: Container): void {
  active = container
}

export function resetContainer(): void {
  active = null
}

export function resolve<K extends AppToken>(token: K): TokenMap[K] {
  return getContainer().resolve(token)
}
