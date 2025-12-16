import { Play, Pause, SkipBack, SkipForward, Music2 } from "lucide-react";

interface SpotifyWidgetProps {
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

export function SpotifyWidget({
    currentSong,
    isPlaying,
    onTogglePlay,
    onNext,
    onPrevious,
    onOpenApp,
}: SpotifyWidgetProps) {
    return (
        <div className="bg-gradient-to-br from-green-500/20 via-green-600/10 to-emerald-500/20 backdrop-blur-2xl border border-green-500/30 rounded-3xl p-5 shadow-2xl hover:shadow-green-500/20 transition-all duration-300 group">
            {/* Header */}
            <div
                className="flex items-center gap-3 mb-4 cursor-pointer"
                onClick={onOpenApp}
            >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Music2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                    <span className="font-bold text-sm block">Now Playing</span>
                    <span className="text-xs text-muted-foreground">DevTunes</span>
                </div>
            </div>

            {/* Album Art & Info */}
            <div
                className="flex items-center gap-4 mb-5 cursor-pointer group/song"
                onClick={onOpenApp}
            >
                <div className="relative">
                    <img
                        src={currentSong.coverUrl}
                        alt={currentSong.title}
                        className="w-20 h-20 rounded-2xl object-cover shadow-xl group-hover/song:scale-105 transition-transform"
                    />
                    {isPlaying && (
                        <div className="absolute inset-0 rounded-2xl bg-black/20 flex items-center justify-center">
                            <div className="flex gap-1">
                                <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                                <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                                <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-base truncate mb-1 group-hover/song:text-green-500 transition-colors">
                        {currentSong.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                        {currentSong.artist}
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={(e) => { e.stopPropagation(); onPrevious(); }}
                    className="p-2.5 hover:bg-white/20 rounded-xl transition-all hover:scale-110 active:scale-95"
                    title="Previous"
                >
                    <SkipBack className="w-5 h-5 fill-current" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
                    className="w-12 h-12 bg-gradient-to-br from-white to-gray-100 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg hover:shadow-xl"
                    title={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <Pause className="w-5 h-5 text-black fill-black" />
                    ) : (
                        <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                    )}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="p-2.5 hover:bg-white/20 rounded-xl transition-all hover:scale-110 active:scale-95"
                    title="Next"
                >
                    <SkipForward className="w-5 h-5 fill-current" />
                </button>
            </div>
        </div>
    );
}
