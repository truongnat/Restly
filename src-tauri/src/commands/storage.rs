//! Storage commands — persistence operations.

use crate::domain::{Collection, Environment, HistoryItem};
use crate::error::CommandError;
use crate::runtime::AppState;
use serde::Deserialize;
use tauri::State;
use tracing::info;

// ─── Collection Commands ────────────────────────────────────────────────────

/// List all collections.
#[tauri::command]
pub async fn list_collections(state: State<'_, AppState>) -> Result<Vec<Collection>, CommandError> {
    state.collections.list().map_err(CommandError::Storage)
}

/// Save a collection.
#[tauri::command]
pub async fn save_collection(
    state: State<'_, AppState>,
    collection: Collection,
) -> Result<(), CommandError> {
    info!(id = %collection.id, name = %collection.name, "Saving collection");
    state
        .collections
        .save(&collection)
        .map_err(CommandError::Storage)
}

/// Delete a collection.
#[tauri::command]
pub async fn delete_collection(
    state: State<'_, AppState>,
    id: String,
) -> Result<bool, CommandError> {
    info!(id = %id, "Deleting collection");
    state.collections.delete(&id).map_err(CommandError::Storage)
}

// ─── Environment Commands ───────────────────────────────────────────────────

/// List all environments.
#[tauri::command]
pub async fn list_environments(
    state: State<'_, AppState>,
) -> Result<Vec<Environment>, CommandError> {
    state.environments.list().map_err(CommandError::Storage)
}

/// Save an environment.
#[tauri::command]
pub async fn save_environment(
    state: State<'_, AppState>,
    environment: Environment,
) -> Result<(), CommandError> {
    info!(id = %environment.id, name = %environment.name, "Saving environment");
    state
        .environments
        .save(&environment)
        .map_err(CommandError::Storage)
}

/// Delete an environment.
#[tauri::command]
pub async fn delete_environment(
    state: State<'_, AppState>,
    id: String,
) -> Result<bool, CommandError> {
    info!(id = %id, "Deleting environment");
    state
        .environments
        .delete(&id)
        .map_err(CommandError::Storage)
}

// ─── History Commands ───────────────────────────────────────────────────────

/// Input for list_history command.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ListHistoryInput {
    #[serde(default = "default_limit")]
    pub limit: usize,
}

const fn default_limit() -> usize {
    50
}

/// List history items.
#[tauri::command]
pub async fn list_history(
    state: State<'_, AppState>,
    input: Option<ListHistoryInput>,
) -> Result<Vec<HistoryItem>, CommandError> {
    let limit = input.map(|i| i.limit).unwrap_or(50);
    state.history.list(limit).map_err(CommandError::Storage)
}

/// Add a history item.
#[tauri::command]
pub async fn add_history_item(
    state: State<'_, AppState>,
    item: HistoryItem,
) -> Result<(), CommandError> {
    state.history.add(&item).map_err(CommandError::Storage)
}

/// Clear all history.
#[tauri::command]
pub async fn clear_history(state: State<'_, AppState>) -> Result<usize, CommandError> {
    info!("Clearing history");
    state.history.clear().map_err(CommandError::Storage)
}

/// Delete a history item.
#[tauri::command]
pub async fn delete_history_item(
    state: State<'_, AppState>,
    id: String,
) -> Result<bool, CommandError> {
    state.history.delete(&id).map_err(CommandError::Storage)
}

// ─── Settings Commands ──────────────────────────────────────────────────────

/// Get a setting value.
#[tauri::command]
pub async fn get_setting(
    state: State<'_, AppState>,
    key: String,
) -> Result<Option<String>, CommandError> {
    state
        .database
        .with_conn(|conn| {
            let result =
                conn.query_row("SELECT value FROM settings WHERE key = ?1", [&key], |row| {
                    row.get(0)
                });
            match result {
                Ok(value) => Ok(Some(value)),
                Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
                Err(e) => Err(crate::error::StorageError::Database(e.to_string())),
            }
        })
        .map_err(CommandError::Storage)
}

/// Set a setting value.
#[tauri::command]
pub async fn set_setting(
    state: State<'_, AppState>,
    key: String,
    value: String,
) -> Result<(), CommandError> {
    state
        .database
        .with_conn(|conn| {
            conn.execute(
                "INSERT INTO settings (key, value) VALUES (?1, ?2)
                 ON CONFLICT(key) DO UPDATE SET value = ?2",
                rusqlite::params![key, value],
            )
            .map_err(|e| crate::error::StorageError::Database(e.to_string()))?;
            Ok(())
        })
        .map_err(CommandError::Storage)
}
