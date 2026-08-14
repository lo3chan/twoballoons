use super::emitter::DiagramEmitter;
use super::{LogiAST, EntityKind, RelationType};

pub struct PlantUMLEmitter;

impl DiagramEmitter for PlantUMLEmitter {
    fn emit(&self, ast: &LogiAST, view_name: &str) -> Result<String, String> {
        let view = ast.views.get(view_name).ok_or_else(|| "View not found".to_string())?;

        let mut output = String::new();

        if view.view_type == "sequence" {
            output.push_str("@startuml\n");

            // Declare participants
            for part_id in &view.participants {
                if let Some(entity) = ast.entities.get(part_id) {
                    let label = entity.label.as_deref().unwrap_or(part_id);
                    let tech = entity.tech.as_deref().unwrap_or("");
                    let display = if tech.is_empty() {
                        format!("{}", label)
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
        } else {
            return Err("Unsupported view type for PlantUML emitter".to_string());
        }

        Ok(output)
    }
}
