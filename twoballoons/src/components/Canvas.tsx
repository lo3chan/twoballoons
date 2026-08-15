import { useEffect, useRef, useState } from "react";
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

      if (isKripkeWorld) {
          // Draw circular Kripke World
          g.circle(0, 0, 50);

          // Truth Evaluation Colors
          const evaluatedTrue = evaluations[node.id] === true;
          const evaluatedFalse = evaluations[node.id] === false;

          const fillColor = evaluatedTrue ? 0xdcfce7 : (evaluatedFalse ? 0xfee2e2 : 0xffffff);
          const strokeColor = evaluatedTrue ? 0x22c55e : (evaluatedFalse ? 0xef4444 : 0x3b82f6);

          g.fill({ color: fillColor });
          g.stroke({ color: strokeColor, width: 3 });
      } else {
          // Draw standard rectangle for standard nodes
          g.roundRect(-75, -40, 150, 80, 8);
          g.fill({ color: 0xffffff });
          g.stroke({ color: 0x3b82f6, width: 2 });
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
  }, [nodes, edges, evaluations]);

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
        backgroundColor: 0xf6f6f6,
        preference: "webgpu", // Attempt WebGPU backend
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
                          // TODO: Dispatch to Antigravity Sidecar
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

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full outline-none cursor-crosshair"
      style={{ display: "block" }}
    />
  );
}
