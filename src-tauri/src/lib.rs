//! Restly — Desktop-first API client.
//!
//! Architecture:
//! ```text
//! commands → application → domain
//!               ↑
//!         infrastructure
//! ```
//!
//! Following the Tauri/Rust coding rules in `docs/engineering/tauri-rust-coding-rules.md`.

pub mod bootstrap;
pub mod commands;
pub mod contracts;
pub mod domain;
pub mod error;
pub mod infrastructure;
pub mod runtime;

// Re-export commonly used items
pub use runtime::AppState;

/// Run the Tauri application.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize tracing
    bootstrap::init_tracing();

    tracing::info!("Starting Restly...");

    // Create app state
    let app_state = bootstrap::create_app_state().expect("Failed to create app state");

    // Build and run Tauri app
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            // HTTP commands
            commands::send_http_request,
            commands::cancel_http_request,
            // Storage commands
            commands::list_collections,
            commands::save_collection,
            commands::delete_collection,
            commands::list_environments,
            commands::save_environment,
            commands::delete_environment,
            commands::list_history,
            commands::add_history_item,
            commands::clear_history,
            commands::delete_history_item,
            commands::get_setting,
            commands::set_setting,
            // Window commands
            commands::get_window_state,
            commands::restore_window_state,
            commands::minimize_window,
            commands::toggle_maximize,
            commands::toggle_fullscreen,
            commands::close_window,
            commands::set_window_title,
            commands::set_window_size,
            commands::set_window_position,
            commands::set_always_on_top,
            commands::focus_window,
            commands::show_window,
            commands::hide_window,
            commands::is_window_visible,
            commands::center_window,
            // Mock server commands
            commands::start_mock_server,
            commands::stop_mock_server,
            commands::get_mock_server_status,
            commands::add_mock_route,
            commands::remove_mock_route,
            commands::list_mock_routes,
            commands::clear_mock_routes,
            commands::get_mock_server_stats,
            commands::reset_mock_server_stats,
        ])
        .run(tauri::generate_context!())
        .expect("Error while running Restly");
}
