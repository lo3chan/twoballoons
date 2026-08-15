import { Snapshot } from '../history/zfsVersioning';

interface TimelineHUDProps {
    snapshots?: Snapshot[];
    onScrub?: (snapshotId: string) => void;
}

export function TimelineHUD({ snapshots = [], onScrub }: TimelineHUDProps) {
    return (
        <div className="hud-glass absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg px-4 py-2 flex items-center gap-4 shadow-sm pointer-events-auto bg-[#faf5ee]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3a302a]">Timeline Engine</span>
            <div className="flex-1 w-64 h-2 bg-[#d8d0c8] rounded-full relative">
                {snapshots.map((snap, i) => (
                    <div
                        key={snap.id}
                        className="absolute h-4 w-4 rounded-full bg-[#c2652a] top-1/2 -translate-y-1/2 cursor-pointer border-2 border-[#faf5ee] shadow-sm hover:scale-125 transition-transform"
                        style={{ left: `${(i / Math.max(1, snapshots.length - 1)) * 100}%` }}
                        onClick={() => onScrub && onScrub(snap.id)}
                        title={snap.milestone}
                    />
                ))}
            </div>
        </div>
    );
}
