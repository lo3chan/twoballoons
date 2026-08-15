use tree_sitter::{Language, Parser, Tree, Node};
use super::philo::{PhiloAST, StateNode, RelationEdge, Formula};
use std::collections::HashMap;



pub pub fn language() -> Language { tree_sitter_philo::language() }

pub fn parse_philo(source: &str) -> Option<PhiloAST> {
    let mut parser = Parser::new();
    let lang = language();
    parser.set_language(&lang).ok()?;

    let tree = parser.parse(source, None)?;
    let root_node = tree.root_node();

    let mut ast = PhiloAST::default();

    let mut cursor = root_node.walk();
    for child in root_node.children(&mut cursor) {
        match child.kind() {
            "block" => {
                let block_child = child.child(0)?;
                match block_child.kind() {
                    "state_block" => {
                        if let Some(state) = parse_state(block_child, source) {
                            ast.states.insert(state.id.clone(), state);
                        }
                    },
                    "edge_decl" => {
                        if let Some(edge) = parse_edge(block_child, source) {
                            ast.relations.push(edge);
                        }
                    },
                    _ => {}
                }
            },
            _ => {}
        }
    }

    Some(ast)
}

fn parse_state(node: Node, source: &str) -> Option<StateNode> {
    let name_node = node.child_by_field_name("name")?;
    let name_str = name_node.utf8_text(source.as_bytes()).ok()?;

    let mut string_name = None;
    for i in 0..node.child_count() {
        let child = node.child(i as u32).unwrap();
        if child.kind() == "string" {
            string_name = Some(child.utf8_text(source.as_bytes()).ok()?.trim_matches('"').to_string());
        }
    }

    let mut formulas = Vec::new();
    let mut cursor = node.walk();
    for child in node.children(&mut cursor) {
        if child.kind() == "state_stmt" {
            if let Some(formula_node) = child.child(0) {
                if formula_node.kind() == "formula" {
                    if let Some(formula) = parse_formula(formula_node, source) {
                        formulas.push(formula);
                    }
                }
            }
        }
    }

    Some(StateNode {
        id: name_str.to_string(),
        name: string_name,
        formulas,
    })
}

fn parse_edge(node: Node, source: &str) -> Option<RelationEdge> {
    let from_node = node.child_by_field_name("from")?;
    let to_node = node.child_by_field_name("to")?;
    let rel_node = node.child_by_field_name("relation")?;

    let from_str = from_node.utf8_text(source.as_bytes()).ok()?;
    let to_str = to_node.utf8_text(source.as_bytes()).ok()?;
    let rel_str = rel_node.utf8_text(source.as_bytes()).ok()?;

    Some(RelationEdge {
        from: from_str.to_string(),
        to: to_str.to_string(),
        relation: rel_str.to_string(),
    })
}

fn parse_formula(node: Node, source: &str) -> Option<Formula> {
    let child = node.child(0)?;
    match child.kind() {
        "extensional_f" => {
            Some(Formula::Extensional(child.utf8_text(source.as_bytes()).ok()?.to_string()))
        },
        "deontic_f" => {
            // Very simple stub for now
            let inner = child.child(2)?;
            Some(Formula::Deontic(Box::new(parse_formula(inner, source)?), None))
        },
        _ => Some(Formula::Extensional(child.utf8_text(source.as_bytes()).ok()?.to_string()))
    }
}
