//! HTTP domain types.
//!
//! These types mirror the frontend `HttpExchangeResult` contract
//! defined in `src/entities/response.ts`.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Response contract version — must match frontend `RESPONSE_CONTRACT_VERSION`.
pub const RESPONSE_CONTRACT_VERSION: u8 = 1;

/// HTTP methods supported by Restly.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[serde(rename_all = "UPPERCASE")]
pub enum HttpMethod {
    #[default]
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Head,
    Options,
}

impl std::fmt::Display for HttpMethod {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let s = match self {
            HttpMethod::Get => "GET",
            HttpMethod::Post => "POST",
            HttpMethod::Put => "PUT",
            HttpMethod::Patch => "PATCH",
            HttpMethod::Delete => "DELETE",
            HttpMethod::Head => "HEAD",
            HttpMethod::Options => "OPTIONS",
        };
        write!(f, "{s}")
    }
}

/// Authentication type for HTTP requests.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, Default)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum HttpAuth {
    /// No authentication.
    #[default]
    None,
    /// Basic authentication (username/password).
    Basic { username: String, password: String },
    /// Bearer token authentication.
    Bearer { token: String },
    /// API key in header.
    ApiKeyHeader { key: String, value: String },
    /// API key in query parameter.
    ApiKeyQuery { key: String, value: String },
}

/// Proxy configuration.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProxyConfig {
    /// Proxy URL (e.g., "http://proxy:8080").
    pub url: String,
    /// Optional proxy authentication.
    #[serde(default)]
    pub username: Option<String>,
    #[serde(default)]
    pub password: Option<String>,
    /// Hosts to bypass proxy.
    #[serde(default)]
    pub bypass: Vec<String>,
}

/// TLS configuration options.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct TlsConfig {
    /// Whether to verify TLS certificates (default: true).
    /// Following coding rules: TLS verification is never disabled by default.
    #[serde(default = "default_true")]
    pub verify_certificates: bool,
    /// Custom CA certificate (PEM format).
    #[serde(default)]
    pub ca_certificate: Option<String>,
    /// Client certificate (PEM format).
    #[serde(default)]
    pub client_certificate: Option<String>,
    /// Client private key (PEM format).
    #[serde(default)]
    pub client_key: Option<String>,
}

/// An HTTP request to be executed.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HttpRequest {
    pub method: HttpMethod,
    pub url: String,
    #[serde(default)]
    pub headers: HashMap<String, String>,
    #[serde(default)]
    pub body: Option<String>,
    /// Request timeout in milliseconds. Default: 30_000.
    #[serde(default = "default_timeout_ms")]
    pub timeout_ms: u64,
    /// Maximum response size in bytes. Default: 50 MB.
    #[serde(default = "default_max_response_bytes")]
    pub max_response_bytes: u64,
    /// Whether to follow redirects.
    #[serde(default = "default_true")]
    pub follow_redirects: bool,
    /// Maximum redirect hops. Default: 10.
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
    50 * 1024 * 1024 // 50 MB
}

const fn default_true() -> bool {
    true
}

const fn default_max_redirects() -> u32 {
    10
}

/// Timing breakdown for an HTTP exchange.
///
/// [RULE:RESPONSE:UNKNOWN_METRICS_NULL]
/// Adapters must use null when the runtime cannot observe a metric.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponseTimings {
    pub dns_ms: Option<f64>,
    pub connect_ms: Option<f64>,
    pub tls_ms: Option<f64>,
    pub ttfb_ms: Option<f64>,
    pub download_ms: Option<f64>,
    pub total_ms: Option<f64>,
}

/// Size breakdown for an HTTP response.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponseSizes {
    pub encoded_body_bytes: Option<u64>,
    pub decoded_body_bytes: Option<u64>,
    pub downloaded_bytes: Option<u64>,
}

/// The result of an HTTP exchange.
///
/// This struct is serialized to the frontend and must match
/// `httpExchangeResultSchema` in `src/entities/response.ts`.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HttpResponse {
    /// Contract version for compatibility checking.
    pub version: u8,
    pub status: u16,
    pub status_text: String,
    pub headers: HashMap<String, String>,
    pub body: String,
    pub timings: ResponseTimings,
    pub sizes: ResponseSizes,
}

impl HttpResponse {
    /// Create a new response with the current contract version.
    pub fn new(status: u16, status_text: String) -> Self {
        Self {
            version: RESPONSE_CONTRACT_VERSION,
            status,
            status_text,
            headers: HashMap::new(),
            body: String::new(),
            timings: ResponseTimings::default(),
            sizes: ResponseSizes::default(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn http_method_display() {
        assert_eq!(HttpMethod::Get.to_string(), "GET");
        assert_eq!(HttpMethod::Post.to_string(), "POST");
        assert_eq!(HttpMethod::Delete.to_string(), "DELETE");
    }

    #[test]
    fn http_method_serde() {
        let json = serde_json::to_string(&HttpMethod::Post).unwrap();
        assert_eq!(json, "\"POST\"");

        let parsed: HttpMethod = serde_json::from_str("\"GET\"").unwrap();
        assert_eq!(parsed, HttpMethod::Get);
    }

    #[test]
    fn http_request_defaults() {
        let json = r#"{"method":"GET","url":"https://example.com"}"#;
        let req: HttpRequest = serde_json::from_str(json).unwrap();

        assert_eq!(req.timeout_ms, 30_000);
        assert_eq!(req.max_response_bytes, 50 * 1024 * 1024);
        assert!(req.follow_redirects);
        assert_eq!(req.max_redirects, 10);
    }

    #[test]
    fn http_response_contract_version() {
        let res = HttpResponse::new(200, "OK".to_string());
        assert_eq!(res.version, RESPONSE_CONTRACT_VERSION);
    }
}
