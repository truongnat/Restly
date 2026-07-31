//! Mock server infrastructure.
//!
//! Following the coding rules:
//! - Bind to 127.0.0.1 by default. LAN/public binding requires confirmation.
//! - Bound headers/bodies/connections.
//! - Release ports on shutdown.
//! - Do not expose filesystem/process execution to mock routes.

use axum::{
    extract::State,
    http::{HeaderMap, Method, StatusCode, Uri},
    response::{IntoResponse, Response},
    routing::any,
    Router,
};
use dashmap::DashMap;
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;
use tokio::sync::broadcast;
use tracing::{debug, info, warn};

/// Maximum mock response body size (1 MB).
const MAX_BODY_SIZE: usize = 1024 * 1024;

/// Maximum number of routes allowed.
const MAX_ROUTES: usize = 100;

/// A mock route definition.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MockRoute {
    pub id: String,
    pub method: String,
    pub path: String,
    pub status: u16,
    #[serde(default)]
    pub headers: std::collections::HashMap<String, String>,
    #[serde(default)]
    pub body: String,
    #[serde(default)]
    pub delay_ms: u64,
    /// Whether this route is enabled.
    #[serde(default = "default_true")]
    pub enabled: bool,
}

const fn default_true() -> bool {
    true
}

/// Mock server statistics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MockServerStats {
    pub total_requests: u64,
    pub matched_requests: u64,
    pub not_found_requests: u64,
}

/// Mock server state.
#[derive(Clone)]
pub struct MockServerState {
    routes: Arc<DashMap<String, MockRoute>>,
    shutdown_tx: broadcast::Sender<()>,
    stats: Arc<MockStats>,
}

/// Internal stats counters.
struct MockStats {
    total_requests: AtomicU64,
    matched_requests: AtomicU64,
    not_found_requests: AtomicU64,
}

impl Default for MockStats {
    fn default() -> Self {
        Self {
            total_requests: AtomicU64::new(0),
            matched_requests: AtomicU64::new(0),
            not_found_requests: AtomicU64::new(0),
        }
    }
}

impl MockServerState {
    /// Create new mock server state.
    pub fn new() -> (Self, broadcast::Receiver<()>) {
        let (shutdown_tx, shutdown_rx) = broadcast::channel(1);
        (
            Self {
                routes: Arc::new(DashMap::new()),
                shutdown_tx,
                stats: Arc::new(MockStats::default()),
            },
            shutdown_rx,
        )
    }

    /// Add or update a route.
    pub fn add_route(&self, route: MockRoute) -> Result<(), MockServerError> {
        // Validate route
        if route.path.is_empty() {
            return Err(MockServerError::InvalidPath(
                "Path cannot be empty".to_string(),
            ));
        }
        if !route.path.starts_with('/') {
            return Err(MockServerError::InvalidPath(
                "Path must start with '/'".to_string(),
            ));
        }
        if route.body.len() > MAX_BODY_SIZE {
            return Err(MockServerError::BodyTooLarge {
                size: route.body.len(),
                max: MAX_BODY_SIZE,
            });
        }

        // Check route limit (only for new routes)
        if !self.routes.contains_key(&route.id) && self.routes.len() >= MAX_ROUTES {
            return Err(MockServerError::TooManyRoutes { max: MAX_ROUTES });
        }

        debug!(route_id = %route.id, path = %route.path, method = %route.method, "Adding mock route");
        self.routes.insert(route.id.clone(), route);
        Ok(())
    }

    /// Remove a route.
    pub fn remove_route(&self, id: &str) -> bool {
        let removed = self.routes.remove(id).is_some();
        if removed {
            debug!(route_id = %id, "Removed mock route");
        }
        removed
    }

    /// List all routes.
    pub fn list_routes(&self) -> Vec<MockRoute> {
        self.routes.iter().map(|r| r.clone()).collect()
    }

    /// Get a route by ID.
    pub fn get_route(&self, id: &str) -> Option<MockRoute> {
        self.routes.get(id).map(|r| r.clone())
    }

    /// Clear all routes.
    pub fn clear_routes(&self) -> usize {
        let count = self.routes.len();
        self.routes.clear();
        debug!(count = count, "Cleared all mock routes");
        count
    }

    /// Find a matching route for a request.
    fn find_route(&self, method: &Method, path: &str) -> Option<MockRoute> {
        self.routes
            .iter()
            .find(|r| {
                r.enabled
                    && r.method.eq_ignore_ascii_case(method.as_str())
                    && self.path_matches(&r.path, path)
            })
            .map(|r| r.clone())
    }

    /// Check if a route path matches the request path.
    /// Supports wildcard patterns like `/api/*` and `/api/:id`.
    fn path_matches(&self, pattern: &str, path: &str) -> bool {
        // Exact match
        if pattern == path {
            return true;
        }

        // Wildcard match (e.g., /api/*)
        if pattern.ends_with("/*") {
            let prefix = &pattern[..pattern.len() - 1]; // Remove the *
            return path.starts_with(prefix);
        }

        // Parameter match (e.g., /api/:id)
        let pattern_parts: Vec<&str> = pattern.split('/').collect();
        let path_parts: Vec<&str> = path.split('/').collect();

        if pattern_parts.len() != path_parts.len() {
            return false;
        }

        pattern_parts
            .iter()
            .zip(path_parts.iter())
            .all(|(p, r)| p.starts_with(':') || p == r)
    }

    /// Get server statistics.
    pub fn stats(&self) -> MockServerStats {
        MockServerStats {
            total_requests: self.stats.total_requests.load(Ordering::Relaxed),
            matched_requests: self.stats.matched_requests.load(Ordering::Relaxed),
            not_found_requests: self.stats.not_found_requests.load(Ordering::Relaxed),
        }
    }

    /// Reset statistics.
    pub fn reset_stats(&self) {
        self.stats.total_requests.store(0, Ordering::Relaxed);
        self.stats.matched_requests.store(0, Ordering::Relaxed);
        self.stats.not_found_requests.store(0, Ordering::Relaxed);
    }

    /// Signal shutdown.
    pub fn shutdown(&self) {
        let _ = self.shutdown_tx.send(());
    }
}

impl Default for MockServerState {
    fn default() -> Self {
        Self::new().0
    }
}

/// Mock server errors.
#[derive(Debug, thiserror::Error)]
pub enum MockServerError {
    #[error("Invalid path: {0}")]
    InvalidPath(String),
    #[error("Body too large: {size} bytes (max {max})")]
    BodyTooLarge { size: usize, max: usize },
    #[error("Too many routes (max {max})")]
    TooManyRoutes { max: usize },
    #[error("Server error: {0}")]
    Server(String),
}

/// Handle incoming mock requests.
async fn mock_handler(
    State(state): State<MockServerState>,
    method: Method,
    uri: Uri,
    _headers: HeaderMap,
) -> Response {
    let path = uri.path();

    // Increment total requests
    state.stats.total_requests.fetch_add(1, Ordering::Relaxed);

    debug!(method = %method, path = %path, "Mock request received");

    match state.find_route(&method, path) {
        Some(route) => {
            state.stats.matched_requests.fetch_add(1, Ordering::Relaxed);

            // Apply delay if configured
            if route.delay_ms > 0 {
                tokio::time::sleep(tokio::time::Duration::from_millis(route.delay_ms)).await;
            }

            let mut response_headers = HeaderMap::new();
            for (key, value) in &route.headers {
                if let (Ok(name), Ok(val)) = (
                    key.parse::<axum::http::header::HeaderName>(),
                    value.parse::<axum::http::header::HeaderValue>(),
                ) {
                    response_headers.insert(name, val);
                }
            }

            // Default content-type if not set
            if !response_headers.contains_key(axum::http::header::CONTENT_TYPE) {
                response_headers.insert(
                    axum::http::header::CONTENT_TYPE,
                    "application/json".parse().unwrap(),
                );
            }

            let status = StatusCode::from_u16(route.status).unwrap_or(StatusCode::OK);

            // Truncate body if too large
            let body = if route.body.len() > MAX_BODY_SIZE {
                warn!(route_id = %route.id, "Mock response body truncated");
                route.body[..MAX_BODY_SIZE].to_string()
            } else {
                route.body
            };

            (status, response_headers, body).into_response()
        }
        None => {
            state
                .stats
                .not_found_requests
                .fetch_add(1, Ordering::Relaxed);

            // No matching route
            (
                StatusCode::NOT_FOUND,
                [(axum::http::header::CONTENT_TYPE, "application/json")],
                format!(
                    r#"{{"error": "No mock route for {} {}", "path": "{}", "method": "{}"}}"#,
                    method, path, path, method
                ),
            )
                .into_response()
        }
    }
}

/// Mock server handle for managing the server lifecycle.
pub struct MockServer {
    state: MockServerState,
    shutdown_rx: Option<broadcast::Receiver<()>>,
    addr: Option<SocketAddr>,
    running: bool,
}

impl MockServer {
    /// Create a new mock server (not started).
    pub fn new() -> Self {
        let (state, shutdown_rx) = MockServerState::new();
        Self {
            state,
            shutdown_rx: Some(shutdown_rx),
            addr: None,
            running: false,
        }
    }

    /// Get the server state for route management.
    pub fn state(&self) -> &MockServerState {
        &self.state
    }

    /// Check if the server is running.
    pub fn is_running(&self) -> bool {
        self.running
    }

    /// Start the mock server on 127.0.0.1 with the given port.
    ///
    /// Following the coding rules: Bind to 127.0.0.1 by default.
    pub async fn start(&mut self, port: u16) -> Result<SocketAddr, MockServerError> {
        if self.running {
            return Err(MockServerError::Server(
                "Server already running".to_string(),
            ));
        }

        let addr = SocketAddr::from(([127, 0, 0, 1], port));

        let app = Router::new()
            .route("/{*path}", any(mock_handler))
            .with_state(self.state.clone());

        info!(%addr, "Starting mock server");

        let listener = tokio::net::TcpListener::bind(addr)
            .await
            .map_err(|e| MockServerError::Server(format!("Failed to bind: {e}")))?;

        let local_addr = listener
            .local_addr()
            .map_err(|e| MockServerError::Server(format!("Failed to get local addr: {e}")))?;
        self.addr = Some(local_addr);

        // Take the shutdown receiver
        let mut shutdown_rx = self
            .shutdown_rx
            .take()
            .ok_or_else(|| MockServerError::Server("Shutdown channel already used".to_string()))?;

        // Spawn server task
        tokio::spawn(async move {
            axum::serve(listener, app)
                .with_graceful_shutdown(async move {
                    let _ = shutdown_rx.recv().await;
                    info!("Mock server graceful shutdown initiated");
                })
                .await
                .ok();
        });

        self.running = true;
        info!(%local_addr, "Mock server started");
        Ok(local_addr)
    }

    /// Get the bound address.
    pub fn addr(&self) -> Option<SocketAddr> {
        self.addr
    }

    /// Stop the mock server.
    pub fn stop(&mut self) {
        if self.running {
            self.state.shutdown();
            self.running = false;
            info!("Mock server stopped");
        }
    }
}

impl Default for MockServer {
    fn default() -> Self {
        Self::new()
    }
}

impl Drop for MockServer {
    fn drop(&mut self) {
        self.stop();
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_route(id: &str, method: &str, path: &str) -> MockRoute {
        MockRoute {
            id: id.to_string(),
            method: method.to_string(),
            path: path.to_string(),
            status: 200,
            headers: std::collections::HashMap::new(),
            body: r#"{"test": true}"#.to_string(),
            delay_ms: 0,
            enabled: true,
        }
    }

    #[test]
    fn mock_route_matching() {
        let state = MockServerState::default();

        state
            .add_route(create_test_route("route-1", "GET", "/api/users"))
            .unwrap();

        assert!(state.find_route(&Method::GET, "/api/users").is_some());
        assert!(state.find_route(&Method::POST, "/api/users").is_none());
        assert!(state.find_route(&Method::GET, "/api/other").is_none());
    }

    #[test]
    fn route_management() {
        let state = MockServerState::default();

        let route = create_test_route("route-1", "GET", "/test");
        state.add_route(route).unwrap();
        assert_eq!(state.list_routes().len(), 1);

        assert!(state.remove_route("route-1"));
        assert_eq!(state.list_routes().len(), 0);
    }

    #[test]
    fn route_validation() {
        let state = MockServerState::default();

        // Empty path should fail
        let route = create_test_route("route-1", "GET", "");
        assert!(state.add_route(route).is_err());

        // Path not starting with / should fail
        let route = create_test_route("route-1", "GET", "api/users");
        assert!(state.add_route(route).is_err());

        // Valid path should succeed
        let route = create_test_route("route-1", "GET", "/api/users");
        assert!(state.add_route(route).is_ok());
    }

    #[test]
    fn wildcard_path_matching() {
        let state = MockServerState::default();

        state
            .add_route(create_test_route("route-1", "GET", "/api/*"))
            .unwrap();

        assert!(state.find_route(&Method::GET, "/api/users").is_some());
        assert!(state.find_route(&Method::GET, "/api/users/123").is_some());
        assert!(state.find_route(&Method::GET, "/other").is_none());
    }

    #[test]
    fn parameter_path_matching() {
        let state = MockServerState::default();

        state
            .add_route(create_test_route("route-1", "GET", "/api/users/:id"))
            .unwrap();

        assert!(state.find_route(&Method::GET, "/api/users/123").is_some());
        assert!(state.find_route(&Method::GET, "/api/users/abc").is_some());
        assert!(state.find_route(&Method::GET, "/api/users").is_none());
        assert!(state
            .find_route(&Method::GET, "/api/users/123/posts")
            .is_none());
    }

    #[test]
    fn disabled_route_not_matched() {
        let state = MockServerState::default();

        let mut route = create_test_route("route-1", "GET", "/test");
        route.enabled = false;
        state.add_route(route).unwrap();

        assert!(state.find_route(&Method::GET, "/test").is_none());
    }

    #[test]
    fn stats_tracking() {
        let state = MockServerState::default();

        let stats = state.stats();
        assert_eq!(stats.total_requests, 0);
        assert_eq!(stats.matched_requests, 0);
        assert_eq!(stats.not_found_requests, 0);
    }
}
