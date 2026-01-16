import { useState, useRef, useEffect } from "react";
import { songs, initializeSongs } from "./data";
import { Song } from "./types";
import { useVolume } from "@/lib/volume-context";
import { useSpotify } from "@/lib/spotify-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { Play, Pause, SkipBack, SkipForward, Volume2, Loader2, Music2, ListMusic, ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function XAudio() {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const spotifyContext = useSpotify();
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const { volume, setVolume: setGlobalVolume } = useVolume();
    const audioRef = useRef<HTMLAudioElement>(null);
    const isMobile = useIsMobile();
    const [songsLoaded, setSongsLoaded] = useState(false);
    const [showMobilePlayer, setShowMobilePlayer] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState({ loaded: 0, total: 0 });

    useEffect(() => {
        const loadSongs = async () => {
            await initializeSongs((loadedSongs, loadedCount, totalCount) => {
                // Update loading progress
                setLoadingProgress({ loaded: loadedCount, total: totalCount });

                // Show app as soon as first song loads
                if (loadedSongs.length > 0) {
                    setSongsLoaded(true);
                    if (!currentSong) {
                        setCurrentSong(loadedSongs[0]);
                    }
                }
            });
        };
        loadSongs();
    }, []);

    const togglePlay = () => {
        if (!audioRef.current || !currentSong) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const playSong = (song: Song) => {
        setCurrentSong(song);
        setIsPlaying(true);
        setCurrentTime(0);
        if (isMobile) {
            setShowMobilePlayer(true);
        }
    };

    const nextSong = () => {
        if (!currentSong) return;
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % songs.length;
        playSong(songs[nextIndex]);
    };

    const previousSong = () => {
        if (!currentSong) return;
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
        playSong(songs[prevIndex]);
    };

    const seek = (value: number[]) => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = value[0];
        setCurrentTime(value[0]);
    };

    const changeVolume = (value: number[]) => {
        if (!audioRef.current) return;
        audioRef.current.volume = value[0];
        setGlobalVolume(value[0]);
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleDurationChange = () => setDuration(audio.duration);
        const handleEnded = () => {
            setIsPlaying(false);
            nextSong();
        };
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, [currentSong]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;
        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    console.log("Playback prevented:", err);
                    setIsPlaying(false);
                });
            }
        }
    }, [currentSong, isPlaying]);

    useEffect(() => {
        if (currentSong) {
            spotifyContext.setCurrentSong({
                title: currentSong.title,
                artist: currentSong.artist,
                coverUrl: currentSong.coverUrl,
            });
        } else {
            spotifyContext.setCurrentSong(null);
        }
    }, [currentSong]);

    useEffect(() => {
        spotifyContext.setIsPlaying(isPlaying);
    }, [isPlaying]);

    // Register callbacks
    useEffect(() => {
        if ((spotifyContext as any)._togglePlayCallbackRef) {
            (spotifyContext as any)._togglePlayCallbackRef.current = togglePlay;
        }
        if ((spotifyContext as any)._nextSongCallbackRef) {
            (spotifyContext as any)._nextSongCallbackRef.current = nextSong;
        }
        if ((spotifyContext as any)._previousSongCallbackRef) {
            (spotifyContext as any)._previousSongCallbackRef.current = previousSong;
        }
    }, [togglePlay, nextSong, previousSong]);

    // Cleanup on unmount only
    useEffect(() => {
        return () => {
            // Clear widget when component unmounts (app closes)
            spotifyContext.setCurrentSong(null);
            spotifyContext.setIsPlaying(false);
            if ((spotifyContext as any)._togglePlayCallbackRef) {
                (spotifyContext as any)._togglePlayCallbackRef.current = null;
            }
            if ((spotifyContext as any)._nextSongCallbackRef) {
                (spotifyContext as any)._nextSongCallbackRef.current = null;
            }
            if ((spotifyContext as any)._previousSongCallbackRef) {
                (spotifyContext as any)._previousSongCallbackRef.current = null;
            }
        };
    }, []); // Empty deps = runs only on mount/unmount

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!songsLoaded) {
        return (
            <div className="flex flex-col h-full bg-background items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Loading music library...</p>
                    {loadingProgress.total > 0 && (
                        <p className="text-xs text-muted-foreground/70 mt-1">
                            {loadingProgress.loaded} / {loadingProgress.total} songs
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Mobile Fullscreen Player
    if (isMobile && showMobilePlayer && currentSong) {
        return (
            <div className="flex flex-col h-full bg-background">
                <audio ref={audioRef} src={currentSong?.audioUrl} preload="metadata" />

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <button
                        onClick={() => setShowMobilePlayer(false)}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                        <ChevronDown className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium">Now Playing</span>
                    <div className="w-9" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
                    <img
                        src={currentSong.coverUrl}
                        alt={currentSong.title}
                        className="w-64 h-64 rounded-lg shadow-lg object-cover"
                    />

                    <div className="text-center space-y-1 w-full">
                        <h2 className="text-2xl font-bold truncate">{currentSong.title}</h2>
                        <p className="text-muted-foreground truncate">{currentSong.artist}</p>
                    </div>

                    <div className="w-full space-y-2">
                        <Slider
                            value={[currentTime]}
                            max={duration || 100}
                            step={0.1}
                            onValueChange={seek}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={previousSong}
                            className="p-3 hover:bg-accent rounded-full transition-colors"
                        >
                            <SkipBack className="w-6 h-6" />
                        </button>
                        <button
                            onClick={togglePlay}
                            className="p-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                        >
                            {isPlaying ? (
                                <Pause className="w-7 h-7" />
                            ) : (
                                <Play className="w-7 h-7 ml-0.5" />
                            )}
                        </button>
                        <button
                            onClick={nextSong}
                            className="p-3 hover:bg-accent rounded-full transition-colors"
                        >
                            <SkipForward className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full max-w-xs">
                        <Volume2 className="w-4 h-4 text-muted-foreground" />
                        <Slider
                            value={[volume]}
                            max={1}
                            step={0.01}
                            onValueChange={changeVolume}
                            className="flex-1"
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Mobile List View
    if (isMobile) {
        return (
            <div className="h-full flex flex-col bg-background">
                <audio ref={audioRef} src={currentSong?.audioUrl} preload="metadata" />

                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b">
                    <Music2 className="w-5 h-5 text-primary" />
                    <h1 className="text-base font-semibold">X-Audio</h1>
                </div>

                {/* Song List */}
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-3">
                        {songs.map((song) => (
                            <button
                                key={song.id}
                                onClick={() => playSong(song)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                                    currentSong?.id === song.id
                                        ? "bg-primary/10 border-2 border-primary"
                                        : "bg-muted/50 hover:bg-muted"
                                )}
                            >
                                <img
                                    src={song.coverUrl}
                                    alt={song.title}
                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow-md"
                                />
                                <div className="flex-1 text-left min-w-0 pr-2">
                                    <p className="text-sm font-semibold truncate">
                                        {song.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {song.artist}
                                    </p>
                                </div>
                                {currentSong?.id === song.id && isPlaying && (
                                    <div className="flex gap-0.5 items-end h-4 flex-shrink-0">
                                        <div className="w-0.5 bg-primary rounded-full animate-pulse h-2" style={{ animationDelay: '0ms' }} />
                                        <div className="w-0.5 bg-primary rounded-full animate-pulse h-3" style={{ animationDelay: '150ms' }} />
                                        <div className="w-0.5 bg-primary rounded-full animate-pulse h-4" style={{ animationDelay: '300ms' }} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </ScrollArea>

                {/* Bottom Player Bar */}
                {currentSong && (
                    <div className="border-t bg-background/95 backdrop-blur-xl">
                        {/* Progress Bar */}
                        <div className="px-6 pt-3">
                            <Slider
                                value={[currentTime]}
                                max={duration || 100}
                                step={0.1}
                                onValueChange={seek}
                                className="mb-1"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground mb-3">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between px-6 pb-5">
                            <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                                <img
                                    src={currentSong.coverUrl}
                                    alt={currentSong.title}
                                    className="w-11 h-11 rounded-lg object-cover shadow-md flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">
                                        {currentSong.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {currentSong.artist}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 flex-shrink-0">
                                <button
                                    onClick={previousSong}
                                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                                >
                                    <SkipBack className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={togglePlay}
                                    className="p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-lg"
                                >
                                    {isPlaying ? (
                                        <Pause className="w-5 h-5" />
                                    ) : (
                                        <Play className="w-5 h-5 ml-0.5" />
                                    )}
                                </button>
                                <button
                                    onClick={nextSong}
                                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                                >
                                    <SkipForward className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Desktop Layout
    return (
        <div className="h-full flex flex-col bg-background">
            <audio ref={audioRef} src={currentSong?.audioUrl} preload="metadata" />

            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b">
                <Music2 className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-semibold">X-Audio</h1>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Playlist Section */}
                <div className="w-80 border-r flex flex-col">
                    <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
                        <ListMusic className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Library</span>
                        <span className="ml-auto text-xs text-muted-foreground">{songs.length} songs</span>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <div className="p-2">
                            {songs.map((song) => (
                                <button
                                    key={song.id}
                                    onClick={() => playSong(song)}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-accent",
                                        currentSong?.id === song.id && "bg-accent"
                                    )}
                                >
                                    <img
                                        src={song.coverUrl}
                                        alt={song.title}
                                        className="w-10 h-10 rounded object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="text-sm font-medium truncate">{song.title}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <Music2 className="w-3 h-3 text-primary" />
                                            <span className="text-[10px] font-semibold text-primary">X-Audio</span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground flex-shrink-0">{song.duration}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Now Playing Section */}
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    {currentSong ? (
                        <div className="w-full max-w-2xl space-y-8">
                            {/* Album Art + Volume Control */}
                            <div className="flex items-center justify-center gap-8">
                                <img
                                    src={currentSong.coverUrl}
                                    alt={currentSong.title}
                                    className="w-64 h-64 rounded-lg shadow-lg object-cover"
                                />

                                {/* Vertical Volume Bars */}
                                <div className="flex flex-col items-center gap-3 h-64">
                                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                                    <div className="flex flex-col-reverse gap-1 flex-1 justify-end">
                                        {Array.from({ length: 20 }).map((_, i) => {
                                            const barValue = (i + 1) / 20;
                                            const isFilled = barValue <= volume;
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => changeVolume([barValue])}
                                                    className={cn(
                                                        "w-6 h-2 rounded-sm transition-colors",
                                                        isFilled
                                                            ? "bg-primary hover:bg-primary/80"
                                                            : "bg-muted hover:bg-muted-foreground/20"
                                                    )}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Song Info */}
                            <div className="text-center space-y-1">
                                <h2 className="text-2xl font-bold">{currentSong.title}</h2>
                                <p className="text-muted-foreground">{currentSong.artist}</p>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <Slider
                                    value={[currentTime]}
                                    max={duration || 100}
                                    step={0.1}
                                    onValueChange={seek}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={previousSong}
                                    className="p-3 hover:bg-accent rounded-full transition-colors"
                                >
                                    <SkipBack className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={togglePlay}
                                    className="p-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                                >
                                    {isPlaying ? (
                                        <Pause className="w-6 h-6" />
                                    ) : (
                                        <Play className="w-6 h-6 ml-0.5" />
                                    )}
                                </button>
                                <button
                                    onClick={nextSong}
                                    className="p-3 hover:bg-accent rounded-full transition-colors"
                                >
                                    <SkipForward className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <Music2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p>Select a song to start playing</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
