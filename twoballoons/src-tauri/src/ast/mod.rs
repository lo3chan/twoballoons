use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EntityKind {
    Actor,
    Component,
    Store,
    Gate,
    Claim,
    Boundary,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Entity {
    pub id: String,
    pub kind: EntityKind,
    pub label: Option<String>,
    pub tech: Option<String>,
    pub status: Option<String>,
    pub contains: Vec<String>, // For boundaries
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RelationType {
    DirectedFlow,      // ->
    BiDirectional,     // <=>
    Implication,       // =>
    Refutation,        // =/=
    WeakDependency,    // ..>
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Relation {
    pub from: String,
    pub to: String,
    pub rel_type: RelationType,
    pub label: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Assertion {
    pub logic_expression: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ViewProjection {
    pub name: String,
    pub view_type: String, // sequence, c4_container, argument
    pub participants: Vec<String>,
    pub focus: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct LogiAST {
    pub entities: HashMap<String, Entity>,
    pub relations: Vec<Relation>,
    pub assertions: Vec<Assertion>,
    pub views: HashMap<String, ViewProjection>,
}
pub mod parser;
pub mod emitter;
pub mod mermaid;
pub mod plantuml;
pub mod philo;
pub mod philo_parser;
