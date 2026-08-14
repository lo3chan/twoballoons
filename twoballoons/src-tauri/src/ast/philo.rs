use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Formula {
    Extensional(String),
    Deontic(Box<Formula>, Option<Box<Formula>>),
    Modal(Box<Formula>),
    Epistemic(String, Box<Formula>),
    // Add other formula variants here based on the PhiloDSL grammar
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StateNode {
    pub id: String,
    pub name: Option<String>,
    pub formulas: Vec<Formula>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RelationEdge {
    pub from: String,
    pub to: String,
    pub relation: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct PhiloAST {
    pub states: HashMap<String, StateNode>,
    pub relations: Vec<RelationEdge>,
}
