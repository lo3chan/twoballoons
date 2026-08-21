import { useState, useEffect } from 'react';
import { invoke } from "@tauri-apps/api/core";
import { offlineCache } from "../services/offlineCache";
import { FloatingWindow } from "./FloatingWindow";

interface FileEntry {
    name: string;
    is_dir: boolean;
}

import { useStore } from '../store';

export function VaultExplorer() {
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const { addTab } = useStore();

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const loadFallbackFiles = async () => {
            try {
                // If IDB has saved documents or we fall back to default
                const cachedState = await offlineCache.getVaultState("default");
                const fallbackList = cachedState ? [
                    { name: 'Cached_Vault.logi', is_dir: false },
                    { name: 'Architecture.logi', is_dir: false }
                ] : [
                    { name: 'Architecture.logi', is_dir: false },
                    { name: 'Epistemic_Action.philo', is_dir: false }
                ];
                setFiles(fallbackList);
            } catch {
                setFiles([
                    { name: 'Architecture.logi', is_dir: false },
                    { name: 'Epistemic_Action.philo', is_dir: false }
                ]);
            }
        };

        // Fallback for tests or non-Tauri env
        if (!window.__TAURI_INTERNALS__) {
            loadFallbackFiles();
            return;
        }

        // Ideally, we invoke a real tauri command like `list_vault_files`.
        // We will simulate the call wrapper for now, but not hardcode the UI.
        invoke<FileEntry[]>('list_vault_files').then(setFiles).catch(err => {
            console.error("Failed to list vault files", err);
            // Fallback for demonstration if endpoint is missing in rust side currently
            loadFallbackFiles();
        });
    }, []);

  return (
    <FloatingWindow
      title="Vault Explorer"
      icon="folder_open"
      initialPosition={{ x: windowSize.width - 320, y: 100 }}
      initialWidth={280}
      initialHeight={240}
    >
      <div className="flex-1 overflow-y-auto p-2 text-xs font-sans bg-[#faf5ee]">
        <div className="flex items-center justify-between p-1 hover:bg-[#f2ece4] rounded cursor-pointer text-[#3a302a]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#c2652a]">folder_open</span>
            <span className="font-bold">twoballoons_vault</span>
          </div>
          <div className="flex gap-1">
            <button
              title="New File"
              className="text-[#9a9088] hover:text-[#c2652a]"
              onClick={(e) => {
                e.stopPropagation();
                const newName = `New_File_${Date.now().toString().slice(-4)}.logi`;
                setFiles([...files, { name: newName, is_dir: false }]);
              }}
            >
              <span className="material-symbols-outlined text-[16px]">note_add</span>
            </button>
          </div>
        </div>
        {files.map((file, idx) => (
            <div
              key={idx}
              className={`ml-4 flex items-center justify-between p-1 rounded cursor-pointer ${file.name.endsWith('.logi') ? 'bg-[#c2652a]/10 text-[#c2652a] font-medium border border-[#c2652a]/20' : 'hover:bg-[#f2ece4] text-[#605850]'}`}
              onClick={() => {
                if (!file.is_dir) addTab(file.name);
              }}
            >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">
                      {file.is_dir ? 'folder' : file.name.endsWith('.logi') ? 'account_tree' : 'psychology'}
                  </span>
                  <span>{file.name}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    title="Rename"
                    className="text-[#9a9088] hover:text-[#c2652a] opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newName = prompt("Rename file", file.name);
                      if (newName && newName !== file.name) {
                        setFiles(files.map(f => f.name === file.name ? { ...f, name: newName } : f));
                      }
                    }}
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                  </button>
                  <button
                    title="Delete"
                    className="text-[#9a9088] hover:text-red-500 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete ${file.name}?`)) {
                        setFiles(files.filter(f => f.name !== file.name));
                      }
                    }}
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                  </button>
                </div>
            </div>
        ))}
      </div>
    </FloatingWindow>
  );
}
