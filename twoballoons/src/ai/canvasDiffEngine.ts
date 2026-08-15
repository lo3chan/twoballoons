import { NodeItem, EdgeItem } from "../store";

export interface DiffOperation {
  id: string;
  type: "add" | "remove" | "update";
  entityType: "node" | "edge";
  entity: NodeItem | EdgeItem;
  changes?: Partial<NodeItem | EdgeItem>;
}

export interface DiffPreview {
  operations: DiffOperation[];
}

export function generateCanvasDiff(
  currentNodes: NodeItem[],
  _currentEdges: EdgeItem[],
  prompt: string,
  selectedIds: string[]
): DiffPreview {
  const operations: DiffOperation[] = [];

  if (prompt === "Refactor with Antigravity" && selectedIds.length > 0) {
    // Mock update: modify the first selected node to be 'database' type and change color/label slightly
    const targetNode = currentNodes.find(n => n.id === selectedIds[0]);
    if (targetNode) {
      operations.push({
        id: `op-update-${Date.now()}`,
        type: "update",
        entityType: "node",
        entity: targetNode,
        changes: {
          type: "database",
          label: targetNode.label + " (Refactored)"
        }
      });
    }
  } else if (prompt === "Generate Subsystem Architecture") {
    // Mock add: add two new nodes and an edge
    const newNode1: NodeItem = {
      id: `ai-node-1`,
      name: "Generated Service",
      label: "AI Gen Service",
      x: 300,
      y: 300,
      type: "service",
      worldType: "epistemic"
    };
    const newNode2: NodeItem = {
      id: `ai-node-2`,
      name: "Generated DB",
      label: "AI Gen DB",
      x: 500,
      y: 300,
      type: "database",
      worldType: "alethic"
    };
    const newEdge: EdgeItem = {
      id: `ai-edge-1`,
      from: newNode1.id,
      to: newNode2.id,
      label: "reads/writes"
    };

    operations.push({
      id: `op-add-n1-${Date.now()}`,
      type: "add",
      entityType: "node",
      entity: newNode1
    });
    operations.push({
      id: `op-add-n2-${Date.now()}`,
      type: "add",
      entityType: "node",
      entity: newNode2
    });
    operations.push({
      id: `op-add-e1-${Date.now()}`,
      type: "add",
      entityType: "edge",
      entity: newEdge
    });
  } else if (prompt === "Auto-Layout & Optimize") {
      // Mock remove and add
      if (currentNodes.length > 0) {
          operations.push({
             id: `op-remove-${Date.now()}`,
             type: "remove",
             entityType: "node",
             entity: currentNodes[0]
          })
      }
  }

  return { operations };
}
