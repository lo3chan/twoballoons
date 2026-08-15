fn main() {
    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR").unwrap();
    let src_dir = std::path::Path::new(&manifest_dir).join("src");
    let mut c_config = cc::Build::new();
    c_config.include(&src_dir);
    c_config.file(src_dir.join("parser.c"));
    if src_dir.join("scanner.c").exists() {
        c_config.file(src_dir.join("scanner.c"));
    }
    c_config.compile("tree-sitter-logi");
}
