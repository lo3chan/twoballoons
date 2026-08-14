use axum::{
    routing::{get, post},
    Router,
    response::sse::{Event, Sse},
};
use futures_core::stream::Stream;
use tokio_stream::StreamExt;
use std::convert::Infallible;
use tokio_stream::wrappers::BroadcastStream;
use tokio::sync::broadcast;
use std::sync::Arc;

pub struct McpState {
    pub tx: broadcast::Sender<Event>,
}

pub async fn start_mcp_server() {
    let (tx, _rx) = broadcast::channel(100);
    let shared_state = Arc::new(McpState { tx });

    let app = Router::new()
        .route("/mcp/sse", get(sse_handler))
        .route("/mcp/message", post(message_handler))
        .route("/vault/architecture/c4", get(crate::mcp::resources::c4_architecture))
        .route("/vault/pages/:page_id", get(crate::mcp::resources::get_page))
        .with_state(shared_state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080").await.unwrap();
    println!("MCP Gateway Server listening on {}", listener.local_addr().unwrap());

    axum::serve(listener, app).await.unwrap();
}

async fn sse_handler(
    axum::extract::State(state): axum::extract::State<Arc<McpState>>,
) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    let rx = state.tx.subscribe();
    let stream = BroadcastStream::new(rx)
        .filter_map(|r| r.ok())
        .map(Ok::<Event, Infallible>);

    Sse::new(stream).keep_alive(axum::response::sse::KeepAlive::default())
}

async fn message_handler(
    axum::extract::State(_state): axum::extract::State<Arc<McpState>>,
    axum::Json(_payload): axum::Json<serde_json::Value>,
) -> axum::Json<serde_json::Value> {
    // This will route JSON-RPC 2.0 requests to tools and resources
    // For now we just return a mock success
    axum::Json(serde_json::json!({
        "jsonrpc": "2.0",
        "result": { "status": "received" }
    }))
}
