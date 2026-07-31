//! HTTP commands.
//!
//! Command naming: `<verb>_<domain_object>` — e.g., `send_http_request`.

use crate::contracts::{
    CancelHttpRequestInput, CancelHttpRequestOutput, SendHttpRequestInput, SendHttpRequestOutput,
};
use crate::error::CommandError;
use crate::runtime::AppState;
use tauri::State;
use tracing::info;

/// Send an HTTP request.
///
/// This command:
/// 1. Validates input
/// 2. Delegates to the HTTP client
/// 3. Maps the result to a safe output DTO
#[tauri::command]
pub async fn send_http_request(
    state: State<'_, AppState>,
    input: SendHttpRequestInput,
) -> Result<SendHttpRequestOutput, CommandError> {
    info!(run_id = %input.run_id, method = %input.method, "Sending HTTP request");

    let request = input.to_domain();
    let response = state.http_client.send(&input.run_id, request).await?;

    Ok(SendHttpRequestOutput {
        run_id: input.run_id,
        response,
    })
}

/// Cancel a running HTTP request.
#[tauri::command]
pub async fn cancel_http_request(
    state: State<'_, AppState>,
    input: CancelHttpRequestInput,
) -> Result<CancelHttpRequestOutput, CommandError> {
    info!(run_id = %input.run_id, "Cancelling HTTP request");

    let cancelled = state.http_client.cancel(&input.run_id);

    Ok(CancelHttpRequestOutput {
        run_id: input.run_id,
        cancelled,
    })
}
