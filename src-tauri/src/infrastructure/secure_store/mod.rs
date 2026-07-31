//! Secure storage — OS Keychain integration.
//!
//! Following the coding rules:
//! - Main storage never contains raw secrets; use OS secure storage and persist references.
//! - Do not expose raw paths, stack traces, credentials or sensitive payloads.

use crate::error::StorageError;
use keyring::Entry;
use serde::{Deserialize, Serialize};
use tracing::debug;

/// Service name for keyring entries.
const SERVICE_NAME: &str = "com.restly.app";

/// Secret types supported by Restly.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum SecretType {
    /// Environment variable secret.
    EnvVar,
    /// Auth profile credential.
    AuthProfile,
    /// API key.
    ApiKey,
    /// Bearer token.
    BearerToken,
    /// Basic auth password.
    BasicAuth,
    /// Custom secret.
    Custom,
}

impl SecretType {
    /// Get the key prefix for this secret type.
    pub fn prefix(&self) -> &'static str {
        match self {
            Self::EnvVar => "env",
            Self::AuthProfile => "auth",
            Self::ApiKey => "apikey",
            Self::BearerToken => "bearer",
            Self::BasicAuth => "basic",
            Self::Custom => "custom",
        }
    }
}

/// Secret metadata (stored in DB, not keychain).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SecretMetadata {
    pub key: String,
    pub secret_type: SecretType,
    pub label: String,
    #[serde(default)]
    pub description: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

/// Secure storage using OS keychain.
pub struct SecureStore;

impl SecureStore {
    /// Store a secret value.
    pub fn set_secret(key: &str, value: &str) -> Result<(), StorageError> {
        debug!(key = %key, "Storing secret in keychain");

        let entry = Entry::new(SERVICE_NAME, key)
            .map_err(|e| StorageError::Database(format!("Keyring error: {e}")))?;

        entry
            .set_password(value)
            .map_err(|e| StorageError::Database(format!("Failed to store secret: {e}")))?;

        Ok(())
    }

    /// Retrieve a secret value.
    pub fn get_secret(key: &str) -> Result<Option<String>, StorageError> {
        let entry = Entry::new(SERVICE_NAME, key)
            .map_err(|e| StorageError::Database(format!("Keyring error: {e}")))?;

        match entry.get_password() {
            Ok(value) => Ok(Some(value)),
            Err(keyring::Error::NoEntry) => Ok(None),
            Err(e) => Err(StorageError::Database(format!("Failed to get secret: {e}"))),
        }
    }

    /// Check if a secret exists.
    pub fn has_secret(key: &str) -> Result<bool, StorageError> {
        let entry = Entry::new(SERVICE_NAME, key)
            .map_err(|e| StorageError::Database(format!("Keyring error: {e}")))?;

        match entry.get_password() {
            Ok(_) => Ok(true),
            Err(keyring::Error::NoEntry) => Ok(false),
            Err(e) => Err(StorageError::Database(format!(
                "Failed to check secret: {e}"
            ))),
        }
    }

    /// Delete a secret value.
    pub fn delete_secret(key: &str) -> Result<bool, StorageError> {
        debug!(key = %key, "Deleting secret from keychain");

        let entry = Entry::new(SERVICE_NAME, key)
            .map_err(|e| StorageError::Database(format!("Keyring error: {e}")))?;

        match entry.delete_credential() {
            Ok(()) => Ok(true),
            Err(keyring::Error::NoEntry) => Ok(false), // Already deleted
            Err(e) => Err(StorageError::Database(format!(
                "Failed to delete secret: {e}"
            ))),
        }
    }

    /// Store multiple secrets in batch.
    pub fn set_secrets_batch(secrets: &[(String, String)]) -> Result<usize, StorageError> {
        let mut count = 0;
        for (key, value) in secrets {
            Self::set_secret(key, value)?;
            count += 1;
        }
        debug!(count = count, "Stored secrets in batch");
        Ok(count)
    }

    /// Delete multiple secrets in batch.
    pub fn delete_secrets_batch(keys: &[String]) -> Result<usize, StorageError> {
        let mut count = 0;
        for key in keys {
            if Self::delete_secret(key)? {
                count += 1;
            }
        }
        debug!(count = count, "Deleted secrets in batch");
        Ok(count)
    }

    /// Generate a keychain key for an environment variable.
    pub fn env_var_key(env_id: &str, var_id: &str) -> String {
        format!("env:{env_id}:{var_id}")
    }

    /// Generate a keychain key for an auth profile.
    pub fn auth_profile_key(profile_id: &str) -> String {
        format!("auth:{profile_id}")
    }

    /// Generate a keychain key for an API key.
    pub fn api_key_key(key_id: &str) -> String {
        format!("apikey:{key_id}")
    }

    /// Generate a keychain key for a bearer token.
    pub fn bearer_token_key(token_id: &str) -> String {
        format!("bearer:{token_id}")
    }

    /// Generate a keychain key for basic auth.
    pub fn basic_auth_key(auth_id: &str) -> String {
        format!("basic:{auth_id}")
    }

    /// Generate a keychain key for a custom secret.
    pub fn custom_key(secret_id: &str) -> String {
        format!("custom:{secret_id}")
    }

    /// Generate a key based on secret type and ID.
    pub fn key_for_type(secret_type: SecretType, id: &str) -> String {
        format!("{}:{id}", secret_type.prefix())
    }

    /// Parse a key to extract secret type and ID.
    pub fn parse_key(key: &str) -> Option<(SecretType, String)> {
        let parts: Vec<&str> = key.splitn(2, ':').collect();
        if parts.len() != 2 {
            return None;
        }

        let secret_type = match parts[0] {
            "env" => SecretType::EnvVar,
            "auth" => SecretType::AuthProfile,
            "apikey" => SecretType::ApiKey,
            "bearer" => SecretType::BearerToken,
            "basic" => SecretType::BasicAuth,
            "custom" => SecretType::Custom,
            _ => return None,
        };

        Some((secret_type, parts[1].to_string()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn key_generation() {
        assert_eq!(
            SecureStore::env_var_key("env-1", "var-1"),
            "env:env-1:var-1"
        );
        assert_eq!(SecureStore::auth_profile_key("profile-1"), "auth:profile-1");
        assert_eq!(SecureStore::api_key_key("key-1"), "apikey:key-1");
        assert_eq!(SecureStore::bearer_token_key("token-1"), "bearer:token-1");
        assert_eq!(SecureStore::basic_auth_key("auth-1"), "basic:auth-1");
        assert_eq!(SecureStore::custom_key("secret-1"), "custom:secret-1");
    }

    #[test]
    fn key_for_type() {
        assert_eq!(
            SecureStore::key_for_type(SecretType::ApiKey, "123"),
            "apikey:123"
        );
        assert_eq!(
            SecureStore::key_for_type(SecretType::BearerToken, "456"),
            "bearer:456"
        );
    }

    #[test]
    fn parse_key_valid() {
        let result = SecureStore::parse_key("apikey:123");
        assert!(result.is_some());
        let (secret_type, id) = result.unwrap();
        assert_eq!(secret_type, SecretType::ApiKey);
        assert_eq!(id, "123");
    }

    #[test]
    fn parse_key_invalid() {
        assert!(SecureStore::parse_key("invalid").is_none());
        assert!(SecureStore::parse_key("unknown:123").is_none());
    }

    #[test]
    fn secret_type_prefix() {
        assert_eq!(SecretType::EnvVar.prefix(), "env");
        assert_eq!(SecretType::AuthProfile.prefix(), "auth");
        assert_eq!(SecretType::ApiKey.prefix(), "apikey");
        assert_eq!(SecretType::BearerToken.prefix(), "bearer");
        assert_eq!(SecretType::BasicAuth.prefix(), "basic");
        assert_eq!(SecretType::Custom.prefix(), "custom");
    }

    // Note: Actual keychain tests are skipped in CI as they require OS keychain access
}
