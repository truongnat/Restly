/**
 * Passive Security Scanner — FEAT-09
 *
 * Analyzes HTTP responses for common security issues without
 * sending additional requests (passive scanning).
 *
 * Checks include:
 * - Missing security headers (OWASP recommended)
 * - Information disclosure (server version, stack traces)
 * - CORS misconfiguration
 * - Sensitive data exposure
 * - Cookie security flags
 *
 * SECURITY:REDACT_EVIDENCE — All evidence is automatically masked
 * to prevent leaking secrets in reports.
 */

export type SecuritySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'

export interface SecurityFinding {
  id: string
  severity: SecuritySeverity
  title: string
  description: string
  cweId?: string
  remediation: string
  evidence: string // Redacted per SECURITY:REDACT_EVIDENCE
}

export interface ScanTarget {
  url: string
  method: string
  statusCode: number
  headers: Record<string, string>
  body?: string
}

/** Sensitive patterns to redact from evidence */
const SENSITIVE_PATTERNS = [
  /(?:api[_-]?key|apikey|api[_-]?secret)\s*[:=]\s*["']?[\w-]+/gi,
  /(?:password|passwd|pwd|secret)\s*[:=]\s*["']?[^\s"']+/gi,
  /(?:token|access[_-]?token|refresh[_-]?token)\s*[:=]\s*["']?[\w.-]+/gi,
  /(?:authorization|auth)\s*:\s*(?:bearer|basic)\s+[\w.-]+/gi,
  /(?:set-cookie)\s*:\s*[^\n]+/gi,
  /eyJ[\w-]+\.[\w-]+\.[\w-]+/g, // JWT tokens
  /sk_[\w]{20,}/g, // Stripe-style keys
  /ghp_[\w]{36}/g, // GitHub tokens
  /AKIA[\w]{16}/g, // AWS access keys
]

/**
 * Redact sensitive information from evidence string.
 * SECURITY:REDACT_EVIDENCE compliance.
 */
export function redactEvidence(evidence: string): string {
  let redacted = evidence
  for (const pattern of SENSITIVE_PATTERNS) {
    redacted = redacted.replace(pattern, '[REDACTED]')
  }
  return redacted
}

/**
 * Generate a unique finding ID.
 */
function generateId(): string {
  return `sec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Check for missing security headers.
 */
function checkSecurityHeaders(target: ScanTarget): SecurityFinding[] {
  const findings: SecurityFinding[] = []
  const headers = Object.fromEntries(
    Object.entries(target.headers).map(([k, v]) => [k.toLowerCase(), v]),
  )

  const requiredHeaders = [
    {
      name: 'strict-transport-security',
      severity: 'HIGH' as SecuritySeverity,
      title: 'Missing Strict-Transport-Security Header',
      description:
        'The HSTS header is missing. This allows potential protocol downgrade attacks and cookie hijacking.',
      cweId: 'CWE-319',
      remediation:
        'Add "Strict-Transport-Security: max-age=31536000; includeSubDomains" header to enforce HTTPS.',
    },
    {
      name: 'x-content-type-options',
      severity: 'MEDIUM' as SecuritySeverity,
      title: 'Missing X-Content-Type-Options Header',
      description:
        'The X-Content-Type-Options header is not set to "nosniff". This allows MIME type sniffing attacks.',
      cweId: 'CWE-16',
      remediation: 'Add "X-Content-Type-Options: nosniff" header.',
    },
    {
      name: 'x-frame-options',
      severity: 'MEDIUM' as SecuritySeverity,
      title: 'Missing X-Frame-Options Header',
      description: 'The X-Frame-Options header is missing. This could allow clickjacking attacks.',
      cweId: 'CWE-1021',
      remediation:
        'Add "X-Frame-Options: DENY" or "SAMEORIGIN" header, or use Content-Security-Policy frame-ancestors.',
    },
    {
      name: 'content-security-policy',
      severity: 'MEDIUM' as SecuritySeverity,
      title: 'Missing Content-Security-Policy Header',
      description:
        'No Content-Security-Policy header found. CSP helps prevent XSS and data injection attacks.',
      cweId: 'CWE-693',
      remediation: 'Implement a Content-Security-Policy appropriate for your application.',
    },
    {
      name: 'x-xss-protection',
      severity: 'LOW' as SecuritySeverity,
      title: 'Missing X-XSS-Protection Header',
      description:
        'The X-XSS-Protection header is not set. While deprecated in modern browsers, it provides defense-in-depth for older browsers.',
      cweId: 'CWE-79',
      remediation: 'Add "X-XSS-Protection: 1; mode=block" header for legacy browser support.',
    },
    {
      name: 'referrer-policy',
      severity: 'LOW' as SecuritySeverity,
      title: 'Missing Referrer-Policy Header',
      description:
        'No Referrer-Policy header. This could leak sensitive URL information to third parties.',
      cweId: 'CWE-200',
      remediation: 'Add "Referrer-Policy: strict-origin-when-cross-origin" or more restrictive.',
    },
    {
      name: 'permissions-policy',
      severity: 'LOW' as SecuritySeverity,
      title: 'Missing Permissions-Policy Header',
      description:
        'No Permissions-Policy (formerly Feature-Policy) header. Browser features are not restricted.',
      cweId: 'CWE-16',
      remediation: 'Add a Permissions-Policy header to restrict browser feature access.',
    },
  ]

  for (const header of requiredHeaders) {
    if (!(header.name in headers)) {
      findings.push({
        id: generateId(),
        severity: header.severity,
        title: header.title,
        description: header.description,
        cweId: header.cweId,
        remediation: header.remediation,
        evidence: redactEvidence(`URL: ${target.url}\nMissing header: ${header.name}`),
      })
    }
  }

  return findings
}

/**
 * Check for information disclosure.
 */
function checkInformationDisclosure(target: ScanTarget): SecurityFinding[] {
  const findings: SecurityFinding[] = []
  const headers = Object.fromEntries(
    Object.entries(target.headers).map(([k, v]) => [k.toLowerCase(), v]),
  )

  // Check Server header for version disclosure
  const server = headers['server']
  if (server && /\d+\.\d+/.test(server)) {
    findings.push({
      id: generateId(),
      severity: 'LOW',
      title: 'Server Version Disclosure',
      description: `The Server header reveals version information: "${redactEvidence(server)}". This helps attackers identify known vulnerabilities.`,
      cweId: 'CWE-200',
      remediation: 'Configure the server to omit version information from the Server header.',
      evidence: redactEvidence(`Server: ${server}`),
    })
  }

  // Check X-Powered-By header
  const poweredBy = headers['x-powered-by']
  if (poweredBy) {
    findings.push({
      id: generateId(),
      severity: 'LOW',
      title: 'X-Powered-By Header Present',
      description: `The X-Powered-By header reveals technology stack: "${redactEvidence(poweredBy)}".`,
      cweId: 'CWE-200',
      remediation: 'Remove the X-Powered-By header.',
      evidence: redactEvidence(`X-Powered-By: ${poweredBy}`),
    })
  }

  // Check for stack traces in response body
  if (target.body) {
    const stackPatterns = [
      /at\s+\w+\s+\([^)]+\)/, // Node.js stack trace
      /Traceback \(most recent call last\)/, // Python
      /Exception in thread/, // Java
      /Stack trace:/i,
      /<pre>.*at.*<\/pre>/is, // Generic HTML stack trace
    ]

    for (const pattern of stackPatterns) {
      if (pattern.test(target.body)) {
        findings.push({
          id: generateId(),
          severity: 'HIGH',
          title: 'Stack Trace in Response',
          description:
            'The response body contains a stack trace, revealing internal implementation details.',
          cweId: 'CWE-209',
          remediation:
            'Disable detailed error messages in production. Return generic error responses.',
          evidence: redactEvidence(target.body.slice(0, 200) + '...'),
        })
        break
      }
    }
  }

  return findings
}

/**
 * Check CORS configuration.
 */
function checkCorsConfiguration(target: ScanTarget): SecurityFinding[] {
  const findings: SecurityFinding[] = []
  const headers = Object.fromEntries(
    Object.entries(target.headers).map(([k, v]) => [k.toLowerCase(), v]),
  )

  const acao = headers['access-control-allow-origin']
  const acac = headers['access-control-allow-credentials']

  if (acao === '*' && acac === 'true') {
    findings.push({
      id: generateId(),
      severity: 'HIGH',
      title: 'CORS Misconfiguration: Wildcard with Credentials',
      description:
        'Access-Control-Allow-Origin is "*" while Access-Control-Allow-Credentials is "true". This is a dangerous combination that can lead to credential theft.',
      cweId: 'CWE-942',
      remediation: 'Never use wildcard (*) with credentials. Specify explicit origins instead.',
      evidence: redactEvidence(
        `Access-Control-Allow-Origin: *\nAccess-Control-Allow-Credentials: true`,
      ),
    })
  } else if (acao === '*') {
    findings.push({
      id: generateId(),
      severity: 'INFO',
      title: 'CORS: Wildcard Origin',
      description:
        'Access-Control-Allow-Origin is set to "*". While not always a vulnerability, this allows any origin to access the resource.',
      cweId: 'CWE-942',
      remediation: 'Consider restricting allowed origins to trusted domains.',
      evidence: 'Access-Control-Allow-Origin: *',
    })
  }

  return findings
}

/**
 * Check cookie security.
 */
function checkCookieSecurity(target: ScanTarget): SecurityFinding[] {
  const findings: SecurityFinding[] = []
  const headers = Object.fromEntries(
    Object.entries(target.headers).map(([k, v]) => [k.toLowerCase(), v]),
  )

  const setCookie = headers['set-cookie']
  if (!setCookie) return findings

  const cookies = setCookie.split(/,(?=\s*\w+=)/)

  for (const cookie of cookies) {
    const cookieLower = cookie.toLowerCase()
    const cookieName = cookie.split('=')[0]?.trim() || 'unknown'

    if (!cookieLower.includes('secure')) {
      findings.push({
        id: generateId(),
        severity: 'MEDIUM',
        title: `Cookie "${cookieName}" Missing Secure Flag`,
        description: `The cookie "${cookieName}" does not have the Secure flag. It may be transmitted over unencrypted connections.`,
        cweId: 'CWE-614',
        remediation: 'Add the "Secure" attribute to the cookie.',
        evidence: redactEvidence(`Set-Cookie: ${cookie.slice(0, 100)}...`),
      })
    }

    if (!cookieLower.includes('httponly')) {
      findings.push({
        id: generateId(),
        severity: 'LOW',
        title: `Cookie "${cookieName}" Missing HttpOnly Flag`,
        description: `The cookie "${cookieName}" does not have the HttpOnly flag. It is accessible via JavaScript, increasing XSS risk.`,
        cweId: 'CWE-1004',
        remediation: 'Add the "HttpOnly" attribute to the cookie.',
        evidence: redactEvidence(`Set-Cookie: ${cookie.slice(0, 100)}...`),
      })
    }

    if (!cookieLower.includes('samesite')) {
      findings.push({
        id: generateId(),
        severity: 'LOW',
        title: `Cookie "${cookieName}" Missing SameSite Attribute`,
        description: `The cookie "${cookieName}" does not have a SameSite attribute. This may allow CSRF attacks.`,
        cweId: 'CWE-1275',
        remediation: 'Add "SameSite=Strict" or "SameSite=Lax" attribute.',
        evidence: redactEvidence(`Set-Cookie: ${cookie.slice(0, 100)}...`),
      })
    }
  }

  return findings
}

/**
 * Check for sensitive data in URL.
 */
function checkSensitiveDataInUrl(target: ScanTarget): SecurityFinding[] {
  const findings: SecurityFinding[] = []

  const sensitivePatterns = [
    { pattern: /[?&](?:api[_-]?key|apikey|key|token|access[_-]?token)=/i, name: 'API key/token' },
    { pattern: /[?&](?:password|passwd|pwd|secret)=/i, name: 'password' },
    { pattern: /[?&](?:auth|authorization)=/i, name: 'authorization' },
  ]

  for (const { pattern, name } of sensitivePatterns) {
    if (pattern.test(target.url)) {
      findings.push({
        id: generateId(),
        severity: 'HIGH',
        title: `Sensitive Data in URL: ${name}`,
        description: `The URL contains a ${name} parameter. URLs are logged in server logs, browser history, and referrer headers.`,
        cweId: 'CWE-598',
        remediation: `Move the ${name} to request headers or body instead of URL parameters.`,
        evidence: redactEvidence(`URL: ${target.url}`),
      })
    }
  }

  return findings
}

/**
 * Run all passive security checks on a response.
 */
export function passiveScan(target: ScanTarget): SecurityFinding[] {
  const findings: SecurityFinding[] = [
    ...checkSecurityHeaders(target),
    ...checkInformationDisclosure(target),
    ...checkCorsConfiguration(target),
    ...checkCookieSecurity(target),
    ...checkSensitiveDataInUrl(target),
  ]

  // Sort by severity
  const severityOrder: Record<SecuritySeverity, number> = {
    CRITICAL: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
    INFO: 4,
  }

  return findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
}

/**
 * Get summary counts by severity.
 */
export function getFindingsSummary(findings: SecurityFinding[]): Record<SecuritySeverity, number> {
  const summary: Record<SecuritySeverity, number> = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
    INFO: 0,
  }

  for (const finding of findings) {
    summary[finding.severity]++
  }

  return summary
}

/**
 * Calculate a security score (0-100) based on findings.
 */
export function calculateSecurityScore(findings: SecurityFinding[]): number {
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
