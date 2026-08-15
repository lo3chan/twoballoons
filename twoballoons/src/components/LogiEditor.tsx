import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import { useStore } from "../store";
import { invoke } from "@tauri-apps/api/core";

export function LogiEditor({ language }: { language: "logidsl" | "philodsl" }) {
  const monaco = useMonaco();
  const { setNodes, setEdges, setEvaluations, setEditorContent } = useStore();

  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: "logidsl" });
      monaco.languages.setMonarchTokensProvider("logidsl", {
        symbols: /[=><!~?:&|+\-*\/\^%]+/, 
    keywords: [
          "actor",
          "component",
          "store",
          "claim",
          "boundary",
          "gate",
          "assert",
        ],
        operators: ["->", "<=>", "=>", "=/=", "..>"],
        tokenizer: {
          root: [
            [
              /[a-z_$][\w$]*/,
              {
                cases: {
                  "@keywords": "keyword",
                  "@default": "identifier",
                },
              },
            ],
            [/[A-Z][\w\$]*/, "type.identifier"],
            [/".*?"/, "string"],
            [/\/\/.*/, "comment"],
            [
              /@symbols/,
              {
                cases: {
                  "@operators": "operator",
                  "@default": "",
                },
              },
            ],
          ],
        },
      });

      monaco.languages.register({ id: "philodsl" });
      monaco.languages.setMonarchTokensProvider("philodsl", {
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        keywords: [
          "agent",
          "world",
          "knows",
          "believes",
          "public_announcement",
          "group_knowledge",
          "distributed_knowledge",
          "formula",
          "action_model"
        ],
        operators: ["[]", "<>", "->", "<=>", "&", "|", "~"],
        tokenizer: {
          root: [
            [
              /[a-z_$][\w$]*/,
              {
                cases: {
                  "@keywords": "keyword",
                  "@default": "identifier",
                },
              },
            ],
            [/[A-Z][\w\$]*/, "type.identifier"],
            [/".*?"/, "string"],
            [/\/\/.*/, "comment"],
            [
              /@symbols/,
              {
                cases: {
                  "@operators": "operator",
                  "@default": "",
                },
              },
            ],
          ],
        },
      });
    }
  }, [monaco]);

  useEffect(() => {
    const defaultContent = language === "logidsl" ? `actor User {\n    label: "End User Client"\n}` : `state w1 {\n    formulas: []\n}`;
    setEditorContent(defaultContent);
  }, [language]);

  const handleEditorChange = async (value: string | undefined) => {
    if (value) {
      setEditorContent(value);
      try {
        if (language === "logidsl") {
          const astJson: string = await invoke("parse_logidsl", {
            source: value,
          });
          const ast = JSON.parse(astJson);

          if (ast && ast.entities) {
            const parsedNodes = Object.values(ast.entities);
            setNodes(parsedNodes);
            if (ast.relations) {
              setEdges(ast.relations);
            }
          }
        } else if (language === "philodsl") {
          const resultJson: string = await invoke("parse_and_evaluate_philodsl", {
            source: value,
          });
          const result = JSON.parse(resultJson);

          if (result && result.ast) {
            const ast = result.ast;
            if (ast.states) {
              const parsedNodes = Object.values(ast.states).map((s: any) => ({
                id: s.id,
                kind: "nominal",
                label: s.name || s.id,
                formulas: s.formulas,
              }));
              setNodes(parsedNodes);
            }
            if (ast.relations) {
              setEdges(ast.relations);
            }
          }
          if (result && result.evaluations) {
            setEvaluations(result.evaluations);
          }
        }
      } catch (e) {
        console.error("Syntax Error or AST parsing failed:", e);
      }
    }
  };

  return (
    <div className="h-full w-full border-r border-gray-300">
      <Editor
        height="100%"
        language={language}
        theme="vs-light"
        defaultValue={language === "logidsl" ? `actor User {\n    label: "End User Client"\n}` : `state w1 {\n    formulas: []\n}`}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "Inter, monospace",
        }}
      />
    </div>
  );
}
