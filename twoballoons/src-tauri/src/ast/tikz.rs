use super::emitter::DiagramEmitter;
use super::{LogiAST, EntityKind, RelationType};

pub struct TikzEmitter;

impl DiagramEmitter for TikzEmitter {

    fn emit(&self, ast: &LogiAST) -> String {
        let mut output = String::new();
        output.push_str("\\begin{tikzpicture}[>=latex, node distance=2cm]\n");

        let mut i = 0;
        for (id, entity) in &ast.entities {
            let label = entity.label.as_deref().unwrap_or(id);
            let shape = match entity.kind {
                EntityKind::Store => "cylinder",
                EntityKind::Actor => "circle",
                _ => "rectangle",
            };
            // very naive positioning
            output.push_str(&format!("    \\node[{}] ({}) at ({}, {}) {{{}}};\n", shape, id, i * 3, 0, label));
            i += 1;
        }

        for rel in &ast.relations {
            let style = match rel.rel_type {
                RelationType::WeakDependency => "dashed,->",
                RelationType::BiDirectional => "<->",
                _ => "->",
            };

            if let Some(label) = &rel.label {
                output.push_str(&format!("    \\draw[{}] ({}) -- node[above] {{{}}} ({});\n", style, rel.from, label, rel.to));
            } else {
                output.push_str(&format!("    \\draw[{}] ({}) -- ({});\n", style, rel.from, rel.to));
            }
        }

        output.push_str("\\end{tikzpicture}\n");
        output
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ast::{Entity, EntityKind, Relation, RelationType, ViewProjection};
    use std::collections::HashMap;

    #[test]
    fn test_tikz_emitter_basic() {
        let mut ast = LogiAST::default();
        ast.entities.insert("A".to_string(), Entity {
            id: "A".to_string(),
            kind: EntityKind::Store,
            label: Some("DB".to_string()),
            tech: None,
            status: None,
            contains: vec![],
        });
        ast.relations.push(Relation {
            from: "A".to_string(),
            to: "B".to_string(),
            rel_type: RelationType::DirectedFlow,
            label: Some("Flow".to_string()),
        });

        let emitter = TikzEmitter;
        let output = emitter.emit(&ast);
        assert!(output.contains("\\begin{tikzpicture}"));
        assert!(output.contains("\\node[cylinder] (A) at (0, 0) {DB};"));
        assert!(output.contains("\\draw[->] (A) -- node[above] {Flow} (B);"));
        assert!(output.contains("\\end{tikzpicture}"));
    }
}
