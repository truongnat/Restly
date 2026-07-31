//! Application layer — ports and services.
//!
//! Following the coding rules:
//! - Application defines ports and orchestration.
//! - Core services must be testable without starting Tauri.

pub mod ports;
pub mod services;
