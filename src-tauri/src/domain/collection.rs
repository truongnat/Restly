//! Collection domain types.

use serde::{Deserialize, Serialize};

/// A request item within a collection.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RequestItem {
    pub id: String,
    pub name: String,
    pub method: String,
    pub url: String,
}

/// A collection folder containing requests.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Collection {
    pub id: String,
    pub name: String,
    #[serde(default)]
    pub open: bool,
    #[serde(default)]
    pub requests: Vec<RequestItem>,
    #[serde(default)]
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    #[serde(default)]
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

impl Collection {
    /// Create a new collection with the given name.
    pub fn new(name: impl Into<String>) -> Self {
        let now = chrono::Utc::now();
        Self {
            id: uuid::Uuid::new_v4().to_string(),
            name: name.into(),
            open: true,
            requests: Vec::new(),
            created_at: Some(now),
            updated_at: Some(now),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn collection_new() {
        let coll = Collection::new("Test API");
        assert_eq!(coll.name, "Test API");
        assert!(coll.open);
        assert!(coll.requests.is_empty());
        assert!(coll.created_at.is_some());
    }

    #[test]
    fn collection_serde() {
        let coll = Collection::new("Test");
        let json = serde_json::to_string(&coll).unwrap();
        let parsed: Collection = serde_json::from_str(&json).unwrap();
        assert_eq!(parsed.id, coll.id);
        assert_eq!(parsed.name, coll.name);
    }
}
