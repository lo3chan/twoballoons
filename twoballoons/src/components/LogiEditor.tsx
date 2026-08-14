import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import { useStore } from "../store";
import { invoke } from "@tauri-apps/api/core";

export function LogiEditor() {
  const monaco = useMonaco();
  const { setNodes } = useStore();

  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: "logidsl" });

      monaco.languages.setMonarchTokensProvider("logidsl", {
        keywords: ['actor', 'component', 'store', 'claim', 'boundary', 'gate', 'assert'],
        operators: ['->', '<=>', '=>', '=/=', '..>'],
        tokenizer: {
          root: [
            [/[a-z_$][\w$]*/, {
              cases: {
                '@keywords': 'keyword',
                '@default': 'identifier'
              }
            }],
            [/[A-Z][\w\$]*/, 'type.identifier'],
            [/".*?"/, 'string'],
            [/\/\/.*/, 'comment'],
            [/@symbols/, {
              cases: {
                '@operators': 'operator',
                '@default': ''
              }
            }]
          ]
        }
      });
    }
  }, [monaco]);

  const handleEditorChange = async (value: string | undefined) => {
    if (value) {
       try {
           const astJson: string = await invoke("parse_logidsl", { source: value });
           const ast = JSON.parse(astJson);

           if (ast && ast.entities) {
               const parsedNodes = Object.values(ast.entities);
               setNodes(parsedNodes);
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
        defaultLanguage="logidsl"
        theme="vs-light"
        defaultValue={`actor User {\n    label: "End User Client"\n}`}
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
