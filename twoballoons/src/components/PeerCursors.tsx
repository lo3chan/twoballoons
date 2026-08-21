import { useState, useEffect } from 'react';
import { awareness } from '../sync/crdtProvider';

interface PeerState {
  name: string;
  color: string;
  cursor?: { x: number; y: number };
  viewport?: { x: number; y: number; zoom: number };
}

export const PeerCursors = () => {
  const [peers, setPeers] = useState<Map<number, PeerState>>(new Map());

  useEffect(() => {
    const handleAwareness = () => {
      const states = awareness.getStates();
      const peerMap = new Map<number, PeerState>();
      states.forEach((val: unknown, key: number) => {
        const stateVal = val as Record<string, unknown>;
        // we use awareness.clientID, not ydoc.clientID to ensure it targets the correct signaling client
        if (stateVal.user && key !== awareness.clientID) {
          const userObj = stateVal.user as Partial<PeerState>;
          const cursorObj = stateVal.cursor as PeerState['cursor'];
          const viewportObj = stateVal.viewport as PeerState['viewport'];

          peerMap.set(key, {
            name: userObj.name || 'Anonymous',
            color: userObj.color || '#c2652a',
            cursor: cursorObj,
            viewport: viewportObj
          });
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
      {Array.from(peers.entries()).map(([id, user]: [number, PeerState]) => {
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
