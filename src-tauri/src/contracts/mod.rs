//! Command contracts — DTOs for Tauri command boundary.
//!
//! Following the coding rules:
//! - Never expose database entities across the boundary.
//! - Command/event contracts are versioned when persisted or externally consumed.

pub mod http;

pub use http::*;
