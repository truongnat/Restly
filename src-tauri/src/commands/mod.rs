//! Tauri commands — boundary layer.
//!
//! Following the coding rules:
//! - Commands validate boundary input, call a service and map safe output.
//! - Commands do not contain business orchestration or direct IO.
//! - Command handler: approximately 15–20 lines.
//! - All commands are async and return typed serializable DTOs.

pub mod http;
pub mod mock_server;
pub mod storage;
pub mod window;

pub use http::*;
pub use mock_server::*;
pub use storage::*;
pub use window::*;
