import { describe, expect, it } from 'vitest'

import { groupHistoryByDay } from '@/application/use-cases/list-history'
import type { HistoryItem } from '@/entities'

const base = {
  status: 200,
  statusText: 'OK',
  durationMs: 10,
  when: 'now',
} as const

describe('groupHistoryByDay', () => {
  it('includes Older group and drops empty groups', () => {
    const items: HistoryItem[] = [
      { id: '1', method: 'GET', url: '/a', group: 'Today', ...base },
      { id: '2', method: 'POST', url: '/b', group: 'Older', ...base },
    ]
    const groups = groupHistoryByDay(items)
    expect(groups.map((g) => g.group)).toEqual(['Today', 'Older'])
    expect(groups.find((g) => g.group === 'Yesterday')).toBeUndefined()
  })
})
