use super::LogiAST;

pub trait DiagramEmitter {
    fn emit(&self, ast: &LogiAST) -> String;
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;
    use crate::ast::{Entity, EntityKind, Relation, RelationType, ViewProjection};

    struct TestEmitter;
    impl DiagramEmitter for TestEmitter {
        fn emit(&self, ast: &LogiAST) -> String { "emitted".to_string() }
    }

    #[test]
    fn test_emitter_trait() {
        let ast = LogiAST::default();
        let emitter = TestEmitter;
        assert_eq!(emitter.emit(&ast), "emitted");
    }
}
