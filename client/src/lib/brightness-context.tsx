import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface BrightnessContextType {
    brightness: number[];
    setBrightness: (value: number[]) => void;
}

const BrightnessContext = createContext<BrightnessContextType | undefined>(undefined);

export function BrightnessProvider({ children }: { children: ReactNode }) {
    const [brightness, setBrightness] = useState<number[]>(() => {
        const saved = localStorage.getItem("system-brightness");
        return saved ? [parseInt(saved)] : [100];
    });

    // Apply brightness filter
    useEffect(() => {
        const brightnessValue = brightness[0] / 100;
        document.documentElement.style.filter = `brightness(${brightnessValue})`;
        localStorage.setItem("system-brightness", brightness[0].toString());

        return () => {
            document.documentElement.style.filter = '';
        };
    }, [brightness]);

    return (
        <BrightnessContext.Provider value={{ brightness, setBrightness }}>
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
