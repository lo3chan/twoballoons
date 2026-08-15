fn main() {
    let root = std::path::Path::new("..");
    
    // 1. Compile tree-sitter-logi parser.c
    let logi_src = root.join("tree-sitter-logi").join("src");
    if logi_src.join("parser.c").exists() {
        let mut build = cc::Build::new();
        build.include(&logi_src);
        build.file(logi_src.join("parser.c"));
        if logi_src.join("scanner.c").exists() {
            build.file(logi_src.join("scanner.c"));
        }
        build.compile("tree-sitter-logi");
    }

    // 2. Compile tree-sitter-philo parser.c
    let philo_src = root.join("tree-sitter-philo").join("src");
    if philo_src.join("parser.c").exists() {
        let mut build = cc::Build::new();
        build.include(&philo_src);
        build.file(philo_src.join("parser.c"));
        if philo_src.join("scanner.c").exists() {
            build.file(philo_src.join("scanner.c"));
        }
        build.compile("tree-sitter-philo");
    }

    tauri_build::build();
}
