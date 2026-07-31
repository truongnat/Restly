/**
 * Quality & Health Reporter — FEAT-10
 *
 * Generates unified quality reports combining:
 * - Test suite execution results (FEAT-05)
 * - Security findings (FEAT-09)
 * - Response performance metrics
 *
 * Output formats: Markdown, HTML
 * Health Score: Test Pass (50%) + Security Clear (30%) + Performance (20%)
 */

import type { AssertionResult } from '@/features/request-editor/model/script-sandbox'
import type { SecurityFinding, SecuritySeverity } from '@/features/security/model/passive-scanner'

export interface PerformanceMetric {
  url: string
  method: string
  durationMs: number
  statusCode: number
}

export interface QualityReportInput {
  testResults: AssertionResult[]
  securityFindings: SecurityFinding[]
  performanceMetrics: PerformanceMetric[]
  apiName?: string
  version?: string
}

export interface UnifiedQualityReport {
  generatedAt: string
  apiName: string
  version: string
  healthScore: number // 0-100
  summary: {
    totalTests: number
    passedTests: number
    failedTests: number
    testPassRate: number // 0-100
    securityFindingsCount: Record<SecuritySeverity, number>
    securityScore: number // 0-100
    avgResponseTimeMs: number
    slowEndpoints: Array<{ url: string; durationMs: number }>
    performanceScore: number // 0-100
  }
  details: {
    testResults: AssertionResult[]
    securityFindings: SecurityFinding[]
    slowEndpoints: PerformanceMetric[]
  }
}

/** Threshold for slow endpoint detection (ms) */
export const SLOW_ENDPOINT_THRESHOLD_MS = 1000

/** Performance score thresholds */
const PERF_EXCELLENT_MS = 200
const PERF_GOOD_MS = 500
const PERF_FAIR_MS = 1000

/**
 * Calculate test pass rate score (0-100).
 */
export function calculateTestScore(testResults: AssertionResult[]): number {
  if (testResults.length === 0) return 100 // No tests = no failures
  const passed = testResults.filter((t) => t.passed).length
  return Math.round((passed / testResults.length) * 100)
}

/**
 * Calculate security score (0-100) based on findings.
 */
export function calculateSecurityScoreFromFindings(findings: SecurityFinding[]): number {
  const weights: Record<SecuritySeverity, number> = {
    CRITICAL: 25,
    HIGH: 15,
    MEDIUM: 8,
    LOW: 3,
    INFO: 1,
  }

  let deduction = 0
  for (const finding of findings) {
    deduction += weights[finding.severity]
  }

  return Math.max(0, 100 - deduction)
}

/**
 * Calculate performance score (0-100) based on response times.
 */
export function calculatePerformanceScore(metrics: PerformanceMetric[]): number {
  if (metrics.length === 0) return 100

  const avg = metrics.reduce((sum, m) => sum + m.durationMs, 0) / metrics.length

  if (avg <= PERF_EXCELLENT_MS) return 100
  if (avg <= PERF_GOOD_MS) return 85
  if (avg <= PERF_FAIR_MS) return 70
  if (avg <= SLOW_ENDPOINT_THRESHOLD_MS * 2) return 50
  return 30
}

/**
 * Calculate overall health score.
 * Weights: Test Pass (50%) + Security Clear (30%) + Performance (20%)
 */
export function calculateHealthScore(
  testScore: number,
  securityScore: number,
  performanceScore: number,
): number {
  return Math.round(testScore * 0.5 + securityScore * 0.3 + performanceScore * 0.2)
}

/**
 * Generate a unified quality report.
 */
export function generateQualityReport(input: QualityReportInput): UnifiedQualityReport {
  const { testResults, securityFindings, performanceMetrics } = input

  const passedTests = testResults.filter((t) => t.passed).length
  const failedTests = testResults.length - passedTests
  const testPassRate =
    testResults.length > 0 ? Math.round((passedTests / testResults.length) * 100) : 100

  const securityFindingsCount: Record<SecuritySeverity, number> = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
    INFO: 0,
  }
  for (const finding of securityFindings) {
    securityFindingsCount[finding.severity]++
  }

  const avgResponseTimeMs =
    performanceMetrics.length > 0
      ? Math.round(
          performanceMetrics.reduce((sum, m) => sum + m.durationMs, 0) / performanceMetrics.length,
        )
      : 0

  const slowEndpoints = performanceMetrics
    .filter((m) => m.durationMs > SLOW_ENDPOINT_THRESHOLD_MS)
    .sort((a, b) => b.durationMs - a.durationMs)

  const testScore = calculateTestScore(testResults)
  const securityScore = calculateSecurityScoreFromFindings(securityFindings)
  const performanceScore = calculatePerformanceScore(performanceMetrics)
  const healthScore = calculateHealthScore(testScore, securityScore, performanceScore)

  return {
    generatedAt: new Date().toISOString(),
    apiName: input.apiName ?? 'API Quality Report',
    version: input.version ?? '1.0.0',
    healthScore,
    summary: {
      totalTests: testResults.length,
      passedTests,
      failedTests,
      testPassRate,
      securityFindingsCount,
      securityScore,
      avgResponseTimeMs,
      slowEndpoints: slowEndpoints.map((m) => ({ url: m.url, durationMs: m.durationMs })),
      performanceScore,
    },
    details: {
      testResults,
      securityFindings,
      slowEndpoints,
    },
  }
}

/**
 * Get health score grade and color.
 */
export function getHealthGrade(score: number): { grade: string; color: string; label: string } {
  if (score >= 90) return { grade: 'A', color: '#10b981', label: 'Excellent' }
  if (score >= 80) return { grade: 'B', color: '#3b82f6', label: 'Good' }
  if (score >= 70) return { grade: 'C', color: '#f59e0b', label: 'Fair' }
  if (score >= 60) return { grade: 'D', color: '#f97316', label: 'Poor' }
  return { grade: 'F', color: '#ef4444', label: 'Critical' }
}

/**
 * Render report as Markdown.
 */
export function renderMarkdownReport(report: UnifiedQualityReport): string {
  const grade = getHealthGrade(report.healthScore)
  const lines: string[] = []

  lines.push(`# ${report.apiName} — Quality Report`)
  lines.push('')
  lines.push(`**Version:** ${report.version}`)
  lines.push(`**Generated:** ${new Date(report.generatedAt).toLocaleString()}`)
  lines.push('')
  lines.push(`## Health Score: ${report.healthScore}/100 (${grade.grade} — ${grade.label})`)
  lines.push('')
  lines.push('---')
  lines.push('')

  // Test Results
  lines.push('## Test Results')
  lines.push('')
  lines.push(`| Metric | Value |`)
  lines.push(`|--------|-------|`)
  lines.push(`| Total Tests | ${report.summary.totalTests} |`)
  lines.push(`| Passed | ${report.summary.passedTests} |`)
  lines.push(`| Failed | ${report.summary.failedTests} |`)
  lines.push(`| Pass Rate | ${report.summary.testPassRate}% |`)
  lines.push(`| Test Score | ${calculateTestScore(report.details.testResults)}/100 |`)
  lines.push('')

  if (report.details.testResults.length > 0) {
    lines.push('### Test Details')
    lines.push('')
    for (const test of report.details.testResults) {
      const status = test.passed ? '✅ PASS' : '❌ FAIL'
      lines.push(`- ${status} ${test.name} (${test.durationMs}ms)`)
      if (test.error) {
        lines.push(`  - Error: ${test.error}`)
      }
    }
    lines.push('')
  }

  // Security Findings
  lines.push('## Security Findings')
  lines.push('')
  const sec = report.summary.securityFindingsCount
  lines.push(`| Severity | Count |`)
  lines.push(`|----------|-------|`)
  lines.push(`| 🔴 Critical | ${sec.CRITICAL} |`)
  lines.push(`| 🟠 High | ${sec.HIGH} |`)
  lines.push(`| 🟡 Medium | ${sec.MEDIUM} |`)
  lines.push(`| 🔵 Low | ${sec.LOW} |`)
  lines.push(`| ⚪ Info | ${sec.INFO} |`)
  lines.push(`| **Security Score** | **${report.summary.securityScore}/100** |`)
  lines.push('')

  if (report.details.securityFindings.length > 0) {
    lines.push('### Finding Details')
    lines.push('')
    for (const finding of report.details.securityFindings) {
      lines.push(`#### [${finding.severity}] ${finding.title}`)
      lines.push('')
      lines.push(`- **CWE:** ${finding.cweId ?? 'N/A'}`)
      lines.push(`- **Description:** ${finding.description}`)
      lines.push(`- **Remediation:** ${finding.remediation}`)
      lines.push('')
    }
  }

  // Performance
  lines.push('## Performance')
  lines.push('')
  lines.push(`| Metric | Value |`)
  lines.push(`|--------|-------|`)
  lines.push(`| Avg Response Time | ${report.summary.avgResponseTimeMs}ms |`)
  lines.push(
    `| Slow Endpoints (>${SLOW_ENDPOINT_THRESHOLD_MS}ms) | ${report.summary.slowEndpoints.length} |`,
  )
  lines.push(`| Performance Score | ${report.summary.performanceScore}/100 |`)
  lines.push('')

  if (report.details.slowEndpoints.length > 0) {
    lines.push('### Slow Endpoints')
    lines.push('')
    lines.push('| URL | Duration |')
    lines.push('|-----|----------|')
    for (const endpoint of report.details.slowEndpoints) {
      lines.push(`| ${endpoint.url} | ${endpoint.durationMs}ms |`)
    }
    lines.push('')
  }

  lines.push('---')
  lines.push('')
  lines.push('*Generated by Restly Quality Reporter*')

  return lines.join('\n')
}

/**
 * Render report as HTML.
 */
export function renderHtmlReport(report: UnifiedQualityReport): string {
  const grade = getHealthGrade(report.healthScore)
  const sec = report.summary.securityFindingsCount

  const testRows = report.details.testResults
    .map(
      (t) => `
      <tr class="${t.passed ? 'pass' : 'fail'}">
        <td>${t.passed ? '✅' : '❌'}</td>
        <td>${escapeHtml(t.name)}</td>
        <td>${t.durationMs}ms</td>
        <td>${t.error ? escapeHtml(t.error) : '—'}</td>
      </tr>`,
    )
    .join('')

  const findingCards = report.details.securityFindings
    .map(
      (f) => `
      <div class="finding ${f.severity.toLowerCase()}">
        <div class="finding-header">
          <span class="badge">${f.severity}</span>
          <strong>${escapeHtml(f.title)}</strong>
        </div>
        <p>${escapeHtml(f.description)}</p>
        <p class="remediation"><strong>Fix:</strong> ${escapeHtml(f.remediation)}</p>
      </div>`,
    )
    .join('')

  const slowRows = report.details.slowEndpoints
    .map((e) => `<tr><td>${escapeHtml(e.url)}</td><td>${e.durationMs}ms</td></tr>`)
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(report.apiName)} — Quality Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1e293b; line-height: 1.6; }
    .container { max-width: 900px; margin: 0 auto; padding: 24px; }
    header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 24px; border-radius: 12px; margin-bottom: 24px; }
    header h1 { font-size: 28px; margin-bottom: 8px; }
    header .meta { opacity: 0.9; font-size: 14px; }
    .score-card { background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; }
    .score-value { font-size: 64px; font-weight: 700; color: ${grade.color}; }
    .score-label { font-size: 18px; color: #64748b; margin-top: 8px; }
    .grade-badge { display: inline-block; background: ${grade.color}; color: white; width: 48px; height: 48px; border-radius: 50%; font-size: 24px; font-weight: 700; line-height: 48px; margin-top: 12px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card h3 { font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
    .card .value { font-size: 32px; font-weight: 700; }
    .card .sub { font-size: 13px; color: #94a3b8; margin-top: 4px; }
    section { background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    section h2 { font-size: 20px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #f8fafc; font-weight: 600; color: #475569; }
    tr.pass td:first-child { color: #10b981; }
    tr.fail td:first-child { color: #ef4444; }
    .finding { border-left: 4px solid #94a3b8; padding: 16px; margin-bottom: 12px; background: #f8fafc; border-radius: 0 8px 8px 0; }
    .finding.critical { border-color: #ef4444; background: #fef2f2; }
    .finding.high { border-color: #f97316; background: #fff7ed; }
    .finding.medium { border-color: #f59e0b; background: #fffbeb; }
    .finding.low { border-color: #3b82f6; background: #eff6ff; }
    .finding.info { border-color: #94a3b8; }
    .finding-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .badge { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; background: #64748b; color: white; }
    .critical .badge { background: #ef4444; }
    .high .badge { background: #f97316; }
    .medium .badge { background: #f59e0b; }
    .low .badge { background: #3b82f6; }
    .remediation { font-size: 13px; color: #475569; margin-top: 8px; }
    footer { text-align: center; color: #94a3b8; font-size: 13px; padding: 24px; }
    .severity-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; text-align: center; }
    .severity-item { padding: 12px; border-radius: 8px; background: #f8fafc; }
    .severity-item .count { font-size: 24px; font-weight: 700; }
    .severity-item .label { font-size: 11px; color: #64748b; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${escapeHtml(report.apiName)}</h1>
      <div class="meta">Version ${escapeHtml(report.version)} • Generated ${new Date(report.generatedAt).toLocaleString()}</div>
    </header>

    <div class="score-card">
      <div class="score-value">${report.healthScore}</div>
      <div class="score-label">Health Score — ${grade.label}</div>
      <div class="grade-badge">${grade.grade}</div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>Tests</h3>
        <div class="value" style="color: ${report.summary.testPassRate === 100 ? '#10b981' : '#f59e0b'}">${report.summary.testPassRate}%</div>
        <div class="sub">${report.summary.passedTests}/${report.summary.totalTests} passed</div>
      </div>
      <div class="card">
        <h3>Security</h3>
        <div class="value" style="color: ${report.summary.securityScore >= 80 ? '#10b981' : '#ef4444'}">${report.summary.securityScore}/100</div>
        <div class="sub">${report.details.securityFindings.length} findings</div>
      </div>
      <div class="card">
        <h3>Performance</h3>
        <div class="value" style="color: ${report.summary.avgResponseTimeMs <= 500 ? '#10b981' : '#f59e0b'}">${report.summary.avgResponseTimeMs}ms</div>
        <div class="sub">avg response time</div>
      </div>
    </div>

    <section>
      <h2>Test Results</h2>
      ${
        report.details.testResults.length > 0
          ? `<table>
          <thead><tr><th></th><th>Test</th><th>Duration</th><th>Error</th></tr></thead>
          <tbody>${testRows}</tbody>
        </table>`
          : '<p style="color: #94a3b8;">No tests executed.</p>'
      }
    </section>

    <section>
      <h2>Security Findings</h2>
      <div class="severity-grid" style="margin-bottom: 16px;">
        <div class="severity-item"><div class="count" style="color: #ef4444;">${sec.CRITICAL}</div><div class="label">Critical</div></div>
        <div class="severity-item"><div class="count" style="color: #f97316;">${sec.HIGH}</div><div class="label">High</div></div>
        <div class="severity-item"><div class="count" style="color: #f59e0b;">${sec.MEDIUM}</div><div class="label">Medium</div></div>
        <div class="severity-item"><div class="count" style="color: #3b82f6;">${sec.LOW}</div><div class="label">Low</div></div>
        <div class="severity-item"><div class="count" style="color: #94a3b8;">${sec.INFO}</div><div class="label">Info</div></div>
      </div>
      ${findingCards || '<p style="color: #94a3b8;">No security findings. 🎉</p>'}
    </section>

    <section>
      <h2>Performance</h2>
      ${
        report.details.slowEndpoints.length > 0
          ? `<table>
          <thead><tr><th>Endpoint</th><th>Duration</th></tr></thead>
          <tbody>${slowRows}</tbody>
        </table>`
          : '<p style="color: #94a3b8;">No slow endpoints detected. 🚀</p>'
      }
    </section>

    <footer>Generated by Restly Quality Reporter</footer>
  </div>
</body>
</html>`
}

/**
 * Escape HTML special characters.
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * Download report as file.
 */
export function downloadReport(report: UnifiedQualityReport, format: 'markdown' | 'html'): void {
  const content = format === 'markdown' ? renderMarkdownReport(report) : renderHtmlReport(report)
  const mimeType = format === 'markdown' ? 'text/markdown' : 'text/html'
  const extension = format === 'markdown' ? 'md' : 'html'
  const filename = `quality-report-${report.version}-${new Date().toISOString().split('T')[0]}.${extension}`

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
