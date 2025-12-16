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

    // Use refs to store callbacks so they don't cause re-renders
    const togglePlayCallbackRef = React.useRef<(() => void) | null>(null);
    const nextSongCallbackRef = React.useRef<(() => void) | null>(null);
    const previousSongCallbackRef = React.useRef<(() => void) | null>(null);

    const togglePlay = () => {
        if (togglePlayCallbackRef.current) {
            togglePlayCallbackRef.current();
        }
    };

    const nextSong = () => {
        if (nextSongCallbackRef.current) {
            nextSongCallbackRef.current();
        }
    };

    const previousSong = () => {
        if (previousSongCallbackRef.current) {
            previousSongCallbackRef.current();
        }
    };

    // Expose refs for DevTunes app to register callbacks
    const contextValue = {
        currentSong,
        isPlaying,
        setCurrentSong,
        setIsPlaying,
        togglePlay,
        nextSong,
        previousSong,
        // Internal refs for callback registration
        _togglePlayCallbackRef: togglePlayCallbackRef,
        _nextSongCallbackRef: nextSongCallbackRef,
        _previousSongCallbackRef: previousSongCallbackRef,
    };

    return (
        <SpotifyContext.Provider value={contextValue as any}>
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
