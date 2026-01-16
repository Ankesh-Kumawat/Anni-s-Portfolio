import { Play, Pause, SkipBack, SkipForward, Music2 } from "lucide-react";

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
    return (
        <div
            className="bg-background/95 backdrop-blur-xl border rounded-2xl p-3 shadow-2xl transition-all duration-300 group h-[140px] overflow-hidden cursor-pointer hover:shadow-xl"
            onClick={onOpenApp}
        >
            <div className="h-full flex gap-3">
                {/* Album Art */}
                <div className="relative flex-shrink-0">
                    <img
                        src={currentSong.coverUrl}
                        alt={currentSong.title}
                        className="w-[114px] h-[114px] rounded-xl object-cover shadow-lg group-hover:scale-[1.02] transition-transform"
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
                <div className="flex-1 flex flex-col justify-between min-w-0">
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

                    {/* Controls */}
                    <div className="flex items-center gap-2">
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
