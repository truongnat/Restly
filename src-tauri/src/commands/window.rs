//! Window commands — window management.
//!
//! Following the coding rules:
//! - Commands are thin wrappers around infrastructure.
//! - Errors are converted to String for Tauri IPC.

use serde::{Deserialize, Serialize};
use tauri::Window;
use tracing::{debug, info};

/// Window state for persistence.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WindowState {
    pub width: f64,
    pub height: f64,
    pub x: f64,
    pub y: f64,
    pub is_maximized: bool,
    pub is_fullscreen: bool,
}

/// Window size configuration.
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WindowSize {
    pub width: f64,
    pub height: f64,
}

/// Window position configuration.
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WindowPosition {
    pub x: f64,
    pub y: f64,
}

/// Get the current window state.
#[tauri::command]
pub async fn get_window_state(window: Window) -> Result<WindowState, String> {
    let size = window.outer_size().map_err(|e| e.to_string())?;
    let position = window.outer_position().map_err(|e| e.to_string())?;
    let is_maximized = window.is_maximized().map_err(|e| e.to_string())?;
    let is_fullscreen = window.is_fullscreen().map_err(|e| e.to_string())?;

    Ok(WindowState {
        width: size.width as f64,
        height: size.height as f64,
        x: position.x as f64,
        y: position.y as f64,
        is_maximized,
        is_fullscreen,
    })
}

/// Restore window state from persisted data.
#[tauri::command]
pub async fn restore_window_state(window: Window, state: WindowState) -> Result<(), String> {
    debug!(
        width = state.width,
        height = state.height,
        x = state.x,
        y = state.y,
        "Restoring window state"
    );

    // Set size first
    window
        .set_size(tauri::LogicalSize::new(state.width, state.height))
        .map_err(|e| e.to_string())?;

    // Set position
    window
        .set_position(tauri::LogicalPosition::new(state.x, state.y))
        .map_err(|e| e.to_string())?;

    // Restore maximized state
    if state.is_maximized {
        window.maximize().map_err(|e| e.to_string())?;
    }

    info!("Window state restored");
    Ok(())
}

/// Minimize the window.
#[tauri::command]
pub async fn minimize_window(window: Window) -> Result<(), String> {
    debug!("Minimizing window");
    window.minimize().map_err(|e| e.to_string())
}

/// Toggle maximize state.
#[tauri::command]
pub async fn toggle_maximize(window: Window) -> Result<(), String> {
    debug!("Toggling maximize");
    let is_maximized = window.is_maximized().map_err(|e| e.to_string())?;
    if is_maximized {
        window.unmaximize().map_err(|e| e.to_string())
    } else {
        window.maximize().map_err(|e| e.to_string())
    }
}

/// Toggle fullscreen mode.
#[tauri::command]
pub async fn toggle_fullscreen(window: Window) -> Result<(), String> {
    debug!("Toggling fullscreen");
    let is_fullscreen = window.is_fullscreen().map_err(|e| e.to_string())?;
    window
        .set_fullscreen(!is_fullscreen)
        .map_err(|e| e.to_string())
}

/// Close the window.
#[tauri::command]
pub async fn close_window(window: Window) -> Result<(), String> {
    debug!("Closing window");
    window.close().map_err(|e| e.to_string())
}

/// Set window title.
#[tauri::command]
pub async fn set_window_title(window: Window, title: String) -> Result<(), String> {
    debug!(title = %title, "Setting window title");
    window.set_title(&title).map_err(|e| e.to_string())
}

/// Set window size.
#[tauri::command]
pub async fn set_window_size(window: Window, size: WindowSize) -> Result<(), String> {
    debug!(
        width = size.width,
        height = size.height,
        "Setting window size"
    );
    window
        .set_size(tauri::LogicalSize::new(size.width, size.height))
        .map_err(|e| e.to_string())
}

/// Set window position.
#[tauri::command]
pub async fn set_window_position(window: Window, position: WindowPosition) -> Result<(), String> {
    debug!(x = position.x, y = position.y, "Setting window position");
    window
        .set_position(tauri::LogicalPosition::new(position.x, position.y))
        .map_err(|e| e.to_string())
}

/// Set always on top.
#[tauri::command]
pub async fn set_always_on_top(window: Window, on_top: bool) -> Result<(), String> {
    debug!(on_top = on_top, "Setting always on top");
    window.set_always_on_top(on_top).map_err(|e| e.to_string())
}

/// Focus the window.
#[tauri::command]
pub async fn focus_window(window: Window) -> Result<(), String> {
    debug!("Focusing window");
    window.set_focus().map_err(|e| e.to_string())
}

/// Show the window.
#[tauri::command]
pub async fn show_window(window: Window) -> Result<(), String> {
    debug!("Showing window");
    window.show().map_err(|e| e.to_string())
}

/// Hide the window.
#[tauri::command]
pub async fn hide_window(window: Window) -> Result<(), String> {
    debug!("Hiding window");
    window.hide().map_err(|e| e.to_string())
}

/// Check if window is visible.
#[tauri::command]
pub async fn is_window_visible(window: Window) -> Result<bool, String> {
    window.is_visible().map_err(|e| e.to_string())
}

/// Center the window on screen.
#[tauri::command]
pub async fn center_window(window: Window) -> Result<(), String> {
    debug!("Centering window");
    window.center().map_err(|e| e.to_string())
}
