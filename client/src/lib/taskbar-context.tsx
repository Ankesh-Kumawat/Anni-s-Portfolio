import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type TaskbarBehavior = "always-show" | "always-hide" | "auto-hide";

interface TaskbarContextType {
    behavior: TaskbarBehavior;
    setBehavior: (behavior: TaskbarBehavior) => void;
    isVisible: boolean;
    setIsVisible: (visible: boolean) => void;
}

const TaskbarContext = createContext<TaskbarContextType | undefined>(undefined);

export function TaskbarProvider({ children }: { children: ReactNode }) {
    const [behavior, setBehavior] = useState<TaskbarBehavior>(() => {
        const saved = localStorage.getItem("taskbar-behavior");
        return (saved as TaskbarBehavior) || "always-show";
    });
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        localStorage.setItem("taskbar-behavior", behavior);
    }, [behavior]);

    return (
        <TaskbarContext.Provider value={{ behavior, setBehavior, isVisible, setIsVisible }}>
            {children}
        </TaskbarContext.Provider>
    );
}

export function useTaskbar() {
    const context = useContext(TaskbarContext);
    if (context === undefined) {
        throw new Error("useTaskbar must be used within a TaskbarProvider");
    }
    return context;
}
