import React, { createContext, useContext, useState, ReactNode } from "react";

export type AppId =
  | "about"
  | "projects"
  | "skills"
  | "contact"
  | "terminal"
  | "settings"
  | "calculator"
  | "notepad"
  | "vscode"
  | "browser"
  | "spotify"
  | "youtube"
  | "db"
  | "gallery";

export interface AppConfig {
  id: AppId;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  width?: number;
  height?: number;
}

interface WindowState {
  id: AppId;
  minimized: boolean;
  zIndex: number;
}

interface OSContextType {
  openWindows: WindowState[];
  activeWindowId: AppId | null;
  launchApp: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  isAppOpen: (id: AppId) => boolean;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export function OSProvider({ children }: { children: ReactNode }) {
  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(10);

  const launchApp = (id: AppId) => {
    // Check if running on mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (isAppOpen(id)) {
      focusWindow(id);
      return;
    }

    const newWindow: WindowState = {
      id,
      minimized: false,
      zIndex: zIndexCounter + 1,
    };

    setZIndexCounter((prev) => prev + 1);

    // On mobile, close all other windows and open only the new one
    if (isMobile) {
      setOpenWindows([newWindow]);
    } else {
      setOpenWindows((prev) => [...prev, newWindow]);
    }

    setActiveWindowId(id);
  };

  const closeWindow = (id: AppId) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (id: AppId) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    );
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const focusWindow = (id: AppId) => {
    const window = openWindows.find((w) => w.id === id);
    if (!window) return;

    if (window.minimized) {
      setOpenWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, minimized: false } : w))
      );
    }

    setZIndexCounter((prev) => prev + 1);
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: zIndexCounter + 1 } : w))
    );
    setActiveWindowId(id);
  };

  const isAppOpen = (id: AppId) => {
    return openWindows.some((w) => w.id === id);
  };

  return (
    <OSContext.Provider
      value={{
        openWindows,
        activeWindowId,
        launchApp,
        closeWindow,
        minimizeWindow,
        focusWindow,
        isAppOpen,
      }}
    >
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  const context = useContext(OSContext);
  if (context === undefined) {
    throw new Error("useOS must be used within an OSProvider");
  }
  return context;
}
