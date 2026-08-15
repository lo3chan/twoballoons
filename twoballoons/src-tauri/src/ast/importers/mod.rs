use crate::ast::LogiAST;

pub trait DiagramImporter {
    fn import(&self, content: &str) -> Result<LogiAST, String>;
}

pub mod mermaid_importer;
pub mod plantuml_importer;
pub mod dot_importer;
