import { describe, it, expect } from 'vitest';
import { parseKubernetesYaml, parseDockerComposeYaml, parseTerraformHcl } from './iacIngestion';

describe('IaC Ingestion Parsers', () => {
  it('should parse Kubernetes YAML into nodes', () => {
    const yaml = `
apiVersion: v1
kind: Service
metadata:
  name: my-service
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: my-db
`;
    const result = parseKubernetesYaml(yaml);
    expect(result.nodes.length).toBe(2);
    expect(result.nodes[0].type).toBe('gateway');
    expect(result.nodes[1].type).toBe('database');
  });

  it('should parse Docker Compose YAML and extract dependencies', () => {
    const yaml = `
version: '3'
services:
  web:
    image: nginx
    depends_on:
      - db
  db:
    image: postgres
`;
    const result = parseDockerComposeYaml(yaml);
    expect(result.nodes.length).toBe(2);
    expect(result.nodes.find(n => n.name === 'db')?.type).toBe('database');
    expect(result.edges.length).toBe(1);
    expect(result.edges[0].from).toBe('web');
    expect(result.edges[0].to).toBe('db');
  });

  it('should parse Terraform HCL and detect references', () => {
    const hcl = `
resource "aws_db_instance" "main" {
  name = "mydb"
}

resource "aws_instance" "web" {
  ami = "ami-123"
  db_ref = aws_db_instance.main.id
}
`;
    const result = parseTerraformHcl(hcl);
    expect(result.nodes.length).toBe(2);
    expect(result.nodes.find(n => n.id === 'aws_db_instance_main')?.type).toBe('database');
    expect(result.edges.length).toBe(1);
    expect(result.edges[0].from).toBe('aws_instance_web');
    expect(result.edges[0].to).toBe('aws_db_instance_main');
  });
});
