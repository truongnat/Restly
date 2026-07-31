//! Database migrations.
//!
//! Following the coding rules:
//! - Every schema is versioned.
//! - Migrations are ordered, transactional where possible, recoverable.

use crate::error::StorageError;
use rusqlite::Connection;
use tracing::info;

/// Current schema version.
pub const SCHEMA_VERSION: i32 = 1;

/// Run all pending migrations.
pub fn run_migrations(conn: &Connection) -> Result<(), StorageError> {
    // Enable WAL mode for better concurrency
    conn.execute_batch("PRAGMA journal_mode=WAL;")
        .map_err(|e| StorageError::Database(e.to_string()))?;

    // Create migrations table if not exists
    conn.execute(
        "CREATE TABLE IF NOT EXISTS _migrations (
            version INTEGER PRIMARY KEY,
            applied_at TEXT NOT NULL DEFAULT (datetime('now'))
        )",
        [],
    )
    .map_err(|e| StorageError::Migration(e.to_string()))?;

    // Get current version
    let current_version: i32 = conn
        .query_row(
            "SELECT COALESCE(MAX(version), 0) FROM _migrations",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0);

    info!(
        current_version,
        target_version = SCHEMA_VERSION,
        "Running migrations"
    );

    if current_version < 1 {
        migration_v1(conn)?;
    }

    Ok(())
}

/// Migration v1: Initial schema.
fn migration_v1(conn: &Connection) -> Result<(), StorageError> {
    info!("Applying migration v1: Initial schema");

    let tx = conn
        .unchecked_transaction()
        .map_err(|e| StorageError::Migration(e.to_string()))?;

    // Collections table
    tx.execute(
        "CREATE TABLE IF NOT EXISTS collections (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            open INTEGER NOT NULL DEFAULT 1,
            data TEXT NOT NULL DEFAULT '{}',
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        )",
        [],
    )
    .map_err(|e| StorageError::Migration(e.to_string()))?;

    // Environments table
    tx.execute(
        "CREATE TABLE IF NOT EXISTS environments (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            color TEXT NOT NULL DEFAULT 'bg-emerald-500',
            data TEXT NOT NULL DEFAULT '{}',
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        )",
        [],
    )
    .map_err(|e| StorageError::Migration(e.to_string()))?;

    // History table
    tx.execute(
        "CREATE TABLE IF NOT EXISTS history (
            id TEXT PRIMARY KEY,
            method TEXT NOT NULL,
            url TEXT NOT NULL,
            status INTEGER NOT NULL,
            status_text TEXT NOT NULL DEFAULT '',
            duration_ms REAL,
            timestamp TEXT NOT NULL DEFAULT (datetime('now')),
            data TEXT NOT NULL DEFAULT '{}'
        )",
        [],
    )
    .map_err(|e| StorageError::Migration(e.to_string()))?;

    // Index for history timestamp (for ordering)
    tx.execute(
        "CREATE INDEX IF NOT EXISTS idx_history_timestamp ON history(timestamp DESC)",
        [],
    )
    .map_err(|e| StorageError::Migration(e.to_string()))?;

    // Settings table (key-value)
    tx.execute(
        "CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )",
        [],
    )
    .map_err(|e| StorageError::Migration(e.to_string()))?;

    // Record migration
    tx.execute("INSERT INTO _migrations (version) VALUES (1)", [])
        .map_err(|e| StorageError::Migration(e.to_string()))?;

    tx.commit()
        .map_err(|e| StorageError::Migration(e.to_string()))?;

    info!("Migration v1 applied successfully");
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn migrations_run_on_fresh_db() {
        let conn = Connection::open_in_memory().unwrap();
        let result = run_migrations(&conn);
        assert!(result.is_ok());

        // Verify tables exist
        let count: i32 = conn
            .query_row(
                "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='collections'",
                [],
                |row| row.get(0),
            )
            .unwrap();
        assert_eq!(count, 1);
    }

    #[test]
    fn migrations_idempotent() {
        let conn = Connection::open_in_memory().unwrap();
        run_migrations(&conn).unwrap();
        let result = run_migrations(&conn);
        assert!(result.is_ok());
    }
}
