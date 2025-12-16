import React, { createContext, useContext, useState, ReactNode } from "react";

type SystemState = "boot" | "lock" | "desktop" | "shutdown";

interface SystemStateContextType {
    state: SystemState;
    setState: (state: SystemState) => void;
    lock: () => void;
    unlock: () => void;
    shutdown: () => void;
    boot: () => void;
}

const SystemStateContext = createContext<SystemStateContextType | undefined>(undefined);

export function SystemStateProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<SystemState>("boot");

    const lock = () => setState("lock");
    const unlock = () => setState("desktop");
    const shutdown = () => setState("shutdown");
    const boot = () => setState("boot");

    return (
        <SystemStateContext.Provider value={{
            state,
            setState,
            lock,
            unlock,
            shutdown,
            boot,
        }}>
            {children}
        </SystemStateContext.Provider>
    );
}

export function useSystemState() {
    const context = useContext(SystemStateContext);
    if (context === undefined) {
        throw new Error("useSystemState must be used within a SystemStateProvider");
    }
    return context;
}
