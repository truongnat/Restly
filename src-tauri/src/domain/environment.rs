//! Environment domain types.

use serde::{Deserialize, Serialize};

/// An environment variable.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnvVar {
    pub id: String,
    #[serde(default = "default_true")]
    pub enabled: bool,
    pub key: String,
    pub value: String,
    #[serde(default)]
    pub secret: bool,
    #[serde(default)]
    pub description: Option<String>,
}

const fn default_true() -> bool {
    true
}

/// An environment containing variables.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Environment {
    pub id: String,
    pub name: String,
    #[serde(default)]
    pub color: String,
    #[serde(default)]
    pub variables: Vec<EnvVar>,
    #[serde(default)]
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    #[serde(default)]
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

impl Environment {
    /// Create a new environment with the given name.
    pub fn new(name: impl Into<String>) -> Self {
        let now = chrono::Utc::now();
        Self {
            id: uuid::Uuid::new_v4().to_string(),
            name: name.into(),
            color: "bg-emerald-500".to_string(),
            variables: Vec::new(),
            created_at: Some(now),
            updated_at: Some(now),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn environment_new() {
        let env = Environment::new("Production");
        assert_eq!(env.name, "Production");
        assert_eq!(env.color, "bg-emerald-500");
        assert!(env.variables.is_empty());
    }

    #[test]
    fn env_var_serde() {
        let var = EnvVar {
            id: "var-1".to_string(),
            enabled: true,
            key: "API_KEY".to_string(),
            value: "secret123".to_string(),
            secret: true,
            description: Some("API authentication key".to_string()),
        };
        let json = serde_json::to_string(&var).unwrap();
        let parsed: EnvVar = serde_json::from_str(&json).unwrap();
        assert_eq!(parsed.key, "API_KEY");
        assert!(parsed.secret);
    }
}
