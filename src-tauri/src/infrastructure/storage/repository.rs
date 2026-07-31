//! Repository implementations for SQLite storage.
//!
//! Following the coding rules:
//! - Queries are parameterized (no string interpolation).
//! - Every write is transactional where possible.
//! - Errors are typed and traceable.

use crate::domain::{Collection, Environment, HistoryItem, HISTORY_MAX_ITEMS};
use crate::error::StorageError;
use crate::infrastructure::storage::Database;
use std::sync::Arc;
use tracing::debug;

/// Collection repository backed by SQLite.
pub struct CollectionRepository {
    db: Arc<Database>,
}

impl CollectionRepository {
    /// Create a new collection repository.
    pub fn new(db: Arc<Database>) -> Self {
        Self { db }
    }

    /// List all collections ordered by creation date.
    pub fn list(&self) -> Result<Vec<Collection>, StorageError> {
        self.db.with_conn(|conn| {
            let mut stmt = conn
                .prepare("SELECT id, name, open, data FROM collections ORDER BY created_at DESC")
                .map_err(|e| StorageError::Database(e.to_string()))?;

            let collections = stmt
                .query_map([], |row| {
                    let id: String = row.get(0)?;
                    let name: String = row.get(1)?;
                    let open: bool = row.get(2)?;
                    let data: String = row.get(3)?;
                    Ok((id, name, open, data))
                })
                .map_err(|e| StorageError::Database(e.to_string()))?
                .filter_map(|row| row.ok())
                .filter_map(|(id, name, open, data)| {
                    let mut collection: Collection = serde_json::from_str(&data).ok()?;
                    collection.id = id;
                    collection.name = name;
                    collection.open = open;
                    Some(collection)
                })
                .collect();

            Ok(collections)
        })
    }

    /// Get a collection by ID.
    pub fn get_by_id(&self, id: &str) -> Result<Option<Collection>, StorageError> {
        self.db.with_conn(|conn| {
            let result = conn.query_row(
                "SELECT id, name, open, data FROM collections WHERE id = ?1",
                [id],
                |row| {
                    let id: String = row.get(0)?;
                    let name: String = row.get(1)?;
                    let open: bool = row.get(2)?;
                    let data: String = row.get(3)?;
                    Ok((id, name, open, data))
                },
            );

            match result {
                Ok((id, name, open, data)) => {
                    let mut collection: Collection = serde_json::from_str(&data)
                        .map_err(|e| StorageError::Serialization(e.to_string()))?;
                    collection.id = id;
                    collection.name = name;
                    collection.open = open;
                    Ok(Some(collection))
                }
                Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
                Err(e) => Err(StorageError::Database(e.to_string())),
            }
        })
    }

    /// Save a collection (insert or update).
    pub fn save(&self, collection: &Collection) -> Result<(), StorageError> {
        self.db.with_conn(|conn| {
            let data = serde_json::to_string(collection)
                .map_err(|e| StorageError::Serialization(e.to_string()))?;

            conn.execute(
                "INSERT INTO collections (id, name, open, data, updated_at)
                 VALUES (?1, ?2, ?3, ?4, datetime('now'))
                 ON CONFLICT(id) DO UPDATE SET
                    name = ?2, open = ?3, data = ?4, updated_at = datetime('now')",
                rusqlite::params![collection.id, collection.name, collection.open, data],
            )
            .map_err(|e| StorageError::Database(e.to_string()))?;

            debug!(id = %collection.id, name = %collection.name, "Collection saved");
            Ok(())
        })
    }

    /// Delete a collection by ID.
    pub fn delete(&self, id: &str) -> Result<bool, StorageError> {
        self.db.with_conn(|conn| {
            let rows = conn
                .execute("DELETE FROM collections WHERE id = ?1", [id])
                .map_err(|e| StorageError::Database(e.to_string()))?;
            Ok(rows > 0)
        })
    }

    /// Get the count of collections.
    pub fn count(&self) -> Result<usize, StorageError> {
        self.db.with_conn(|conn| {
            let count: i64 = conn
                .query_row("SELECT COUNT(*) FROM collections", [], |row| row.get(0))
                .map_err(|e| StorageError::Database(e.to_string()))?;
            Ok(count as usize)
        })
    }

    /// Check if a collection exists.
    pub fn exists(&self, id: &str) -> Result<bool, StorageError> {
        self.db.with_conn(|conn| {
            let count: i64 = conn
                .query_row(
                    "SELECT COUNT(*) FROM collections WHERE id = ?1",
                    [id],
                    |row| row.get(0),
                )
                .map_err(|e| StorageError::Database(e.to_string()))?;
            Ok(count > 0)
        })
    }
}

/// Environment repository backed by SQLite.
pub struct EnvironmentRepository {
    db: Arc<Database>,
}

impl EnvironmentRepository {
    /// Create a new environment repository.
    pub fn new(db: Arc<Database>) -> Self {
        Self { db }
    }

    /// List all environments ordered by creation date.
    pub fn list(&self) -> Result<Vec<Environment>, StorageError> {
        self.db.with_conn(|conn| {
            let mut stmt = conn
                .prepare("SELECT id, name, color, data FROM environments ORDER BY created_at DESC")
                .map_err(|e| StorageError::Database(e.to_string()))?;

            let environments = stmt
                .query_map([], |row| {
                    let id: String = row.get(0)?;
                    let name: String = row.get(1)?;
                    let color: String = row.get(2)?;
                    let data: String = row.get(3)?;
                    Ok((id, name, color, data))
                })
                .map_err(|e| StorageError::Database(e.to_string()))?
                .filter_map(|row| row.ok())
                .filter_map(|(id, name, color, data)| {
                    let mut env: Environment = serde_json::from_str(&data).ok()?;
                    env.id = id;
                    env.name = name;
                    env.color = color;
                    Some(env)
                })
                .collect();

            Ok(environments)
        })
    }

    /// Get an environment by ID.
    pub fn get_by_id(&self, id: &str) -> Result<Option<Environment>, StorageError> {
        self.db.with_conn(|conn| {
            let result = conn.query_row(
                "SELECT id, name, color, data FROM environments WHERE id = ?1",
                [id],
                |row| {
                    let id: String = row.get(0)?;
                    let name: String = row.get(1)?;
                    let color: String = row.get(2)?;
                    let data: String = row.get(3)?;
                    Ok((id, name, color, data))
                },
            );

            match result {
                Ok((id, name, color, data)) => {
                    let mut env: Environment = serde_json::from_str(&data)
                        .map_err(|e| StorageError::Serialization(e.to_string()))?;
                    env.id = id;
                    env.name = name;
                    env.color = color;
                    Ok(Some(env))
                }
                Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
                Err(e) => Err(StorageError::Database(e.to_string())),
            }
        })
    }

    /// Get an environment by name.
    pub fn get_by_name(&self, name: &str) -> Result<Option<Environment>, StorageError> {
        self.db.with_conn(|conn| {
            let result = conn.query_row(
                "SELECT id, name, color, data FROM environments WHERE name = ?1",
                [name],
                |row| {
                    let id: String = row.get(0)?;
                    let name: String = row.get(1)?;
                    let color: String = row.get(2)?;
                    let data: String = row.get(3)?;
                    Ok((id, name, color, data))
                },
            );

            match result {
                Ok((id, name, color, data)) => {
                    let mut env: Environment = serde_json::from_str(&data)
                        .map_err(|e| StorageError::Serialization(e.to_string()))?;
                    env.id = id;
                    env.name = name;
                    env.color = color;
                    Ok(Some(env))
                }
                Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
                Err(e) => Err(StorageError::Database(e.to_string())),
            }
        })
    }

    /// Save an environment (insert or update).
    pub fn save(&self, env: &Environment) -> Result<(), StorageError> {
        self.db.with_conn(|conn| {
            let data = serde_json::to_string(env)
                .map_err(|e| StorageError::Serialization(e.to_string()))?;

            conn.execute(
                "INSERT INTO environments (id, name, color, data, updated_at)
                 VALUES (?1, ?2, ?3, ?4, datetime('now'))
                 ON CONFLICT(id) DO UPDATE SET
                    name = ?2, color = ?3, data = ?4, updated_at = datetime('now')",
                rusqlite::params![env.id, env.name, env.color, data],
            )
            .map_err(|e| StorageError::Database(e.to_string()))?;

            debug!(id = %env.id, name = %env.name, "Environment saved");
            Ok(())
        })
    }

    /// Delete an environment by ID.
    pub fn delete(&self, id: &str) -> Result<bool, StorageError> {
        self.db.with_conn(|conn| {
            let rows = conn
                .execute("DELETE FROM environments WHERE id = ?1", [id])
                .map_err(|e| StorageError::Database(e.to_string()))?;
            Ok(rows > 0)
        })
    }

    /// Get the count of environments.
    pub fn count(&self) -> Result<usize, StorageError> {
        self.db.with_conn(|conn| {
            let count: i64 = conn
                .query_row("SELECT COUNT(*) FROM environments", [], |row| row.get(0))
                .map_err(|e| StorageError::Database(e.to_string()))?;
            Ok(count as usize)
        })
    }
}

/// History repository backed by SQLite.
pub struct HistoryRepository {
    db: Arc<Database>,
}

impl HistoryRepository {
    /// Create a new history repository.
    pub fn new(db: Arc<Database>) -> Self {
        Self { db }
    }

    /// List history items (most recent first).
    pub fn list(&self, limit: usize) -> Result<Vec<HistoryItem>, StorageError> {
        self.db.with_conn(|conn| {
            let mut stmt = conn
                .prepare(
                    "SELECT id, method, url, status, status_text, duration_ms, timestamp, data
                     FROM history ORDER BY timestamp DESC LIMIT ?1",
                )
                .map_err(|e| StorageError::Database(e.to_string()))?;

            let items = stmt
                .query_map([limit], |row| {
                    let id: String = row.get(0)?;
                    let method: String = row.get(1)?;
                    let url: String = row.get(2)?;
                    let status: u16 = row.get(3)?;
                    let status_text: String = row.get(4)?;
                    let duration_ms: Option<f64> = row.get(5)?;
                    let timestamp: String = row.get(6)?;
                    let data: String = row.get(7)?;
                    Ok((
                        id,
                        method,
                        url,
                        status,
                        status_text,
                        duration_ms,
                        timestamp,
                        data,
                    ))
                })
                .map_err(|e| StorageError::Database(e.to_string()))?
                .filter_map(|row| row.ok())
                .filter_map(
                    |(id, method, url, status, status_text, duration_ms, timestamp, data)| {
                        let mut item: HistoryItem = serde_json::from_str(&data).ok()?;
                        item.id = id;
                        item.method = method;
                        item.url = url;
                        item.status = status;
                        item.status_text = status_text;
                        item.duration_ms = duration_ms;
                        // Parse timestamp
                        if let Ok(ts) = chrono::DateTime::parse_from_rfc3339(&timestamp) {
                            item.timestamp = ts.with_timezone(&chrono::Utc);
                        }
                        Some(item)
                    },
                )
                .collect();

            Ok(items)
        })
    }

    /// Search history by URL pattern.
    pub fn search_by_url(
        &self,
        pattern: &str,
        limit: usize,
    ) -> Result<Vec<HistoryItem>, StorageError> {
        self.db.with_conn(|conn| {
            let mut stmt = conn
                .prepare(
                    "SELECT id, method, url, status, status_text, duration_ms, timestamp, data
                     FROM history WHERE url LIKE ?1 ORDER BY timestamp DESC LIMIT ?2",
                )
                .map_err(|e| StorageError::Database(e.to_string()))?;

            let search_pattern = format!("%{pattern}%");
            let items = stmt
                .query_map(rusqlite::params![search_pattern, limit], |row| {
                    let id: String = row.get(0)?;
                    let method: String = row.get(1)?;
                    let url: String = row.get(2)?;
                    let status: u16 = row.get(3)?;
                    let status_text: String = row.get(4)?;
                    let duration_ms: Option<f64> = row.get(5)?;
                    let timestamp: String = row.get(6)?;
                    let data: String = row.get(7)?;
                    Ok((
                        id,
                        method,
                        url,
                        status,
                        status_text,
                        duration_ms,
                        timestamp,
                        data,
                    ))
                })
                .map_err(|e| StorageError::Database(e.to_string()))?
                .filter_map(|row| row.ok())
                .filter_map(
                    |(id, method, url, status, status_text, duration_ms, timestamp, data)| {
                        let mut item: HistoryItem = serde_json::from_str(&data).ok()?;
                        item.id = id;
                        item.method = method;
                        item.url = url;
                        item.status = status;
                        item.status_text = status_text;
                        item.duration_ms = duration_ms;
                        if let Ok(ts) = chrono::DateTime::parse_from_rfc3339(&timestamp) {
                            item.timestamp = ts.with_timezone(&chrono::Utc);
                        }
                        Some(item)
                    },
                )
                .collect();

            Ok(items)
        })
    }

    /// Filter history by HTTP method.
    pub fn filter_by_method(
        &self,
        method: &str,
        limit: usize,
    ) -> Result<Vec<HistoryItem>, StorageError> {
        self.db.with_conn(|conn| {
            let mut stmt = conn
                .prepare(
                    "SELECT id, method, url, status, status_text, duration_ms, timestamp, data
                     FROM history WHERE method = ?1 ORDER BY timestamp DESC LIMIT ?2",
                )
                .map_err(|e| StorageError::Database(e.to_string()))?;

            let items = stmt
                .query_map(rusqlite::params![method, limit], |row| {
                    let id: String = row.get(0)?;
                    let method: String = row.get(1)?;
                    let url: String = row.get(2)?;
                    let status: u16 = row.get(3)?;
                    let status_text: String = row.get(4)?;
                    let duration_ms: Option<f64> = row.get(5)?;
                    let timestamp: String = row.get(6)?;
                    let data: String = row.get(7)?;
                    Ok((
                        id,
                        method,
                        url,
                        status,
                        status_text,
                        duration_ms,
                        timestamp,
                        data,
                    ))
                })
                .map_err(|e| StorageError::Database(e.to_string()))?
                .filter_map(|row| row.ok())
                .filter_map(
                    |(id, method, url, status, status_text, duration_ms, timestamp, data)| {
                        let mut item: HistoryItem = serde_json::from_str(&data).ok()?;
                        item.id = id;
                        item.method = method;
                        item.url = url;
                        item.status = status;
                        item.status_text = status_text;
                        item.duration_ms = duration_ms;
                        if let Ok(ts) = chrono::DateTime::parse_from_rfc3339(&timestamp) {
                            item.timestamp = ts.with_timezone(&chrono::Utc);
                        }
                        Some(item)
                    },
                )
                .collect();

            Ok(items)
        })
    }

    /// Add a history item.
    pub fn add(&self, item: &HistoryItem) -> Result<(), StorageError> {
        self.db.with_conn(|conn| {
            let data = serde_json::to_string(item)
                .map_err(|e| StorageError::Serialization(e.to_string()))?;

            conn.execute(
                "INSERT INTO history (id, method, url, status, status_text, duration_ms, timestamp, data)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
                rusqlite::params![
                    item.id,
                    item.method,
                    item.url,
                    item.status,
                    item.status_text,
                    item.duration_ms,
                    item.timestamp.to_rfc3339(),
                    data
                ],
            )
            .map_err(|e| StorageError::Database(e.to_string()))?;

            // Trim old entries
            conn.execute(
                "DELETE FROM history WHERE id NOT IN (
                    SELECT id FROM history ORDER BY timestamp DESC LIMIT ?1
                )",
                [HISTORY_MAX_ITEMS],
            )
            .map_err(|e| StorageError::Database(e.to_string()))?;

            debug!(id = %item.id, method = %item.method, url = %item.url, "History item added");
            Ok(())
        })
    }

    /// Clear all history.
    pub fn clear(&self) -> Result<usize, StorageError> {
        self.db.with_conn(|conn| {
            let rows = conn
                .execute("DELETE FROM history", [])
                .map_err(|e| StorageError::Database(e.to_string()))?;
            debug!(rows = rows, "History cleared");
            Ok(rows)
        })
    }

    /// Delete a specific history item.
    pub fn delete(&self, id: &str) -> Result<bool, StorageError> {
        self.db.with_conn(|conn| {
            let rows = conn
                .execute("DELETE FROM history WHERE id = ?1", [id])
                .map_err(|e| StorageError::Database(e.to_string()))?;
            Ok(rows > 0)
        })
    }

    /// Get the count of history items.
    pub fn count(&self) -> Result<usize, StorageError> {
        self.db.with_conn(|conn| {
            let count: i64 = conn
                .query_row("SELECT COUNT(*) FROM history", [], |row| row.get(0))
                .map_err(|e| StorageError::Database(e.to_string()))?;
            Ok(count as usize)
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn setup() -> Arc<Database> {
        Arc::new(Database::open_in_memory().unwrap())
    }

    #[test]
    fn collection_crud() {
        let db = setup();
        let repo = CollectionRepository::new(db);

        // Create
        let coll = Collection::new("Test API");
        repo.save(&coll).unwrap();

        // Read
        let list = repo.list().unwrap();
        assert_eq!(list.len(), 1);
        assert_eq!(list[0].name, "Test API");

        // Delete
        repo.delete(&coll.id).unwrap();
        let list = repo.list().unwrap();
        assert!(list.is_empty());
    }

    #[test]
    fn environment_crud() {
        let db = setup();
        let repo = EnvironmentRepository::new(db);

        let env = Environment::new("Production");
        repo.save(&env).unwrap();

        let list = repo.list().unwrap();
        assert_eq!(list.len(), 1);
        assert_eq!(list[0].name, "Production");
    }

    #[test]
    fn history_crud() {
        let db = setup();
        let repo = HistoryRepository::new(db);

        let item = HistoryItem::new("GET", "https://api.example.com", 200);
        repo.add(&item).unwrap();

        let list = repo.list(10).unwrap();
        assert_eq!(list.len(), 1);
        assert_eq!(list[0].method, "GET");

        repo.clear().unwrap();
        let list = repo.list(10).unwrap();
        assert!(list.is_empty());
    }
}
