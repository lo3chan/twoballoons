use petgraph::Graph;
use petgraph::visit::EdgeRef;
use petgraph::graph::NodeIndex;
use std::collections::HashMap;
use crate::ast::philo::{PhiloAST, Formula, StateNode, RelationEdge};
use serde::{Deserialize, Serialize};

// Define an ActionModel struct for a more rigorous implementation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActionModel {
    pub events: Vec<String>,
    pub preconditions: HashMap<String, Formula>, // event_id -> Precondition Formula
    pub relations: Vec<(String, String, String)>, // (from_event, to_event, relation_name)
}

pub struct KripkeModel {
    pub graph: Graph<String, String>, // Node: world_id, Edge: relation_name
    pub id_to_node: HashMap<String, NodeIndex>,
    pub world_formulas: HashMap<String, Vec<Formula>>,
}

impl KripkeModel {
    pub fn new() -> Self {
        Self {
            graph: Graph::new(),
            id_to_node: HashMap::new(),
            world_formulas: HashMap::new(),
        }
    }

    pub fn from_ast(ast: &PhiloAST) -> Self {
        let mut model = Self::new();

        for (id, state) in &ast.states {
            let node_idx = model.graph.add_node(id.clone());
            model.id_to_node.insert(id.clone(), node_idx);
            model.world_formulas.insert(id.clone(), state.formulas.clone());
        }

        for edge in &ast.relations {
            if let (Some(&from_idx), Some(&to_idx)) = (model.id_to_node.get(&edge.from), model.id_to_node.get(&edge.to)) {
                model.graph.add_edge(from_idx, to_idx, edge.relation.clone());
            }
        }

        model
    }

    // Convert the KripkeModel back to a PhiloAST for the frontend
    pub fn to_ast(&self) -> PhiloAST {
        let mut ast = PhiloAST::default();

        for world_id in self.id_to_node.keys() {
            let formulas = self.world_formulas.get(world_id).cloned().unwrap_or_default();
            ast.states.insert(world_id.clone(), StateNode {
                id: world_id.clone(),
                name: Some(world_id.clone()),
                formulas,
            });
        }

        for edge in self.graph.edge_indices() {
            if let Some((from_idx, to_idx)) = self.graph.edge_endpoints(edge) {
                if let (Some(from_id), Some(to_id)) = (self.graph.node_weight(from_idx), self.graph.node_weight(to_idx)) {
                    if let Some(relation_name) = self.graph.edge_weight(edge) {
                        ast.relations.push(RelationEdge {
                            from: from_id.clone(),
                            to: to_id.clone(),
                            relation: relation_name.clone(),
                        });
                    }
                }
            }
        }

        ast
    }

    pub fn update_with_action_model(&mut self, action_model: &ActionModel) {
        // BMS Action Model Product Update (M ⊗ E)

        let mut new_graph = Graph::<String, String>::new();
        let mut new_id_to_node = HashMap::new();
        let mut new_world_formulas = HashMap::new();

        // 1. Worlds of the new model: pairs (w, e) such that w satisfies Pre(e)
        let mut product_worlds = Vec::new(); // Store valid (world_id, event_id) pairs

        for world_id in self.id_to_node.keys() {
            for event_id in &action_model.events {
                let precondition_met = if let Some(pre) = action_model.preconditions.get(event_id) {
                    self.evaluate(world_id, pre)
                } else {
                    true // If no precondition, it's implicitly true
                };

                if precondition_met {
                    let new_world_id = format!("{}_{}", world_id, event_id);
                    let node_idx = new_graph.add_node(new_world_id.clone());
                    new_id_to_node.insert(new_world_id.clone(), node_idx);

                    // Formulas in the new world are typically inherited from the old world
                    if let Some(formulas) = self.world_formulas.get(world_id) {
                        new_world_formulas.insert(new_world_id.clone(), formulas.clone());
                    }

                    product_worlds.push((world_id.clone(), event_id.clone(), new_world_id));
                }
            }
        }

        // 2. Relations of the new model: (w,e) R (w',e') iff w R w' AND e R e'
        for (w, e, new_w_id) in &product_worlds {
            for (w_prime, e_prime, new_w_prime_id) in &product_worlds {
                // Check if e R e' exists in action model
                for (from_e, to_e, rel_e) in &action_model.relations {
                    if from_e == e && to_e == e_prime {
                        // Check if w R w' exists in original model with the SAME relation label
                        if let (Some(&w_idx), Some(&w_prime_idx)) = (self.id_to_node.get(w), self.id_to_node.get(w_prime)) {
                            // Find an edge between w and w' with rel_e
                            let mut has_relation = false;
                            for edge_idx in self.graph.edges_connecting(w_idx, w_prime_idx) {
                                if let Some(weight) = self.graph.edge_weight(edge_idx.id()) {
                                    if weight == rel_e {
                                        has_relation = true;
                                        break;
                                    }
                                }
                            }

                            if has_relation {
                                if let (Some(&new_w_idx), Some(&new_w_prime_idx)) = (new_id_to_node.get(new_w_id), new_id_to_node.get(new_w_prime_id)) {
                                    new_graph.add_edge(new_w_idx, new_w_prime_idx, rel_e.clone());
                                }
                            }
                        }
                    }
                }
            }
        }

        // Replace old state with new state
        self.graph = new_graph;
        self.id_to_node = new_id_to_node;
        self.world_formulas = new_world_formulas;
    }

    pub fn evaluate(&self, world_id: &str, formula: &Formula) -> bool {
        match formula {
            Formula::Extensional(s) => {
                // Simplified evaluation for base propositions - just check if it's strictly contained in the state's formula list
                if let Some(formulas) = self.world_formulas.get(world_id) {
                    formulas.iter().any(|f| {
                        if let Formula::Extensional(fs) = f {
                            fs == s
                        } else {
                            false
                        }
                    })
                } else {
                    false
                }
            },
            Formula::Modal(inner) => {
                // Box operator: true if inner is true in all accessible worlds
                if let Some(&node_idx) = self.id_to_node.get(world_id) {
                    let accessible_worlds = self.graph.neighbors(node_idx);
                    let mut all_true = true;
                    // Note: Needs strict graph traversal depending on relation edges, ignoring for simplicity
                    for neighbor in accessible_worlds {
                        if let Some(n_id) = self.graph.node_weight(neighbor) {
                            if !self.evaluate(n_id, inner) {
                                all_true = false;
                                break;
                            }
                        }
                    }
                    all_true
                } else {
                    false
                }
            },
            Formula::Epistemic(_agent, inner) => {
                // Simplified Epistemic evaluation (K_a phi)
                // Treated as a Box modality over the agent's accessibility relation.
                // For this minimal impl, we treat it same as Modal (evaluating all neighbors).
                if let Some(&node_idx) = self.id_to_node.get(world_id) {
                    let accessible_worlds = self.graph.neighbors(node_idx);
                    let mut all_true = true;
                    for neighbor in accessible_worlds {
                        if let Some(n_id) = self.graph.node_weight(neighbor) {
                            if !self.evaluate(n_id, inner) {
                                all_true = false;
                                break;
                            }
                        }
                    }
                    all_true
                } else {
                    false
                }
            },
            _ => false, // other formulas unhandled in minimal implementation
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;
    use crate::ast::philo::{PhiloAST, StateNode, RelationEdge, Formula};

    #[test]
    fn test_kripke_model_evaluation() {
        let mut ast = PhiloAST::default();

        // State 1: Contains p
        ast.states.insert("w1".to_string(), StateNode {
            id: "w1".to_string(),
            name: None,
            formulas: vec![Formula::Extensional("p".to_string())],
        });

        // State 2: Empty
        ast.states.insert("w2".to_string(), StateNode {
            id: "w2".to_string(),
            name: None,
            formulas: vec![],
        });

        ast.relations.push(RelationEdge {
            from: "w1".to_string(),
            to: "w2".to_string(),
            relation: "R".to_string(),
        });

        let model = KripkeModel::from_ast(&ast);

        // p is true in w1
        assert_eq!(model.evaluate("w1", &Formula::Extensional("p".to_string())), true);

        // q is false in w1
        assert_eq!(model.evaluate("w1", &Formula::Extensional("q".to_string())), false);

        // p is false in w2
        assert_eq!(model.evaluate("w2", &Formula::Extensional("p".to_string())), false);

        // Box p in w1 is false because it can see w2, where p is false
        assert_eq!(model.evaluate("w1", &Formula::Modal(Box::new(Formula::Extensional("p".to_string())))), false);
    }

    #[test]
    fn test_action_model_update() {
        let mut ast = PhiloAST::default();

        ast.states.insert("w1".to_string(), StateNode {
            id: "w1".to_string(),
            name: None,
            formulas: vec![Formula::Extensional("p".to_string())],
        });
        ast.states.insert("w2".to_string(), StateNode {
            id: "w2".to_string(),
            name: None,
            formulas: vec![],
        });

        ast.relations.push(RelationEdge {
            from: "w1".to_string(),
            to: "w2".to_string(),
            relation: "R".to_string(),
        });
        ast.relations.push(RelationEdge {
            from: "w1".to_string(),
            to: "w1".to_string(),
            relation: "R".to_string(),
        });

        let mut model = KripkeModel::from_ast(&ast);

        let mut preconditions = HashMap::new();
        preconditions.insert("e1".to_string(), Formula::Extensional("p".to_string()));

        let action_model = ActionModel {
            events: vec!["e1".to_string()],
            preconditions,
            relations: vec![("e1".to_string(), "e1".to_string(), "R".to_string())]
        };

        model.update_with_action_model(&action_model);

        // w1 has p, so it remains as w1_e1. w2 does not, so it is pruned.
        assert_eq!(model.graph.node_count(), 1);
        assert_eq!(model.evaluate("w1_e1", &Formula::Extensional("p".to_string())), true);

        // Edge w1_e1 -> w1_e1 should exist because w1 -> w1 and e1 -> e1
        assert_eq!(model.graph.edge_count(), 1);
    }
}
