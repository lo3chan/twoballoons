use super::LogiAST;

pub trait DiagramEmitter {
    fn emit(&self, ast: &LogiAST, view_name: &str) -> Result<String, String>;
}
