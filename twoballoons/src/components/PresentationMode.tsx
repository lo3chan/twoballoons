import { useStore } from "../store";

export function PresentationMode() {
  const { 
    isPresenting, 
    setIsPresenting, 
    presentationKeyframes,
    setPresentationKeyframes,
    activeKeyframeIndex,
    setActiveKeyframeIndex
  } = useStore();

  if (!isPresenting) return null;

  const handleNext = () => {
    if (activeKeyframeIndex < presentationKeyframes.length - 1) {
      setActiveKeyframeIndex(activeKeyframeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeKeyframeIndex > 0) {
      setActiveKeyframeIndex(activeKeyframeIndex - 1);
    }
  };

  const handleAddKeyframe = () => {
    // In a real scenario, this would capture current canvas camera coords
    const newKeyframe = {
      id: `kf_${Date.now()}`,
      x: 0, 
      y: 0, 
      zoom: 1, 
      title: `Slide ${presentationKeyframes.length + 1}`
    };
    setPresentationKeyframes([...presentationKeyframes, newKeyframe]);
  };

  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-auto">
      <div className="hud-glass rounded-lg flex items-center justify-between w-[400px] px-4 py-2 shadow-lg border border-[#c2652a]/30">
        <div className="text-[#c2652a] font-bold">
          {presentationKeyframes.length > 0 ? (
            <span>Slide {activeKeyframeIndex + 1} / {presentationKeyframes.length}</span>
          ) : (
            <span>Cinematic Presentation</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handlePrev}
            disabled={activeKeyframeIndex === 0}
            className="p-1 text-[#3a302a] hover:text-[#c2652a] disabled:opacity-50"
            title="Previous Slide"
          >
            <span className="material-symbols-outlined">skip_previous</span>
          </button>
          
          <button 
            onClick={handleNext}
            disabled={activeKeyframeIndex === presentationKeyframes.length - 1}
            className="p-1 text-[#3a302a] hover:text-[#c2652a] disabled:opacity-50"
            title="Next Slide"
          >
            <span className="material-symbols-outlined">skip_next</span>
          </button>
          
          <button 
            onClick={handleAddKeyframe}
            className="p-1 text-[#3a302a] hover:text-[#c2652a]"
            title="Add Keyframe"
          >
            <span className="material-symbols-outlined">add_a_photo</span>
          </button>

          <button 
            onClick={() => setIsPresenting(false)}
            className="p-1 text-red-500 hover:text-red-700 ml-2"
            title="Exit Presentation"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
      
      {presentationKeyframes.length === 0 && (
        <div className="bg-[#faf5ee]/90 text-xs text-[#605850] p-2 rounded text-center border border-[#d8d0c8]">
          Add a keyframe to start creating your storyboard. Use the mouse to point with the laser pointer.
        </div>
      )}
    </div>
  );
}
