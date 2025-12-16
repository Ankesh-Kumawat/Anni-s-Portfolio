import { useState, useRef } from "react";
import { ChevronUp, Lock } from "lucide-react";
import { format } from "date-fns";

interface LockScreenProps {
    onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
    const [time, setTime] = useState(new Date());
    const [isDragging, setIsDragging] = useState(false);
    const [dragY, setDragY] = useState(0);
    const startY = useRef(0);

    useState(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    });

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        startY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const currentY = e.touches[0].clientY;
        const diff = startY.current - currentY;
        if (diff > 0) {
            setDragY(Math.min(diff, 200));
        }
    };

    const handleTouchEnd = () => {
        if (dragY > 100) {
            onUnlock();
        } else {
            setDragY(0);
        }
        setIsDragging(false);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        startY.current = e.clientY;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const diff = startY.current - e.clientY;
        if (diff > 0) {
            setDragY(Math.min(diff, 200));
        }
    };

    const handleMouseUp = () => {
        if (dragY > 100) {
            onUnlock();
        } else {
            setDragY(0);
        }
        setIsDragging(false);
    };

    return (
        <div
            className="fixed inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex flex-col items-center justify-center z-50"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Time Display */}
            <div className="text-center mb-12" style={{ transform: `translateY(-${dragY * 0.3}px)`, opacity: 1 - dragY / 200 }}>
                <h1 className="text-8xl font-light text-white mb-2">
                    {format(time, 'HH:mm')}
                </h1>
                <p className="text-xl text-zinc-400">
                    {format(time, 'EEEE, MMMM d')}
                </p>
            </div>

            {/* Lock Icon */}
            <div className="mb-8" style={{ transform: `translateY(-${dragY * 0.5}px)`, opacity: 1 - dragY / 200 }}>
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Lock className="w-8 h-8 text-white" />
                </div>
            </div>

            {/* Swipe Indicator */}
            <div
                className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                style={{
                    transform: `translate(-50%, -${dragY}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                }}
            >
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center animate-bounce">
                        <ChevronUp className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-zinc-400">Swipe up to unlock</p>
                </div>
            </div>

            {/* Drag Progress */}
            {dragY > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                        style={{ width: `${(dragY / 200) * 100}%` }}
                    />
                </div>
            )}
        </div>
    );
}
