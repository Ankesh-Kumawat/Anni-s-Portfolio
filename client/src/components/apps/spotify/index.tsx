import { useState, useRef, useEffect } from "react";
import { SpotifySidebar } from "./components/SpotifySidebar";
import { MainContent } from "./components/MainContent";
import { PlayerBar } from "./components/PlayerBar";
import { MobilePlayer } from "./components/MobilePlayer";
import { songs, playlists, initializeSongs } from "./data";
import { Song } from "./types";
import { useVolume } from "@/lib/volume-context";
import { useSpotify } from "@/lib/spotify-context";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Spotify() {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const spotifyContext = useSpotify();
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showMobilePlayer, setShowMobilePlayer] = useState(false);
    const { volume, setVolume: setGlobalVolume } = useVolume();
    const audioRef = useRef<HTMLAudioElement>(null);
    const isMobile = useIsMobile();
    const [songsLoaded, setSongsLoaded] = useState(false);

    // Initialize songs with metadata on mount
    useEffect(() => {
        const loadSongs = async () => {
            await initializeSongs();
            setSongsLoaded(true);
            // Set first song as current after loading
            if (songs.length > 0 && !currentSong) {
                setCurrentSong(songs[0]);
            }
        };
        loadSongs();
    }, []);

    // Play/Pause
    const togglePlay = () => {
        if (!audioRef.current || !currentSong) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Play specific song
    const playSong = (song: Song) => {
        setCurrentSong(song);
        setIsPlaying(true);
        setCurrentTime(0);
    };

    // Next song
    const nextSong = () => {
        if (!currentSong) return;
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % songs.length;
        playSong(songs[nextIndex]);
    };

    // Previous song
    const previousSong = () => {
        if (!currentSong) return;
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
        playSong(songs[prevIndex]);
    };

    // Seek
    const seek = (time: number) => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    // Volume control - synced with global volume
    const changeVolume = (vol: number) => {
        if (!audioRef.current) return;
        audioRef.current.volume = vol;
        setGlobalVolume(vol);
    };

    // Sync audio volume with global volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Audio element event handlers
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

    // Auto-play when song changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;

        // Load and play the new song
        if (isPlaying) {
            // Small delay to ensure audio source is loaded
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    console.log("Playback prevented:", err);
                    setIsPlaying(false);
                });
            }
        }
    }, [currentSong, isPlaying]);

    // Sync with global Spotify context for widgets
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

    // Register control callbacks
    useEffect(() => {
        (spotifyContext as any).togglePlayCallback = togglePlay;
        (spotifyContext as any).nextSongCallback = nextSong;
        (spotifyContext as any).previousSongCallback = previousSong;
    }, [togglePlay, nextSong, previousSong]);

    // Show loading state while songs are being loaded
    if (!songsLoaded) {
        return (
            <div className="flex flex-col h-full bg-black text-white overflow-hidden items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading music library...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-black text-white overflow-hidden">
            {/* Hidden audio element */}
            <audio
                ref={audioRef}
                src={currentSong?.audioUrl}
                preload="metadata"
            />

            {/* Mobile Fullscreen Player */}
            {isMobile && showMobilePlayer && currentSong && (
                <MobilePlayer
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    currentTime={currentTime}
                    duration={duration}
                    onTogglePlay={togglePlay}
                    onNext={nextSong}
                    onPrevious={previousSong}
                    onSeek={seek}
                    onClose={() => setShowMobilePlayer(false)}
                />
            )}

            <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
                <SpotifySidebar playlists={playlists} />
                <MainContent
                    songs={songs}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    onPlaySong={playSong}
                    onTogglePlay={togglePlay}
                />
            </div>
            <PlayerBar
                currentSong={currentSong}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                volume={volume}
                onTogglePlay={togglePlay}
                onNext={nextSong}
                onPrevious={previousSong}
                onSeek={seek}
                onVolumeChange={changeVolume}
                onMobilePlayerOpen={() => isMobile && setShowMobilePlayer(true)}
            />
        </div>
    );
}
