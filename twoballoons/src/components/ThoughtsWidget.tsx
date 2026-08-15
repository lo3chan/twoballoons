import { useState } from "react";

export function ThoughtsWidget({ thoughts, onStreamToken }: { thoughts: string[], onStreamToken?: (token: string) => void }) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [localThoughts, setLocalThoughts] = useState<string[]>(thoughts);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setLocalThoughts([]);

    try {
      const sidecarUrl = import.meta.env.VITE_SIDE_CAR_URL || "http://127.0.0.1:50927";
      const response = await fetch(`${sidecarUrl}/generate/diagram`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          target_format: "logidsl"
        })
      });

      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'thought') {
                setLocalThoughts(prev => [...prev, data.content]);
              } else if (data.type === 'token') {
                if (onStreamToken) {
                  onStreamToken(data.content);
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to generate:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 border rounded shadow-sm flex flex-col h-full">
      <h3 className="font-bold mb-2">AI Engine Thoughts</h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Generate diagram from prompt..."
          className="flex-1 border p-1 rounded"
          disabled={isGenerating}
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt}
          className="bg-blue-500 text-white px-3 py-1 rounded disabled:bg-gray-400"
        >
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {localThoughts.length === 0 ? (
          <p className="text-gray-500 italic text-sm">No thoughts yet.</p>
        ) : (
          <ul className="list-disc pl-5">
            {localThoughts.map((thought, i) => (
              <li key={i} className="text-sm mb-1 text-gray-700">
                {thought}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
