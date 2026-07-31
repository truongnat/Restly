//! Mock server commands.
//!
//! Following the coding rules:
//! - Commands are thin wrappers around infrastructure.
//! - Errors are converted to CommandError for Tauri IPC.

use crate::error::CommandError;
use crate::infrastructure::mock_server::{MockRoute, MockServer, MockServerStats};
use crate::runtime::AppState;
use serde::{Deserialize, Serialize};
use tauri::State;
use tracing::info;

/// Mock server status.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MockServerStatus {
    pub running: bool,
    pub port: Option<u16>,
    pub base_url: Option<String>,
    pub route_count: usize,
    pub stats: Option<MockServerStats>,
}

/// Start mock server input.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StartMockServerInput {
    #[serde(default = "default_port")]
    pub port: u16,
}

const fn default_port() -> u16 {
    4523
}

/// Start the mock server.
#[tauri::command]
pub async fn start_mock_server(
    state: State<'_, AppState>,
    input: Option<StartMockServerInput>,
) -> Result<MockServerStatus, CommandError> {
    let port = input.map(|i| i.port).unwrap_or(4523);

    let mut guard = state.mock_server.lock().await;

    // Check if already running
    if let Some(server) = guard.as_ref() {
        if server.is_running() {
            if let Some(addr) = server.addr() {
                return Ok(MockServerStatus {
                    running: true,
                    port: Some(addr.port()),
                    base_url: Some(format!("http://{}", addr)),
                    route_count: server.state().list_routes().len(),
                    stats: Some(server.state().stats()),
                });
            }
        }
    }

    // Create and start new server
    let mut server = MockServer::new();
    let addr = server
        .start(port)
        .await
        .map_err(|e| CommandError::Internal(format!("Failed to start mock server: {e}")))?;

    info!(%addr, "Mock server started");

    let status = MockServerStatus {
        running: true,
        port: Some(addr.port()),
        base_url: Some(format!("http://{}", addr)),
        route_count: 0,
        stats: Some(server.state().stats()),
    };

    *guard = Some(server);
    Ok(status)
}

/// Stop the mock server.
#[tauri::command]
pub async fn stop_mock_server(state: State<'_, AppState>) -> Result<(), CommandError> {
    let mut guard = state.mock_server.lock().await;

    if let Some(mut server) = guard.take() {
        server.stop();
        info!("Mock server stopped");
    }

    Ok(())
}

/// Get mock server status.
#[tauri::command]
pub async fn get_mock_server_status(
    state: State<'_, AppState>,
) -> Result<MockServerStatus, CommandError> {
    let guard = state.mock_server.lock().await;

    match guard.as_ref() {
        Some(server) => {
            let addr = server.addr();
            Ok(MockServerStatus {
                running: server.is_running(),
                port: addr.map(|a| a.port()),
                base_url: addr.map(|a| format!("http://{}", a)),
                route_count: server.state().list_routes().len(),
                stats: Some(server.state().stats()),
            })
        }
        None => Ok(MockServerStatus {
            running: false,
            port: None,
            base_url: None,
            route_count: 0,
            stats: None,
        }),
    }
}

/// Add a mock route.
#[tauri::command]
pub async fn add_mock_route(
    state: State<'_, AppState>,
    route: MockRoute,
) -> Result<(), CommandError> {
    let guard = state.mock_server.lock().await;

    match guard.as_ref() {
        Some(server) => {
            server
                .state()
                .add_route(route)
                .map_err(|e| CommandError::Internal(format!("Failed to add route: {e}")))?;
            Ok(())
        }
        None => Err(CommandError::Internal(
            "Mock server not running".to_string(),
        )),
    }
}

/// Remove a mock route.
#[tauri::command]
pub async fn remove_mock_route(
    state: State<'_, AppState>,
    id: String,
) -> Result<bool, CommandError> {
    let guard = state.mock_server.lock().await;

    match guard.as_ref() {
        Some(server) => Ok(server.state().remove_route(&id)),
        None => Err(CommandError::Internal(
            "Mock server not running".to_string(),
        )),
    }
}

/// List mock routes.
#[tauri::command]
pub async fn list_mock_routes(state: State<'_, AppState>) -> Result<Vec<MockRoute>, CommandError> {
    let guard = state.mock_server.lock().await;

    match guard.as_ref() {
        Some(server) => Ok(server.state().list_routes()),
        None => Ok(Vec::new()),
    }
}

/// Clear all mock routes.
#[tauri::command]
pub async fn clear_mock_routes(state: State<'_, AppState>) -> Result<usize, CommandError> {
    let guard = state.mock_server.lock().await;

    match guard.as_ref() {
        Some(server) => Ok(server.state().clear_routes()),
        None => Err(CommandError::Internal(
            "Mock server not running".to_string(),
        )),
    }
}

/// Get mock server statistics.
#[tauri::command]
pub async fn get_mock_server_stats(
    state: State<'_, AppState>,
) -> Result<MockServerStats, CommandError> {
    let guard = state.mock_server.lock().await;

    match guard.as_ref() {
        Some(server) => Ok(server.state().stats()),
        None => Ok(MockServerStats::default()),
    }
}

/// Reset mock server statistics.
#[tauri::command]
pub async fn reset_mock_server_stats(state: State<'_, AppState>) -> Result<(), CommandError> {
    let guard = state.mock_server.lock().await;

    match guard.as_ref() {
        Some(server) => {
            server.state().reset_stats();
            Ok(())
        }
        None => Err(CommandError::Internal(
            "Mock server not running".to_string(),
        )),
    }
}
