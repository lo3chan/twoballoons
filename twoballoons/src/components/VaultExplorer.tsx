export function VaultExplorer() {
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
        <div className="ml-4 flex items-center gap-2 p-1 bg-[#c2652a]/10 text-[#c2652a] font-medium rounded cursor-pointer border border-[#c2652a]/20">
          <span className="material-symbols-outlined text-[16px]">account_tree</span>
          <span>Architecture.logi</span>
        </div>
        <div className="ml-4 flex items-center gap-2 p-1 hover:bg-[#f2ece4] rounded cursor-pointer text-[#605850]">
          <span className="material-symbols-outlined text-[16px]">psychology</span>
          <span>Epistemic_Action.philo</span>
        </div>
      </div>
    </div>
  );
}
