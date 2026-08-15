fn main() {
    let root_dir = std::path::Path::new(".");
    let src_dir = root_dir.join("src");
    let mut c_config = cc::Build::new();
    c_config.include(&src_dir);
    c_config.file(src_dir.join("parser.c"));
    if src_dir.join("scanner.c").exists() {
        c_config.file(src_dir.join("scanner.c"));
    }
    c_config.compile("tree-sitter-philo");
}
