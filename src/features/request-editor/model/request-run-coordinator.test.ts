import { describe, expect, it, vi } from 'vitest'

import { createRequestRunCoordinator } from './request-run-coordinator'

describe('request-execution run ownership', () => {
  it('accepts success from the active run and releases pending ownership', () => {
    const coordinator = createRequestRunCoordinator()
    const runId = coordinator.start()

    expect(coordinator.isLatest(runId)).toBe(true)
    expect(coordinator.succeed(runId)).toEqual({ accepted: true, outcome: 'success' })
    expect(coordinator.isLatest(runId)).toBe(false)
  })

  it('rejects stale completion when request-execution finishes newest run first', () => {
    const coordinator = createRequestRunCoordinator()
    const commitResponseAndHistory = vi.fn()
    const firstRunId = coordinator.start()
    const secondRunId = coordinator.start()

    if (coordinator.succeed(secondRunId).accepted) commitResponseAndHistory(secondRunId)
    if (coordinator.succeed(firstRunId).accepted) commitResponseAndHistory(firstRunId)

    expect(commitResponseAndHistory).toHaveBeenCalledOnce()
    expect(commitResponseAndHistory).toHaveBeenCalledWith(secondRunId)
  })

  it('ends request-execution pending state on cancel without committing stale success', () => {
    const coordinator = createRequestRunCoordinator()
    const commitResponseAndHistory = vi.fn()
    const runId = coordinator.start()
    let isPending = true

    if (coordinator.cancel(runId).accepted) isPending = false
    if (coordinator.succeed(runId).accepted) commitResponseAndHistory()

    expect(isPending).toBe(false)
    expect(commitResponseAndHistory).not.toHaveBeenCalled()
  })

  it('ends request-execution pending state on error without success side effects', () => {
    const coordinator = createRequestRunCoordinator()
    const commitResponseAndHistory = vi.fn()
    const runId = coordinator.start()
    let isPending = true

    if (coordinator.fail(runId).accepted) isPending = false
    if (coordinator.succeed(runId).accepted) commitResponseAndHistory()

    expect(isPending).toBe(false)
    expect(commitResponseAndHistory).not.toHaveBeenCalled()
  })
})
