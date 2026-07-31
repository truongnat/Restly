//! HTTP client infrastructure using reqwest.
//!
//! Following the coding rules:
//! - Reuse clients.
//! - Explicitly define timeout, redirects, proxy, TLS, cookie and response-size policies.
//! - TLS verification is never disabled by default.
//! - Bound redirect hops and response sizes.
//! - Redact headers and payloads before logs.

mod client;

pub use client::HttpClient;
