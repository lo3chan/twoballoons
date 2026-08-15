# twoballoons Pass 14 Specification: Visual Git Merge Conflict Engine, Obsidian Vault Bridge & IaC Auto-Import

## 1. Overview
Pass 14 integrates twoballoons into enterprise engineering workflows with visual 3-way git merge conflict resolution, bi-directional Obsidian vault sync, and Terraform/CloudFormation auto-ingestion.

---

## 2. Core Capabilities
1. **Visual Git Merge Conflict Engine**: Side-by-side visual graph diffing with 3-way interactive conflict resolution for `.balloon` files.
2. **Obsidian Vault Bridge**: Live bi-directional sync with Markdown notes, parsing `[[wikilinks]]` and tags.
3. **Infrastructure-as-Code Ingestion**: One-click import from Terraform HCL, AWS CloudFormation, and Kubernetes manifests into live C4 architecture graphs.

---

## 3. Deliverables
- `src/vcs/visualGitMerge.ts`
- `src/importers/iacImporter.ts`
- `src/bridge/obsidianSync.ts`
