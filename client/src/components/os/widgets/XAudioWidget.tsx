import { Play, Pause, SkipBack, SkipForward, Music, Disc } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const [duration] = useState(180); // 3 mins default
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= duration ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Audio spectrum waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      const barCount = 28;
      const barWidth = 3;
      const gap = 3;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < barCount; i++) {
        const time = animationFrameRef.current * 0.1;
        const baseHeight = Math.sin(i * 0.4 + time) * 0.3 + 0.5;
        const randomVariation = isPlaying
          ? Math.sin(i * 0.9 + time * 2) * 0.2
          : 0;
        const normalizedHeight =
          (baseHeight + randomVariation) * height * (isPlaying ? 0.9 : 0.2);
        const barHeight = Math.max(3, normalizedHeight);
        const x = i * (barWidth + gap);
        const y = height - barHeight;

        // Indigo Gradient
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, "rgba(99, 102, 241, 0.9)");
        gradient.addColorStop(1, "rgba(168, 85, 247, 0.9)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      if (isPlaying) {
        animationFrameRef.current++;
      }
    };

    draw();
    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onOpenApp}
      className="w-full rounded-3xl bg-white/90 dark:bg-zinc-950/90 text-zinc-900 dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xl p-4 backdrop-blur-xl transition-all duration-300 group cursor-pointer select-none"
    >
      <div className="flex items-center gap-3.5">
        {/* Vinyl / Cover Art */}
        <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300">
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />

          {/* Center Play Indicator */}
          {isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Disc className="w-7 h-7 text-white animate-spin [animation-duration:4s]" />
            </div>
          )}
        </div>

        {/* Track Title & Artist */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Music className="w-3 h-3 text-indigo-500" />
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Now Playing
            </span>
          </div>
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {currentSong.title}
          </h4>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            {currentSong.artist}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            className="w-8 h-8 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            <SkipBack className="w-3.5 h-3.5 fill-current" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay();
            }}
            className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="w-8 h-8 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </div>

      {/* Waveform & Progress Bar */}
      <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between gap-3">
        <canvas ref={canvasRef} width={160} height={20} className="h-5" />
        <span className="text-[10px] font-mono font-medium text-zinc-400 dark:text-zinc-500">
          {formatTime(progress)} / {formatTime(duration)}
        </span>
      </div>
    </motion.div>
  );
}
