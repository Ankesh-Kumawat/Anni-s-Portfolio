import { ChevronDown, SkipBack, SkipForward, Play, Pause } from "lucide-react";
import { Song } from "../types";
import { formatDuration } from "../data";
import { Slider } from "@/components/ui/slider";

interface MobilePlayerProps {
    currentSong: Song;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    onTogglePlay: () => void;
    onNext: () => void;
    onPrevious: () => void;
    onSeek: (time: number) => void;
    onClose: () => void;
}

export function MobilePlayer({
    currentSong,
    isPlaying,
    currentTime,
    duration,
    onTogglePlay,
    onNext,
    onPrevious,
    onSeek,
    onClose,
}: MobilePlayerProps) {
    const handleSeekChange = (value: number[]) => {
        onSeek(value[0]);
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-black z-50 flex flex-col text-white p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={onClose} className="p-2 -ml-2">
                    <ChevronDown className="w-6 h-6" />
                </button>
                <span className="text-sm font-medium">Now Playing</span>
                <div className="w-6" />
            </div>

            {/* Album Art */}
            <div className="flex-1 flex items-center justify-center mb-8">
                <div className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-2xl">
                    <img
                        src={currentSong.coverUrl}
                        alt={currentSong.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Song Info */}
            <div className="mb-8">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold truncate mb-1">{currentSong.title}</h1>
                    <p className="text-white/70 truncate">{currentSong.artist}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
                <Slider
                    value={[currentTime]}
                    onValueChange={handleSeekChange}
                    max={duration || 100}
                    step={0.1}
                    className="w-full [&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&_.bg-primary]:bg-white"
                />
                <div className="flex justify-between text-xs text-white/70 mt-2">
                    <span>{formatDuration(currentTime)}</span>
                    <span>{formatDuration(duration)}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-8 mb-8">
                <button onClick={onPrevious} className="p-2">
                    <SkipBack className="w-8 h-8 fill-white" />
                </button>
                <button
                    onClick={onTogglePlay}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl"
                >
                    {isPlaying ? (
                        <Pause className="w-7 h-7 text-black fill-black" />
                    ) : (
                        <Play className="w-7 h-7 text-black fill-black ml-1" />
                    )}
                </button>
                <button onClick={onNext} className="p-2">
                    <SkipForward className="w-8 h-8 fill-white" />
                </button>
            </div>
        </div>
    );
}
