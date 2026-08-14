use axum::{
    extract::{Path, State},
    Json,
};
use serde_json::Value;
use std::sync::Arc;
use crate::mcp::server::McpState;

pub async fn c4_architecture(
    State(_state): State<Arc<McpState>>,
) -> Json<Value> {
    // In a full implementation, this queries the `AppGraph` and `SQLite` db
    // to return the current C4 architecture representation.
    let mock_response = serde_json::json!({
        "status": "success",
        "data": {
            "name": "twoballoons Architecture",
            "components": [
                { "id": "IngressGateway", "type": "Container", "tech": "Rust/Axum" },
                { "id": "IdentityService", "type": "Container", "tech": "Go" }
            ]
        }
    });
    Json(mock_response)
}

pub async fn get_page(
    Path(page_id): Path<String>,
    State(_state): State<Arc<McpState>>,
) -> Json<Value> {
    // Query sqlite FTS for page
    let mock_response = serde_json::json!({
        "status": "success",
        "data": {
            "id": page_id,
            "content": "# Markdown Content\nThis is a mocked response for the page."
        }
    });
    Json(mock_response)
}
