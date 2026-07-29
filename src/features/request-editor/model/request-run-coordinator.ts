/** Identifies one request execution within the current editor session. */
export type RequestRunId = number

/** Terminal outcomes that release the active request execution. */
export type RequestRunOutcome = 'success' | 'error' | 'cancelled'

/**
 * Reports whether a terminal transition still owns request UI side effects.
 */
export type RequestRunTransition = {
  accepted: boolean
  outcome: RequestRunOutcome
}

/**
 * Coordinates request execution ownership without depending on React state.
 *
 * 1. Allocate a monotonically increasing identity for each Send action.
 * 2. Accept terminal transitions only while that identity owns the active UI.
 * 3. Release active ownership without allowing older completions to reclaim it.
 *
 * [ASYNC:REQUEST:SEND]
 * A stale transport completion must not overwrite response or history from a newer run.
 *
 * [TRACE:REQUEST:IT0-39]
 */
export function createRequestRunCoordinator() {
  let nextRunId = 0
  let latestStartedRunId: RequestRunId | null = null
  let activeRunId: RequestRunId | null = null

  const settle = (runId: RequestRunId, outcome: RequestRunOutcome): RequestRunTransition => {
    // [ASYNC:REQUEST:SEND]
    // Clearing ownership is one-way: an older completion cannot reclaim the UI.
    if (activeRunId !== runId) {
      return { accepted: false, outcome }
    }

    activeRunId = null
    return { accepted: true, outcome }
  }

  return {
    start(): RequestRunId {
      const runId = ++nextRunId
      latestStartedRunId = runId
      activeRunId = runId
      return runId
    },
    isLatest(runId: RequestRunId): boolean {
      return activeRunId === runId
    },
    isMostRecent(runId: RequestRunId): boolean {
      return latestStartedRunId === runId
    },
    succeed(runId: RequestRunId): RequestRunTransition {
      return settle(runId, 'success')
    },
    fail(runId: RequestRunId): RequestRunTransition {
      return settle(runId, 'error')
    },
    cancel(runId: RequestRunId): RequestRunTransition {
      return settle(runId, 'cancelled')
    },
  }
}

/** Coordinator contract used by request execution orchestration. */
export type RequestRunCoordinator = ReturnType<typeof createRequestRunCoordinator>
