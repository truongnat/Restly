/**
 * Tauri window management adapter.
 *
 * Provides window control functions using Tauri's native window API.
 *
 * [RULE:TAURI:ADAPTER_BOUNDARY]
 * FE must not call Tauri directly outside infrastructure/adapters/tauri.
 */

import { invoke } from '@tauri-apps/api/core'

/**
 * Window state for persistence.
 */
export interface WindowState {
  width: number
  height: number
  x: number
  y: number
  isMaximized: boolean
  isFullscreen: boolean
}

/**
 * Window size configuration.
 */
export interface WindowSize {
  width: number
  height: number
}

/**
 * Window position configuration.
 */
export interface WindowPosition {
  x: number
  y: number
}

/**
 * Window management client.
 */
export interface WindowClient {
  getState(): Promise<WindowState>
  restoreState(state: WindowState): Promise<void>
  minimize(): Promise<void>
  toggleMaximize(): Promise<void>
  toggleFullscreen(): Promise<void>
  close(): Promise<void>
  setTitle(title: string): Promise<void>
  setSize(size: WindowSize): Promise<void>
  setPosition(position: WindowPosition): Promise<void>
  setAlwaysOnTop(onTop: boolean): Promise<void>
  focus(): Promise<void>
  show(): Promise<void>
  hide(): Promise<void>
  isVisible(): Promise<boolean>
  center(): Promise<void>
}

/**
 * Create a Tauri-based window client.
 */
export function createTauriWindowClient(): WindowClient {
  return {
    async getState(): Promise<WindowState> {
      return invoke<WindowState>('get_window_state')
    },

    async restoreState(state: WindowState): Promise<void> {
      await invoke('restore_window_state', { state })
    },

    async minimize(): Promise<void> {
      await invoke('minimize_window')
    },

    async toggleMaximize(): Promise<void> {
      await invoke('toggle_maximize')
    },

    async toggleFullscreen(): Promise<void> {
      await invoke('toggle_fullscreen')
    },

    async close(): Promise<void> {
      await invoke('close_window')
    },

    async setTitle(title: string): Promise<void> {
      await invoke('set_window_title', { title })
    },

    async setSize(size: WindowSize): Promise<void> {
      await invoke('set_window_size', { size })
    },

    async setPosition(position: WindowPosition): Promise<void> {
      await invoke('set_window_position', { position })
    },

    async setAlwaysOnTop(onTop: boolean): Promise<void> {
      await invoke('set_always_on_top', { onTop })
    },

    async focus(): Promise<void> {
      await invoke('focus_window')
    },

    async show(): Promise<void> {
      await invoke('show_window')
    },

    async hide(): Promise<void> {
      await invoke('hide_window')
    },

    async isVisible(): Promise<boolean> {
      return invoke<boolean>('is_window_visible')
    },

    async center(): Promise<void> {
      await invoke('center_window')
    },
  }
}
