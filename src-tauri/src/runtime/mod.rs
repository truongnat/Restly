//! Runtime state management.
//!
//! Following the coding rules:
//! - State contains service handles, repositories, job registries and immutable configuration.
//! - Do not store UI state in Rust.
//! - No mutable global statics.

use crate::infrastructure::http::HttpClient;
use crate::infrastructure::mock_server::MockServer;
use crate::infrastructure::storage::{
    CollectionRepository, Database, EnvironmentRepository, HistoryRepository,
};
use std::sync::Arc;
use tokio::sync::Mutex;

/// Application state shared across Tauri commands.
///
/// This is registered as Tauri managed state and injected into commands.
pub struct AppState {
    /// Shared HTTP client with connection pooling.
    pub http_client: Arc<HttpClient>,
    /// SQLite database.
    pub database: Arc<Database>,
    /// Collection repository.
    pub collections: Arc<CollectionRepository>,
    /// Environment repository.
    pub environments: Arc<EnvironmentRepository>,
    /// History repository.
    pub history: Arc<HistoryRepository>,
    /// Mock server (lazy initialized).
    pub mock_server: Arc<Mutex<Option<MockServer>>>,
}

impl AppState {
    /// Create new application state with default database path.
    pub fn new() -> Result<Self, crate::error::CommandError> {
        let db_path = Database::default_path();
        let database =
            Arc::new(Database::open(db_path).map_err(crate::error::CommandError::Storage)?);

        Ok(Self {
            http_client: Arc::new(HttpClient::new().map_err(crate::error::CommandError::Http)?),
            collections: Arc::new(CollectionRepository::new(database.clone())),
            environments: Arc::new(EnvironmentRepository::new(database.clone())),
            history: Arc::new(HistoryRepository::new(database.clone())),
            database,
            mock_server: Arc::new(Mutex::new(None)),
        })
    }

    /// Create application state with in-memory database (for testing).
    pub fn new_in_memory() -> Result<Self, crate::error::CommandError> {
        let database =
            Arc::new(Database::open_in_memory().map_err(crate::error::CommandError::Storage)?);

        Ok(Self {
            http_client: Arc::new(HttpClient::new().map_err(crate::error::CommandError::Http)?),
            collections: Arc::new(CollectionRepository::new(database.clone())),
            environments: Arc::new(EnvironmentRepository::new(database.clone())),
            history: Arc::new(HistoryRepository::new(database.clone())),
            database,
            mock_server: Arc::new(Mutex::new(None)),
        })
    }
}
