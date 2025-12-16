import { SkipBack, SkipForward, Play, Pause, Volume2 } from "lucide-react";
import { Song } from "../types";
import { formatDuration } from "../data";
import { Slider } from "@/components/ui/slider";

interface PlayerBarProps {
    currentSong: Song | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    onTogglePlay: () => void;
    onNext: () => void;
    onPrevious: () => void;
    onSeek: (time: number) => void;
    onVolumeChange: (volume: number) => void;
    onMobilePlayerOpen?: () => void;
}

export function PlayerBar({
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    onTogglePlay,
    onNext,
    onPrevious,
    onSeek,
    onVolumeChange,
    onMobilePlayerOpen,
}: PlayerBarProps) {
    // Handle seek slider change
    const handleSeekChange = (value: number[]) => {
        onSeek(value[0]);
    };

    // Handle volume slider change
    const handleVolumeChange = (value: number[]) => {
        onVolumeChange(value[0] / 100);
    };

    if (!currentSong) {
        return (
            <div className="h-20 md:h-24 bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-center z-20">
                <p className="text-white/50 text-sm">No song selected</p>
            </div>
        );
    }

    return (
        <div className="h-20 md:h-24 bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-between z-20">
            {/* Current Song Info - Click to open fullscreen on mobile */}
            <div
                className="flex items-center gap-4 w-full md:w-[30%] cursor-pointer md:cursor-default"
                onClick={() => onMobilePlayerOpen?.()}
            >
                <img src={currentSong.coverUrl} className="rounded w-10 h-10 md:w-14 md:h-14 object-cover" alt={currentSong.title} />
                <div className="flex-1 md:flex-none min-w-0">
                    <p className="text-sm font-medium truncate">{currentSong.title}</p>
                    <p className="text-xs text-white/70 truncate">{currentSong.artist}</p>
                </div>
                <div className="md:hidden ml-auto" onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}>
                    {isPlaying ? (
                        <Pause className="w-8 h-8 fill-white" />
                    ) : (
                        <Play className="w-8 h-8 fill-white" />
                    )}
                </div>
            </div>

            {/* Player Controls */}
            <div className="hidden md:flex flex-col items-center gap-2 max-w-[40%] w-full">
                <div className="flex items-center gap-6">
                    <SkipBack
                        className="w-5 h-5 text-white/70 hover:text-white cursor-pointer fill-current transition-colors"
                        onClick={onPrevious}
                    />
                    <div
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                        onClick={onTogglePlay}
                    >
                        {isPlaying ? (
                            <Pause className="w-4 h-4 text-black fill-current" />
                        ) : (
                            <Play className="w-4 h-4 text-black fill-current ml-0.5" />
                        )}
                    </div>
                    <SkipForward
                        className="w-5 h-5 text-white/70 hover:text-white cursor-pointer fill-current transition-colors"
                        onClick={onNext}
                    />
                </div>

                {/* Progress Bar - Slider */}
                <div className="flex items-center gap-2 w-full text-xs text-white/70 font-mono">
                    <span>{formatDuration(currentTime)}</span>
                    <Slider
                        value={[currentTime]}
                        onValueChange={handleSeekChange}
                        max={duration || 100}
                        step={0.1}
                        className="flex-1 [&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&_.bg-primary]:bg-white hover:[&_.bg-primary]:bg-green-500"
                    />
                    <span>{formatDuration(duration)}</span>
                </div>
            </div>

            {/* Volume Control - Slider */}
            <div className="hidden md:flex items-center justify-end gap-3 w-[30%]">
                <div className="flex items-center gap-2 w-28">
                    <Volume2 className="w-4 h-4 text-white/70" />
                    <Slider
                        value={[volume * 100]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="flex-1 [&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&_.bg-primary]:bg-white hover:[&_.bg-primary]:bg-green-500"
                    />
                </div>
            </div>
        </div>
    );
}
