import { useEffect } from 'react';
import { useStore } from '../store';

export function PresentationMode() {
  const {
    isPresenting,
    setIsPresenting,
    presentationKeyframes,
    setPresentationKeyframes,
    activeKeyframeIndex,
    setActiveKeyframeIndex,
    cameraPos,
    zoom
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPresenting) return;
      if (e.key === 'Escape') {
        setIsPresenting(false);
      } else if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        if (activeKeyframeIndex < presentationKeyframes.length - 1) {
          setActiveKeyframeIndex(activeKeyframeIndex + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (activeKeyframeIndex > 0) {
          setActiveKeyframeIndex(activeKeyframeIndex - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresenting, activeKeyframeIndex, presentationKeyframes.length, setIsPresenting, setActiveKeyframeIndex]);

  if (!isPresenting) return null;

  const currentKf = presentationKeyframes[activeKeyframeIndex];

  const handleAddCurrentView = () => {
    const newKf = {
      id: 'slide_' + Date.now(),
      x: cameraPos.x,
      y: cameraPos.y,
      zoom: zoom || 1,
      title: 'Slide ' + (presentationKeyframes.length + 1)
    };
    setPresentationKeyframes([...presentationKeyframes, newKf]);
    setActiveKeyframeIndex(presentationKeyframes.length);
  };

  const handleDeleteCurrent = () => {
    if (presentationKeyframes.length === 0) return;
    const updated = presentationKeyframes.filter((_, i) => i !== activeKeyframeIndex);
    setPresentationKeyframes(updated);
    setActiveKeyframeIndex(Math.max(0, activeKeyframeIndex - 1));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-6">
      {/* Top Bar HUD */}
      <div className="flex items-center justify-between pointer-events-auto bg-[#faf5ee]/95 backdrop-blur border border-[#d8d0c8] px-4 py-2 rounded-lg shadow-md max-w-xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#c2652a] text-xl">slideshow</span>
          <span className="font-serif text-sm font-semibold text-[#3a302a]">
            {currentKf ? currentKf.title : 'Overview Mode'}
          </span>
          <span className="text-xs text-[#9a9088] font-mono">
            {presentationKeyframes.length > 0 ? `${activeKeyframeIndex + 1} / ${presentationKeyframes.length}` : 'No Slides'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddCurrentView}
            title="Add Keyframe"
            className="px-2.5 py-1 text-xs bg-[#c2652a]/10 text-[#c2652a] hover:bg-[#c2652a]/20 font-medium rounded border border-[#c2652a]/30 flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add_a_photo</span>
            Capture Slide
          </button>

          {presentationKeyframes.length > 0 && (
            <button
              onClick={handleDeleteCurrent}
              title="Delete current slide"
              className="p-1 text-xs text-[#8c3c3c] hover:bg-[#8c3c3c]/10 rounded transition-colors"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          )}

          <button
            onClick={() => setIsPresenting(false)}
            className="px-2.5 py-1 text-xs bg-[#3a302a] text-[#faf5ee] hover:bg-[#251e1a] rounded font-medium transition-colors"
          >
            Exit (Esc)
          </button>
        </div>
      </div>

      {/* Bottom Navigation HUD */}
      <div className="flex items-center justify-center gap-4 pointer-events-auto bg-[#faf5ee]/95 backdrop-blur border border-[#d8d0c8] px-6 py-2.5 rounded-full shadow-lg mx-auto">
        <button
          onClick={() => setActiveKeyframeIndex(Math.max(0, activeKeyframeIndex - 1))}
          disabled={activeKeyframeIndex <= 0}
          className="p-2 rounded-full hover:bg-[#f2ece4] disabled:opacity-30 disabled:hover:bg-transparent text-[#3a302a] transition-colors"
        >
          <span className="material-symbols-outlined text-lg" title="Previous Slide">chevron_left</span>
        </button>

        <div className="flex items-center gap-1.5">
          {presentationKeyframes.map((kf, index) => (
            <button
              key={kf.id}
              onClick={() => setActiveKeyframeIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeKeyframeIndex
                  ? 'bg-[#c2652a] scale-125'
                  : 'bg-[#d8d0c8] hover:bg-[#9a9088]'
              }`}
              title={kf.title}
            />
          ))}
        </div>

        <button
          onClick={() => setActiveKeyframeIndex(Math.min(presentationKeyframes.length - 1, activeKeyframeIndex + 1))}
          disabled={activeKeyframeIndex >= presentationKeyframes.length - 1}
          className="p-2 rounded-full hover:bg-[#f2ece4] disabled:opacity-30 disabled:hover:bg-transparent text-[#3a302a] transition-colors"
        >
          <span className="material-symbols-outlined text-lg" title="Next Slide">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
