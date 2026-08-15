

fn get_runtime_log_path() -> std::path::PathBuf {
    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(parent) = exe_path.parent() {
            return parent.join("twoballoons_runtime.log");
        }
    }
    std::path::PathBuf::from("twoballoons_runtime.log")
}

#[tauri::command]
fn log_to_file(level: String, message: String) -> Result<(), String> {
    use std::io::Write;
    let timestamp = chrono_lite_timestamp();
    let log_line = format!("[{}] [{}] {}\n", timestamp, level, message);
    let log_path = get_runtime_log_path();
    
    if let Ok(mut file) = std::fs::OpenOptions::new().create(true).append(true).open(&log_path) {
        let _ = file.write_all(log_line.as_bytes());
    }
    println!("{}", log_line.trim_end());
    Ok(())
}

fn chrono_lite_timestamp() -> String {
    let now = std::time::SystemTime::now();
    format!("{:?}", now)
}

#![allow(dead_code, unused_imports, unused_variables)]
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

#[derive(serde::Serialize)]
struct PhiloEvaluationResult {
    ast: crate::ast::philo::PhiloAST,
    evaluations: std::collections::HashMap<String, bool>,
}

#[tauri::command]
fn parse_and_evaluate_philodsl(source: String) -> Result<String, String> {
    if let Some(ast) = crate::ast::philo_parser::parse_philo(&source) {
        let model = crate::graph::kripke::KripkeModel::from_ast(&ast);

        let mut evaluations = std::collections::HashMap::new();
        for (world_id, _) in &ast.states {
            // For now, let's just evaluate whether ANY formula in the state is true.
            // Ideally we'd evaluate specific assertions or modal formulas.
            // As a baseline, we'll just check if the state has formulas and they don't immediately fail.
            // We'll just mark it true if the world exists for now, or you can implement specific formula checks.
            let mut eval_result = true;
            if let Some(state_node) = ast.states.get(world_id) {
                for formula in &state_node.formulas {
                    if !model.evaluate(world_id, formula) {
                        eval_result = false;
                        break;
                    }
                }
            }
            evaluations.insert(world_id.clone(), eval_result);
        }

        let result = PhiloEvaluationResult {
            ast,
            evaluations,
        };

        serde_json::to_string(&result).map_err(|e| e.to_string())
    } else {
        Err("Failed to parse PhiloDSL".into())
    }
}


#[tauri::command]
async fn apply_epistemic_action(
    current_ast_json: String,
    action_model_json: String,
    _graph: State<'_, Arc<Mutex<graph::AppGraph>>>,
    _db: State<'_, Arc<Mutex<db::DbClient>>>,
) -> Result<String, String> {
    let current_ast: crate::ast::philo::PhiloAST = serde_json::from_str(&current_ast_json)
        .map_err(|e| format!("Failed to parse current AST: {}", e))?;

    let action_model: crate::graph::kripke::ActionModel = serde_json::from_str(&action_model_json)
        .map_err(|e| format!("Failed to parse action model: {}", e))?;

    let mut model = crate::graph::kripke::KripkeModel::from_ast(&current_ast);
    model.update_with_action_model(&action_model);

    // Evaluate new model to return updated truth values
    let mut evaluations = std::collections::HashMap::new();
    let updated_ast = model.to_ast();

    for (world_id, _) in &updated_ast.states {
        let mut eval_result = true;
        if let Some(state_node) = updated_ast.states.get(world_id) {
            for formula in &state_node.formulas {
                if !model.evaluate(world_id, formula) {
                    eval_result = false;
                    break;
                }
            }
        }
        evaluations.insert(world_id.clone(), eval_result);
    }

    let result = PhiloEvaluationResult {
        ast: updated_ast.clone(),
        evaluations,
    };

    // Update DB for persistent AST changes
    let db_guard = _db.lock().unwrap();

    // In a real application, we would delete pruned nodes from DB and add new nodes.
    // For this minimal update, we sync the state by clearing existing kripke worlds and inserting the new ones.
    let _ = db_guard.conn.execute("DELETE FROM entities WHERE kind='nominal' OR kind='state'", []);

    for (world_id, state_node) in &updated_ast.states {
        let label = state_node.name.as_deref().unwrap_or(world_id);
        let properties_json = serde_json::to_string(&state_node.formulas).unwrap_or_default();
        let _ = db_guard.insert_entity(world_id, "state", Some(label), None, None, &properties_json);
    }

    // We would also update edges similarly
    let _ = db_guard.conn.execute("DELETE FROM relations", []);
    for edge in &updated_ast.relations {
        let _ = db_guard.conn.execute(
            "INSERT INTO relations (from_id, to_id, relation_type) VALUES (?1, ?2, ?3)",
            rusqlite::params![edge.from, edge.to, edge.relation]
        );
    }

    // Emit event to update frontend state
    let _unused = _graph.lock().unwrap(); // Just to show graph access


    serde_json::to_string(&result).map_err(|e| e.to_string())
}

#[tauri::command]
fn export_diagram(format: String, source: String) -> Result<String, String> {
    use crate::ast::emitter::DiagramEmitter;

    let ast = crate::ast::parser::parse_logi(&source)
        .ok_or_else(|| "Failed to parse LogiDSL".to_string())?;

    match format.as_str() {
        "mermaid" => Ok(crate::ast::mermaid::MermaidEmitter.emit(&ast)),
        "plantuml" => Ok(crate::ast::plantuml::PlantUMLEmitter.emit(&ast)),
        "dot" => Ok(crate::ast::dot::DotEmitter.emit(&ast)),
        "tikz" => Ok(crate::ast::tikz::TikzEmitter.emit(&ast)),
        _ => Err(format!("Unsupported format: {}", format))
    }
}

#[tauri::command]
fn import_diagram(format: String, content: String) -> Result<String, String> {
    Ok(serde_json::json!({
        "status": "success",
        "format": format,
        "message": "Import stubbed. AI sidecar will parse this in future."
    }).to_string())
}

#[tokio::main]
async fn main() {

    // Global Rust Panic Hook: writes any backend panic directly to twoballoons_runtime.log
    std::panic::set_hook(Box::new(|panic_info| {
        let timestamp = chrono_lite_timestamp();
        let payload = if let Some(s) = panic_info.payload().downcast_ref::<&str>() {
            s.to_string()
        } else if let Some(s) = panic_info.payload().downcast_ref::<String>() {
            s.clone()
        } else {
            "Unknown Rust panic payload".to_string()
        };
        let location = panic_info.location().map(|l| format!("{}:{}:{}", l.file(), l.line(), l.column())).unwrap_or_else(|| "unknown location".to_string());
        let log_line = format!("[{}] [CRITICAL_RUST_PANIC] Panic at {}: {}\n", timestamp, location, payload);
        if let Ok(mut file) = std::fs::OpenOptions::new().create(true).append(true).open(get_runtime_log_path()) {
            use std::io::Write;
            let _ = file.write_all(log_line.as_bytes());
        }
        eprintln!("{}", log_line.trim_end());
    }));

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
        .invoke_handler(tauri::generate_handler![log_to_file, add_node, update_node_position, parse_logidsl, parse_and_evaluate_philodsl, apply_epistemic_action, export_diagram, import_diagram])
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
