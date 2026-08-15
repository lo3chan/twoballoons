use tree_sitter_language::LanguageFn;

extern "C" {
    fn tree_sitter_philo() -> *const ();
}

pub const LANGUAGE: LanguageFn = unsafe { LanguageFn::from_raw(tree_sitter_philo) };

pub fn language() -> tree_sitter::Language {
    LANGUAGE.into()
}
