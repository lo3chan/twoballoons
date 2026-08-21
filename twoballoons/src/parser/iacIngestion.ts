import { parseAllDocuments } from 'yaml';
import { NodeItem, EdgeItem } from '../store';

interface DockerComposeService {
  image?: string;
  depends_on?: string[] | Record<string, unknown>;
  [key: string]: unknown;
}

export function parseKubernetesYaml(yamlString: string): { nodes: NodeItem[], edges: EdgeItem[] } {
  const documents = parseAllDocuments(yamlString);
  const nodes: NodeItem[] = [];
  const edges: EdgeItem[] = [];

  documents.forEach((doc, idx) => {
    const json = doc.toJSON();
    if (!json || !json.kind) return;

    const name = json.metadata?.name || `k8s-resource-${idx}`;
    const id = name.replace(/[^a-zA-Z0-9_]/g, '_');
    
    let type = 'container';
    if (json.kind === 'Service') type = 'gateway';
    if (json.kind === 'StatefulSet' || json.kind === 'PersistentVolumeClaim') type = 'database';

    nodes.push({
      id,
      name,
      label: `${json.kind}: ${name}`,
      x: 100 + (idx * 50),
      y: 100 + (idx * 50),
      type,
    });
  });

  return { nodes, edges };
}

export function parseDockerComposeYaml(yamlString: string): { nodes: NodeItem[], edges: EdgeItem[] } {
  const documents = parseAllDocuments(yamlString);
  const nodes: NodeItem[] = [];
  const edges: EdgeItem[] = [];

  if (documents.length === 0) return { nodes, edges };
  
  const json = documents[0].toJSON();
  if (!json || !json.services) return { nodes, edges };

  let idx = 0;
  const services = (json.services as Record<string, DockerComposeService>) || {};
  for (const [serviceName, serviceDef] of Object.entries(services)) {
    const id = serviceName.replace(/[^a-zA-Z0-9_]/g, '_');
    
    let type = 'container';
    if (serviceDef.image?.includes('postgres') || serviceDef.image?.includes('mysql') || serviceDef.image?.includes('redis')) {
      type = 'database';
    }

    nodes.push({
      id,
      name: serviceName,
      label: `Service: ${serviceName}`,
      x: 200 + (idx * 60),
      y: 200 + (idx * 60),
      type,
    });

    if (serviceDef.depends_on) {
      const deps = Array.isArray(serviceDef.depends_on)
        ? serviceDef.depends_on
        : Object.keys(serviceDef.depends_on);
        
      deps.forEach((dep: string) => {
        edges.push({
          id: `edge_${id}_${dep}`,
          from: id,
          to: dep.replace(/[^a-zA-Z0-9_]/g, '_'),
          type: 'rel',
          label: 'depends_on',
        });
      });
    }
    idx++;
  }

  return { nodes, edges };
}

export function parseTerraformHcl(hclString: string): { nodes: NodeItem[], edges: EdgeItem[] } {
  // A very rudimentary regex-based parser for basic Terraform HCL ingestion
  // In a real robust scenario, we'd use a WASM HCL parser, but for now we extract resources
  const nodes: NodeItem[] = [];
  const edges: EdgeItem[] = [];
  
  const resourceRegex = /resource\s+"([^"]+)"\s+"([^"]+)"\s+\{/g;
  let match;
  let idx = 0;

  while ((match = resourceRegex.exec(hclString)) !== null) {
    const resourceType = match[1];
    const resourceName = match[2];
    const id = `${resourceType}_${resourceName}`.replace(/[^a-zA-Z0-9_]/g, '_');
    
    let type = 'container';
    if (resourceType.includes('db') || resourceType.includes('bucket')) {
      type = 'database';
    } else if (resourceType.includes('gateway') || resourceType.includes('lb')) {
      type = 'gateway';
    }

    nodes.push({
      id,
      name: resourceName,
      label: `${resourceType}: ${resourceName}`,
      x: 300 + (idx * 70),
      y: 300 + (idx * 70),
      type,
    });
    idx++;
  }

  // Very basic edge detection (e.g., aws_subnet.main.id -> depends on aws_subnet.main)
  nodes.forEach(sourceNode => {
      nodes.forEach(targetNode => {
          if (sourceNode.id !== targetNode.id) {
              // Extract the resource block
              const blockRegex = new RegExp(`resource\\s+"${(sourceNode.label || "").split(': ')[0]}"\\s+"${sourceNode.name}"\\s+\\{[^}]+\\}`, 'g');
              const blockMatch = blockRegex.exec(hclString);
              
              if (blockMatch) {
                  const blockContent = blockMatch[0];
                  // If the block references the target resource's type.name
                  const targetRef = `${(targetNode.label || "").split(': ')[0]}.${targetNode.name}`;
                  if (blockContent.includes(targetRef)) {
                      edges.push({
                          id: `edge_${sourceNode.id}_${targetNode.id}`,
                          from: sourceNode.id,
                          to: targetNode.id,
                          type: 'rel',
                          label: 'references',
                      });
                  }
              }
          }
      });
  });

  return { nodes, edges };
}
