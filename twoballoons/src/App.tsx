import { useState } from "react";
import { Canvas } from "./components/Canvas";
import { LogiEditor } from "./components/LogiEditor";
import "./App.css";

function App() {
  const [language, setLanguage] = useState<"logidsl" | "philodsl">("logidsl");

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      {/* Left Panel: Code Editor */}
      <div className="w-1/3 h-full z-10 relative bg-white shadow-lg flex flex-col">
        <div className="p-3 bg-gray-100 border-b font-semibold text-gray-700 flex justify-between items-center">
          <span>{language === "logidsl" ? "LogiDSL Editor" : "PhiloDSL Editor"}</span>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
            onClick={() => setLanguage(language === "logidsl" ? "philodsl" : "logidsl")}
          >
            Switch to {language === "logidsl" ? "PhiloDSL" : "LogiDSL"}
          </button>
        </div>
        <div className="flex-1">
          <LogiEditor language={language} />
        </div>
      </div>

      {/* Right Panel: WebGPU Canvas */}
      <div className="w-2/3 h-full relative z-0">
        <Canvas />
      </div>
    </main>
  );
}

export default App;
