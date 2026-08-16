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

// Generates a deterministic ID for operations based on input to avoid Date.now() randomness
let opCounter = 0;
function getOpId(prefix: string): string {
  opCounter++;
  return `${prefix}-${opCounter}`;
}

function isValidWorldType(type: string): boolean {
  return ["alethic", "epistemic", "deontic"].includes(type);
}

function isValidNodeType(type: string): boolean {
  return ["container", "database", "service", "gateway"].includes(type);
}

export function generateCanvasDiff(
  currentNodes: NodeItem[],
  currentEdges: EdgeItem[],
  prompt: string,
  selectedIds: string[]
): DiffPreview {
  const operations: DiffOperation[] = [];
  opCounter = 0; // Reset for determinism in tests
  const lowercasePrompt = prompt.toLowerCase();

  // 1. Refactor Logic (Schema Validation & Transformation)
  if (lowercasePrompt.includes("refactor")) {
    const targetNodes = selectedIds.length > 0
      ? currentNodes.filter(n => selectedIds.includes(n.id))
      : currentNodes;

    for (const node of targetNodes) {
      const changes: Partial<NodeItem> = {};
      let hasChanges = false;

      // Upgrade generic types to schema-compliant types
      if (!node.type || !isValidNodeType(node.type)) {
        changes.type = "service";
        hasChanges = true;
      }
      if (!node.worldType || !isValidWorldType(node.worldType)) {
        changes.worldType = "epistemic";
        hasChanges = true;
      }

      // Append refactored to label
      if (!node.label?.includes("(Refactored)")) {
         changes.label = `${node.label || node.name || node.id} (Refactored)`;
         hasChanges = true;
      }

      if (hasChanges) {
        operations.push({
          id: getOpId("op-update-node"),
          type: "update",
          entityType: "node",
          entity: node,
          changes
        });
      }
    }
  }

  // 2. Generation Logic (Subsystem architecture adding)
  if (lowercasePrompt.includes("generate")) {
     const newServiceId = `gen_svc_${currentNodes.length + 1}`;
     const newDbId = `gen_db_${currentNodes.length + 1}`;

     const newNode1: NodeItem = {
      id: newServiceId,
      name: "Generated Service",
      label: "AI Gen Service",
      x: 300,
      y: 300,
      type: "service",
      worldType: "epistemic"
    };
    const newNode2: NodeItem = {
      id: newDbId,
      name: "Generated DB",
      label: "AI Gen DB",
      x: 500,
      y: 300,
      type: "database",
      worldType: "alethic"
    };
    const newEdge: EdgeItem = {
      id: `edge_${newServiceId}_${newDbId}`,
      from: newNode1.id,
      to: newNode2.id,
      label: "reads/writes"
    };

    operations.push({ id: getOpId("op-add-node"), type: "add", entityType: "node", entity: newNode1 });
    operations.push({ id: getOpId("op-add-node"), type: "add", entityType: "node", entity: newNode2 });
    operations.push({ id: getOpId("op-add-edge"), type: "add", entityType: "edge", entity: newEdge });
  }

  // 3. Optimize Logic (Prune unconnected/orphan nodes)
  if (lowercasePrompt.includes("optimize")) {
     const connectedNodeIds = new Set<string>();
     currentEdges.forEach(e => {
        connectedNodeIds.add(e.from);
        connectedNodeIds.add(e.to);
     });

     currentNodes.forEach(n => {
        if (!connectedNodeIds.has(n.id)) {
           operations.push({
             id: getOpId("op-remove-node"),
             type: "remove",
             entityType: "node",
             entity: n
           });
        }
     });
  }

  return { operations };
}
