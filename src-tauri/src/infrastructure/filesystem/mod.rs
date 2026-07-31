//! Filesystem infrastructure.
//!
//! Following the coding rules:
//! - Canonicalize and validate paths.
//! - Bound import size.
//! - Handle overwrite explicitly.
//! - Clean temporary files.
//! - Prevent traversal and archive extraction attacks.

use crate::error::StorageError;
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};
use tracing::{debug, info};

/// Maximum import file size (10 MB).
const MAX_IMPORT_SIZE: u64 = 10 * 1024 * 1024;

/// Supported import formats.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum ImportFormat {
    Postman,
    OpenApi,
    Har,
    Curl,
    Restly,
}

impl ImportFormat {
    /// Detect format from file content.
    pub fn detect(content: &str) -> Option<Self> {
        // Try to parse as JSON first
        if let Ok(json) = serde_json::from_str::<serde_json::Value>(content) {
            // Postman collection
            if json.get("info").is_some_and(|i| i.get("name").is_some()) {
                return Some(Self::Postman);
            }
            // OpenAPI/Swagger
            if json.get("openapi").is_some() || json.get("swagger").is_some() {
                return Some(Self::OpenApi);
            }
            // HAR format
            if json.get("log").is_some_and(|l| l.get("entries").is_some()) {
                return Some(Self::Har);
            }
            // Restly format
            if json.get("restlyVersion").is_some() {
                return Some(Self::Restly);
            }
        }

        // Try YAML for OpenAPI
        if content.contains("openapi:") || content.contains("swagger:") {
            return Some(Self::OpenApi);
        }

        // cURL command
        if content.trim().starts_with("curl ") {
            return Some(Self::Curl);
        }

        None
    }
}

/// File dialog filter for collections.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileFilter {
    pub name: String,
    pub extensions: Vec<String>,
}

impl FileFilter {
    /// JSON file filter.
    pub fn json() -> Self {
        Self {
            name: "JSON Files".to_string(),
            extensions: vec!["json".to_string()],
        }
    }

    /// All supported import formats.
    pub fn import_formats() -> Vec<Self> {
        vec![
            Self {
                name: "Postman Collection".to_string(),
                extensions: vec!["json".to_string()],
            },
            Self {
                name: "OpenAPI/Swagger".to_string(),
                extensions: vec!["json".to_string(), "yaml".to_string(), "yml".to_string()],
            },
            Self {
                name: "HAR Archive".to_string(),
                extensions: vec!["har".to_string()],
            },
            Self {
                name: "All Supported".to_string(),
                extensions: vec![
                    "json".to_string(),
                    "yaml".to_string(),
                    "yml".to_string(),
                    "har".to_string(),
                ],
            },
        ]
    }
}

/// Validate and canonicalize a path, preventing traversal attacks.
pub fn validate_path(path: &Path, base_dir: &Path) -> Result<PathBuf, StorageError> {
    // Canonicalize base directory
    let canonical_base = base_dir
        .canonicalize()
        .map_err(|e| StorageError::Database(format!("Invalid base directory: {e}")))?;

    // Join and canonicalize the target path
    let target = canonical_base.join(path);
    let canonical_target = target
        .canonicalize()
        .map_err(|e| StorageError::Database(format!("Invalid path: {e}")))?;

    // Ensure the target is within the base directory
    if !canonical_target.starts_with(&canonical_base) {
        return Err(StorageError::Database(
            "Path traversal detected".to_string(),
        ));
    }

    Ok(canonical_target)
}

/// Read a file with size limit.
pub fn read_file_limited(path: &Path, max_size: u64) -> Result<String, StorageError> {
    let metadata = std::fs::metadata(path)
        .map_err(|e| StorageError::Database(format!("Failed to read file metadata: {e}")))?;

    if metadata.len() > max_size {
        return Err(StorageError::Database(format!(
            "File too large: {} bytes (max {} bytes)",
            metadata.len(),
            max_size
        )));
    }

    std::fs::read_to_string(path)
        .map_err(|e| StorageError::Database(format!("Failed to read file: {e}")))
}

/// Write a file atomically (write to temp, then rename).
pub fn write_file_atomic(path: &Path, content: &str) -> Result<(), StorageError> {
    let parent = path
        .parent()
        .ok_or_else(|| StorageError::Database("Invalid path: no parent".to_string()))?;

    // Ensure parent directory exists
    std::fs::create_dir_all(parent)
        .map_err(|e| StorageError::Database(format!("Failed to create directory: {e}")))?;

    // Write to temporary file
    let temp_path = path.with_extension("tmp");
    std::fs::write(&temp_path, content)
        .map_err(|e| StorageError::Database(format!("Failed to write temp file: {e}")))?;

    // Atomic rename
    std::fs::rename(&temp_path, path)
        .map_err(|e| StorageError::Database(format!("Failed to rename file: {e}")))?;

    debug!(path = %path.display(), "File written atomically");
    Ok(())
}

/// Get the default export directory.
pub fn default_export_dir() -> PathBuf {
    dirs::document_dir()
        .or_else(dirs::home_dir)
        .unwrap_or_else(|| PathBuf::from("."))
}

/// Import a Postman collection from JSON.
pub fn import_postman_collection(json_content: &str) -> Result<serde_json::Value, StorageError> {
    // Validate size
    if json_content.len() as u64 > MAX_IMPORT_SIZE {
        return Err(StorageError::Database(format!(
            "Import file too large (max {} MB)",
            MAX_IMPORT_SIZE / 1024 / 1024
        )));
    }

    // Parse JSON
    let value: serde_json::Value = serde_json::from_str(json_content)
        .map_err(|e| StorageError::Serialization(format!("Invalid JSON: {e}")))?;

    // Validate it looks like a Postman collection
    if !value.get("info").is_some_and(|i| i.get("name").is_some()) {
        return Err(StorageError::Serialization(
            "Not a valid Postman collection (missing info.name)".to_string(),
        ));
    }

    info!("Postman collection imported successfully");
    Ok(value)
}

/// Import an OpenAPI/Swagger specification.
pub fn import_openapi_spec(content: &str) -> Result<serde_json::Value, StorageError> {
    // Validate size
    if content.len() as u64 > MAX_IMPORT_SIZE {
        return Err(StorageError::Database(format!(
            "Import file too large (max {} MB)",
            MAX_IMPORT_SIZE / 1024 / 1024
        )));
    }

    // Try JSON first
    let value: serde_json::Value = if content.trim().starts_with('{') {
        serde_json::from_str(content)
            .map_err(|e| StorageError::Serialization(format!("Invalid JSON: {e}")))?
    } else {
        // Try YAML
        serde_yaml::from_str(content)
            .map_err(|e| StorageError::Serialization(format!("Invalid YAML: {e}")))?
    };

    // Validate it looks like an OpenAPI spec
    let has_openapi = value.get("openapi").is_some();
    let has_swagger = value.get("swagger").is_some();

    if !has_openapi && !has_swagger {
        return Err(StorageError::Serialization(
            "Not a valid OpenAPI/Swagger spec (missing openapi or swagger field)".to_string(),
        ));
    }

    let version = if has_openapi {
        value
            .get("openapi")
            .and_then(|v| v.as_str())
            .unwrap_or("3.x")
    } else {
        value
            .get("swagger")
            .and_then(|v| v.as_str())
            .unwrap_or("2.0")
    };

    info!(version = version, "OpenAPI spec imported successfully");
    Ok(value)
}

/// Import a HAR (HTTP Archive) file.
pub fn import_har(content: &str) -> Result<serde_json::Value, StorageError> {
    // Validate size
    if content.len() as u64 > MAX_IMPORT_SIZE {
        return Err(StorageError::Database(format!(
            "Import file too large (max {} MB)",
            MAX_IMPORT_SIZE / 1024 / 1024
        )));
    }

    // Parse JSON
    let value: serde_json::Value = serde_json::from_str(content)
        .map_err(|e| StorageError::Serialization(format!("Invalid JSON: {e}")))?;

    // Validate HAR structure
    if !value.get("log").is_some_and(|l| l.get("entries").is_some()) {
        return Err(StorageError::Serialization(
            "Not a valid HAR file (missing log.entries)".to_string(),
        ));
    }

    let entry_count = value
        .get("log")
        .and_then(|l| l.get("entries"))
        .and_then(|e| e.as_array())
        .map(|a| a.len())
        .unwrap_or(0);

    info!(entries = entry_count, "HAR file imported successfully");
    Ok(value)
}

/// Parse a cURL command into request components.
pub fn parse_curl_command(curl: &str) -> Result<CurlRequest, StorageError> {
    let curl = curl.trim();
    if !curl.starts_with("curl ") {
        return Err(StorageError::Serialization(
            "Not a valid cURL command".to_string(),
        ));
    }

    let mut request = CurlRequest {
        method: "GET".to_string(),
        ..Default::default()
    };

    // Tokenize the command
    let tokens = tokenize_curl(curl);
    let mut i = 0;

    while i < tokens.len() {
        let token = &tokens[i];
        match token.as_str() {
            "curl" => {
                // Skip the curl command itself
            }
            "-X" | "--request" => {
                i += 1;
                if i < tokens.len() {
                    request.method = tokens[i].to_uppercase();
                }
            }
            "-H" | "--header" => {
                i += 1;
                if i < tokens.len() {
                    let header = &tokens[i];
                    if let Some((key, value)) = header.split_once(':') {
                        request
                            .headers
                            .insert(key.trim().to_string(), value.trim().to_string());
                    }
                }
            }
            "-d" | "--data" | "--data-raw" | "--data-binary" => {
                i += 1;
                if i < tokens.len() {
                    request.body = Some(tokens[i].clone());
                    if request.method == "GET" {
                        request.method = "POST".to_string();
                    }
                }
            }
            _ if !token.starts_with('-') && request.url.is_empty() => {
                request.url = token.clone();
            }
            _ => {}
        }
        i += 1;
    }

    if request.url.is_empty() {
        return Err(StorageError::Serialization(
            "No URL found in cURL command".to_string(),
        ));
    }

    debug!(url = %request.url, method = %request.method, "Parsed cURL command");
    Ok(request)
}

/// Tokenize a cURL command, handling quoted strings.
fn tokenize_curl(input: &str) -> Vec<String> {
    let mut tokens = Vec::new();
    let mut current = String::new();
    let mut in_quotes = false;
    let mut quote_char = '"';

    for c in input.chars() {
        match c {
            '"' | '\'' if !in_quotes => {
                in_quotes = true;
                quote_char = c;
            }
            c if in_quotes && c == quote_char => {
                in_quotes = false;
            }
            ' ' | '\t' | '\n' if !in_quotes => {
                if !current.is_empty() {
                    tokens.push(current.clone());
                    current.clear();
                }
            }
            _ => current.push(c),
        }
    }

    if !current.is_empty() {
        tokens.push(current);
    }

    tokens
}

/// Parsed cURL request.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CurlRequest {
    pub method: String,
    pub url: String,
    #[serde(default)]
    pub headers: std::collections::HashMap<String, String>,
    #[serde(default)]
    pub body: Option<String>,
}

/// Export data to JSON file.
pub fn export_json(path: &Path, data: &impl Serialize) -> Result<(), StorageError> {
    let json = serde_json::to_string_pretty(data)
        .map_err(|e| StorageError::Serialization(e.to_string()))?;

    write_file_atomic(path, &json)
}

/// Export data to YAML file.
pub fn export_yaml(path: &Path, data: &impl Serialize) -> Result<(), StorageError> {
    let yaml =
        serde_yaml::to_string(data).map_err(|e| StorageError::Serialization(e.to_string()))?;

    write_file_atomic(path, &yaml)
}

/// Generate a cURL command from request components.
pub fn generate_curl_command(
    method: &str,
    url: &str,
    headers: &std::collections::HashMap<String, String>,
    body: Option<&str>,
) -> String {
    let mut parts = vec!["curl".to_string()];

    // Method (only if not GET)
    if method != "GET" {
        parts.push(format!("-X {method}"));
    }

    // URL
    parts.push(format!("'{url}'"));

    // Headers
    for (key, value) in headers {
        parts.push(format!("-H '{key}: {value}'"));
    }

    // Body
    if let Some(body) = body {
        parts.push(format!("-d '{body}'"));
    }

    parts.join(" \\\n  ")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn file_filter_json() {
        let filter = FileFilter::json();
        assert_eq!(filter.name, "JSON Files");
        assert!(filter.extensions.contains(&"json".to_string()));
    }

    #[test]
    fn import_postman_valid() {
        let json = r#"{"info": {"name": "Test API"}, "item": []}"#;
        let result = import_postman_collection(json);
        assert!(result.is_ok());
    }

    #[test]
    fn import_postman_invalid() {
        let json = r#"{"not": "a collection"}"#;
        let result = import_postman_collection(json);
        assert!(result.is_err());
    }

    #[test]
    fn import_openapi_json() {
        let json = r#"{"openapi": "3.0.0", "info": {"title": "Test", "version": "1.0"}}"#;
        let result = import_openapi_spec(json);
        assert!(result.is_ok());
    }

    #[test]
    fn import_swagger_json() {
        let json = r#"{"swagger": "2.0", "info": {"title": "Test", "version": "1.0"}}"#;
        let result = import_openapi_spec(json);
        assert!(result.is_ok());
    }

    #[test]
    fn import_har_valid() {
        let json = r#"{"log": {"entries": []}}"#;
        let result = import_har(json);
        assert!(result.is_ok());
    }

    #[test]
    fn import_har_invalid() {
        let json = r#"{"not": "har"}"#;
        let result = import_har(json);
        assert!(result.is_err());
    }

    #[test]
    fn parse_curl_simple() {
        let curl = "curl https://api.example.com/users";
        let result = parse_curl_command(curl);
        assert!(result.is_ok());
        let req = result.unwrap();
        assert_eq!(req.url, "https://api.example.com/users");
        assert_eq!(req.method, "GET");
    }

    #[test]
    fn parse_curl_with_method() {
        let curl = "curl -X POST https://api.example.com/users";
        let result = parse_curl_command(curl);
        assert!(result.is_ok());
        let req = result.unwrap();
        assert_eq!(req.method, "POST");
    }

    #[test]
    fn parse_curl_with_data() {
        let curl = r#"curl -d '{"name": "test"}' https://api.example.com/users"#;
        let result = parse_curl_command(curl);
        assert!(result.is_ok());
        let req = result.unwrap();
        assert_eq!(req.method, "POST"); // Auto-set to POST when data present
        assert!(req.body.is_some());
    }

    #[test]
    fn detect_format_postman() {
        let content = r#"{"info": {"name": "Test"}, "item": []}"#;
        assert_eq!(ImportFormat::detect(content), Some(ImportFormat::Postman));
    }

    #[test]
    fn detect_format_openapi() {
        let content = r#"{"openapi": "3.0.0"}"#;
        assert_eq!(ImportFormat::detect(content), Some(ImportFormat::OpenApi));
    }

    #[test]
    fn detect_format_har() {
        let content = r#"{"log": {"entries": []}}"#;
        assert_eq!(ImportFormat::detect(content), Some(ImportFormat::Har));
    }

    #[test]
    fn detect_format_curl() {
        let content = "curl https://example.com";
        assert_eq!(ImportFormat::detect(content), Some(ImportFormat::Curl));
    }

    #[test]
    fn generate_curl_basic() {
        let headers = std::collections::HashMap::new();
        let curl = generate_curl_command("GET", "https://example.com", &headers, None);
        assert!(curl.contains("curl"));
        assert!(curl.contains("https://example.com"));
        assert!(!curl.contains("-X")); // GET should not have -X
    }

    #[test]
    fn generate_curl_post() {
        let headers = std::collections::HashMap::new();
        let curl = generate_curl_command(
            "POST",
            "https://example.com",
            &headers,
            Some(r#"{"test": true}"#),
        );
        assert!(curl.contains("-X POST"));
        assert!(curl.contains("-d"));
    }
}
