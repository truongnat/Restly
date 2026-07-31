//! Infrastructure layer — port implementations.
//!
//! Following the coding rules:
//! - Infrastructure implements ports defined in application.
//! - Reuse HTTP clients. Explicitly define timeout, redirects, proxy, TLS policies.
//! - TLS verification is never disabled by default.

pub mod filesystem;
pub mod http;
pub mod mock_server;
pub mod secure_store;
pub mod storage;

pub use secure_store::SecureStore;
pub use storage::Database;
