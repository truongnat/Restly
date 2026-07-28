import type { AppToken, TokenMap } from '@/infrastructure/di/tokens'

/**
 * Tiny typed DI container — composition root registers, features resolve.
 * No third-party IoC lib; enough for ports/adapters + use-cases.
 */
export class Container {
  private readonly bindings = new Map<string, unknown>()

  register<K extends AppToken>(token: K, implementation: TokenMap[K]): this {
    this.bindings.set(token, implementation)
    return this
  }

  resolve<K extends AppToken>(token: K): TokenMap[K] {
    const value = this.bindings.get(token)
    if (value === undefined) {
      throw new Error(`DI: no binding for ${token}`)
    }
    return value as TokenMap[K]
  }

  has(token: AppToken): boolean {
    return this.bindings.has(token)
  }
}
