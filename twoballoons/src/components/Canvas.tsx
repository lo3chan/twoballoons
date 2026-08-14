import { useEffect, useRef } from "react";
import { Application, Graphics, Rectangle, Container, Text } from "pixi.js";
import { useStore } from "../store";
import { invoke } from "@tauri-apps/api/core";

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);

  const { nodes, edges } = useStore();
  const nodesContainerRef = useRef<any>(null);

  // Render nodes when they change
  useEffect(() => {
    if (!nodesContainerRef.current) return;
    const container = nodesContainerRef.current;

    // Clear previous nodes
    container.removeChildren();

    nodes.forEach((node) => {
      const g = new Graphics();
      const x = parseFloat(node.properties?.x || "0");
      const y = parseFloat(node.properties?.y || "0");

      // Draw standard rectangle for nodes
      g.roundRect(0, 0, 150, 80, 8);
      g.fill({ color: 0xffffff });
      g.stroke({ color: 0x3b82f6, width: 2 });

      const label = new Text({
          text: node.label || node.id,
          style: {
              fontFamily: 'Inter',
              fontSize: 14,
              fill: 0x1e293b,
              wordWrap: true,
              wordWrapWidth: 130,
              align: 'center'
          }
      });
      label.position.set(150 / 2 - label.width / 2, 80 / 2 - label.height / 2);

      const nodeContainer = new Container();
      nodeContainer.position.set(x, y);
      nodeContainer.eventMode = 'static';
      nodeContainer.cursor = 'pointer';

      let isNodeDragging = false;
      let nodeDragStart = { x: 0, y: 0 };

      nodeContainer.on('pointerdown', (e) => {
          e.stopPropagation(); // Prevent panning
          isNodeDragging = true;
          nodeDragStart = { x: e.global.x, y: e.global.y };
      });

      nodeContainer.on('pointerup', async () => {
          if (isNodeDragging) {
              isNodeDragging = false;
              // Sync position back to rust
              try {
                  await invoke("update_node_position", {
                      id: node.id,
                      x: nodeContainer.x,
                      y: nodeContainer.y
                  });
              } catch (e) {
                  console.error("Failed to sync node position:", e);
              }
          }
      });

      nodeContainer.on('pointerupoutside', () => { isNodeDragging = false; });

      nodeContainer.on('pointermove', (e) => {
          if (isNodeDragging) {
              const dx = (e.global.x - nodeDragStart.x) / appRef.current!.stage.scale.x;
              const dy = (e.global.y - nodeDragStart.y) / appRef.current!.stage.scale.y;
              nodeContainer.x += dx;
              nodeContainer.y += dy;
              nodeDragStart = { x: e.global.x, y: e.global.y };
          }
      });

      nodeContainer.addChild(g);
      nodeContainer.addChild(label);

      container.addChild(nodeContainer);
    });
  }, [nodes]);

  useEffect(() => {
    if (!canvasRef.current) return;

    let isMounted = true;
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
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
      stage.eventMode = 'static';
      stage.hitArea = new Rectangle(-100000, -100000, 200000, 200000);

      stage.on('pointerdown', (e) => {
        isDragging = true;
        dragStart = { x: e.global.x, y: e.global.y };
      });

      stage.on('pointerup', () => isDragging = false);
      stage.on('pointerupoutside', () => isDragging = false);

      stage.on('pointermove', (e) => {
        if (isDragging) {
          const dx = (e.global.x - dragStart.x) / zoom;
          const dy = (e.global.y - dragStart.y) / zoom;
          cameraPos.x += dx;
          cameraPos.y += dy;
          stage.position.set(cameraPos.x, cameraPos.y);
          dragStart = { x: e.global.x, y: e.global.y };
        }
      });

      canvasRef.current!.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomFactor = 1.1;
        if (e.deltaY < 0) zoom *= zoomFactor;
        else zoom /= zoomFactor;
        stage.scale.set(zoom);
      }, { passive: false });

      appRef.current = app;
      console.log("PixiJS initialized with WebGPU preference");

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
      className="absolute inset-0 w-full h-full outline-none"
      style={{ display: "block" }}
    />
  );
}
