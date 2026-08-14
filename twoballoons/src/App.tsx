import { Canvas } from "./components/Canvas";
import { LogiEditor } from "./components/LogiEditor";
import "./App.css";

function App() {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      {/* Left Panel: LogiDSL Code Editor */}
      <div className="w-1/3 h-full z-10 relative bg-white shadow-lg flex flex-col">
          <div className="p-3 bg-gray-100 border-b font-semibold text-gray-700">
              LogiDSL Editor
          </div>
          <div className="flex-1">
              <LogiEditor />
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
