/**
 * Realtime frame entity — WebSocket & SSE message representation.
 * FEAT-06: WebSocket & Server-Sent Events (SSE) Realtime Client
 */

export type FrameDirection = 'sent' | 'received'
export type FrameType = 'text' | 'binary' | 'ping' | 'pong' | 'control'
export type ConnectionStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'ERROR'

export interface RealtimeFrame {
  id: string
  timestamp: number
  direction: FrameDirection
  type: FrameType
  payload: string
  sizeBytes: number
}

export interface RealtimeConnection {
  id: string
  url: string
  protocol: 'websocket' | 'sse'
  status: ConnectionStatus
  frames: RealtimeFrame[]
  connectedAt: number | null
  closedAt: number | null
  error: string | null
}

/**
 * Create a new realtime frame.
 */
export function createFrame(
  direction: FrameDirection,
  type: FrameType,
  payload: string,
): RealtimeFrame {
  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    direction,
    type,
    payload,
    sizeBytes: new TextEncoder().encode(payload).length,
  }
}

/**
 * Format frame size for display.
 */
export function formatFrameSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
