use tree_sitter::{Language, Parser, Tree, Node};
use super::{LogiAST, Entity, EntityKind, Relation, RelationType, Assertion, ViewProjection};
use std::collections::HashMap;



pub fn language() -> Language {
    unsafe { tree_sitter_logi() }
}

pub fn parse_logi(source: &str) -> Option<LogiAST> {
    let mut parser = Parser::new();
    let lang = language();
    parser.set_language(&lang).ok()?;

    let tree = parser.parse(source, None)?;
    let root_node = tree.root_node();

    let mut ast = LogiAST::default();

    let mut cursor = root_node.walk();
    for child in root_node.children(&mut cursor) {
        match child.kind() {
            "entity_declaration" => {
                if let Some(entity) = parse_entity(child, source) {
                    ast.entities.insert(entity.id.clone(), entity);
                }
            }
            "relation" => {
                if let Some(relation) = parse_relation(child, source) {
                    ast.relations.push(relation);
                }
            }
            "assertion" => {
                if let Some(assertion) = parse_assertion(child, source) {
                    ast.assertions.push(assertion);
                }
            }
            "view_projection" => {
                if let Some(view) = parse_view(child, source) {
                    ast.views.insert(view.name.clone(), view);
                }
            }
            _ => {}
        }
    }

    Some(ast)
}

fn parse_entity(node: Node, source: &str) -> Option<Entity> {
    let kind_node = node.child_by_field_name("kind")?;
    let name_node = node.child_by_field_name("name")?;

    let kind_str = kind_node.utf8_text(source.as_bytes()).ok()?;
    let name_str = name_node.utf8_text(source.as_bytes()).ok()?;

    let kind = match kind_str {
        "actor" => EntityKind::Actor,
        "component" => EntityKind::Component,
        "store" => EntityKind::Store,
        "claim" => EntityKind::Claim,
        "boundary" => EntityKind::Boundary,
        _ => return None,
    };

    let mut label = None;
    let mut tech = None;
    let mut status = None;
    let mut contains = Vec::new();

    let mut cursor = node.walk();
    for prop in node.children(&mut cursor) {
        if prop.kind() == "property" {
            if let (Some(k), Some(v)) = (prop.child_by_field_name("key"), prop.child_by_field_name("value")) {
                let key_str = k.utf8_text(source.as_bytes()).ok()?;
                let val_str = v.utf8_text(source.as_bytes()).ok()?.trim_matches('"');
                match key_str {
                    "label" => label = Some(val_str.to_string()),
                    "tech" => tech = Some(val_str.to_string()),
                    "status" => status = Some(val_str.to_string()),
                    "contains" => {
                        // Very simple list parsing for MVP
                        let list = val_str.trim_matches('[').trim_matches(']');
                        for item in list.split(',') {
                            let item = item.trim();
                            if !item.is_empty() {
                                contains.push(item.to_string());
                            }
                        }
                    }
                    _ => {}
                }
            }
        }
    }

    Some(Entity {
        id: name_str.to_string(),
        kind,
        label,
        tech,
        status,
        contains,
    })
}

fn parse_relation(node: Node, source: &str) -> Option<Relation> {
    let from_node = node.child_by_field_name("from")?;
    let to_node = node.child_by_field_name("to")?;
    let op_node = node.child_by_field_name("operator")?;

    let from_str = from_node.utf8_text(source.as_bytes()).ok()?;
    let to_str = to_node.utf8_text(source.as_bytes()).ok()?;
    let op_str = op_node.utf8_text(source.as_bytes()).ok()?;

    let rel_type = match op_str {
        "->" => RelationType::DirectedFlow,
        "<=>" => RelationType::BiDirectional,
        "=>" => RelationType::Implication,
        "=/=" => RelationType::Refutation,
        "..>" => RelationType::WeakDependency,
        _ => return None,
    };

    let mut label = None;
    if let Some(label_node) = node.child_by_field_name("label") {
        label = label_node.utf8_text(source.as_bytes()).ok().map(|s| s.trim_matches('"').to_string());
    }

    Some(Relation {
        from: from_str.to_string(),
        to: to_str.to_string(),
        rel_type,
        label,
    })
}

fn parse_assertion(node: Node, source: &str) -> Option<Assertion> {
    let expr_node = node.child_by_field_name("expression")?;
    let expr_str = expr_node.utf8_text(source.as_bytes()).ok()?;
    Some(Assertion {
        logic_expression: expr_str.to_string(),
    })
}

fn parse_view(node: Node, source: &str) -> Option<ViewProjection> {
    let name_node = node.child_by_field_name("name")?;
    let name_str = name_node.utf8_text(source.as_bytes()).ok()?;

    let mut view_type = String::from("c4_container");
    let mut participants = Vec::new();
    let mut focus = Vec::new();

    let mut cursor = node.walk();
    for prop in node.children(&mut cursor) {
        if prop.kind() == "property" {
            if let (Some(k), Some(v)) = (prop.child_by_field_name("key"), prop.child_by_field_name("value")) {
                let key_str = k.utf8_text(source.as_bytes()).ok()?;
                let val_str = v.utf8_text(source.as_bytes()).ok()?.trim_matches('"');
                match key_str {
                    "type" => view_type = val_str.to_string(),
                    "participants" => {
                        let list = val_str.trim_matches('[').trim_matches(']');
                        participants = list.split(',').map(|s| s.trim().to_string()).filter(|s| !s.is_empty()).collect();
                    }
                    "focus" => {
                        let list = val_str.trim_matches('[').trim_matches(']');
                        focus = list.split(',').map(|s| s.trim().to_string()).filter(|s| !s.is_empty()).collect();
                    }
                    _ => {}
                }
            }
        }
    }

    Some(ViewProjection {
        name: name_str.to_string(),
        view_type,
        participants,
        focus,
    })
}
