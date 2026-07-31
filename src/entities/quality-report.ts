/**
 * Quality report entity — unified health reporting.
 * FEAT-10: Production Quality & Unified Health Reporter
 *
 * Health Score Formula:
 * HealthScore = (TestPassRate × 0.5) + (max(0, 100 - SecurityPenalty) × 0.3) + (PerfScore × 0.2)
 */

import type { SecurityFinding } from '@/entities/security-finding'

export interface AssertionResult {
  id: string
  name: string
  passed: boolean
  error?: string
  durationMs: number
}

export interface UnifiedQualityReport {
  id: string
  generatedAt: number
  healthScore: number // 0-100
  summary: {
    totalRequestsExecuted: number
    testPassRatePercentage: number
    securityFindingsCount: {
      critical: number
      high: number
      medium: number
      low: number
      info: number
    }
    averageResponseTimeMs: number
  }
  assertions: AssertionResult[]
  securityFindings: SecurityFinding[]
  performanceMetrics: {
    minResponseTimeMs: number
    maxResponseTimeMs: number
    avgResponseTimeMs: number
    p95ResponseTimeMs: number
  }
}

/**
 * Health score weights.
 */
export const HEALTH_WEIGHTS = {
  testPassRate: 0.5,
  security: 0.3,
  performance: 0.2,
} as const

/**
 * Calculate performance score based on average response time.
 * 100 points if avg < 200ms, decreasing linearly to 0 at 2000ms.
 */
export function calculatePerformanceScore(avgResponseTimeMs: number): number {
  if (avgResponseTimeMs <= 200) return 100
  if (avgResponseTimeMs >= 2000) return 0
  // Linear interpolation between 200ms (100) and 2000ms (0)
  return Math.round(100 - ((avgResponseTimeMs - 200) / 1800) * 100)
}

/**
 * Calculate unified health score.
 */
export function calculateHealthScore(
  testPassRate: number, // 0-100
  securityScore: number, // 0-100
  avgResponseTimeMs: number,
): number {
  const perfScore = calculatePerformanceScore(avgResponseTimeMs)
  const score =
    testPassRate * HEALTH_WEIGHTS.testPassRate +
    securityScore * HEALTH_WEIGHTS.security +
    perfScore * HEALTH_WEIGHTS.performance
  return Math.round(Math.min(100, Math.max(0, score)))
}

/**
 * Get health score grade label.
 */
export function getHealthGrade(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Excellent', color: 'text-emerald-500' }
  if (score >= 75) return { label: 'Good', color: 'text-green-500' }
  if (score >= 60) return { label: 'Fair', color: 'text-yellow-500' }
  if (score >= 40) return { label: 'Poor', color: 'text-orange-500' }
  return { label: 'Critical', color: 'text-red-500' }
}
