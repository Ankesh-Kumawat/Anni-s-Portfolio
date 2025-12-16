import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface VolumeContextType {
    volume: number;
    setVolume: (volume: number) => void;
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined);

export function VolumeProvider({ children }: { children: ReactNode }) {
    const [volume, setVolumeState] = useState(() => {
        const saved = localStorage.getItem("system-volume");
        return saved ? parseFloat(saved) : 0.7;
    });

    const setVolume = (newVolume: number) => {
        const clampedVolume = Math.max(0, Math.min(1, newVolume));
        setVolumeState(clampedVolume);
        localStorage.setItem("system-volume", clampedVolume.toString());
    };

    return (
        <VolumeContext.Provider value={{ volume, setVolume }}>
            {children}
        </VolumeContext.Provider>
    );
}

export function useVolume() {
    const context = useContext(VolumeContext);
    if (context === undefined) {
        throw new Error("useVolume must be used within a VolumeProvider");
    }
    return context;
}
