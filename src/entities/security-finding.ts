/**
 * Security finding entity — vulnerability detection result.
 * FEAT-09: Automated Passive & Active Security Scanner
 *
 * SECURITY:REDACT_EVIDENCE — All evidence must be masked before storage/display.
 */

export type SecuritySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'

export interface SecurityFinding {
  id: string
  severity: SecuritySeverity
  ruleId: string
  title: string
  description: string
  remediation: string
  /** Must be REDACTED — never contains raw secrets */
  evidence: string
  /** Optional URL of the affected request */
  url?: string
  /** Timestamp when finding was detected */
  detectedAt: number
}

/**
 * Security scan result for a single response.
 */
export interface SecurityScanResult {
  url: string
  scannedAt: number
  findings: SecurityFinding[]
  score: number // 0-100, higher is better
}

/**
 * Severity weights for health score calculation.
 */
export const SEVERITY_PENALTY: Record<SecuritySeverity, number> = {
  CRITICAL: 40,
  HIGH: 20,
  MEDIUM: 10,
  LOW: 5,
  INFO: 0,
}

/**
 * Calculate security score from findings.
 * Starts at 100, deducts based on severity penalties.
 */
export function calculateSecurityScore(findings: SecurityFinding[]): number {
  const penalty = findings.reduce((sum, f) => sum + SEVERITY_PENALTY[f.severity], 0)
  return Math.max(0, 100 - penalty)
}

/**
 * Sort findings by severity (CRITICAL first).
 */
export function sortBySeverity(findings: SecurityFinding[]): SecurityFinding[] {
  const order: SecuritySeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']
  return [...findings].sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity))
}
