/**
 * Lightweight script sandbox — Function constructor + timeout.
 * DEV/mock only: not a hardened isolate.
 */
export type ScriptContext = {
  environment: { get: (key: string) => string | undefined }
  request: { url: string; method: string }
  response?: { code: number; body: string }
  console: { log: (...args: unknown[]) => void }
}

export async function runScript(
  source: string,
  ctx: ScriptContext,
  timeoutMs = 5000,
): Promise<{ logs: string[]; error: string | null }> {
  const logs: string[] = []
  if (!source.trim()) return { logs, error: null }

  const sandboxConsole = {
    log: (...args: unknown[]) => {
      logs.push(args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '))
      ctx.console.log(...args)
    },
  }

  try {
    const runner = new Function('pm', 'console', `"use strict";\n${source}\n`) as (
      pm: unknown,
      console: unknown,
    ) => void

    const pm = {
      environment: ctx.environment,
      request: ctx.request,
      response: ctx.response,
    }

    await Promise.race([
      Promise.resolve().then(() => runner(pm, sandboxConsole)),
      new Promise((_, reject) => {
        window.setTimeout(() => reject(new Error(`Script timeout (${timeoutMs}ms)`)), timeoutMs)
      }),
    ])
    return { logs, error: null }
  } catch (err) {
    return { logs, error: err instanceof Error ? err.message : 'Script failed' }
  }
}
