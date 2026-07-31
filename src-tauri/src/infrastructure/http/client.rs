//! HTTP client implementation with reqwest.
//!
//! Following the coding rules:
//! - Reuse clients. Explicitly define timeout, redirects, proxy, TLS policies.
//! - TLS verification is never disabled by default.
//! - Bound redirect hops and response sizes.
//! - Redact headers and payloads before logs.

use crate::domain::{HttpAuth, HttpRequest, HttpResponse, ResponseSizes, ResponseTimings};
use crate::error::HttpError;
use dashmap::DashMap;
use std::sync::Arc;
use std::time::{Duration, Instant};
use tokio_util::sync::CancellationToken;
use tracing::{debug, instrument};

/// Default maximum response size: 50 MB.
const DEFAULT_MAX_RESPONSE_BYTES: u64 = 50 * 1024 * 1024;

/// Maximum number of active concurrent requests.
const MAX_CONCURRENT_REQUESTS: usize = 100;

/// HTTP client with connection pooling and cancellation support.
pub struct HttpClient {
    client: reqwest::Client,
    /// Active request cancellation tokens, keyed by run_id.
    cancellations: Arc<DashMap<String, CancellationToken>>,
}

impl HttpClient {
    /// Create a new HTTP client with default settings.
    pub fn new() -> Result<Self, HttpError> {
        let client = reqwest::Client::builder()
            // TLS verification is enabled by default (never disable)
            .use_rustls_tls()
            // Connection pool settings
            .pool_idle_timeout(Duration::from_secs(90))
            .pool_max_idle_per_host(10)
            // Cookie support
            .cookie_store(true)
            // Compression
            .gzip(true)
            .brotli(true)
            // We handle redirects manually to count hops
            .redirect(reqwest::redirect::Policy::none())
            // Default timeout (can be overridden per-request)
            .timeout(Duration::from_secs(30))
            .build()
            .map_err(|e| HttpError::Transport(e.to_string()))?;

        Ok(Self {
            client,
            cancellations: Arc::new(DashMap::new()),
        })
    }

    /// Create an HTTP client with proxy configuration.
    pub fn with_proxy(proxy_url: &str) -> Result<Self, HttpError> {
        let proxy = reqwest::Proxy::all(proxy_url)
            .map_err(|e| HttpError::Transport(format!("Invalid proxy URL: {e}")))?;

        let client = reqwest::Client::builder()
            .use_rustls_tls()
            .pool_idle_timeout(Duration::from_secs(90))
            .pool_max_idle_per_host(10)
            .cookie_store(true)
            .gzip(true)
            .brotli(true)
            .redirect(reqwest::redirect::Policy::none())
            .timeout(Duration::from_secs(30))
            .proxy(proxy)
            .build()
            .map_err(|e| HttpError::Transport(e.to_string()))?;

        Ok(Self {
            client,
            cancellations: Arc::new(DashMap::new()),
        })
    }

    /// Get the number of active requests.
    pub fn active_request_count(&self) -> usize {
        self.cancellations.len()
    }

    /// Register a cancellation token for a run.
    pub fn register_cancellation(&self, run_id: &str) -> CancellationToken {
        let token = CancellationToken::new();
        self.cancellations.insert(run_id.to_string(), token.clone());
        token
    }

    /// Cancel a running request by run_id.
    pub fn cancel(&self, run_id: &str) -> bool {
        if let Some((_, token)) = self.cancellations.remove(run_id) {
            token.cancel();
            debug!(run_id = %run_id, "Request cancelled");
            true
        } else {
            false
        }
    }

    /// Cancel all running requests.
    pub fn cancel_all(&self) -> usize {
        let count = self.cancellations.len();
        for entry in self.cancellations.iter() {
            entry.value().cancel();
        }
        self.cancellations.clear();
        debug!(count = count, "All requests cancelled");
        count
    }

    /// Execute an HTTP request with timing instrumentation.
    #[instrument(skip(self), fields(method = %request.method, url = %request.url))]
    pub async fn send(
        &self,
        run_id: &str,
        request: HttpRequest,
    ) -> Result<HttpResponse, HttpError> {
        // Check concurrent request limit
        if self.cancellations.len() >= MAX_CONCURRENT_REQUESTS {
            return Err(HttpError::Transport(format!(
                "Too many concurrent requests (max {MAX_CONCURRENT_REQUESTS})"
            )));
        }

        let start = Instant::now();

        // Get or create cancellation token
        let cancel_token = self
            .cancellations
            .get(run_id)
            .map(|t| t.clone())
            .unwrap_or_else(|| self.register_cancellation(run_id));

        // Validate URL
        let mut url = url::Url::parse(&request.url)
            .map_err(|e| HttpError::InvalidUrl(format!("{}: {}", request.url, e)))?;

        // Apply API key query parameter if configured
        if let HttpAuth::ApiKeyQuery { key, value } = &request.auth {
            url.query_pairs_mut().append_pair(key, value);
        }

        // Build reqwest request
        let method = match request.method {
            crate::domain::HttpMethod::Get => reqwest::Method::GET,
            crate::domain::HttpMethod::Post => reqwest::Method::POST,
            crate::domain::HttpMethod::Put => reqwest::Method::PUT,
            crate::domain::HttpMethod::Patch => reqwest::Method::PATCH,
            crate::domain::HttpMethod::Delete => reqwest::Method::DELETE,
            crate::domain::HttpMethod::Head => reqwest::Method::HEAD,
            crate::domain::HttpMethod::Options => reqwest::Method::OPTIONS,
        };

        let mut req_builder = self
            .client
            .request(method, url.clone())
            .timeout(Duration::from_millis(request.timeout_ms));

        // Add headers
        for (key, value) in &request.headers {
            req_builder = req_builder.header(key.as_str(), value.as_str());
        }

        // Apply authentication
        req_builder = self.apply_auth(req_builder, &request.auth)?;

        // Add body if present
        if let Some(body) = &request.body {
            req_builder = req_builder.body(body.clone());
        }

        // Execute with redirect handling
        let max_redirects = if request.follow_redirects {
            request.max_redirects
        } else {
            0
        };

        let response = self
            .execute_with_redirects(req_builder, max_redirects, &cancel_token)
            .await?;

        let ttfb_ms = start.elapsed().as_secs_f64() * 1000.0;

        // Read body with size limit
        let max_bytes = request.max_response_bytes.max(DEFAULT_MAX_RESPONSE_BYTES);
        let body_bytes = self
            .read_body_limited(response, max_bytes, &cancel_token)
            .await?;

        let download_ms = start.elapsed().as_secs_f64() * 1000.0 - ttfb_ms;
        let total_ms = start.elapsed().as_secs_f64() * 1000.0;

        // Cleanup cancellation token
        self.cancellations.remove(run_id);

        debug!(
            run_id = %run_id,
            status = %body_bytes.status,
            total_ms = %format!("{:.2}", total_ms),
            body_bytes = %body_bytes.encoded_bytes.unwrap_or(0),
            "HTTP request completed"
        );

        Ok(HttpResponse {
            version: crate::domain::RESPONSE_CONTRACT_VERSION,
            status: body_bytes.status,
            status_text: body_bytes.status_text,
            headers: body_bytes.headers,
            body: body_bytes.body,
            timings: ResponseTimings {
                dns_ms: None, // Not observable with reqwest
                connect_ms: None,
                tls_ms: None,
                ttfb_ms: Some(ttfb_ms),
                download_ms: Some(download_ms),
                total_ms: Some(total_ms),
            },
            sizes: ResponseSizes {
                encoded_body_bytes: body_bytes.encoded_bytes,
                decoded_body_bytes: body_bytes.decoded_bytes,
                downloaded_bytes: body_bytes.encoded_bytes,
            },
        })
    }

    /// Apply authentication to the request builder.
    fn apply_auth(
        &self,
        mut builder: reqwest::RequestBuilder,
        auth: &HttpAuth,
    ) -> Result<reqwest::RequestBuilder, HttpError> {
        match auth {
            HttpAuth::None => {}
            HttpAuth::Basic { username, password } => {
                builder = builder.basic_auth(username, Some(password));
            }
            HttpAuth::Bearer { token } => {
                builder = builder.bearer_auth(token);
            }
            HttpAuth::ApiKeyHeader { key, value } => {
                builder = builder.header(key.as_str(), value.as_str());
            }
            HttpAuth::ApiKeyQuery { .. } => {
                // Already handled in URL modification
            }
        }
        Ok(builder)
    }

    /// Execute request with manual redirect handling.
    async fn execute_with_redirects(
        &self,
        mut req_builder: reqwest::RequestBuilder,
        max_redirects: u32,
        cancel_token: &CancellationToken,
    ) -> Result<reqwest::Response, HttpError> {
        let mut redirect_count = 0;

        loop {
            // Check cancellation
            if cancel_token.is_cancelled() {
                return Err(HttpError::Cancelled);
            }

            let request = req_builder
                .build()
                .map_err(|e| HttpError::Transport(e.to_string()))?;

            // Race between request and cancellation
            let response = tokio::select! {
                res = self.client.execute(request) => {
                    res.map_err(|e| self.map_reqwest_error(e))?
                }
                _ = cancel_token.cancelled() => {
                    return Err(HttpError::Cancelled);
                }
            };

            // Handle redirects
            let status = response.status();
            if status.is_redirection() && redirect_count < max_redirects {
                if let Some(location) = response.headers().get(reqwest::header::LOCATION) {
                    if let Ok(location_str) = location.to_str() {
                        let new_url = response
                            .url()
                            .join(location_str)
                            .map_err(|e| HttpError::InvalidUrl(e.to_string()))?;

                        debug!(
                            redirect_count = redirect_count,
                            new_url = %new_url,
                            "Following redirect"
                        );

                        req_builder = self.client.get(new_url);
                        redirect_count += 1;
                        continue;
                    }
                }
            }

            if status.is_redirection() && redirect_count >= max_redirects {
                return Err(HttpError::TooManyRedirects { max: max_redirects });
            }

            return Ok(response);
        }
    }

    /// Read response body with size limit.
    async fn read_body_limited(
        &self,
        response: reqwest::Response,
        max_bytes: u64,
        cancel_token: &CancellationToken,
    ) -> Result<ResponseBody, HttpError> {
        let status = response.status().as_u16();
        let status_text = response
            .status()
            .canonical_reason()
            .unwrap_or("Unknown")
            .to_string();

        // Collect headers
        let headers: std::collections::HashMap<String, String> = response
            .headers()
            .iter()
            .filter_map(|(k, v)| v.to_str().ok().map(|v| (k.to_string(), v.to_string())))
            .collect();

        // Get content-length if available
        let content_length = response.content_length();

        // Check size limit before reading
        if let Some(len) = content_length {
            if len > max_bytes {
                return Err(HttpError::ResponseTooLarge {
                    size: len,
                    limit: max_bytes,
                });
            }
        }

        // Read body with cancellation
        let body_result = tokio::select! {
            res = response.bytes() => res,
            _ = cancel_token.cancelled() => {
                return Err(HttpError::Cancelled);
            }
        };

        let body_bytes = body_result.map_err(|e| HttpError::Transport(e.to_string()))?;

        // Check actual size
        if body_bytes.len() as u64 > max_bytes {
            return Err(HttpError::ResponseTooLarge {
                size: body_bytes.len() as u64,
                limit: max_bytes,
            });
        }

        let encoded_bytes = Some(body_bytes.len() as u64);

        // Convert to string (lossy for binary content)
        let body = String::from_utf8_lossy(&body_bytes).to_string();
        let decoded_bytes = Some(body.len() as u64);

        Ok(ResponseBody {
            status,
            status_text,
            headers,
            body,
            encoded_bytes,
            decoded_bytes,
        })
    }

    /// Map reqwest errors to our error types.
    fn map_reqwest_error(&self, err: reqwest::Error) -> HttpError {
        if err.is_timeout() {
            HttpError::Timeout { timeout_ms: 0 }
        } else if err.is_connect() {
            HttpError::Connection(err.to_string())
        } else if err.to_string().contains("tls") || err.to_string().contains("certificate") {
            HttpError::Tls(err.to_string())
        } else {
            HttpError::Transport(err.to_string())
        }
    }
}

impl Default for HttpClient {
    fn default() -> Self {
        Self::new().expect("Failed to create HTTP client")
    }
}

/// Internal struct for body reading result.
struct ResponseBody {
    status: u16,
    status_text: String,
    headers: std::collections::HashMap<String, String>,
    body: String,
    encoded_bytes: Option<u64>,
    decoded_bytes: Option<u64>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn client_creation() {
        let client = HttpClient::new();
        assert!(client.is_ok());
    }

    #[tokio::test]
    async fn cancellation_registration() {
        let client = HttpClient::new().unwrap();
        let token = client.register_cancellation("test-run");
        assert!(!token.is_cancelled());

        assert!(client.cancel("test-run"));
        assert!(token.is_cancelled());

        // Second cancel should return false
        assert!(!client.cancel("test-run"));
    }
}
