use petgraph::graph::DiGraph;
use petgraph::graph::NodeIndex;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

#[derive(Clone, Debug)]
pub struct NodeData {
    pub id: String,
    pub label: String,
    pub kind: String, // container, component, actor, gate
    pub properties: HashMap<String, String>,
}

#[derive(Clone, Debug)]
pub struct EdgeData {
    pub relation_type: String, // ->, <=>, =>, =/=
    pub label: Option<String>,
}

pub struct AppGraph {
    pub inner: DiGraph<NodeData, EdgeData>,
    pub id_map: HashMap<String, NodeIndex>,
}

impl AppGraph {
    pub fn new() -> Self {
        Self {
            inner: DiGraph::new(),
            id_map: HashMap::new(),
        }
    }

    pub fn add_node(&mut self, node: NodeData) -> NodeIndex {
        if let Some(&idx) = self.id_map.get(&node.id) {
            return idx; // Already exists
        }

        let id = node.id.clone();
        let idx = self.inner.add_node(node);
        self.id_map.insert(id, idx);
        idx
    }

    pub fn add_edge(&mut self, from_id: &str, to_id: &str, edge: EdgeData) {
        if let (Some(&from_idx), Some(&to_idx)) = (self.id_map.get(from_id), self.id_map.get(to_id)) {
            self.inner.add_edge(from_idx, to_idx, edge);
        }
    }
}

pub type SharedGraph = Arc<Mutex<AppGraph>>;
pub mod kripke;
