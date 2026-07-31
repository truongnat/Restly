//! Storage infrastructure — SQLite persistence.
//!
//! Following the coding rules:
//! - Commands access repositories/services, never files/databases directly.
//! - Every schema is versioned.
//! - Migrations are ordered, transactional where possible, recoverable and tested.
//! - Main storage never contains raw secrets; use OS secure storage and persist references.

mod database;
mod migrations;
mod repository;

pub use database::Database;
pub use repository::{CollectionRepository, EnvironmentRepository, HistoryRepository};
