// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod graph;
mod ast;
mod mcp;

use std::sync::{Arc, Mutex};
use tauri::Manager;
use crate::graph::{NodeData, EdgeData};
use tauri::State;

#[tauri::command]
async fn add_node(
    id: String,
    label: String,
    kind: String,
    properties: std::collections::HashMap<String, String>,
    graph: State<'_, Arc<Mutex<graph::AppGraph>>>,
    db: State<'_, Arc<Mutex<db::DbClient>>>,
) -> Result<(), String> {
    // 1. Update in-memory graph
    {
        let mut g = graph.lock().unwrap();
        g.add_node(NodeData {
            id: id.clone(),
            label: label.clone(),
            kind: kind.clone(),
            properties: properties.clone(),
        });
    }

    // 2. Persist to SQLite
    let props_json = serde_json::to_string(&properties).unwrap_or_default();
    let db_guard = db.lock().unwrap();
    db_guard.insert_entity(
        &id,
        &kind,
        Some(&label),
        None,
        None,
        &props_json
    ).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn update_node_position(
    id: String,
    x: f64,
    y: f64,
    graph: State<'_, Arc<Mutex<graph::AppGraph>>>,
    db: State<'_, Arc<Mutex<db::DbClient>>>,
) -> Result<(), String> {
    // Basic implementation for position updating
    // 1. Update properties in memory
    let mut properties = std::collections::HashMap::new();
    {
        let mut g = graph.lock().unwrap();
        let idx = g.id_map.get(&id).copied();
        if let Some(idx) = idx {
            if let Some(node) = g.inner.node_weight_mut(idx) {
                node.properties.insert("x".to_string(), x.to_string());
                node.properties.insert("y".to_string(), y.to_string());
                properties = node.properties.clone();
            }
        }
    }

    // 2. Persist updated properties to SQLite
    if !properties.is_empty() {
        let props_json = serde_json::to_string(&properties).unwrap_or_default();
        let db_guard = db.lock().unwrap();
        db_guard.conn.execute(
            "UPDATE entities SET properties=?1, updated_at=CURRENT_TIMESTAMP WHERE id=?2",
            rusqlite::params![props_json, id],
        ).map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
fn parse_logidsl(source: String) -> Result<String, String> {
    if let Some(ast) = crate::ast::parser::parse_logi(&source) {
        // Serialize the structured AST back to JSON to send to the frontend store
        serde_json::to_string(&ast).map_err(|e| e.to_string())
    } else {
        Err("Failed to parse LogiDSL".into())
    }
}

#[tauri::command]
fn parse_and_evaluate_philodsl(source: String) -> Result<String, String> {
    if let Some(ast) = crate::ast::philo_parser::parse_philo(&source) {
        let model = crate::graph::kripke::KripkeModel::from_ast(&ast);
        // Note: Actual evaluate returning result not yet plumbed to JSON
        serde_json::to_string(&ast).map_err(|e| e.to_string())
    } else {
        Err("Failed to parse PhiloDSL".into())
    }
}

#[tokio::main]
async fn main() {
    // Spawn MCP Server
    tokio::spawn(async {
        mcp::server::start_mcp_server().await;
    });

    tauri::Builder::default()
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir().expect("Failed to get app data dir");
            let db_path = app_data_dir.join("twoballoons.db");

            // Initialize Database
            let db_client = db::DbClient::new(db_path).expect("Failed to initialize database");
            let shared_db = Arc::new(Mutex::new(db_client));

            // Initialize Graph
            let app_graph = Arc::new(Mutex::new(graph::AppGraph::new()));

            // Manage State
            app.manage(app_graph);
            app.manage(shared_db);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![add_node, update_node_position, parse_logidsl, parse_and_evaluate_philodsl])
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
