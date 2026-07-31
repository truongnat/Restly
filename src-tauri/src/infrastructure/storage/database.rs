//! Database connection management.

use crate::error::StorageError;
use crate::infrastructure::storage::migrations;
use rusqlite::Connection;
use std::path::PathBuf;
use std::sync::Mutex;
use tracing::info;

/// SQLite database wrapper with connection pooling.
pub struct Database {
    conn: Mutex<Connection>,
}

impl Database {
    /// Open database at the given path, creating directories if needed.
    pub fn open(path: PathBuf) -> Result<Self, StorageError> {
        // Ensure parent directory exists
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent)
                .map_err(|e| StorageError::Database(format!("Failed to create directory: {e}")))?;
        }

        info!(path = %path.display(), "Opening database");

        let conn = Connection::open(&path).map_err(|e| StorageError::Database(e.to_string()))?;

        // Run migrations
        migrations::run_migrations(&conn)?;

        Ok(Self {
            conn: Mutex::new(conn),
        })
    }

    /// Open an in-memory database (for testing).
    pub fn open_in_memory() -> Result<Self, StorageError> {
        let conn =
            Connection::open_in_memory().map_err(|e| StorageError::Database(e.to_string()))?;

        migrations::run_migrations(&conn)?;

        Ok(Self {
            conn: Mutex::new(conn),
        })
    }

    /// Get a locked connection for operations.
    pub fn with_conn<F, T>(&self, f: F) -> Result<T, StorageError>
    where
        F: FnOnce(&Connection) -> Result<T, StorageError>,
    {
        let conn = self
            .conn
            .lock()
            .map_err(|e| StorageError::Database(format!("Lock poisoned: {e}")))?;
        f(&conn)
    }

    /// Get the default database path for the current user.
    pub fn default_path() -> PathBuf {
        dirs::data_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("restly")
            .join("restly.db")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn open_in_memory() {
        let db = Database::open_in_memory();
        assert!(db.is_ok());
    }

    #[test]
    fn with_conn_works() {
        let db = Database::open_in_memory().unwrap();
        let result = db.with_conn(|conn| {
            let count: i32 = conn
                .query_row("SELECT 1", [], |row| row.get(0))
                .map_err(|e| StorageError::Database(e.to_string()))?;
            Ok(count)
        });
        assert_eq!(result.unwrap(), 1);
    }
}
