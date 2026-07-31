/**
 * SSE (Server-Sent Events) adapter — manages EventSource connections.
 * FEAT-06: WebSocket & Server-Sent Events (SSE) Realtime Client
 */

import type { ConnectionStatus, RealtimeFrame } from '@/entities/realtime-frame'
import { createFrame } from '@/entities/realtime-frame'

export interface SSEAdapterOptions {
  /** Maximum frames to keep in memory (default: 1000) */
  maxFrames?: number
  /** Custom event types to listen for (default: ['message']) */
  eventTypes?: string[]
  /** Include credentials for cross-origin requests */
  withCredentials?: boolean
}

type FrameCallback = (frame: RealtimeFrame) => void
type StatusCallback = (status: ConnectionStatus) => void

/**
 * SSE adapter using the EventSource API.
 */
export class SSEAdapter {
  private eventSource: EventSource | null = null
  private options: Required<SSEAdapterOptions>
  private frameCallbacks: FrameCallback[] = []
  private statusCallbacks: StatusCallback[] = []
  private frames: RealtimeFrame[] = []
  private status: ConnectionStatus = 'CLOSED'
  private url: string = ''

  constructor(options: SSEAdapterOptions = {}) {
    this.options = {
      maxFrames: options.maxFrames ?? 1000,
      eventTypes: options.eventTypes ?? ['message'],
      withCredentials: options.withCredentials ?? false,
    }
  }

  /**
   * Connect to an SSE endpoint.
   */
  connect(url: string): void {
    if (this.eventSource) {
      this.disconnect()
    }

    this.url = url
    this.setStatus('CONNECTING')

    try {
      this.eventSource = new EventSource(url, {
        withCredentials: this.options.withCredentials,
      })

      this.eventSource.onopen = () => {
        this.setStatus('OPEN')
        this.addFrame(createFrame('received', 'control', 'SSE connection established'))
      }

      // Listen for configured event types
      for (const eventType of this.options.eventTypes) {
        this.eventSource.addEventListener(eventType, (event) => {
          const messageEvent = event as MessageEvent
          this.addFrame(createFrame('received', 'text', messageEvent.data))
        })
      }

      this.eventSource.onerror = () => {
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          this.setStatus('CLOSED')
          this.addFrame(createFrame('received', 'control', 'SSE connection closed'))
        } else {
          this.setStatus('ERROR')
          this.addFrame(createFrame('received', 'control', 'SSE connection error'))
        }
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
   * Disconnect from the SSE endpoint.
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
      this.setStatus('CLOSED')
      this.addFrame(createFrame('received', 'control', 'SSE disconnected by client'))
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

  /**
   * Get the current URL.
   */
  getUrl(): string {
    return this.url
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
}
