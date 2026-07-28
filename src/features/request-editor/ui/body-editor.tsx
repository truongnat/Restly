import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import * as React from 'react'
import { useRef } from 'react'

import { useRestlyStore } from '@/app/store/restly-store'
import { resolveActiveEnvironment } from '@/application/use-cases/list-environments'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { MultipartFilesEditor } from '@/features/request-editor/ui/multipart-files-editor'
import type { EnvVarSubstituteItem } from '@/shared/lib/substitute-env'
import { getEnvResolutionTooltip, hasUnresolvedEnvTokens } from '@/shared/lib/substitute-env'
import { formatBody, validateBody } from '@/shared/lib/validate-body'
import { EnvAwareTextarea } from '@/shared/ui/env-aware-input'

hljs.registerLanguage('xml', xml)

const CONTENT_TYPES = [
  { label: 'JSON (application/json)', value: 'application/json' },
  { label: 'GraphQL', value: 'application/graphql' },
  { label: 'Text (text/plain)', value: 'text/plain' },
  { label: 'XML (application/xml)', value: 'application/xml' },
  { label: 'Form URL Encoded', value: 'application/x-www-form-urlencoded' },
  { label: 'Multipart Form', value: 'multipart/form-data' },
]

const EXAMPLES: Record<string, string> = {
  'application/json':
    '{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "age": 30,\n  "isActive": true\n}',
  'application/graphql': '{\n  "query": "query { viewer { id name } }",\n  "variables": {}\n}',
  'text/plain': 'Hello World',
  'application/xml':
    '<?xml version="1.0" encoding="UTF-8"?>\n<note>\n  <to>Tove</to>\n  <from>Jani</from>\n  <heading>Reminder</heading>\n  <body>Don\'t forget me this weekend!</body>\n</note>',
  'application/x-www-form-urlencoded': 'name=John+Doe&email=john%40example.com&age=30',
  'multipart/form-data': '',
}

function renderHighlightedJson(text: string, vars: EnvVarSubstituteItem[] = []): React.ReactNode {
  if (!text) return null

  const JSON_TOKEN_REGEX =
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|\{\{\s*[^}\s]+\s*\}\})/g

  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  const enabledKeys = new Set(
    vars.filter((v) => v.enabled !== false && Boolean(v.key)).map((v) => v.key.trim()),
  )

  const renderTextOrEnv = (str: string, keyPrefix: string, defaultClass?: string) => {
    const envRegex = /\{\{\s*([^}\s]+)\s*\}\}/g
    const result: React.ReactNode[] = []
    let lIdx = 0
    let eMatch: RegExpExecArray | null

    while ((eMatch = envRegex.exec(str)) !== null) {
      if (eMatch.index > lIdx) {
        const plain = str.slice(lIdx, eMatch.index)
        result.push(
          defaultClass ? (
            <span key={`${keyPrefix}-p-${lIdx}`} className={defaultClass}>
              {plain}
            </span>
          ) : (
            plain
          ),
        )
      }
      const fullToken = eMatch[0]
      const varName = eMatch[1]
      const isResolved = enabledKeys.has(varName)
      result.push(
        <span
          key={`${keyPrefix}-env-${eMatch.index}`}
          className={
            isResolved
              ? 'font-semibold text-teal-500 dark:text-teal-400'
              : 'rounded bg-destructive/10 px-0.5 font-bold text-destructive'
          }
        >
          {fullToken}
        </span>,
      )
      lIdx = envRegex.lastIndex
    }
    if (lIdx < str.length) {
      const remaining = str.slice(lIdx)
      result.push(
        defaultClass ? (
          <span key={`${keyPrefix}-p-${lIdx}`} className={defaultClass}>
            {remaining}
          </span>
        ) : (
          remaining
        ),
      )
    }
    return result
  }

  let count = 0
  while ((match = JSON_TOKEN_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plain = text.slice(lastIndex, match.index)
      nodes.push(<span key={`plain-${count++}`}>{plain}</span>)
    }

    const token = match[0]
    if (token.startsWith('"')) {
      if (token.endsWith(':')) {
        const keyText = token.slice(0, -1)
        nodes.push(
          <span key={`key-${count++}`}>
            <span className="font-medium text-sky-600 dark:text-sky-400">
              {renderTextOrEnv(keyText, `k-${count}`, 'font-medium text-sky-600 dark:text-sky-400')}
            </span>
            <span className="text-foreground">:</span>
          </span>,
        )
      } else {
        nodes.push(
          <span key={`str-${count++}`} className="text-emerald-600 dark:text-emerald-400">
            {renderTextOrEnv(token, `s-${count}`, 'text-emerald-600 dark:text-emerald-400')}
          </span>,
        )
      }
    } else if (token === 'true' || token === 'false' || token === 'null') {
      nodes.push(
        <span key={`bool-${count++}`} className="font-medium text-indigo-600 dark:text-indigo-400">
          {token}
        </span>,
      )
    } else if (/^-?\d/.test(token)) {
      nodes.push(
        <span key={`num-${count++}`} className="text-amber-600 dark:text-amber-400">
          {token}
        </span>,
      )
    } else if (token.startsWith('{{')) {
      const varName = token.replace(/\{\{\s*|\s*\}\}/g, '')
      const isResolved = enabledKeys.has(varName)
      nodes.push(
        <span
          key={`env-${count++}`}
          className={
            isResolved
              ? 'font-semibold text-teal-500 dark:text-teal-400'
              : 'rounded bg-destructive/10 px-0.5 font-bold text-destructive'
          }
        >
          {token}
        </span>,
      )
    }
    lastIndex = JSON_TOKEN_REGEX.lastIndex
  }

  if (lastIndex < text.length) {
    nodes.push(<span key={`plain-${count++}`}>{text.slice(lastIndex)}</span>)
  }

  return <>{nodes}</>
}

function JsonBodyEditor({
  value,
  onChange,
  placeholder,
  vars,
}: {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  vars: EnvVarSubstituteItem[]
}) {
  const preRef = useRef<HTMLPreElement>(null)
  const tooltipText = getEnvResolutionTooltip(value, vars)
  const hasUnresolved = hasUnresolvedEnvTokens(value, vars)

  const editorContainer = (
    <div
      className={`relative h-full min-h-0 w-full flex-1 rounded-lg border bg-transparent font-mono text-xs leading-relaxed transition-colors ${
        hasUnresolved ? 'border-destructive ring-1 ring-destructive/20' : 'border-input'
      }`}
    >
      <pre
        ref={preRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-auto p-2.5 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap text-foreground [font-kerning:none] [font-variant-ligatures:none]"
      >
        {renderHighlightedJson(value + (value.endsWith('\n') ? ' ' : ''), vars)}
      </pre>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={(e) => {
          if (preRef.current) {
            preRef.current.scrollTop = e.currentTarget.scrollTop
            preRef.current.scrollLeft = e.currentTarget.scrollLeft
          }
        }}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        placeholder={placeholder}
        className="absolute inset-0 h-full w-full resize-none overflow-auto border-0 bg-transparent p-2.5 font-mono text-xs leading-relaxed text-transparent caret-foreground outline-none [font-kerning:none] [font-variant-ligatures:none] selection:bg-accent selection:text-accent-foreground placeholder:text-muted-foreground"
      />
    </div>
  )

  if (!tooltipText) return editorContainer

  return (
    <Tooltip>
      <TooltipTrigger asChild>{editorContainer}</TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs font-mono text-xs break-all">
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  )
}

function renderXmlHighlight(text: string, vars: EnvVarSubstituteItem[] = []): string {
  if (!text) return ''

  const enabledKeys = new Set(
    vars.filter((v) => v.enabled !== false && Boolean(v.key)).map((v) => v.key.trim()),
  )

  const rawHtml = hljs.highlight(text + (text.endsWith('\n') ? ' ' : ''), {
    language: 'xml',
  }).value

  return rawHtml.replace(/\{\{\s*([^}\s]+)\s*\}\}/g, (match, varName) => {
    const isResolved = enabledKeys.has(varName)
    if (isResolved) {
      return `<span class="font-semibold text-teal-500 dark:text-teal-400">${match}</span>`
    }
    return `<span class="rounded bg-destructive/10 px-0.5 font-bold text-destructive">${match}</span>`
  })
}

function XmlBodyEditor({
  value,
  onChange,
  placeholder,
  vars,
}: {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  vars: EnvVarSubstituteItem[]
}) {
  const preRef = useRef<HTMLPreElement>(null)
  const tooltipText = getEnvResolutionTooltip(value, vars)
  const hasUnresolved = hasUnresolvedEnvTokens(value, vars)

  const editorContainer = (
    <div
      className={`relative h-full min-h-0 w-full flex-1 rounded-lg border bg-transparent font-mono text-xs leading-relaxed transition-colors ${
        hasUnresolved ? 'border-destructive ring-1 ring-destructive/20' : 'border-input'
      }`}
    >
      <pre
        ref={preRef}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: renderXmlHighlight(value, vars) }}
        className="pointer-events-none absolute inset-0 overflow-auto p-2.5 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap text-foreground [font-kerning:none] [font-variant-ligatures:none]"
      />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={(e) => {
          if (preRef.current) {
            preRef.current.scrollTop = e.currentTarget.scrollTop
            preRef.current.scrollLeft = e.currentTarget.scrollLeft
          }
        }}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        placeholder={placeholder}
        className="absolute inset-0 h-full w-full resize-none overflow-auto border-0 bg-transparent p-2.5 font-mono text-xs leading-relaxed text-transparent caret-foreground outline-none [font-kerning:none] [font-variant-ligatures:none] selection:bg-accent selection:text-accent-foreground placeholder:text-muted-foreground"
      />
    </div>
  )

  if (!tooltipText) return editorContainer

  return (
    <Tooltip>
      <TooltipTrigger asChild>{editorContainer}</TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs font-mono text-xs break-all">
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  )
}

function GraphQLBodyEditor({
  value,
  onChange,
  vars,
}: {
  value: string
  onChange: (v: string) => void
  vars: EnvVarSubstituteItem[]
}) {
  let query = 'query { }'
  let variables = '{\n  \n}'
  try {
    const parsed = JSON.parse(value || '{}') as { query?: string; variables?: unknown }
    if (typeof parsed.query === 'string') query = parsed.query
    if (parsed.variables !== undefined) {
      variables =
        typeof parsed.variables === 'string'
          ? parsed.variables
          : JSON.stringify(parsed.variables, null, 2)
    }
  } catch {
    /* keep defaults */
  }

  const commit = (nextQuery: string, nextVars: string) => {
    let variablesObj: unknown = {}
    try {
      variablesObj = JSON.parse(nextVars || '{}')
    } catch {
      variablesObj = {}
    }
    onChange(JSON.stringify({ query: nextQuery, variables: variablesObj }, null, 2))
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex min-h-0 flex-[1.4] flex-col gap-1">
        <Label className="text-[11px] text-muted-foreground">Query</Label>
        <EnvAwareTextarea
          value={query}
          onChange={(e) => commit(e.target.value, variables)}
          className="h-full min-h-[120px] flex-1 font-mono text-xs leading-relaxed"
          spellCheck={false}
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-1">
        <Label className="text-[11px] text-muted-foreground">Variables (JSON)</Label>
        <JsonBodyEditor value={variables} onChange={(v) => commit(query, v)} vars={vars} />
      </div>
    </div>
  )
}

export function BodyEditor() {
  const body = useRestlyStore((s) => s.body)
  const contentType = useRestlyStore((s) => s.contentType)
  const environmentId = useRestlyStore((s) => s.environmentId)
  const environments = useRestlyStore((s) => s.environments)
  const setBody = useRestlyStore((s) => s.setBody)
  const setContentType = useRestlyStore((s) => s.setContentType)
  const setHeaders = useRestlyStore((s) => s.setHeaders)

  const activeEnv = resolveActiveEnvironment(environments, environmentId)
  const vars = activeEnv?.variables ?? []

  const validation = validateBody(body, contentType)

  const handleContentTypeChange = (newContentType: string) => {
    setContentType(newContentType)
    const example = EXAMPLES[newContentType] ?? ''
    setBody(example)

    // Keep Headers tab in sync so Content-Type looks like a real request header.
    const headers = useRestlyStore.getState().headers
    const ctIdx = headers.findIndex((h) => h.key.toLowerCase() === 'content-type')
    if (newContentType === 'multipart/form-data') {
      const value = 'multipart/form-data; boundary=----RestlyFormBoundary'
      if (ctIdx >= 0) {
        const next = [...headers]
        next[ctIdx] = { ...next[ctIdx]!, value, enabled: true }
        setHeaders(next)
      } else {
        setHeaders([
          ...headers,
          {
            id: `h-ct-${Date.now()}`,
            enabled: true,
            key: 'Content-Type',
            value,
            description: 'Set from Body content type',
          },
        ])
      }
    } else if (newContentType === 'application/graphql') {
      // GraphQL over HTTP uses JSON payload + application/json Content-Type.
      const value = 'application/json'
      if (ctIdx >= 0) {
        const next = [...headers]
        next[ctIdx] = { ...next[ctIdx]!, value, enabled: true }
        setHeaders(next)
      } else {
        setHeaders([
          ...headers,
          {
            id: `h-ct-${Date.now()}`,
            enabled: true,
            key: 'Content-Type',
            value,
            description: 'GraphQL JSON body',
          },
        ])
      }
    } else if (ctIdx >= 0) {
      const next = [...headers]
      next[ctIdx] = { ...next[ctIdx]!, value: newContentType, enabled: true }
      setHeaders(next)
    } else if (newContentType) {
      setHeaders([
        ...headers,
        {
          id: `h-ct-${Date.now()}`,
          enabled: true,
          key: 'Content-Type',
          value: newContentType,
          description: 'Set from Body content type',
        },
      ])
    }
  }

  const handleFormat = () => {
    const res = formatBody(body, contentType)
    setBody(res.formatted)
  }

  const isXmlContent = contentType.toLowerCase().includes('xml')

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Label
            htmlFor="content-type-select"
            className="text-xs font-medium text-muted-foreground"
          >
            Content-Type:
          </Label>
          <Select value={contentType} onValueChange={handleContentTypeChange}>
            <SelectTrigger id="content-type-select" size="sm" className="w-[240px]">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_TYPES.map((ct) => (
                <SelectItem key={ct.value} value={ct.value}>
                  {ct.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {!contentType.toLowerCase().includes('multipart') && (
            <Button variant="outline" size="sm" onClick={handleFormat} className="h-8 text-xs">
              Format
            </Button>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5">
        {contentType === 'application/json' ? (
          <JsonBodyEditor
            value={body}
            onChange={setBody}
            placeholder={EXAMPLES['application/json']}
            vars={vars}
          />
        ) : contentType === 'application/graphql' ? (
          <GraphQLBodyEditor value={body} onChange={setBody} vars={vars} />
        ) : isXmlContent ? (
          <XmlBodyEditor
            value={body}
            onChange={setBody}
            placeholder={EXAMPLES['application/xml']}
            vars={vars}
          />
        ) : contentType === 'multipart/form-data' ? (
          <MultipartFilesEditor />
        ) : (
          <EnvAwareTextarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={EXAMPLES[contentType] || 'Enter request body here...'}
            className="h-full min-h-0 flex-1 font-mono text-xs leading-relaxed"
          />
        )}
        {!validation.isValid && validation.error && (
          <p className="shrink-0 text-xs font-medium text-destructive">{validation.error}</p>
        )}
      </div>
    </div>
  )
}
