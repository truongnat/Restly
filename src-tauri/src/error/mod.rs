//! Restly error types.
//!
//! Typed errors following the project coding rules:
//! - No `unwrap`, `expect` or `panic!` in production paths.
//! - Infrastructure errors are mapped to application/command errors.
//! - Frontend errors must be safe to serialize.

use thiserror::Error;

/// Top-level error type for Tauri commands.
#[derive(Debug, Error)]
pub enum CommandError {
    #[error("HTTP request failed: {0}")]
    Http(#[from] HttpError),

    #[error("Storage operation failed: {0}")]
    Storage(#[from] StorageError),

    #[error("Validation failed: {0}")]
    Validation(String),

    #[error("Operation cancelled: {run_id}")]
    Cancelled { run_id: String },

    #[error("Internal error: {0}")]
    Internal(String),
}

/// HTTP-specific errors.
#[derive(Debug, Error)]
pub enum HttpError {
    #[error("Invalid URL: {0}")]
    InvalidUrl(String),

    #[error("Request timeout after {timeout_ms}ms")]
    Timeout { timeout_ms: u64 },

    #[error("Connection failed: {0}")]
    Connection(String),

    #[error("TLS error: {0}")]
    Tls(String),

    #[error("Response too large: {size} bytes exceeds limit {limit} bytes")]
    ResponseTooLarge { size: u64, limit: u64 },

    #[error("Too many redirects (max {max})")]
    TooManyRedirects { max: u32 },

    #[error("Request cancelled")]
    Cancelled,

    #[error("Transport error: {0}")]
    Transport(String),
}

/// Storage-specific errors.
#[derive(Debug, Error)]
pub enum StorageError {
    #[error("Database error: {0}")]
    Database(String),

    #[error("Migration failed: {0}")]
    Migration(String),

    #[error("Item not found: {0}")]
    NotFound(String),

    #[error("Serialization error: {0}")]
    Serialization(String),
}

/// Serialize command errors safely for the frontend.
impl serde::Serialize for CommandError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}
