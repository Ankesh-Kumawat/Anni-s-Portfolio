import React, { createContext, useContext, useState, ReactNode } from "react";

interface SpotifyContextType {
    currentSong: {
        title: string;
        artist: string;
        coverUrl: string;
    } | null;
    isPlaying: boolean;
    setCurrentSong: (song: { title: string; artist: string; coverUrl: string } | null) => void;
    setIsPlaying: (playing: boolean) => void;
    togglePlay: () => void;
    nextSong: () => void;
    previousSong: () => void;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export function SpotifyProvider({ children }: { children: ReactNode }) {
    const [currentSong, setCurrentSong] = useState<{ title: string; artist: string; coverUrl: string } | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [togglePlayCallback, setTogglePlayCallback] = useState<(() => void) | null>(null);
    const [nextSongCallback, setNextSongCallback] = useState<(() => void) | null>(null);
    const [previousSongCallback, setPreviousSongCallback] = useState<(() => void) | null>(null);

    const togglePlay = () => {
        if (togglePlayCallback) togglePlayCallback();
    };

    const nextSong = () => {
        if (nextSongCallback) nextSongCallback();
    };

    const previousSong = () => {
        if (previousSongCallback) previousSongCallback();
    };

    return (
        <SpotifyContext.Provider value={{
            currentSong,
            isPlaying,
            setCurrentSong,
            setIsPlaying,
            togglePlay,
            nextSong,
            previousSong,
        }}>
            {children}
        </SpotifyContext.Provider>
    );
}

export function useSpotify() {
    const context = useContext(SpotifyContext);
    if (context === undefined) {
        throw new Error("useSpotify must be used within a SpotifyProvider");
    }
    return context;
}

// Hook for Spotify app to register callbacks
export function useSpotifyControls(
    togglePlayFn: () => void,
    nextSongFn: () => void,
    previousSongFn: () => void
) {
    const context = useContext(SpotifyContext);
    if (!context) return;

    React.useEffect(() => {
        // Store callbacks in context (simplified approach)
        (context as any).togglePlayCallback = togglePlayFn;
        (context as any).nextSongCallback = nextSongFn;
        (context as any).previousSongCallback = previousSongFn;
    }, [togglePlayFn, nextSongFn, previousSongFn]);
}
