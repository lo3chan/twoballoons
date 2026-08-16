import React, { useState, useRef } from 'react';

interface FloatingWindowProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  onClose?: () => void;
  initialPosition?: { x: number; y: number };
  initialWidth?: number;
  initialHeight?: number;
  className?: string;
}

// Global z-index counter to bring focused window to front
let globalZIndex = 50;

export const FloatingWindow: React.FC<FloatingWindowProps> = ({
  title,
  icon,
  children,
  onClose,
  initialPosition = { x: 100, y: 100 },
  initialWidth,
  initialHeight,
  className = ''
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [zIndex, setZIndex] = useState(globalZIndex);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const focusWindow = () => {
    globalZIndex += 1;
    setZIndex(globalZIndex);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag on left click
    if (e.button !== 0) return;

    // Check if clicking close or collapse buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    setIsDragging(true);
    focusWindow();

    // Use pointer capture to allow dragging outside the window
    if (windowRef.current) {
        windowRef.current.setPointerCapture(e.pointerId);
    }

    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (windowRef.current && windowRef.current.hasPointerCapture(e.pointerId)) {
        windowRef.current.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      ref={windowRef}
      onPointerDown={focusWindow}
      className={`absolute flex flex-col hud-glass shadow-xl rounded-lg overflow-hidden border border-[#d8d0c8] ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: initialWidth ? `${initialWidth}px` : 'auto',
        height: isCollapsed ? 'auto' : (initialHeight ? `${initialHeight}px` : 'auto'),
        zIndex: zIndex,
        pointerEvents: 'auto'
      }}
    >
      {/* Header / Drag Handle */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="h-8 flex items-center justify-between px-3 bg-[#f6f0e8] border-b border-[#d8d0c8] select-none cursor-move"
      >
        <div className="flex items-center gap-2 text-[#605850]">
          {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
          <span className="text-[10px] font-bold uppercase tracking-wider">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setIsCollapsed(!isCollapsed); }}
            className="text-[#9a9088] hover:text-[#c2652a] flex items-center justify-center p-0.5"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <span className="material-symbols-outlined text-[14px]">
              {isCollapsed ? 'expand_more' : 'expand_less'}
            </span>
          </button>
          {onClose && (
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="text-[#9a9088] hover:text-[#c2652a] flex items-center justify-center p-0.5"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      {!isCollapsed && (
        <div className="flex-1 overflow-hidden flex flex-col relative">
          {children}
        </div>
      )}
    </div>
  );
};
