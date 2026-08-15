use super::emitter::DiagramEmitter;
use super::{LogiAST, EntityKind, RelationType};

pub struct DotEmitter;

impl DiagramEmitter for DotEmitter {

    fn emit(&self, ast: &LogiAST) -> String {
        let mut output = String::new();
        output.push_str("digraph G {\n");
        output.push_str("    node [shape=box];\n");

        for (id, entity) in &ast.entities {
            let label = entity.label.as_deref().unwrap_or(id);
            let shape = match entity.kind {
                EntityKind::Store => "cylinder",
                EntityKind::Actor => "ellipse",
                _ => "box",
            };
            output.push_str(&format!("    {} [label=\"{}\", shape={}];\n", id, label, shape));
        }

        for rel in &ast.relations {
            let op = match rel.rel_type {
                RelationType::DirectedFlow => "->",
                RelationType::BiDirectional => "->", // simplified for dot
                RelationType::WeakDependency => "->", // style=dashed could be added
                _ => "->",
            };

            let style = match rel.rel_type {
                RelationType::WeakDependency => " [style=dashed]",
                _ => "",
            };

            if let Some(label) = &rel.label {
                output.push_str(&format!("    {} {} {} [label=\"{}\"{}];\n", rel.from, op, rel.to, label, style.replace(" [", ", ")));
            } else {
                output.push_str(&format!("    {} {} {}{};\n", rel.from, op, rel.to, style));
            }
        }

        output.push_str("}\n");
        output
    }

}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ast::{Entity, EntityKind, Relation, RelationType, ViewProjection};
    use std::collections::HashMap;

    #[test]
    fn test_dot_emitter_basic() {
        let mut ast = LogiAST::default();
        ast.entities.insert("A".to_string(), Entity {
            id: "A".to_string(),
            kind: EntityKind::Actor,
            label: Some("User A".to_string()),
            tech: None,
            status: None,
            contains: vec![],
        });
        ast.relations.push(Relation {
            from: "A".to_string(),
            to: "B".to_string(),
            rel_type: RelationType::WeakDependency,
            label: Some("Depends".to_string()),
        });

        let emitter = DotEmitter;
        let output = emitter.emit(&ast);
        assert!(output.contains("digraph G {"));
        assert!(output.contains("A [label=\"User A\", shape=ellipse]"));
        assert!(output.contains("A -> B [label=\"Depends\", style=dashed]"));
    }
}
