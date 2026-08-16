import { useState, useEffect } from 'react';
import { awareness } from '../sync/crdtProvider';

export const PeerCursors = () => {
  const [peers, setPeers] = useState<Map<number, any>>(new Map());

  useEffect(() => {
    const handleAwareness = () => {
      const states = awareness.getStates();
      const peerMap = new Map<number, any>();
      states.forEach((val: any, key: number) => {
        // we use awareness.clientID, not ydoc.clientID to ensure it targets the correct signaling client
        if (val.user && key !== awareness.clientID) {
          // Instead of assuming just val.user, grab the cursor data as well since setLocalStateField might keep them sibling level or nested based on initAwareness
          peerMap.set(key, { ...val.user, cursor: val.cursor });
        }
      });
      setPeers(peerMap);
    };

    awareness.on('change', handleAwareness);
    return () => {
      awareness.off('change', handleAwareness);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {Array.from(peers.entries()).map(([id, user]: [number, any]) => {
        if (!user || !user.cursor) return null;
        return (
          <div key={id}>
           {/* Active Viewport Indicator (Rendered relative to user's zoom/pan if implemented, or just as a status tag here) */}
           {user.viewport && (
             <div className="absolute border border-dashed opacity-20 transition-all pointer-events-none"
               style={{
                 left: user.viewport.x, top: user.viewport.y,
                 width: 200, height: 150, // mock dimensions, ideally derived from peer's actual view
                 borderColor: user.color || '#c2652a',
                 transform: `translate(${user.cursor.x}px, ${user.cursor.y}px) translate(-50%, -50%) scale(${user.viewport.zoom || 1})`
               }}
             />
           )}
          <div
            className="absolute transition-transform duration-75 flex items-center gap-1.5"
            style={{
              transform: `translate(${user.cursor.x}px, ${user.cursor.y}px)`
            }}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ color: user.color || '#c2652a' }}
            >
              near_me
            </span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded text-white font-bold shadow-sm flex gap-1 items-center"
              style={{ backgroundColor: user.color || '#c2652a' }}
            >
              {user.name || 'Peer'} {user.viewport && `(Zoom: ${Math.round((user.viewport.zoom || 1) * 100)}%)`}
            </span>
          </div>
         </div>
        );
      })}
    </div>
  );
};
