import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Canvas } from "./components/Canvas";
import { LogiEditor } from "./components/LogiEditor";
import { useStore } from "./store";
import "./App.css";

function App() {
  const [language, setLanguage] = useState<"logidsl" | "philodsl">("logidsl");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("mermaid");
  const [exportedContent, setExportedContent] = useState("");
  const editorContent = useStore(state => state.editorContent);

  const handleExport = async () => {
    try {
      const result = await invoke("export_diagram", {
        format: exportFormat,
        source: editorContent
      });
      setExportedContent(result as string);
    } catch (e) {
      setExportedContent(`Error: ${e}`);
    }
  };

  const handleImport = async () => {
    try {
      const result = await invoke("import_diagram", { format: "mermaid", content: "" });
      alert(`Import result: ${result}`);
      setIsExportModalOpen(false);
    } catch (e) {
      alert(`Import error: ${e}`);
    }
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      {/* Left Panel: Code Editor */}
      <div className="w-1/3 h-full z-10 relative bg-white shadow-lg flex flex-col">
        <div className="p-3 bg-gray-100 border-b font-semibold text-gray-700 flex justify-between items-center">
          <span>{language === "logidsl" ? "LogiDSL Editor" : "PhiloDSL Editor"}</span>
          <div className="space-x-2">
            <button
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition"
              onClick={() => setIsExportModalOpen(true)}
            >
              Export / Import
            </button>
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
              onClick={() => setLanguage(language === "logidsl" ? "philodsl" : "logidsl")}
            >
              Switch to {language === "logidsl" ? "PhiloDSL" : "LogiDSL"}
            </button>
          </div>
        </div>
        <div className="flex-1">
          <LogiEditor language={language} />
        </div>
      </div>

      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-xl w-[600px] flex flex-col">
            <h2 className="text-xl font-bold mb-4">Export / Import Diagram</h2>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Format:</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="mermaid">Mermaid.js</option>
                <option value="plantuml">PlantUML</option>
                <option value="dot">Graphviz (DOT)</option>
                <option value="tikz">LaTeX (TikZ)</option>
              </select>
            </div>

            <textarea className="flex-1 border p-2 mb-4 font-mono text-sm min-h-[200px]" value={exportedContent} readOnly placeholder="Exported diagram will appear here..." />

            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setIsExportModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Close</button>
              <button onClick={handleImport} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">Test Import Stub</button>
              <button onClick={handleExport} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Export</button>
            </div>
          </div>
        </div>
      )}

      {/* Right Panel: WebGPU Canvas */}
      <div className="w-2/3 h-full relative z-0">
        <Canvas />
      </div>
    </main>
  );
}

export default App;
