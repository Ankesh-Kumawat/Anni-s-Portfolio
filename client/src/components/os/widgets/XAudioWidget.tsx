import { Play, Pause, SkipBack, SkipForward, Music2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface XAudioWidgetProps {
    currentSong: {
        title: string;
        artist: string;
        coverUrl: string;
    };
    isPlaying: boolean;
    onTogglePlay: () => void;
    onNext: () => void;
    onPrevious: () => void;
    onOpenApp: () => void;
}

export function XAudioWidget({
    currentSong,
    isPlaying,
    onTogglePlay,
    onNext,
    onPrevious,
    onOpenApp,
}: XAudioWidgetProps) {
    const [progress, setProgress] = useState(0);
    const [duration] = useState(180); // 3 minutes default
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef(0);

    // Simulate progress (in real app, get from audio element)
    useEffect(() => {
        if (!isPlaying) return;
        
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= duration) return 0;
                return prev + 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, duration]);

    // Draw waveform visualization
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;
            const barCount = 50;
            const barWidth = 3;
            const gap = 2;

            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < barCount; i++) {
                // Smooth sine wave pattern with moderate animation
                const time = animationFrameRef.current * 0.08;
                const baseHeight = Math.sin(i * 0.3 + time) * 0.25 + 0.6;
                const secondWave = Math.sin(i * 0.15 - time * 0.5) * 0.15;
                const randomVariation = isPlaying ? Math.sin(i * 0.8 + time * 2) * 0.12 : 0;
                
                const normalizedHeight = (baseHeight + secondWave + randomVariation) * height;
                const barHeight = Math.max(4, normalizedHeight);
                const x = i * (barWidth + gap);
                const y = (height - barHeight) / 2;

                // Progress-based coloring
                const progressRatio = i / barCount;
                const isPast = progressRatio <= (progress / duration);
                
                if (isPast) {
                    // Played portion - solid purple with glow
                    ctx.fillStyle = 'rgba(139, 92, 246, 0.95)';
                    ctx.shadowColor = 'rgba(139, 92, 246, 0.5)';
                    ctx.shadowBlur = 4;
                } else {
                    // Unplayed portion - light purple
                    ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
                    ctx.shadowBlur = 0;
                }

                // Draw rounded bar
                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
                ctx.fill();
            }

            if (isPlaying) {
                animationFrameRef.current++;
            }
        };

        draw();
        const interval = setInterval(draw, 60);

        return () => {
            clearInterval(interval);
        };
    }, [isPlaying, progress, duration]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div
            className="bg-background/95 backdrop-blur-xl border rounded-2xl p-3 shadow-2xl transition-all duration-300 group h-[180px] overflow-hidden cursor-pointer hover:shadow-xl"
            onClick={onOpenApp}
        >
            <div className="h-full flex gap-4">
                {/* Album Art */}
                <div className="relative flex-shrink-0">
                    <img
                        src={currentSong.coverUrl}
                        alt={currentSong.title}
                        className="w-[154px] h-[154px] rounded-xl object-cover shadow-lg group-hover:scale-[1.02] transition-transform"
                    />
                    {isPlaying && (
                        <div className="absolute inset-0 rounded-xl bg-black/30 flex items-center justify-center">
                            <div className="flex gap-1">
                                <div className="w-1 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                                <div className="w-1 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                                <div className="w-1 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    {/* X-Audio Badge */}
                    <div className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1.5 shadow-lg">
                        <Music2 className="w-3 h-3 text-primary-foreground" />
                        <span className="text-[9px] font-bold text-primary-foreground">X-Audio</span>
                    </div>
                </div>

                {/* Info & Controls */}
                <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                    {/* Song Info */}
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Now Playing
                        </p>
                        <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                            {currentSong.title}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                            {currentSong.artist}
                        </p>
                    </div>

                    {/* Waveform Visualization with Time */}
                    <div className="space-y-2">
                        <div className="relative h-10 flex items-center">
                            <canvas
                                ref={canvasRef}
                                width={280}
                                height={40}
                                className="w-full h-full"
                            />
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                            <span>{formatTime(progress)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Controls - Centered */}
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onPrevious(); }}
                            className="p-2 hover:bg-accent rounded-lg transition-all hover:scale-110 active:scale-95"
                            title="Previous"
                        >
                            <SkipBack className="w-4 h-4 fill-current" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
                            className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all hover:scale-110 active:scale-95 shadow-lg"
                            title={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? (
                                <Pause className="w-4 h-4 fill-current" />
                            ) : (
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onNext(); }}
                            className="p-2 hover:bg-accent rounded-lg transition-all hover:scale-110 active:scale-95"
                            title="Next"
                        >
                            <SkipForward className="w-4 h-4 fill-current" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
