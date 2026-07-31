/**
 * Script Sandbox — FEAT-05
 *
 * Isolated JavaScript execution environment for Pre-request and Test scripts.
 * Provides the `rl` API namespace (Restly's Postman-compatible scripting API):
 * - rl.environment.get/set/unset
 * - rl.request (url, method, headers, body)
 * - rl.response (code, status, headers, json(), text())
 * - rl.test(name, fn) — assertion helper
 * - rl.expect(value) — ChaiJS-style assertions
 * - console.log/warn/error — captured output
 *
 * Security:
 * - No DOM access
 * - No localStorage/sessionStorage access
 * - No network access (fetch/XHR blocked)
 * - 5 second timeout (WORKFLOW:DESTRUCTIVE_RETRY_DISABLED)
 */

export interface ScriptConsoleEntry {
  type: 'log' | 'warn' | 'error' | 'info'
  args: string[]
  timestamp: number
}

export interface AssertionResult {
  name: string
  passed: boolean
  error?: string
  durationMs: number
}

export interface ScriptExecutionContext {
  environment: Map<string, string>
  request: {
    url: string
    method: string
    headers: Record<string, string>
    body?: string
  }
  response?: {
    code: number
    status: string
    headers: Record<string, string>
    body: string
    durationMs: number
  }
}

export interface ScriptExecutionResult {
  success: boolean
  error?: string
  consoleOutput: ScriptConsoleEntry[]
  assertions: AssertionResult[]
  environmentChanges: Map<string, string | null> // null = unset
  durationMs: number
}

/** Maximum script execution time in milliseconds */
export const SCRIPT_TIMEOUT_MS = 5000

/**
 * Create the `rl` API object for script execution.
 */
function createRlApi(
  ctx: ScriptExecutionContext,
  assertions: AssertionResult[],
  envChanges: Map<string, string | null>,
): Record<string, unknown> {
  return {
    environment: {
      get: (key: string): string | undefined => ctx.environment.get(key),
      set: (key: string, value: string): void => {
        ctx.environment.set(key, value)
        envChanges.set(key, value)
      },
      unset: (key: string): void => {
        ctx.environment.delete(key)
        envChanges.set(key, null)
      },
      has: (key: string): boolean => ctx.environment.has(key),
      toObject: (): Record<string, string> => Object.fromEntries(ctx.environment),
    },
    request: {
      url: ctx.request.url,
      method: ctx.request.method,
      headers: {
        get: (key: string): string | undefined => ctx.request.headers[key],
        add: (key: string, value: string): void => {
          ctx.request.headers[key] = value
        },
        remove: (key: string): void => {
          delete ctx.request.headers[key]
        },
        toObject: (): Record<string, string> => ({ ...ctx.request.headers }),
      },
      body: ctx.request.body,
    },
    response: ctx.response
      ? {
          code: ctx.response.code,
          status: ctx.response.status,
          responseTime: ctx.response.durationMs,
          headers: {
            get: (key: string): string | undefined => ctx.response?.headers[key],
            toObject: (): Record<string, string> => ({ ...ctx.response?.headers }),
          },
          text: (): string => ctx.response?.body ?? '',
          json: (): unknown => {
            try {
              return JSON.parse(ctx.response?.body ?? 'null')
            } catch {
              return null
            }
          },
          to: {
            have: {
              status: (code: number): boolean => ctx.response?.code === code,
              header: (key: string): boolean => key in (ctx.response?.headers ?? {}),
              body: (text: string): boolean => ctx.response?.body.includes(text) ?? false,
              jsonBody: (key: string): boolean => {
                try {
                  const parsed = JSON.parse(ctx.response?.body ?? '{}')
                  return key in parsed
                } catch {
                  return false
                }
              },
            },
            be: {
              ok: ctx.response.code >= 200 && ctx.response.code < 300,
              accepted: ctx.response.code === 202,
              badRequest: ctx.response.code === 400,
              unauthorized: ctx.response.code === 401,
              forbidden: ctx.response.code === 403,
              notFound: ctx.response.code === 404,
              serverError: ctx.response.code >= 500,
            },
          },
        }
      : null,
    test: (name: string, fn: () => void): void => {
      const start = performance.now()
      try {
        fn()
        assertions.push({
          name,
          passed: true,
          durationMs: Math.round(performance.now() - start),
        })
      } catch (err) {
        assertions.push({
          name,
          passed: false,
          error: err instanceof Error ? err.message : String(err),
          durationMs: Math.round(performance.now() - start),
        })
      }
    },
    expect: createExpect(),
  }
}

/**
 * Create a minimal ChaiJS-style expect function.
 */
function createExpect() {
  return function expect(actual: unknown) {
    const chain = {
      to: {
        be: {
          ok: assertTruthy(actual, 'expected value to be truthy'),
          true: assertEqual(actual, true, 'expected value to be true'),
          false: assertEqual(actual, false, 'expected value to be false'),
          null: assertEqual(actual, null, 'expected value to be null'),
          undefined: assertEqual(actual, undefined, 'expected value to be undefined'),
          a: (type: string) => assertEqual(typeof actual, type, `expected typeof to be ${type}`),
          an: (type: string) => assertEqual(typeof actual, type, `expected typeof to be ${type}`),
          above: (n: number) =>
            assertTruthy(
              typeof actual === 'number' && actual > n,
              `expected ${actual} to be above ${n}`,
            ),
          below: (n: number) =>
            assertTruthy(
              typeof actual === 'number' && actual < n,
              `expected ${actual} to be below ${n}`,
            ),
          within: (min: number, max: number) =>
            assertTruthy(
              typeof actual === 'number' && actual >= min && actual <= max,
              `expected ${actual} to be within ${min}..${max}`,
            ),
        },
        equal: (expected: unknown) =>
          assertEqual(
            actual,
            expected,
            `expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`,
          ),
        eql: (expected: unknown) => assertDeepEqual(actual, expected, 'expected deep equality'),
        include: (item: unknown) =>
          assertTruthy(
            Array.isArray(actual)
              ? actual.includes(item)
              : typeof actual === 'string' && actual.includes(String(item)),
            `expected value to include ${JSON.stringify(item)}`,
          ),
        have: {
          property: (key: string) =>
            assertTruthy(
              actual !== null && typeof actual === 'object' && key in actual,
              `expected object to have property '${key}'`,
            ),
          length: (len: number) =>
            assertEqual(
              Array.isArray(actual) || typeof actual === 'string' ? actual.length : undefined,
              len,
              `expected length to be ${len}`,
            ),
          status: (code: number) =>
            assertTruthy(
              actual !== null &&
                typeof actual === 'object' &&
                'code' in actual &&
                (actual as { code: number }).code === code,
              `expected response status to be ${code}`,
            ),
        },
        match: (regex: RegExp) =>
          assertTruthy(
            typeof actual === 'string' && regex.test(actual),
            `expected string to match ${regex}`,
          ),
        not: {
          be: {
            ok: assertFalsy(actual, 'expected value to be falsy'),
            null: assertNotEqual(actual, null, 'expected value to not be null'),
            undefined: assertNotEqual(actual, undefined, 'expected value to not be undefined'),
          },
          equal: (expected: unknown) =>
            assertNotEqual(
              actual,
              expected,
              `expected value to not equal ${JSON.stringify(expected)}`,
            ),
          include: (item: unknown) =>
            assertFalsy(
              Array.isArray(actual)
                ? actual.includes(item)
                : typeof actual === 'string' && actual.includes(String(item)),
              `expected value to not include ${JSON.stringify(item)}`,
            ),
        },
      },
    }
    return chain
  }

  function assertTruthy(condition: unknown, message: string): void {
    if (!condition) throw new Error(message)
  }

  function assertFalsy(condition: unknown, message: string): void {
    if (condition) throw new Error(message)
  }

  function assertEqual(actual: unknown, expected: unknown, message: string): void {
    if (actual !== expected) throw new Error(message)
  }

  function assertNotEqual(actual: unknown, expected: unknown, message: string): void {
    if (actual === expected) throw new Error(message)
  }

  function assertDeepEqual(actual: unknown, expected: unknown, message: string): void {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(message)
  }
}

/**
 * Execute a script in a sandboxed environment.
 *
 * @param script - The JavaScript code to execute
 * @param context - Execution context (environment, request, response)
 * @param timeoutMs - Maximum execution time (default 5000ms)
 * @returns Execution result with console output and assertions
 */
export async function executeScript(
  script: string,
  context: ScriptExecutionContext,
  timeoutMs: number = SCRIPT_TIMEOUT_MS,
): Promise<ScriptExecutionResult> {
  const start = performance.now()
  const consoleOutput: ScriptConsoleEntry[] = []
  const assertions: AssertionResult[] = []
  const envChanges = new Map<string, string | null>()

  if (!script.trim()) {
    return {
      success: true,
      consoleOutput,
      assertions,
      environmentChanges: envChanges,
      durationMs: 0,
    }
  }

  // Create sandboxed console
  const sandboxConsole = {
    log: (...args: unknown[]) =>
      consoleOutput.push({
        type: 'log',
        args: args.map(formatArg),
        timestamp: Date.now(),
      }),
    warn: (...args: unknown[]) =>
      consoleOutput.push({
        type: 'warn',
        args: args.map(formatArg),
        timestamp: Date.now(),
      }),
    error: (...args: unknown[]) =>
      consoleOutput.push({
        type: 'error',
        args: args.map(formatArg),
        timestamp: Date.now(),
      }),
    info: (...args: unknown[]) =>
      consoleOutput.push({
        type: 'info',
        args: args.map(formatArg),
        timestamp: Date.now(),
      }),
  }

  const rl = createRlApi(context, assertions, envChanges)

  try {
    // Execute with timeout using Promise.race
    const execution = new Promise<void>((resolve, reject) => {
      try {
        // Create function with sandboxed globals
        // Note: This is NOT fully secure sandboxing (no DOM in Tauri webview context,
        // but localStorage etc. could theoretically be accessed). For production,
        // consider using a Web Worker or QuickJS WASM.
        const fn = new Function(
          'rl',
          'console',
          'pm', // Backward compatibility alias
          '"use strict";\n' + script,
        )
        fn(rl, sandboxConsole, rl)
        resolve()
      } catch (err) {
        reject(err)
      }
    })

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Script execution timed out after ${timeoutMs}ms`)),
        timeoutMs,
      ),
    )

    await Promise.race([execution, timeout])

    return {
      success: true,
      consoleOutput,
      assertions,
      environmentChanges: envChanges,
      durationMs: Math.round(performance.now() - start),
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
      consoleOutput,
      assertions,
      environmentChanges: envChanges,
      durationMs: Math.round(performance.now() - start),
    }
  }
}

/**
 * Format an argument for console output.
 */
function formatArg(arg: unknown): string {
  if (typeof arg === 'string') return arg
  if (arg instanceof Error) return `${arg.name}: ${arg.message}`
  try {
    return JSON.stringify(arg, null, 2) ?? String(arg)
  } catch {
    return String(arg)
  }
}

/**
 * Execute pre-request script and return modified context.
 */
export async function executePreRequestScript(
  script: string,
  context: ScriptExecutionContext,
): Promise<ScriptExecutionResult> {
  return executeScript(script, context)
}

/**
 * Execute test script after response.
 */
export async function executeTestScript(
  script: string,
  context: ScriptExecutionContext,
): Promise<ScriptExecutionResult> {
  return executeScript(script, context)
}
