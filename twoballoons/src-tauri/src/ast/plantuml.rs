use super::emitter::DiagramEmitter;
use super::{LogiAST, EntityKind, RelationType};

pub struct PlantUMLEmitter;

impl DiagramEmitter for PlantUMLEmitter {

    fn emit(&self, ast: &LogiAST) -> String {
        let view = ast.views.values().next();

        let mut output = String::new();
        output.push_str("@startuml\n");

        if let Some(view) = view {
            // Declare participants
            for part_id in &view.participants {
                if let Some(entity) = ast.entities.get(part_id) {
                    let label = entity.label.as_deref().unwrap_or(part_id);
                    let tech = entity.tech.as_deref().unwrap_or("");
                    let display = if tech.is_empty() {
                        label.to_string()
                    } else {
                        format!("{}\\n[{}]", label, tech)
                    };

                    match entity.kind {
                        EntityKind::Actor => output.push_str(&format!("actor \"{}\" as {}\n", display, part_id)),
                        EntityKind::Store => output.push_str(&format!("database \"{}\" as {}\n", display, part_id)),
                        _ => output.push_str(&format!("participant \"{}\" as {}\n", display, part_id)),
                    }
                }
            }
            output.push('\n');
        } else {
            for (id, entity) in &ast.entities {
                let label = entity.label.as_deref().unwrap_or(id);
                match entity.kind {
                    EntityKind::Actor => output.push_str(&format!("actor \"{}\" as {}\n", label, id)),
                    EntityKind::Store => output.push_str(&format!("database \"{}\" as {}\n", label, id)),
                    _ => output.push_str(&format!("participant \"{}\" as {}\n", label, id)),
                }
            }
        }

        // Draw relations
        for rel in &ast.relations {
            let op = match rel.rel_type {
                RelationType::DirectedFlow => "->",
                RelationType::BiDirectional => "<->",
                RelationType::WeakDependency => "-->",
                _ => "->",
            };

            if let Some(label) = &rel.label {
                output.push_str(&format!("{} {} {} : {}\n", rel.from, op, rel.to, label));
            } else {
                output.push_str(&format!("{} {} {}\n", rel.from, op, rel.to));
            }
        }

        output.push_str("@enduml\n");
        output
    }

}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ast::{Entity, EntityKind, Relation, RelationType, ViewProjection};
    use std::collections::HashMap;

    #[test]
    fn test_plantuml_emitter_basic() {
        let mut ast = LogiAST::default();
        ast.entities.insert("A".to_string(), Entity {
            id: "A".to_string(),
            kind: EntityKind::Actor,
            label: Some("User A".to_string()),
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

        let emitter = PlantUMLEmitter;
        let output = emitter.emit(&ast);
        assert!(output.contains("@startuml"));
        assert!(output.contains("actor \"User A\" as A"));
        assert!(output.contains("database \"Database B\" as B"));
        assert!(output.contains("A -> B : Reads"));
        assert!(output.contains("@enduml"));
    }
}
