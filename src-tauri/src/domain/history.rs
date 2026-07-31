//! History domain types.

use serde::{Deserialize, Serialize};

/// Maximum number of history items to retain.
pub const HISTORY_MAX_ITEMS: usize = 100;

/// Maximum body characters to store in history.
pub const HISTORY_BODY_MAX_CHARS: usize = 10_000;

/// A history item representing a past request.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HistoryItem {
    pub id: String,
    pub method: String,
    pub url: String,
    pub status: u16,
    pub status_text: String,
    #[serde(default)]
    pub duration_ms: Option<f64>,
    #[serde(default)]
    pub timestamp: chrono::DateTime<chrono::Utc>,
    // Draft snapshot for reopening
    #[serde(default)]
    pub headers: Option<serde_json::Value>,
    #[serde(default)]
    pub body: Option<String>,
    #[serde(default)]
    pub content_type: Option<String>,
}

impl HistoryItem {
    /// Create a new history item.
    pub fn new(method: impl Into<String>, url: impl Into<String>, status: u16) -> Self {
        Self {
            id: uuid::Uuid::new_v4().to_string(),
            method: method.into(),
            url: url.into(),
            status,
            status_text: String::new(),
            duration_ms: None,
            timestamp: chrono::Utc::now(),
            headers: None,
            body: None,
            content_type: None,
        }
    }

    /// Truncate body to max chars for storage.
    pub fn truncate_body(&mut self) {
        if let Some(body) = &self.body {
            if body.len() > HISTORY_BODY_MAX_CHARS {
                self.body = Some(body[..HISTORY_BODY_MAX_CHARS].to_string());
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn history_item_new() {
        let item = HistoryItem::new("GET", "https://api.example.com", 200);
        assert_eq!(item.method, "GET");
        assert_eq!(item.status, 200);
    }

    #[test]
    fn history_item_truncate_body() {
        let mut item = HistoryItem::new("POST", "https://api.example.com", 201);
        item.body = Some("x".repeat(20_000));
        item.truncate_body();
        assert_eq!(item.body.unwrap().len(), HISTORY_BODY_MAX_CHARS);
    }
}
