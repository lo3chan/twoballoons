use crate::ast::{Entity, EntityKind, LogiAST, Relation, RelationType};
use crate::ast::importers::DiagramImporter;
use std::collections::HashMap;

pub struct PlantUMLImporter;

impl DiagramImporter for PlantUMLImporter {
    fn import(&self, content: &str) -> Result<LogiAST, String> {
        let mut ast = LogiAST::default();
        let mut entities = HashMap::new();
        let mut relations = Vec::new();

        let lines: Vec<&str> = content.lines().collect();

        for line in lines {
            let trimmed = line.trim();
            if trimmed.is_empty() || trimmed.starts_with("'") || trimmed.starts_with("@startuml") || trimmed.starts_with("@enduml") {
                continue;
            }

            // Simple parser for [A] -> [B] : label or A -> B

            if trimmed.contains("->") || trimmed.contains("..>") || trimmed.contains("<--") || trimmed.contains("<|--") {
                let parts: Vec<&str>;
                let mut rel_type = RelationType::DirectedFlow;

                if trimmed.contains("..>") {
                    parts = trimmed.split("..>").collect();
                    rel_type = RelationType::WeakDependency;
                } else if trimmed.contains("->") {
                    parts = trimmed.split("->").collect();
                } else if trimmed.contains("<--") {
                    parts = trimmed.split("<--").collect();
                } else {
                     parts = trimmed.split("<|--").collect();
                }

                if parts.len() == 2 {
                    let from_part = parts[0].trim();
                    let mut to_part = parts[1].trim();
                    let mut label = None;

                    // Handle labels like A -> B : label
                    if let Some(colon_idx) = to_part.find(':') {
                        label = Some(to_part[colon_idx + 1..].trim().to_string());
                        to_part = to_part[..colon_idx].trim();
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
            } else if trimmed.starts_with("component ") || trimmed.starts_with("class ") || trimmed.starts_with("actor ") {
                let parts: Vec<&str> = trimmed.split_whitespace().collect();
                if parts.len() >= 2 {
                    let mut id = parts[1].to_string();
                    let mut label = None;

                    if parts.len() > 3 && parts[2] == "as" {
                        id = parts[3].to_string();
                        label = Some(parts[1].trim_matches('"').to_string());
                    } else if parts.len() == 2 {
                        id = parts[1].trim_matches('"').to_string();
                    }

                    let clean_id = id.replace("[", "").replace("]", "");

                    entities.insert(
                        clean_id.clone(),
                        Entity {
                            id: clean_id.clone(),
                            kind: EntityKind::Component,
                            label,
                            tech: None,
                            status: None,
                            contains: Vec::new(),
                        },
                    );
                }
            } else {
                 parse_node(&mut entities, trimmed);
            }
        }

        ast.entities = entities;
        ast.relations = relations;
        Ok(ast)
    }
}

fn parse_node(entities: &mut HashMap<String, Entity>, part: &str) -> String {
    let mut id = part.to_string();
    let mut label = None;

    if part.starts_with('[') && part.ends_with(']') && part.len() > 1 {
        id = part[1..part.len()-1].to_string();
        label = Some(id.clone());
    } else if part.starts_with('"') && part.ends_with('"') && part.len() > 1 {
         id = part[1..part.len()-1].to_string();
    }

    let clean_id = id.trim().to_string();

    if !entities.contains_key(&clean_id) && !clean_id.is_empty() && !clean_id.contains("{") && !clean_id.contains("}") {
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
    }

    clean_id
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_plantuml_importer_basic() {
        let content = r#"
            @startuml
            [Component A] -> [Component B] : sends data
            component C as CompC
            CompC ..> [Component B]
            @enduml
        "#;

        let importer = PlantUMLImporter;
        let ast = importer.import(content).unwrap();

        assert_eq!(ast.entities.len(), 3);
        assert!(ast.entities.contains_key("Component A"));
        assert!(ast.entities.contains_key("Component B"));
        assert!(ast.entities.contains_key("CompC"));

        assert_eq!(ast.entities.get("CompC").unwrap().label.as_deref(), Some("C"));

        assert_eq!(ast.relations.len(), 2);
        assert_eq!(ast.relations[0].from, "Component A");
        assert_eq!(ast.relations[0].to, "Component B");
        assert_eq!(ast.relations[0].label.as_deref(), Some("sends data"));
    }
}
