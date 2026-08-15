import { useEffect, useRef, useState } from "react";
import { ThoughtsWidget } from "./ThoughtsWidget";
import { Application, Graphics, Rectangle, Container, Text } from "pixi.js";
import { useStore } from "../store";
import { invoke } from "@tauri-apps/api/core";

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);

  const { nodes, edges, evaluations } = useStore();
  const nodesContainerRef = useRef<Container | null>(null);
  const edgesContainerRef = useRef<Container | null>(null);
  const selectionGraphicsRef = useRef<Graphics | null>(null);

  const [, setSelectionBox] = useState<Rectangle | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [fillPrompt, setFillPrompt] = useState("");
  const [fillThoughts, setFillThoughts] = useState<string[]>([]);
  const [isFilling, setIsFilling] = useState(false);

  // Render nodes when they change
  useEffect(() => {
    if (!nodesContainerRef.current || !edgesContainerRef.current) return;
    const nodeContainerStage = nodesContainerRef.current;
    const edgeContainerStage = edgesContainerRef.current;

    // Clear previous elements
    nodeContainerStage.removeChildren();
    edgeContainerStage.removeChildren();

    const nodePositions: Record<string, { x: number, y: number }> = {};

    nodes.forEach((node, i) => {
      const g = new Graphics();

      // We will place nodes in a circle for standard LogiDSL testing,
      // but if properties exist we use those.
      const spacing = 150;
      const x = parseFloat(node.properties?.x || `${(i % 5) * spacing + 100}`);
      const y = parseFloat(node.properties?.y || `${Math.floor(i / 5) * spacing + 100}`);
      nodePositions[node.id] = { x, y };

      const isKripkeWorld = node.kind === "nominal" || node.kind === "state";
      const isSelected = selectedNodeIds.includes(node.id);

      if (isKripkeWorld) {
          // Draw circular Kripke World
          g.circle(0, 0, 50);

          // Truth Evaluation Colors
          const evaluatedTrue = evaluations[node.id] === true;
          const evaluatedFalse = evaluations[node.id] === false;

          const fillColor = evaluatedTrue ? 0xdcfce7 : (evaluatedFalse ? 0xfee2e2 : 0xffffff);
          const strokeColor = evaluatedTrue ? 0x22c55e : (evaluatedFalse ? 0xef4444 : 0x3b82f6);

          g.fill({ color: fillColor });
          g.stroke({ color: isSelected ? 0xd4af37 : strokeColor, width: isSelected ? 4 : 3 });
          if (isSelected) {
              // Glow effect simplified as thick border
              g.stroke({ color: 0xffd700, width: 8, alpha: 0.5 });
          }
      } else {
          // Draw standard rectangle for standard nodes
          g.roundRect(-75, -40, 150, 80, 8);
          g.fill({ color: 0xffffff });
          g.stroke({ color: isSelected ? 0xd4af37 : 0x3b82f6, width: isSelected ? 4 : 2 });
          if (isSelected) {
              g.stroke({ color: 0xffd700, width: 8, alpha: 0.5 });
          }
      }

      const label = new Text({
        text: node.label || node.id,
        style: {
          fontFamily: "Inter",
          fontSize: 14,
          fill: 0x1e293b,
          wordWrap: true,
          wordWrapWidth: 100,
          align: "center",
        },
      });
      label.position.set(-label.width / 2, -label.height / 2);

      const nodeContainer = new Container();
      nodeContainer.position.set(x, y);
      nodeContainer.eventMode = "static";
      nodeContainer.cursor = "pointer";

      // Store node ID for spatial bounding box
      (nodeContainer as any).nodeId = node.id;

      let isNodeDragging = false;
      let nodeDragStart = { x: 0, y: 0 };

      nodeContainer.on("pointerdown", (e) => {
        e.stopPropagation(); // Prevent panning or selection box
        isNodeDragging = true;
        nodeDragStart = { x: e.global.x, y: e.global.y };
      });

      nodeContainer.on("pointerup", async () => {
        if (isNodeDragging) {
          isNodeDragging = false;
          try {
            await invoke("update_node_position", {
              id: node.id,
              x: nodeContainer.x,
              y: nodeContainer.y,
            });
          } catch (e) {
            console.error("Failed to sync node position:", e);
          }
        }
      });

      nodeContainer.on("pointerupoutside", () => {
        isNodeDragging = false;
      });

      nodeContainer.on("pointermove", (e) => {
        if (isNodeDragging) {
          const dx =
            (e.global.x - nodeDragStart.x) / appRef.current!.stage.scale.x;
          const dy =
            (e.global.y - nodeDragStart.y) / appRef.current!.stage.scale.y;
          nodeContainer.x += dx;
          nodeContainer.y += dy;
          nodeDragStart = { x: e.global.x, y: e.global.y };
        }
      });

      nodeContainer.addChild(g);
      nodeContainer.addChild(label);

      nodeContainerStage.addChild(nodeContainer);
    });

    // Render edges
    edges.forEach((edge) => {
      const fromPos = nodePositions[edge.from];
      const toPos = nodePositions[edge.to];

      if (fromPos && toPos) {
        const line = new Graphics();
        line.moveTo(fromPos.x, fromPos.y);
        line.lineTo(toPos.x, toPos.y);
        line.stroke({ color: 0x94a3b8, width: 2 });

        // Simple arrow head
        const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
        const arrowSize = 10;

        // Offset arrow head from the center of the destination node
        const offsetDist = 55; // 50 (radius) + 5 padding
        const targetX = toPos.x - Math.cos(angle) * offsetDist;
        const targetY = toPos.y - Math.sin(angle) * offsetDist;

        line.moveTo(targetX, targetY);
        line.lineTo(targetX - arrowSize * Math.cos(angle - Math.PI / 6), targetY - arrowSize * Math.sin(angle - Math.PI / 6));
        line.moveTo(targetX, targetY);
        line.lineTo(targetX - arrowSize * Math.cos(angle + Math.PI / 6), targetY - arrowSize * Math.sin(angle + Math.PI / 6));
        line.stroke({ color: 0x94a3b8, width: 2 });

        edgeContainerStage.addChild(line);
      }
    });
  }, [nodes, edges, evaluations, selectedNodeIds]);

  useEffect(() => {
    if (!canvasRef.current) return;

    let isMounted = true;
    let isPanning = false;
    let isSelecting = false;
    let dragStart = { x: 0, y: 0 };
    let selectionStart = { x: 0, y: 0 };
    let cameraPos = { x: 0, y: 0 };
    let zoom = 1.0;

    const initPixi = async () => {
      const app = new Application();
      await app.init({
        canvas: canvasRef.current!,
        resizeTo: window,
        background: '#faf5ee',
        preference: 'webgl', // Attempt WebGPU backend
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (!isMounted) {
        app.destroy(true);
        return;
      }

      const stage = app.stage;
      stage.eventMode = "static";
      stage.hitArea = new Rectangle(-100000, -100000, 200000, 200000);

      const selectionGraphics = new Graphics();
      stage.addChild(selectionGraphics);
      selectionGraphicsRef.current = selectionGraphics;

      stage.on("pointerdown", (e) => {
        // clear selection on down if click is empty
        setSelectedNodeIds([]);
        if (e.button === 1 || e.shiftKey) { // Middle click or shift click for panning
            isPanning = true;
            dragStart = { x: e.global.x, y: e.global.y };
        } else {
            // Left click for spatial bounding box
            isSelecting = true;
            selectionStart = { x: e.global.x, y: e.global.y };
            setSelectionBox(null);
            selectionGraphics.clear();
        }
      });

      stage.on("pointerup", (e) => {
          isPanning = false;
          if (isSelecting) {
              isSelecting = false;

              const currentPos = { x: e.global.x, y: e.global.y };
              const rect = new Rectangle(
                  Math.min(selectionStart.x, currentPos.x),
                  Math.min(selectionStart.y, currentPos.y),
                  Math.abs(currentPos.x - selectionStart.x),
                  Math.abs(currentPos.y - selectionStart.y)
              );

              // Only trigger if area is reasonably sized
              if (rect.width > 10 && rect.height > 10) {
                  setSelectionBox(rect);

                  // Compute which nodes are in bounds
                  if (nodesContainerRef.current) {
                      const selectedIds: string[] = [];
                      nodesContainerRef.current.children.forEach(child => {
                         const globalPos = child.getGlobalPosition();
                         if (rect.contains(globalPos.x, globalPos.y)) {
                             selectedIds.push((child as any).nodeId);
                         }
                      });
                      if (selectedIds.length > 0) {
                          console.log("Spatial Selection Node IDs:", selectedIds);
                          setSelectedNodeIds(selectedIds);
                      }
                  }
              } else {
                  selectionGraphics.clear();
              }
          }
      });

      stage.on("pointerupoutside", () => {
          isPanning = false;
          isSelecting = false;
          selectionGraphics.clear();
          // Do not clear selection here, to keep them selected for prompt
      });

      stage.on("pointermove", (e) => {
        if (isPanning) {
          const dx = (e.global.x - dragStart.x) / zoom;
          const dy = (e.global.y - dragStart.y) / zoom;
          cameraPos.x += dx;
          cameraPos.y += dy;
          stage.position.set(cameraPos.x, cameraPos.y);
          dragStart = { x: e.global.x, y: e.global.y };
        } else if (isSelecting) {
          const currentPos = { x: e.global.x, y: e.global.y };

          selectionGraphics.clear();
          selectionGraphics.rect(
              Math.min(selectionStart.x, currentPos.x) / zoom - cameraPos.x,
              Math.min(selectionStart.y, currentPos.y) / zoom - cameraPos.y,
              Math.abs(currentPos.x - selectionStart.x) / zoom,
              Math.abs(currentPos.y - selectionStart.y) / zoom
          );
          selectionGraphics.fill({ color: 0x3b82f6, alpha: 0.2 });
          selectionGraphics.stroke({ color: 0x3b82f6, width: 1, alpha: 0.8 });
        }
      });

      canvasRef.current!.addEventListener(
        "wheel",
        (e) => {
          e.preventDefault();
          const zoomFactor = 1.1;
          if (e.deltaY < 0) zoom *= zoomFactor;
          else zoom /= zoomFactor;
          stage.scale.set(zoom);
        },
        { passive: false },
      );

      appRef.current = app;
      console.log("PixiJS initialized with WebGPU preference");

      const edgesContainer = new Container();
      stage.addChild(edgesContainer);
      edgesContainerRef.current = edgesContainer;

      const nodesContainer = new Container();
      stage.addChild(nodesContainer);
      nodesContainerRef.current = nodesContainer;
    };

    initPixi();

    return () => {
      isMounted = false;
      if (appRef.current) {
        appRef.current.destroy(false, { children: true });
        appRef.current = null;
      }
    };
  }, []);



  const handleSpatialFill = async () => {
    if (!fillPrompt || selectedNodeIds.length < 2) return;
    setIsFilling(true);
    setFillThoughts([]);
    let tokenBuffer = "";
    try {
      const sidecarUrl = import.meta.env.VITE_SIDE_CAR_URL || "http://127.0.0.1:50927";
      const targetNodes = nodes.filter(n => selectedNodeIds.includes(n.id));

      const response = await fetch(`${sidecarUrl}/generate/spatial-fill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_ast: JSON.stringify(targetNodes, null, 2),
          prompt: fillPrompt,
          selected_node_ids: selectedNodeIds
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
                setFillThoughts(prev => [...prev, data.content]);
              } else if (data.type === 'token') {
                tokenBuffer += data.content;
              }
            }
          }
        }
      }

      // If we got a valid action model token output, we want to call the tauri command.
      // Usually, the action model will be parsed.
      // The sidecar is emitting AST JSON or LogiDSL. We need to evaluate it as PhiloDSL or generic JSON.
      // Assuming for Dynamic Epistemic Action model that token buffer represents the action model JSON
      if (tokenBuffer.includes('events') && tokenBuffer.includes('preconditions')) {
          try {
             // Rebuild the current AST to send to Rust
             const currentAst = {
                 states: nodes.reduce((acc: Record<string, any>, node: any) => {
                     acc[node.id] = {
                         id: node.id,
                         name: node.label,
                         formulas: node.formulas || []
                     };
                     return acc;
                 }, {}),
                 relations: edges
             };

             const resultJson = await invoke("apply_epistemic_action", {
                 currentAstJson: JSON.stringify(currentAst),
                 actionModelJson: tokenBuffer,
             });

             const result = JSON.parse(resultJson as string);
             if (result && result.ast) {
                const ast = result.ast;
                if (ast.states) {
                  const parsedNodes = Object.values(ast.states).map((s: any) => ({
                    id: s.id,
                    kind: "state",
                    label: s.name || s.id,
                    formulas: s.formulas,
                  }));
                  useStore.getState().setNodes(parsedNodes);
                }
                if (ast.relations) {
                  useStore.getState().setEdges(ast.relations);
                }
                if (result.evaluations) {
                  useStore.getState().setEvaluations(result.evaluations);
                }
             }
          } catch(e) {
             console.error("Failed to invoke apply_epistemic_action:", e);
          }
      }
    } catch (e) {
      console.error("Spatial Fill Error:", e);
    } finally {
      setIsFilling(false);
      setSelectedNodeIds([]);
    }
  };


  return (
    <div className="relative w-full h-full">
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full outline-none cursor-crosshair"
      style={{ display: "block" }}
    />
    {selectedNodeIds.length >= 2 && (
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-lg border flex flex-col gap-2 w-[400px] z-50">
        <h3 className="font-bold text-sm">Spatial Generative Fill</h3>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border p-1 rounded text-sm"
            placeholder="Transform into redundant cluster..."
            value={fillPrompt}
            onChange={e => setFillPrompt(e.target.value)}
            disabled={isFilling}
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            onClick={handleSpatialFill}
            disabled={isFilling || !fillPrompt}
          >
            {isFilling ? "Filling..." : "Fill"}
          </button>
        </div>
        {fillThoughts.length > 0 && (
          <div className="mt-2 text-xs text-gray-600 max-h-32 overflow-y-auto">
            <ThoughtsWidget thoughts={fillThoughts} />
          </div>
        )}
      </div>
    )}
    </div>
  );
}
