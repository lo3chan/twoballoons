use petgraph::Graph;
use petgraph::graph::NodeIndex;
use std::collections::HashMap;
use crate::ast::philo::{PhiloAST, Formula};

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

    pub fn update_with_action_model(&mut self, action_model_preconditions: &HashMap<String, Formula>) {
        // BMS Action Model Product Update (M ⊗ E)
        // For simplicity, we implement a public announcement style prune where we remove worlds
        // that do not satisfy the precondition. A full product update would duplicate worlds.

        // This acts as [A!]B where we prune false worlds
        let mut to_remove = Vec::new();
        for (world_id, &node_idx) in &self.id_to_node {
            for (_, pre_formula) in action_model_preconditions {
                if !self.evaluate(world_id, pre_formula) {
                    to_remove.push(node_idx);
                    break;
                }
            }
        }

        for node_idx in to_remove {
            self.graph.remove_node(node_idx);
            // Need to clean up id_to_node as well, but petgraph node removals invalidate indices.
            // In a real implementation we'd rebuild the map or use a stable graph.
        }
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

        ast.states.insert("w1".to_string(), crate::ast::philo::StateNode {
            id: "w1".to_string(),
            name: None,
            formulas: vec![Formula::Extensional("p".to_string())],
        });
        ast.states.insert("w2".to_string(), crate::ast::philo::StateNode {
            id: "w2".to_string(),
            name: None,
            formulas: vec![],
        });
        let mut model = KripkeModel::from_ast(&ast);

        let mut action_model = HashMap::new();
        action_model.insert("e1".to_string(), Formula::Extensional("p".to_string()));

        model.update_with_action_model(&action_model);

        // w1 has p, so it remains. w2 does not, so it is pruned.
        assert_eq!(model.graph.node_count(), 1);
        assert_eq!(model.evaluate("w1", &Formula::Extensional("p".to_string())), true);
    }
}
