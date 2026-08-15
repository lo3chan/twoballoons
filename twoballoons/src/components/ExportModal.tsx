
import { useStore } from '../store';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { nodes, edges } = useStore();

  if (!isOpen) return null;

  const handleExportSVG = () => {
    // Basic SVG serialization
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">\n`;

    // Render edges
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (fromNode && toNode) {
        svgContent += `  <line x1="${fromNode.x}" y1="${fromNode.y}" x2="${toNode.x}" y2="${toNode.y}" stroke="#3a302a" stroke-width="2" />\n`;
      }
    });

    // Render nodes
    nodes.forEach(node => {
      svgContent += `  <rect x="${(node.x ?? 0) - 50}" y="${(node.y ?? 0) - 25}" width="100" height="50" fill="#faf5ee" stroke="#c2652a" stroke-width="2" rx="4" />\n`;
      svgContent += `  <text x="${(node.x ?? 0)}" y="${(node.y ?? 0)}" font-family="sans-serif" font-size="12" fill="#3a302a" text-anchor="middle" dominant-baseline="middle">${node.name}</text>\n`;
    });

    svgContent += `</svg>`;

    downloadFile(svgContent, 'export.svg', 'image/svg+xml');
  };

  const handleExportTikZ = () => {
    let tikzContent = `\\begin{tikzpicture}[node distance=2cm]\n`;

    nodes.forEach(node => {
      tikzContent += `\\node[draw, rectangle, rounded corners] (${node.id}) at (${(node.x ?? 0)/50}, ${-(node.y ?? 0)/50}) {${node.name}};\n`;
    });

    edges.forEach(edge => {
      tikzContent += `\\draw[->] (${edge.from}) -- (${edge.to});\n`;
    });

    tikzContent += `\\end{tikzpicture}`;

    downloadFile(tikzContent, 'export.tex', 'text/plain');
  };

  const handleExportHTML = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head><title>twoballoons Export</title></head>
      <body>
        <h1>Architecture Export</h1>
        <pre>${JSON.stringify({ nodes, edges }, null, 2)}</pre>
      </body>
      </html>
    `;
    downloadFile(htmlContent, 'export.html', 'text/html');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3a302a]/50 backdrop-blur-sm">
      <div className="hud-glass bg-[#faf5ee] rounded-xl shadow-xl w-[400px] border border-[#d8d0c8] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-[#d8d0c8] bg-[#f6f0e8]">
          <h2 className="text-[#3a302a] font-bold">Universal Export</h2>
          <button onClick={onClose} className="text-[#605850] hover:text-[#c2652a] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <button
            onClick={handleExportHTML}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-[#d8d0c8] hover:bg-[#f2ece4] hover:border-[#c2652a] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#c2652a]">html</span>
              <span className="font-medium text-[#3a302a]">Interactive HTML</span>
            </div>
            <span className="material-symbols-outlined text-[#605850] group-hover:text-[#c2652a]">download</span>
          </button>

          <button
            onClick={handleExportSVG}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-[#d8d0c8] hover:bg-[#f2ece4] hover:border-[#c2652a] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#c2652a]">polyline</span>
              <span className="font-medium text-[#3a302a]">Vector SVG</span>
            </div>
            <span className="material-symbols-outlined text-[#605850] group-hover:text-[#c2652a]">download</span>
          </button>

          <button
            onClick={handleExportTikZ}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-[#d8d0c8] hover:bg-[#f2ece4] hover:border-[#c2652a] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#c2652a]">functions</span>
              <span className="font-medium text-[#3a302a]">LaTeX TikZ</span>
            </div>
            <span className="material-symbols-outlined text-[#605850] group-hover:text-[#c2652a]">download</span>
          </button>
        </div>
      </div>
    </div>
  );
}
