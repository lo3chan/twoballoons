
export class ASTExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ASTExportError";
  }
}

export class IaCImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IaCImportError";
  }
}
