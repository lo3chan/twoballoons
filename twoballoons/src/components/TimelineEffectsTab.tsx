import { useState } from 'react';
import { FloatingWindow } from './FloatingWindow';

export function TimelineEffectsTab() {
    const [animatedFlows, setAnimatedFlows] = useState(false);
    const [temporalReveals, setTemporalReveals] = useState(false);
    const [modalTransitions, setModalTransitions] = useState(false);
    

    

    return (
        <FloatingWindow
            title="Animation Effects"
            icon="movie_filter"
            initialPosition={{ x: 20, y: 120 }}
            initialWidth={260}
        >
            <div className="flex flex-col gap-4 p-4 bg-[#faf5ee] w-full h-full">
                <div className="flex items-center justify-between">
                <label className="text-xs text-[#605850]">Animated Flows</label>
                <input 
                    type="checkbox" 
                    checked={animatedFlows} 
                    onChange={e => setAnimatedFlows(e.target.checked)} 
                    className="accent-[#c2652a]"
                />
            </div>

            <div className="flex items-center justify-between">
                <label className="text-xs text-[#605850]">Temporal Reveals</label>
                <input 
                    type="checkbox" 
                    checked={temporalReveals} 
                    onChange={e => setTemporalReveals(e.target.checked)} 
                    className="accent-[#c2652a]"
                />
            </div>

            <div className="flex items-center justify-between">
                <label className="text-xs text-[#605850]">Modal Transitions</label>
                <input 
                    type="checkbox" 
                    checked={modalTransitions} 
                    onChange={e => setModalTransitions(e.target.checked)} 
                    className="accent-[#c2652a]"
                />
            </div>
            </div>
        </FloatingWindow>
    );
}
