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
use serde_json::Value;

pub struct McpState {
    pub tx: broadcast::Sender<Event>,
}

pub async fn start_mcp_server() {
    let (tx, _rx) = broadcast::channel(100);
    let shared_state = Arc::new(McpState { tx });

    let app = Router::new().without_v07_checks()
        .route("/mcp/sse", get(sse_handler))
        .route("/mcp/message", post(message_handler))
        .route("/vault/architecture/c4", get(crate::mcp::resources::c4_architecture))
        .route("/vault/pages/{page_id}", get(crate::mcp::resources::get_page))
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
    axum::Json(payload): axum::Json<Value>,
) -> axum::Json<Value> {
    let method = payload.get("method").and_then(|v| v.as_str()).unwrap_or("");
    let params = payload.get("params");
    let id = payload.get("id").unwrap_or(&serde_json::json!(null));

    let result = match method {
        "initialize" => {
            serde_json::json!({
                "protocolVersion": "2024-11-05",
                "capabilities": {
                    "tools": {}
                },
                "serverInfo": {
                    "name": "twoballoons-mcp",
                    "version": "0.1.0"
                }
            })
        },
        "tools/list" => {
            serde_json::json!({
                "tools": [
                    { "name": "twoballoons_query_graph", "description": "Query nodes and edges", "inputSchema": { "type": "object", "properties": {} } },
                    { "name": "twoballoons_evaluate_formula", "description": "Evaluate formula", "inputSchema": { "type": "object", "properties": {} } },
                    { "name": "twoballoons_export_diagram", "description": "Export diagram", "inputSchema": { "type": "object", "properties": { "format": { "type": "string" }, "source": { "type": "string" } } } },
                    { "name": "twoballoons_apply_patch", "description": "Apply patch", "inputSchema": { "type": "object", "properties": {} } }
                ]
            })
        },
        "tools/call" => {
            let tool_name = params.and_then(|p| p.get("name")).and_then(|v| v.as_str()).unwrap_or("");
            let tool_args = params.and_then(|p| p.get("arguments"));

            match tool_name {
                "twoballoons_query_graph" => serde_json::json!({ "content": [{ "type": "text", "text": "{\"nodes\": [], \"edges\": []}" }] }),
                "twoballoons_evaluate_formula" => serde_json::json!({ "content": [{ "type": "text", "text": "{\"result\": true}" }] }),
                "twoballoons_apply_patch" => serde_json::json!({ "content": [{ "type": "text", "text": "{\"status\": \"success\"}" }] }),
                "twoballoons_export_diagram" => {
                    let format = tool_args.and_then(|p| p.get("format")).and_then(|v| v.as_str()).unwrap_or("mermaid");
                    let source = tool_args.and_then(|p| p.get("source")).and_then(|v| v.as_str()).unwrap_or("");
                    if let Some(ast) = crate::ast::parser::parse_logi(source) {
                        use crate::ast::emitter::DiagramEmitter;
                        let diagram = match format { "mermaid" => crate::ast::mermaid::MermaidEmitter.emit(&ast), "plantuml" => crate::ast::plantuml::PlantUMLEmitter.emit(&ast), "dot" => crate::ast::dot::DotEmitter.emit(&ast), "tikz" => crate::ast::tikz::TikzEmitter.emit(&ast), _ => format!("Unsupported format: {}", format) };
                        serde_json::json!({ "content": [{ "type": "text", "text": diagram }] })
                    } else {
                        serde_json::json!({ "content": [{ "type": "text", "text": "Failed to parse source" }] })
                    }
                },
                _ => serde_json::json!({ "error": "Unknown tool" })
            }
        },
        _ => {
            serde_json::json!({ "error": format!("Unknown method: {}", method) })
        }
    };

    axum::Json(serde_json::json!({
        "jsonrpc": "2.0",
        "result": result,
        "id": id
    }))
}
