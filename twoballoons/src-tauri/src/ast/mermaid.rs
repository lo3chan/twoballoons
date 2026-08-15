use super::emitter::DiagramEmitter;
use super::{LogiAST, EntityKind, RelationType};

pub struct MermaidEmitter;

impl DiagramEmitter for MermaidEmitter {
    fn emit(&self, ast: &LogiAST) -> String {
        let view = ast.views.values().next();

        let mut output = String::new();
        output.push_str("graph TD\n");

        if let Some(view) = view {
            // Render entities based on focus
            for focus_id in &view.focus {
                if let Some(boundary) = ast.entities.get(focus_id) {
                    if let EntityKind::Boundary = boundary.kind {
                        let label = boundary.label.as_deref().unwrap_or(focus_id);
                        output.push_str(&format!("    subgraph {} [\"{}\"]\n", focus_id, label));

                        for child_id in &boundary.contains {
                            if let Some(child) = ast.entities.get(child_id) {
                                let label = child.label.as_deref().unwrap_or(child_id);
                                let tech = child.tech.as_deref().unwrap_or("");
                                let display = if tech.is_empty() {
                                    label.to_string()
                                } else {
                                    format!("{} ({})", label, tech)
                                };

                                match child.kind {
                                    EntityKind::Store => output.push_str(&format!("        {}[(\"{}\")]\n", child_id, display)),
                                    _ => output.push_str(&format!("        {}[\"{}\"]\n", child_id, display)),
                                }
                            }
                        }
                        output.push_str("    end\n\n");
                    }
                }
            }

            // Render un-contained participants
            for part_id in &view.participants {
                if !view.focus.iter().any(|f| ast.entities.get(f).is_some_and(|e| e.contains.contains(part_id))) {
                    if let Some(part) = ast.entities.get(part_id) {
                         let label = part.label.as_deref().unwrap_or(part_id);
                         output.push_str(&format!("    {}[\"{}\"]\n", part_id, label));
                    }
                }
            }
            output.push('\n');
        } else {
            // Just dump all entities
            for (id, entity) in &ast.entities {
                let label = entity.label.as_deref().unwrap_or(id);
                match entity.kind {
                    EntityKind::Store => output.push_str(&format!("    {}[(\"{}\")]\n", id, label)),
                    _ => output.push_str(&format!("    {}[\"{}\"]\n", id, label)),
                }
            }
        }

        // Render Relations
        for rel in &ast.relations {
            let op = match rel.rel_type {
                RelationType::DirectedFlow => "-->",
                RelationType::BiDirectional => "<-->",
                RelationType::WeakDependency => "-.->",
                _ => "-->",
            };

            if let Some(label) = &rel.label {
                output.push_str(&format!("    {} {}|{}| {}\n", rel.from, op, label, rel.to));
            } else {
                output.push_str(&format!("    {} {} {}\n", rel.from, op, rel.to));
            }
        }

        output
    }

}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ast::{Entity, EntityKind, Relation, RelationType, ViewProjection};
    use std::collections::HashMap;

    #[test]
    fn test_mermaid_emitter_basic() {
        let mut ast = LogiAST::default();
        ast.entities.insert("A".to_string(), Entity {
            id: "A".to_string(),
            kind: EntityKind::Component,
            label: Some("Component A".to_string()),
            tech: None,
            status: None,
            contains: vec![],
        });
        ast.entities.insert("B".to_string(), Entity {
            id: "B".to_string(),
            kind: EntityKind::Store,
            label: Some("Database B".to_string()),
            tech: None,
            status: None,
            contains: vec![],
        });
        ast.relations.push(Relation {
            from: "A".to_string(),
            to: "B".to_string(),
            rel_type: RelationType::DirectedFlow,
            label: Some("Reads".to_string()),
        });

        let emitter = MermaidEmitter;
        let output = emitter.emit(&ast);
        assert!(output.contains("graph TD"));
        assert!(output.contains("A[\"Component A\"]"));
        assert!(output.contains("B[(\"Database B\")]"));
        assert!(output.contains("A -->|Reads| B"));
    }
}
