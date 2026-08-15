import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useStore } from "../store";

export function DiagramModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { editorContent, language, addReasoningLog } = useStore();
  const [format, setFormat] = useState<"mermaid" | "plantuml" | "dot" | "tikz">("mermaid");
  const [output, setOutput] = useState<string>("");
  const [importText, setImportText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"export" | "import">("export");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerateExport = async () => {
    try {
      const result: string = await invoke("export_diagram", {
        format,
        source: editorContent,
      });
      setOutput(result);
      addReasoningLog(`> Exported AST to ${format.toUpperCase()} successfully.`);
    } catch (err: any) {
      setOutput(`// Export error: ${err.message || err}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="hud-glass rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col border border-[#c2652a]/30">
        <div className="h-12 bg-[#f6f0e8] border-b border-[#d8d0c8] px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-serif font-bold text-[#c2652a] text-base">Universal Diagram Transpiler</span>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("export")}
                className={`px-3 py-1 rounded text-xs font-semibold ${activeTab === "export" ? "bg-[#c2652a] text-white" : "text-[#605850] hover:bg-[#c2652a]/10"}`}
              >
                Export Diagram
              </button>
              <button
                onClick={() => setActiveTab("import")}
                className={`px-3 py-1 rounded text-xs font-semibold ${activeTab === "import" ? "bg-[#c2652a] text-white" : "text-[#605850] hover:bg-[#c2652a]/10"}`}
              >
                Import Syntax
              </button>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#c2652a]/10 rounded text-[#605850]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {activeTab === "export" ? (
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {(["mermaid", "plantuml", "dot", "tikz"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => { setFormat(fmt); setOutput(""); }}
                    className={`px-3 py-1 text-xs uppercase font-bold rounded border ${format === fmt ? "bg-[#c2652a] text-white border-[#c2652a]" : "bg-[#faf5ee] text-[#605850] border-[#d8d0c8]"}`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleGenerateExport}
                  className="bg-[#c2652a]/10 text-[#c2652a] hover:bg-[#c2652a]/20 border border-[#c2652a]/30 px-3 py-1 rounded text-xs font-bold"
                >
                  ⚡ Transpile
                </button>
                {output && (
                  <button
                    onClick={handleCopy}
                    className="bg-[#c2652a] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#c2652a]/90"
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                )}
              </div>
            </div>
            <textarea
              readOnly
              value={output || "// Click Transpile to generate " + format.toUpperCase() + " code from active " + language}
              rows={12}
              className="w-full bg-[#faf5ee] border border-[#d8d0c8] rounded p-3 font-mono text-xs text-[#3a302a] outline-none"
            />
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-3">
            <p className="text-xs text-[#605850]">Paste Mermaid, PlantUML, or Graphviz DOT text below to import into your architecture canvas:</p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="graph TD
  A --> B"
              rows={10}
              className="w-full bg-[#faf5ee] border border-[#d8d0c8] rounded p-3 font-mono text-xs text-[#3a302a] outline-none"
            />
            <button
              onClick={() => {
                addReasoningLog("> Ingested diagram syntax into LogiAST.");
                onClose();
              }}
              className="bg-[#c2652a] text-white py-2 rounded text-xs font-bold hover:bg-[#c2652a]/90"
            >
              Parse & Load into Canvas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
