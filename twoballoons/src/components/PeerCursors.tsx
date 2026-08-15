import { useState, useEffect } from 'react';
import { provider, ydoc } from '../sync/crdtProvider';

export const PeerCursors = () => {
  const [peers, setPeers] = useState<Map<number, any>>(new Map());

  useEffect(() => {
    const handleAwareness = () => {
      const states = provider.awareness.getStates();
      const peerMap = new Map<number, any>();
      states.forEach((val: any, key: number) => {
        if (val.user && key !== ydoc.clientID) {
          peerMap.set(key, val.user);
        }
      });
      setPeers(peerMap);
    };

    provider.awareness.on('change', handleAwareness);
    return () => {
      provider.awareness.off('change', handleAwareness);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {Array.from(peers.entries()).map(([id, user]: [number, any]) => {
        if (!user || !user.cursor) return null;
        return (
          <div
            key={id}
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
              className="text-[10px] px-1.5 py-0.5 rounded text-white font-bold shadow-sm"
              style={{ backgroundColor: user.color || '#c2652a' }}
            >
              {user.name || 'Peer'}
            </span>
          </div>
        );
      })}
    </div>
  );
};
