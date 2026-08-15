import { useState } from 'react';

export function TimelineEffectsTab() {
    const [animatedFlows, setAnimatedFlows] = useState(false);
    const [temporalReveals, setTemporalReveals] = useState(false);
    const [modalTransitions, setModalTransitions] = useState(false);

    return (
        <div className="flex flex-col gap-4 p-4 bg-[#faf5ee] border-r border-[#c2652a]/20 w-64 h-full">
            <h3 className="text-sm font-serif font-bold text-[#3a302a]">Animation Effects</h3>
            
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
    );
}
