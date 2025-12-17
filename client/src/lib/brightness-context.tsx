import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface BrightnessContextType {
    brightness: number[];
    setBrightness: (value: number[]) => void;
    nightShift: boolean;
    setNightShift: (value: boolean) => void;
}

const BrightnessContext = createContext<BrightnessContextType | undefined>(undefined);

export function BrightnessProvider({ children }: { children: ReactNode }) {
    const [brightness, setBrightness] = useState<number[]>(() => {
        const saved = localStorage.getItem("system-brightness");
        return saved ? [parseInt(saved)] : [100];
    });

    const [nightShift, setNightShift] = useState<boolean>(() => {
        const saved = localStorage.getItem("system-nightshift");
        return saved === "true";
    });

    // Apply brightness and night shift filters
    useEffect(() => {
        let brightnessValue = brightness[0] / 100;

        // Night Shift reduces brightness and adds warm tone
        if (nightShift) {
            brightnessValue = brightnessValue * 0.85; // Dim by 15%
        }

        let filterString = `brightness(${brightnessValue})`;

        if (nightShift) {
            filterString += ` sepia(0.25) saturate(1.1) hue-rotate(-5deg)`;
        }

        document.documentElement.style.filter = filterString;
        localStorage.setItem("system-brightness", brightness[0].toString());
        localStorage.setItem("system-nightshift", nightShift.toString());

        return () => {
            document.documentElement.style.filter = '';
        };
    }, [brightness, nightShift]);

    return (
        <BrightnessContext.Provider value={{ brightness, setBrightness, nightShift, setNightShift }}>
            {children}
        </BrightnessContext.Provider>
    );
}

export function useBrightness() {
    const context = useContext(BrightnessContext);
    if (!context) {
        throw new Error("useBrightness must be used within BrightnessProvider");
    }
    return context;
}
