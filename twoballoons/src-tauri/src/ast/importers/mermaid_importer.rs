use crate::ast::{Entity, EntityKind, LogiAST, Relation, RelationType};
use crate::ast::importers::DiagramImporter;
use std::collections::HashMap;

pub struct MermaidImporter;

impl DiagramImporter for MermaidImporter {
    fn import(&self, content: &str) -> Result<LogiAST, String> {
        let mut ast = LogiAST::default();
        let mut entities = HashMap::new();
        let mut relations = Vec::new();

        let lines: Vec<&str> = content.lines().collect();

        for line in lines {
            let trimmed = line.trim();
            if trimmed.is_empty() || trimmed.starts_with("%%") || trimmed.starts_with("graph ") || trimmed.starts_with("flowchart ") || trimmed.starts_with("sequenceDiagram") {
                continue;
            }

            // Very simple parser for A --> B or A -->|label| B
            // Also parsing node definitions like A[Label]

            if trimmed.contains("-->") || trimmed.contains("-.->") || trimmed.contains("==>") || trimmed.contains("->") {
                let parts: Vec<&str>;
                let mut rel_type = RelationType::DirectedFlow;

                if trimmed.contains("-->") {
                    parts = trimmed.split("-->").collect();
                } else if trimmed.contains("-.->") {
                    parts = trimmed.split("-.->").collect();
                    rel_type = RelationType::WeakDependency;
                } else if trimmed.contains("==>") {
                    parts = trimmed.split("==>").collect();
                    rel_type = RelationType::Implication;
                } else {
                    parts = trimmed.split("->").collect();
                }

                if parts.len() == 2 {
                    let from_part = parts[0].trim();
                    let mut to_part = parts[1].trim();
                    let mut label = None;

                    // Handle labels like A -->|label| B
                    if to_part.starts_with('|') {
                        if let Some(end_idx) = to_part[1..].find('|') {
                            label = Some(to_part[1..=end_idx].to_string());
                            to_part = to_part[end_idx + 2..].trim();
                        }
                    }

                    let from_id = parse_node(&mut entities, from_part);
                    let to_id = parse_node(&mut entities, to_part);

                    relations.push(Relation {
                        from: from_id,
                        to: to_id,
                        rel_type,
                        label,
                    });
                }
            } else {
                // Possibly just a node definition
                parse_node(&mut entities, trimmed);
            }
        }

        ast.entities = entities;
        ast.relations = relations;
        Ok(ast)
    }
}

fn parse_node(entities: &mut HashMap<String, Entity>, part: &str) -> String {
    // Handle formats like A[Label] or A(Label) or A
    let mut id = part.to_string();
    let mut label = None;

    if let Some(start) = part.find('[') {
        if let Some(end) = part.find(']') {
            if start < end {
                id = part[..start].trim().to_string();
                label = Some(part[start + 1..end].trim().to_string());
            }
        }
    } else if let Some(start) = part.find('(') {
         if let Some(end) = part.find(')') {
             if start < end {
                id = part[..start].trim().to_string();
                label = Some(part[start + 1..end].trim().to_string());
             }
        }
    } else if let Some(start) = part.find('{') {
         if let Some(end) = part.find('}') {
             if start < end {
                id = part[..start].trim().to_string();
                label = Some(part[start + 1..end].trim().to_string());
             }
        }
    }

    let clean_id = id.replace(";", "");

    if !entities.contains_key(&clean_id) {
        entities.insert(
            clean_id.clone(),
            Entity {
                id: clean_id.clone(),
                kind: EntityKind::Component, // Default kind
                label,
                tech: None,
                status: None,
                contains: Vec::new(),
            },
        );
    } else if let Some(existing_entity) = entities.get_mut(&clean_id) {
        if existing_entity.label.is_none() && label.is_some() {
             existing_entity.label = label;
        }
    }

    clean_id
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mermaid_importer_flowchart() {
        let content = r#"
            graph TD
            A[User] -->|logs in| B(Auth Service)
            B --> C{Database}
            D -.-> E
        "#;

        let importer = MermaidImporter;
        let ast = importer.import(content).unwrap();

        assert_eq!(ast.entities.len(), 5);
        assert!(ast.entities.contains_key("A"));
        assert_eq!(ast.entities.get("A").unwrap().label.as_deref(), Some("User"));
        assert_eq!(ast.entities.get("B").unwrap().label.as_deref(), Some("Auth Service"));
        assert_eq!(ast.entities.get("C").unwrap().label.as_deref(), Some("Database"));

        assert_eq!(ast.relations.len(), 3);
        assert_eq!(ast.relations[0].from, "A");
        assert_eq!(ast.relations[0].to, "B");
        assert_eq!(ast.relations[0].label.as_deref(), Some("logs in"));

        assert_eq!(ast.relations[2].from, "D");
        assert_eq!(ast.relations[2].to, "E");
    }
}
