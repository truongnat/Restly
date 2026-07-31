//! Bootstrap — application initialization.
//!
//! Following the coding rules:
//! - `main.rs` only boots dependencies, plugins, state and commands.

use crate::error::CommandError;
use crate::runtime::AppState;
use tracing_subscriber::EnvFilter;

/// Initialize tracing subscriber with environment filter.
pub fn init_tracing() {
    let filter = EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| EnvFilter::new("info,restly_lib=debug"));

    tracing_subscriber::fmt()
        .with_env_filter(filter)
        .with_target(true)
        .with_thread_ids(true)
        .init();
}

/// Create application state.
pub fn create_app_state() -> Result<AppState, CommandError> {
    AppState::new()
}
