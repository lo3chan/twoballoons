import React, { useState, useEffect } from "react";
import { useStore } from "../store";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export function WikiEditor() {
  const { isWikiEditorOpen, setIsWikiEditorOpen, selectedWikiNodeId, nodes, updateNode } = useStore();
  const [localContent, setLocalContent] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("split");

  const currentNode = nodes.find(n => n.id === selectedWikiNodeId);

  useEffect(() => {
    if (currentNode && currentNode.wikiContent !== undefined) {
      setLocalContent(currentNode.wikiContent);
    } else {
      setLocalContent("");
    }
  }, [currentNode?.wikiContent, selectedWikiNodeId]);

  if (!isWikiEditorOpen || !currentNode) return null;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
    updateNode(currentNode.id, { wikiContent: e.target.value });
  };

  return (
    <div className="absolute inset-y-8 right-8 w-1/2 min-w-[500px] z-50 flex flex-col shadow-2xl rounded-lg overflow-hidden hud-glass">
      <div className="h-10 bg-[#f6f0e8] border-b border-[#d8d0c8] flex items-center justify-between px-4">
        <h3 className="font-serif font-bold text-[#3a302a]">
          Wiki / Docs: <span className="text-[#c2652a]">{currentNode.label || currentNode.name || currentNode.id}</span>
        </h3>
        <div className="flex items-center gap-2 text-sm text-[#605850]">
          <button
            className={`px-2 py-1 rounded ${viewMode === "edit" ? "bg-[#c2652a] text-[#faf5ee]" : "hover:bg-[#f2ece4]"}`}
            onClick={() => setViewMode("edit")}
          >
            Edit
          </button>
          <button
            className={`px-2 py-1 rounded ${viewMode === "preview" ? "bg-[#c2652a] text-[#faf5ee]" : "hover:bg-[#f2ece4]"}`}
            onClick={() => setViewMode("preview")}
          >
            Preview
          </button>
          <button
            className={`px-2 py-1 rounded ${viewMode === "split" ? "bg-[#c2652a] text-[#faf5ee]" : "hover:bg-[#f2ece4]"}`}
            onClick={() => setViewMode("split")}
          >
            Split
          </button>
          <button className="ml-2 hover:text-[#c2652a]" onClick={() => setIsWikiEditorOpen(false)}>
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-row overflow-hidden bg-[#faf5ee]">
        {(viewMode === "edit" || viewMode === "split") && (
          <textarea
            className={`w-full p-4 font-mono text-sm bg-transparent outline-none resize-none text-[#3a302a] border-r border-[#d8d0c8]`}
            value={localContent}
            onChange={handleContentChange}
            placeholder="# Markdown Documentation...\n\nSupport for GFM and Math:\n\n$$ E = mc^2 $$"
          />
        )}

        {(viewMode === "preview" || viewMode === "split") && (
          <div className="w-full p-4 overflow-y-auto prose prose-sm prose-stone">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >{localContent}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
