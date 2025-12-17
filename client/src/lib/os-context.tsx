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

export interface OSNotification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface OSContextType {
  openWindows: WindowState[];
  activeWindowId: AppId | null;
  notifications: OSNotification[];
  launchApp: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  isAppOpen: (id: AppId) => boolean;
  addNotification: (title: string, message: string) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export function OSProvider({ children }: { children: ReactNode }) {
  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(10);
  const [notifications, setNotifications] = useState<OSNotification[]>([]);

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

  const addNotification = (title: string, message: string) => {
    const notification: OSNotification = {
      id: Date.now().toString(),
      title,
      message,
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [notification, ...prev]);

    // Play notification sound
    const audio = new Audio('/assets/notification/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => console.log('Notification added'));

    // Notifications will be auto-removed by the component after 10 seconds
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <OSContext.Provider
      value={{
        openWindows,
        activeWindowId,
        notifications,
        launchApp,
        closeWindow,
        minimizeWindow,
        focusWindow,
        isAppOpen,
        addNotification,
        markNotificationRead,
        clearNotifications,
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
