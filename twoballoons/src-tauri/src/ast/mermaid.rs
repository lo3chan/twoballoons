use super::emitter::DiagramEmitter;
use super::{LogiAST, EntityKind, RelationType};

pub struct MermaidEmitter;

impl DiagramEmitter for MermaidEmitter {
    fn emit(&self, ast: &LogiAST, view_name: &str) -> Result<String, String> {
        let view = ast.views.get(view_name).ok_or_else(|| "View not found".to_string())?;

        let mut output = String::new();

        if view.view_type == "c4_container" {
            output.push_str("graph TD\n");

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
                                    format!("{}", label)
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
                if !view.focus.iter().any(|f| ast.entities.get(f).map_or(false, |e| e.contains.contains(part_id))) {
                    if let Some(part) = ast.entities.get(part_id) {
                         let label = part.label.as_deref().unwrap_or(part_id);
                         output.push_str(&format!("    {}[\"{}\"]\n", part_id, label));
                    }
                }
            }
            output.push('\n');

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

        } else {
            return Err("Unsupported view type for Mermaid emitter".to_string());
        }

        Ok(output)
    }
}
