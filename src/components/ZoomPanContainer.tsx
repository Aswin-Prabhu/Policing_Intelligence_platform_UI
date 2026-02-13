import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';

interface Props {
    children: React.ReactNode;
    className?: string;
}

export function ZoomPanContainer({ children, className = "" }: Props) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleWheel = (e: React.WheelEvent) => {
        // Only zoom if ctrl key is pressed to prevent accidental zooming during scroll
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = -e.deltaY;
            const factor = Math.pow(1.1, delta / 100);
            const newScale = Math.min(Math.max(scale * factor, 1), 5);

            if (newScale === 1) {
                setPosition({ x: 0, y: 0 });
            }
            setScale(newScale);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const resetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const zoomIn = () => setScale(prev => Math.min(prev * 1.2, 5));
    const zoomOut = () => {
        const newScale = Math.max(scale / 1.2, 1);
        setScale(newScale);
        if (newScale === 1) setPosition({ x: 0, y: 0 });
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden cursor-${scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'} ${className}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div
                className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-out select-none"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: 'center'
                }}
            >
                {children}
            </div>

            {/* Controls Overlay */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-50">
                <button
                    onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                    className="p-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg text-white hover:bg-slate-800 transition-all shadow-xl"
                    title="Zoom In"
                >
                    <ZoomIn className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                    className="p-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg text-white hover:bg-slate-800 transition-all shadow-xl"
                    title="Zoom Out"
                >
                    <ZoomOut className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); resetZoom(); }}
                    className="p-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg text-white hover:bg-slate-800 transition-all shadow-xl"
                    title="Reset Zoom"
                >
                    <Maximize2 className="w-4 h-4" />
                </button>
            </div>

            {scale > 1 && (
                <div className="absolute top-4 left-4 p-2 bg-indigo-600/90 backdrop-blur-sm rounded-lg text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 shadow-lg border border-indigo-500/50">
                    <Move className="w-3 h-3" />
                    Pan Enabled (Drag to Move)
                </div>
            )}

            <div className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-sm rounded-lg text-[9px] font-bold text-white/70 pointer-events-none border border-white/10 uppercase tracking-tighter">
                Ctrl + Scroll to Zoom
            </div>
        </div>
    );
}
