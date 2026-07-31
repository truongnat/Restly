//! Domain layer — pure business types with no external dependencies.
//!
//! Following the coding rules:
//! - Domain does not depend on Tauri, HTTP, storage or filesystem.
//! - Units appear in names: `timeout_ms`, `response_size_bytes`.

pub mod collection;
pub mod environment;
pub mod history;
pub mod http;

pub use collection::*;
pub use environment::*;
pub use history::*;
pub use http::*;
