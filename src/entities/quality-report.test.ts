import { describe, expect, it } from 'vitest'

import {
  calculateHealthScore,
  calculatePerformanceScore,
  getHealthGrade,
  HEALTH_WEIGHTS,
} from '@/entities/quality-report'
import {
  calculateSecurityScore,
  sortBySeverity,
  type SecurityFinding,
} from '@/entities/security-finding'

describe('quality-report', () => {
  describe('calculatePerformanceScore', () => {
    it('returns 100 for fast responses (< 200ms)', () => {
      expect(calculatePerformanceScore(100)).toBe(100)
      expect(calculatePerformanceScore(200)).toBe(100)
    })

    it('returns 0 for slow responses (>= 2000ms)', () => {
      expect(calculatePerformanceScore(2000)).toBe(0)
      expect(calculatePerformanceScore(5000)).toBe(0)
    })

    it('interpolates linearly between 200ms and 2000ms', () => {
      // Midpoint: 1100ms should give ~50
      expect(calculatePerformanceScore(1100)).toBe(50)
      // Quarter: 650ms should give ~75
      expect(calculatePerformanceScore(650)).toBe(75)
    })
  })

  describe('calculateHealthScore', () => {
    it('calculates perfect score', () => {
      // 100% test pass, 100 security, 100ms response
      const score = calculateHealthScore(100, 100, 100)
      expect(score).toBe(100)
    })

    it('applies correct weights', () => {
      // 50% test pass, 50 security, 1100ms (50 perf)
      // = 50*0.5 + 50*0.3 + 50*0.2 = 25 + 15 + 10 = 50
      const score = calculateHealthScore(50, 50, 1100)
      expect(score).toBe(50)
    })

    it('clamps to 0-100 range', () => {
      expect(calculateHealthScore(0, 0, 5000)).toBe(0)
      expect(calculateHealthScore(100, 100, 0)).toBe(100)
    })

    it('reflects health weights constant', () => {
      expect(HEALTH_WEIGHTS.testPassRate).toBe(0.5)
      expect(HEALTH_WEIGHTS.security).toBe(0.3)
      expect(HEALTH_WEIGHTS.performance).toBe(0.2)
    })
  })

  describe('getHealthGrade', () => {
    it('returns Excellent for 90+', () => {
      expect(getHealthGrade(90).label).toBe('Excellent')
      expect(getHealthGrade(100).label).toBe('Excellent')
    })

    it('returns Good for 75-89', () => {
      expect(getHealthGrade(75).label).toBe('Good')
      expect(getHealthGrade(89).label).toBe('Good')
    })

    it('returns Fair for 60-74', () => {
      expect(getHealthGrade(60).label).toBe('Fair')
      expect(getHealthGrade(74).label).toBe('Fair')
    })

    it('returns Poor for 40-59', () => {
      expect(getHealthGrade(40).label).toBe('Poor')
      expect(getHealthGrade(59).label).toBe('Poor')
    })

    it('returns Critical for < 40', () => {
      expect(getHealthGrade(0).label).toBe('Critical')
      expect(getHealthGrade(39).label).toBe('Critical')
    })
  })
})

describe('security-finding', () => {
  const createFinding = (severity: SecurityFinding['severity']): SecurityFinding => ({
    id: crypto.randomUUID(),
    severity,
    ruleId: 'TEST_RULE',
    title: 'Test Finding',
    description: 'Test description',
    remediation: 'Fix it',
    evidence: '[REDACTED]',
    detectedAt: Date.now(),
  })

  describe('calculateSecurityScore', () => {
    it('returns 100 for no findings', () => {
      expect(calculateSecurityScore([])).toBe(100)
    })

    it('deducts 40 for CRITICAL', () => {
      expect(calculateSecurityScore([createFinding('CRITICAL')])).toBe(60)
    })

    it('deducts 20 for HIGH', () => {
      expect(calculateSecurityScore([createFinding('HIGH')])).toBe(80)
    })

    it('deducts 10 for MEDIUM', () => {
      expect(calculateSecurityScore([createFinding('MEDIUM')])).toBe(90)
    })

    it('deducts 5 for LOW', () => {
      expect(calculateSecurityScore([createFinding('LOW')])).toBe(95)
    })

    it('deducts 0 for INFO', () => {
      expect(calculateSecurityScore([createFinding('INFO')])).toBe(100)
    })

    it('accumulates penalties', () => {
      const findings = [createFinding('CRITICAL'), createFinding('HIGH'), createFinding('MEDIUM')]
      // 100 - 40 - 20 - 10 = 30
      expect(calculateSecurityScore(findings)).toBe(30)
    })

    it('never goes below 0', () => {
      const findings = [
        createFinding('CRITICAL'),
        createFinding('CRITICAL'),
        createFinding('CRITICAL'),
      ]
      expect(calculateSecurityScore(findings)).toBe(0)
    })
  })

  describe('sortBySeverity', () => {
    it('sorts CRITICAL first', () => {
      const findings = [createFinding('LOW'), createFinding('CRITICAL'), createFinding('MEDIUM')]
      const sorted = sortBySeverity(findings)

      expect(sorted[0].severity).toBe('CRITICAL')
      expect(sorted[1].severity).toBe('MEDIUM')
      expect(sorted[2].severity).toBe('LOW')
    })

    it('does not mutate original array', () => {
      const findings = [createFinding('LOW'), createFinding('CRITICAL')]
      sortBySeverity(findings)

      expect(findings[0].severity).toBe('LOW')
    })
  })
})
