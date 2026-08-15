use crate::ast::{Entity, EntityKind, LogiAST, Relation, RelationType};
use crate::ast::importers::DiagramImporter;
use std::collections::HashMap;

pub struct DotImporter;

impl DiagramImporter for DotImporter {
    fn import(&self, content: &str) -> Result<LogiAST, String> {
        let mut ast = LogiAST::default();
        let mut entities = HashMap::new();
        let mut relations = Vec::new();

        let lines: Vec<&str> = content.lines().collect();

        for line in lines {
            let mut trimmed = line.trim();
            if trimmed.is_empty() || trimmed.starts_with("//") || trimmed.starts_with("digraph") || trimmed.starts_with("}") {
                continue;
            }

            // Remove trailing semicolons
            if trimmed.ends_with(';') {
                trimmed = trimmed[..trimmed.len() - 1].trim();
            }

            // Simple parser for A -> B [label="..."]

            if trimmed.contains("->") || trimmed.contains("--") {
                let rel_type = RelationType::DirectedFlow;

                let parts: Vec<&str> = if trimmed.contains("->") {
                    trimmed.split("->").collect()
                } else {
                    trimmed.split("--").collect()
                };

                if parts.len() == 2 {
                    let from_part = parts[0].trim();
                    let mut to_part = parts[1].trim();
                    let mut label = None;

                    // Handle labels like A -> B [label="..."]
                    if let Some(bracket_start) = to_part.find('[') {
                        if let Some(bracket_end) = to_part.find(']') {
                            if bracket_start < bracket_end {
                                let attrs = &to_part[bracket_start + 1..bracket_end];
                                if attrs.contains("label=") {
                                    let label_parts: Vec<&str> = attrs.split("label=").collect();
                                    if label_parts.len() > 1 {
                                         label = Some(label_parts[1].trim_matches('"').to_string());
                                    }
                                }
                                to_part = to_part[..bracket_start].trim();
                            }
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
            } else if trimmed.contains("[") && trimmed.contains("]") {
                 // Node with attributes, e.g. A [label="..."]
                 let parts: Vec<&str> = trimmed.splitn(2, '[').collect();
                 if parts.len() == 2 {
                     let id_part = parts[0].trim();
                     let attrs_part = parts[1].trim_end_matches(']');

                     let clean_id = parse_node(&mut entities, id_part);

                     if attrs_part.contains("label=") {
                         if let Some(entity) = entities.get_mut(&clean_id) {
                              let label_parts: Vec<&str> = attrs_part.split("label=").collect();
                              if label_parts.len() > 1 {
                                   let parsed_label = label_parts[1].split(',').next().unwrap_or(label_parts[1]).trim_matches('"');
                                   entity.label = Some(parsed_label.to_string());
                              }
                         }
                     }
                 }
            } else if !trimmed.contains("{") {
                 parse_node(&mut entities, trimmed);
            }
        }

        ast.entities = entities;
        ast.relations = relations;
        Ok(ast)
    }
}

fn parse_node(entities: &mut HashMap<String, Entity>, part: &str) -> String {
    let clean_id = part.trim_matches('"').to_string();

    if !entities.contains_key(&clean_id) && !clean_id.is_empty() {
        entities.insert(
            clean_id.clone(),
            Entity {
                id: clean_id.clone(),
                kind: EntityKind::Component, // Default kind
                label: None,
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
    fn test_dot_importer_basic() {
        let content = r#"
            digraph G {
                A [label="Node A"];
                B [label="Node B"];
                A -> B [label="edge 1"];
                B -> C;
            }
        "#;

        let importer = DotImporter;
        let ast = importer.import(content).unwrap();

        assert_eq!(ast.entities.len(), 3);
        assert!(ast.entities.contains_key("A"));
        assert_eq!(ast.entities.get("A").unwrap().label.as_deref(), Some("Node A"));

        assert_eq!(ast.relations.len(), 2);
        assert_eq!(ast.relations[0].from, "A");
        assert_eq!(ast.relations[0].to, "B");
        assert_eq!(ast.relations[0].label.as_deref(), Some("edge 1"));
    }
}
