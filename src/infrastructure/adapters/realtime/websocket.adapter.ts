/**
 * WebSocket adapter — manages WebSocket connections with auto ping/pong.
 * FEAT-06: WebSocket & Server-Sent Events (SSE) Realtime Client
 */

import type { ConnectionStatus, RealtimeFrame } from '@/entities/realtime-frame'
import { createFrame } from '@/entities/realtime-frame'

export interface WebSocketAdapterOptions {
  /** Auto ping interval in ms (default: 30000) */
  pingIntervalMs?: number
  /** Maximum frames to keep in memory (default: 1000) */
  maxFrames?: number
  /** Auto reconnect on close (default: false) */
  autoReconnect?: boolean
  /** Reconnect delay in ms (default: 3000) */
  reconnectDelayMs?: number
}

type FrameCallback = (frame: RealtimeFrame) => void
type StatusCallback = (status: ConnectionStatus) => void

/**
 * WebSocket adapter with frame tracking and auto ping.
 */
export class WebSocketAdapter {
  private ws: WebSocket | null = null
  private options: Required<WebSocketAdapterOptions>
  private frameCallbacks: FrameCallback[] = []
  private statusCallbacks: StatusCallback[] = []
  private pingTimer: ReturnType<typeof setInterval> | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private frames: RealtimeFrame[] = []
  private status: ConnectionStatus = 'CLOSED'
  private url: string = ''
  private headers: Record<string, string> = {}

  constructor(options: WebSocketAdapterOptions = {}) {
    this.options = {
      pingIntervalMs: options.pingIntervalMs ?? 30_000,
      maxFrames: options.maxFrames ?? 1000,
      autoReconnect: options.autoReconnect ?? false,
      reconnectDelayMs: options.reconnectDelayMs ?? 3000,
    }
  }

  /**
   * Connect to a WebSocket server.
   */
  connect(url: string, headers: Record<string, string> = {}): void {
    if (this.ws && this.status === 'OPEN') {
      this.disconnect()
    }

    this.url = url
    this.headers = headers
    this.setStatus('CONNECTING')

    try {
      // Note: Browser WebSocket API doesn't support custom headers
      // Headers are typically passed via subprotocols or query params
      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        this.setStatus('OPEN')
        this.startPingTimer()
        this.addFrame(createFrame('received', 'control', 'Connection established'))
      }

      this.ws.onmessage = (event) => {
        const payload = typeof event.data === 'string' ? event.data : '[Binary data]'
        const frameType = typeof event.data === 'string' ? 'text' : 'binary'
        this.addFrame(createFrame('received', frameType, payload))
      }

      this.ws.onclose = (event) => {
        this.stopPingTimer()
        this.addFrame(
          createFrame('received', 'control', `Connection closed: ${event.code} ${event.reason}`),
        )
        this.setStatus('CLOSED')

        if (this.options.autoReconnect && !event.wasClean) {
          this.scheduleReconnect()
        }
      }

      this.ws.onerror = () => {
        this.addFrame(createFrame('received', 'control', 'Connection error'))
        this.setStatus('ERROR')
      }
    } catch (error) {
      this.setStatus('ERROR')
      this.addFrame(
        createFrame(
          'received',
          'control',
          `Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ),
      )
    }
  }

  /**
   * Send a message through the WebSocket.
   */
  send(data: string | ArrayBuffer): void {
    if (!this.ws || this.status !== 'OPEN') {
      throw new Error('WebSocket is not connected')
    }

    this.ws.send(data)
    const payload = typeof data === 'string' ? data : `[Binary: ${data.byteLength} bytes]`
    this.addFrame(createFrame('sent', typeof data === 'string' ? 'text' : 'binary', payload))
  }

  /**
   * Send a ping frame.
   */
  ping(): void {
    if (this.ws && this.status === 'OPEN') {
      // Browser WebSocket doesn't support ping frames directly
      // Send a text ping message as workaround
      this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }))
      this.addFrame(createFrame('sent', 'ping', 'ping'))
    }
  }

  /**
   * Disconnect from the WebSocket server.
   */
  disconnect(): void {
    this.clearTimers()

    if (this.ws) {
      this.setStatus('CLOSING')
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
  }

  /**
   * Register a callback for incoming frames.
   */
  onFrame(callback: FrameCallback): () => void {
    this.frameCallbacks.push(callback)
    return () => {
      this.frameCallbacks = this.frameCallbacks.filter((cb) => cb !== callback)
    }
  }

  /**
   * Register a callback for status changes.
   */
  onStatusChange(callback: StatusCallback): () => void {
    this.statusCallbacks.push(callback)
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter((cb) => cb !== callback)
    }
  }

  /**
   * Get all recorded frames.
   */
  getFrames(): RealtimeFrame[] {
    return [...this.frames]
  }

  /**
   * Clear recorded frames.
   */
  clearFrames(): void {
    this.frames = []
  }

  /**
   * Get current connection status.
   */
  getStatus(): ConnectionStatus {
    return this.status
  }

  // Private methods

  private addFrame(frame: RealtimeFrame): void {
    this.frames.push(frame)
    if (this.frames.length > this.options.maxFrames) {
      this.frames = this.frames.slice(-this.options.maxFrames)
    }
    for (const cb of this.frameCallbacks) {
      cb(frame)
    }
  }

  private setStatus(status: ConnectionStatus): void {
    this.status = status
    for (const cb of this.statusCallbacks) {
      cb(status)
    }
  }

  private startPingTimer(): void {
    if (this.options.pingIntervalMs > 0) {
      this.pingTimer = setInterval(() => this.ping(), this.options.pingIntervalMs)
    }
  }

  private stopPingTimer(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer)
      this.pingTimer = null
    }
  }

  private scheduleReconnect(): void {
    this.reconnectTimer = setTimeout(() => {
      this.addFrame(createFrame('received', 'control', 'Attempting to reconnect...'))
      this.connect(this.url, this.headers)
    }, this.options.reconnectDelayMs)
  }

  private clearTimers(): void {
    this.stopPingTimer()
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }
}
