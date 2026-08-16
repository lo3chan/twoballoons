// Check if we're running in Tauri
const isTauri = () => {
  return typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__ !== undefined;
};

export class LocalFileSystem {

  /**
   * Opens a directory picker and returns a FileSystemDirectoryHandle (Web)
   * or a path string (Tauri - not fully implemented without plugins, using fallback)
   */
  async openDirectory(): Promise<any> {
    if (isTauri()) {
       console.warn("Tauri directory picker requires @tauri-apps/plugin-dialog. Using Web API fallback if available, or this may fail.");
       // Ideally we would invoke a rust command here: await invoke('open_folder')
    }

    if ('showDirectoryPicker' in window) {
      try {
        const handle = await (window as any).showDirectoryPicker();
        return handle;
      } catch (err) {
        console.error("User cancelled or error opening directory:", err);
        return null;
      }
    } else {
      console.warn("File System Access API not supported in this environment.");
      return null;
    }
  }

  /**
   * Saves the workspace bundle to a local file.
   */
  async saveWorkspace(content: string, suggestedName = 'workspace.balloon'): Promise<boolean> {
    if (isTauri()) {
       console.warn("Tauri save file requires @tauri-apps/plugin-dialog.");
    }

    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName,
          types: [{
            description: 'BalloonDSL Bundle',
            accept: { 'text/plain': ['.balloon'] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        return true;
      } catch (err) {
        console.error("User cancelled or error saving file:", err);
        return false;
      }
    } else {
      // Fallback for older browsers
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = suggestedName;
      a.click();
      URL.revokeObjectURL(url);
      return true;
    }
  }

  /**
   * Exports the current canvas as a .balloon bundle.
   */
  async exportBundle(content: string): Promise<boolean> {
    return this.saveWorkspace(content, `export-${Date.now()}.balloon`);
  }

  /**
   * Opens a file picker for IaC ingestion.
   */
  async importIaC(): Promise<string | null> {
    if ('showOpenFilePicker' in window) {
      try {
        const [handle] = await (window as any).showOpenFilePicker({
          types: [
            {
              description: 'Infrastructure as Code (Terraform/K8s)',
              accept: { 'text/plain': ['.tf', '.yaml', '.yml', '.json'] },
            },
          ],
        });
        const file = await handle.getFile();
        const text = await file.text();
        return text;
      } catch (err) {
        console.error("User cancelled or error opening file:", err);
        return null;
      }
    } else {
      // Fallback using input type=file programmatically
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.tf,.yaml,.yml,.json';
        input.onchange = (e: any) => {
          const file = e.target.files?.[0];
          if (!file) {
             resolve(null);
             return;
          }
          const reader = new FileReader();
          reader.onload = (re) => {
            resolve(re.target?.result as string);
          };
          reader.onerror = () => resolve(null);
          reader.readAsText(file);
        };
        input.click();
      });
    }
  }
}

export const localFileSystem = new LocalFileSystem();
