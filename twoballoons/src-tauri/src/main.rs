// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod graph;
mod ast;
mod mcp;

use std::sync::{Arc, Mutex};
use tauri::Manager;

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
            let _db_client = db::DbClient::new(db_path).expect("Failed to initialize database");

            // Initialize Graph
            let app_graph = Arc::new(Mutex::new(graph::AppGraph::new()));

            // Manage State
            app.manage(app_graph);

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
