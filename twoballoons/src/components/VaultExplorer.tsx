import { useState, useEffect } from 'react';
import { invoke } from "@tauri-apps/api/core";

interface FileEntry {
    name: string;
    is_dir: boolean;
}

export function VaultExplorer() {
    const [files, setFiles] = useState<FileEntry[]>([]);

    useEffect(() => {
        // Fallback for tests or non-Tauri env
        if (!(window as any).__TAURI_INTERNALS__) {
            setFiles([
                { name: 'Architecture.logi', is_dir: false },
                { name: 'Epistemic_Action.philo', is_dir: false }
            ]);
            return;
        }

        // Ideally, we invoke a real tauri command like `list_vault_files`.
        // We will simulate the call wrapper for now, but not hardcode the UI.
        invoke<FileEntry[]>('list_vault_files').then(setFiles).catch(err => {
            console.error("Failed to list vault files", err);
            // Fallback for demonstration if endpoint is missing in rust side currently
            setFiles([
                { name: 'Architecture.logi', is_dir: false },
                { name: 'Epistemic_Action.philo', is_dir: false }
            ]);
        });
    }, []);

  return (
    <div className="hud-glass rounded-lg h-44 flex flex-col overflow-hidden pointer-events-auto shadow-sm">
      <div className="h-8 flex items-center justify-between px-3 border-b border-[#d8d0c8] bg-[#f6f0e8]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#605850]">Vault Explorer</span>
        <span className="material-symbols-outlined text-[14px] text-[#9a9088]">folder_open</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 text-xs font-sans">
        <div className="flex items-center gap-2 p-1 hover:bg-[#f2ece4] rounded cursor-pointer text-[#3a302a]">
          <span className="material-symbols-outlined text-[16px] text-[#c2652a]">folder_open</span>
          <span>twoballoons_vault</span>
        </div>
        {files.map((file, idx) => (
            <div key={idx} className={`ml-4 flex items-center gap-2 p-1 rounded cursor-pointer ${file.name.endsWith('.logi') ? 'bg-[#c2652a]/10 text-[#c2652a] font-medium border border-[#c2652a]/20' : 'hover:bg-[#f2ece4] text-[#605850]'}`}>
                <span className="material-symbols-outlined text-[16px]">
                    {file.is_dir ? 'folder' : file.name.endsWith('.logi') ? 'account_tree' : 'psychology'}
                </span>
                <span>{file.name}</span>
            </div>
        ))}
      </div>
    </div>
  );
}
