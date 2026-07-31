//! HTTP command contracts.

use crate::domain::{HttpAuth, HttpMethod, HttpResponse, ProxyConfig, TlsConfig};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Input for `send_http_request` command.
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SendHttpRequestInput {
    /// Unique identifier for this request run (for cancellation).
    pub run_id: String,
    pub method: HttpMethod,
    pub url: String,
    #[serde(default)]
    pub headers: HashMap<String, String>,
    #[serde(default)]
    pub body: Option<String>,
    /// Request timeout in milliseconds.
    #[serde(default = "default_timeout_ms")]
    pub timeout_ms: u64,
    /// Maximum response size in bytes.
    #[serde(default = "default_max_response_bytes")]
    pub max_response_bytes: u64,
    /// Whether to follow redirects.
    #[serde(default = "default_true")]
    pub follow_redirects: bool,
    /// Maximum redirect hops.
    #[serde(default = "default_max_redirects")]
    pub max_redirects: u32,
    /// Authentication configuration.
    #[serde(default)]
    pub auth: HttpAuth,
    /// Proxy configuration.
    #[serde(default)]
    pub proxy: Option<ProxyConfig>,
    /// TLS configuration.
    #[serde(default)]
    pub tls: TlsConfig,
}

const fn default_timeout_ms() -> u64 {
    30_000
}

const fn default_max_response_bytes() -> u64 {
    50 * 1024 * 1024
}

const fn default_true() -> bool {
    true
}

const fn default_max_redirects() -> u32 {
    10
}

impl SendHttpRequestInput {
    /// Convert to domain HttpRequest.
    pub fn to_domain(&self) -> crate::domain::HttpRequest {
        crate::domain::HttpRequest {
            method: self.method,
            url: self.url.clone(),
            headers: self.headers.clone(),
            body: self.body.clone(),
            timeout_ms: self.timeout_ms,
            max_response_bytes: self.max_response_bytes,
            follow_redirects: self.follow_redirects,
            max_redirects: self.max_redirects,
            auth: self.auth.clone(),
            proxy: self.proxy.clone(),
            tls: self.tls.clone(),
        }
    }
}

/// Output for `send_http_request` command.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SendHttpRequestOutput {
    /// The run_id for correlation.
    pub run_id: String,
    /// The HTTP response.
    #[serde(flatten)]
    pub response: HttpResponse,
}

/// Input for `cancel_http_request` command.
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CancelHttpRequestInput {
    pub run_id: String,
}

/// Output for `cancel_http_request` command.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CancelHttpRequestOutput {
    pub run_id: String,
    /// Whether the request was found and cancelled.
    pub cancelled: bool,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn input_deserialization() {
        let json = r#"{
            "runId": "test-123",
            "method": "POST",
            "url": "https://api.example.com/data",
            "headers": {"Content-Type": "application/json"},
            "body": "{\"key\": \"value\"}"
        }"#;

        let input: SendHttpRequestInput = serde_json::from_str(json).unwrap();
        assert_eq!(input.run_id, "test-123");
        assert_eq!(input.method, HttpMethod::Post);
        assert_eq!(input.timeout_ms, 30_000); // default
    }

    #[test]
    fn input_to_domain() {
        let input = SendHttpRequestInput {
            run_id: "test".to_string(),
            method: HttpMethod::Get,
            url: "https://example.com".to_string(),
            headers: HashMap::new(),
            body: None,
            timeout_ms: 5000,
            max_response_bytes: 1024,
            follow_redirects: false,
            max_redirects: 5,
            auth: HttpAuth::None,
            proxy: None,
            tls: TlsConfig::default(),
        };

        let domain = input.to_domain();
        assert_eq!(domain.timeout_ms, 5000);
        assert!(!domain.follow_redirects);
    }
}
