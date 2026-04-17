import { useOS, AppConfig } from "@/lib/os-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Search, Power, Settings as SettingsIcon, User, FileText, ChevronRight } from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTaskbar } from "@/lib/taskbar-context";
import { createPortal } from "react-dom";
import { useFirestoreData } from "@/hooks/useFirestoreData";

interface AboutData {
  personal: {
    name: string;
    avatar: string;
  };
}

// Windows 11-style Start Menu as a fixed centered overlay
function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return `Yesterday`;
  return `${days} days ago`;
}

interface RecentApp {
  id: AppConfig['id'];
  timestamp: number;
}

function StartMenu({
  apps,
  open,
  onClose,
  launchApp,
  recentApps,
}: {
  apps: AppConfig[];
  open: boolean;
  onClose: () => void;
  launchApp: (id: AppConfig['id']) => void;
  recentApps: RecentApp[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: aboutData } = useFirestoreData<AboutData>("about");
  const avatarUrl = aboutData?.personal?.avatar;
  const displayName = aboutData?.personal?.name ?? "Ankesh Kumawat";

  // Focus search on open
  useEffect(() => {
    if (open) {
      setSearchQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = apps.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menu = (
    <>
      {/* Backdrop — only intercept clicks when menu is open */}
      <div
        className={cn("fixed inset-0 z-[99]", !open && "pointer-events-none")}
        onClick={onClose}
        style={{ background: "transparent" }}
      />

      {/* Start Menu Panel — centered horizontally, sits just above taskbar */}
      <div
        className={cn(
          "fixed z-[100] left-1/2 -translate-x-1/2 flex flex-col overflow-hidden transition-all duration-300 ease-out",
          open
            ? "bottom-[90px] opacity-100 translate-y-0"
            : "bottom-[70px] opacity-0 translate-y-4 pointer-events-none"
        )}
        style={{
          width: "clamp(480px, 45vw, 580px)",
          maxHeight: "calc(100vh - 120px)",
          background: "rgba(18, 18, 22, 0.82)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          boxShadow:
            "0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for apps, settings, and documents"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 rounded-lg pl-10 pr-4 text-sm text-white placeholder:text-white/35 focus:outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.3)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)")
              }
            />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-4">
          {searchQuery ? (
            // ── Search Results ──
            <div>
              <p className="text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-3">
                Best match
              </p>
              {filtered.length === 0 ? (
                <p className="text-sm text-white/40 text-center py-8">
                  No results for "{searchQuery}"
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  {filtered.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => {
                        launchApp(app.id);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-white/8"
                      style={{ "--hover-bg": "rgba(255,255,255,0.06)" } as React.CSSProperties}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        {app.icon}
                      </div>
                      <span className="text-sm font-medium text-white/90 flex-1">
                        {app.title}
                      </span>
                      <span className="text-xs text-white/30">App</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // ── Default View ──
            <div className="flex flex-col gap-6">
              {/* Pinned */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-white/90">Pinned</span>
                  <button
                    className="text-xs text-white/50 flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    All apps <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {apps.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => {
                        launchApp(app.id);
                        onClose();
                      }}
                      className="flex flex-col items-center gap-1.5 p-2 pt-3 pb-2 rounded-xl cursor-pointer transition-all active:scale-90"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div className="w-9 h-9 flex items-center justify-center">
                        {app.icon}
                      </div>
                      <span className="text-[10px] font-medium text-white/70 text-center leading-tight truncate w-full">
                        {app.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Separator */}
              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

              {/* Recommended — real recently opened apps */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-white/90">Recommended</span>
                </div>
                {recentApps.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-white/30">No recently opened apps yet.</p>
                    <p className="text-xs text-white/20 mt-1">Apps you open will appear here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1">
                    {recentApps.slice(0, 4).map((recent) => {
                      const app = apps.find((a) => a.id === recent.id);
                      if (!app) return null;
                      return (
                        <div
                          key={recent.id}
                          onClick={() => { launchApp(app.id); onClose(); }}
                          className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all"
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <div className="w-7 h-7 shrink-0 flex items-center justify-center">{app.icon}</div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-white/85 truncate">{app.title}</span>
                            <span className="text-[10px] text-white/35 truncate">{timeAgo(recent.timestamp)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="shrink-0 px-4 py-3 flex items-center justify-between"
          style={{
            background: "rgba(0,0,0,0.25)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <button
            onClick={() => {
              launchApp("about");
              onClose();
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {/* Profile Avatar */}
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 ring-2 ring-white/10">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-full h-full bg-gradient-to-br from-primary to-purple-600 items-center justify-center text-white font-bold text-sm"
                style={{ display: avatarUrl ? 'none' : 'flex' }}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
            </div>
            <span className="text-sm font-semibold text-white/85">
              {displayName}
            </span>
          </button>
          <button
            onClick={() => {
              onClose();
              window.dispatchEvent(new Event("os-restart"));
            }}
            title="Restart"
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all text-white/60"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "rgba(255,255,255,0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            }}
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(menu, document.body);
}

interface TaskbarProps {
  apps: AppConfig[];
  hasOpenWindows?: boolean;
}

export function Taskbar({ apps, hasOpenWindows = false }: TaskbarProps) {
  const { launchApp, isAppOpen, activeWindowId, minimizeWindow, openWindows } = useOS();
  const [startOpen, setStartOpen] = useState(false);
  const isMobile = useIsMobile();
  const { behavior, isVisible, setIsVisible } = useTaskbar();
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredApp, setHoveredApp] = useState<AppConfig["id"] | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // Track recently opened apps in localStorage
  const RECENT_KEY = "portfolio-os-recent-apps";
  const [recentApps, setRecentApps] = useState<RecentApp[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]") as RecentApp[];
    } catch { return []; }
  });

  const trackRecentApp = (id: AppConfig['id']) => {
    setRecentApps((prev) => {
      // Remove existing entry for same app, then prepend with fresh timestamp
      const filtered = prev.filter((r) => r.id !== id);
      const updated = [{ id, timestamp: Date.now() }, ...filtered].slice(0, 8);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Pinned apps (always show these in taskbar)
  const pinnedAppIds: AppConfig["id"][] = [
    "about",
    "projects",
    "terminal",
    "notepad",
    "browser",
    "gallery",
  ];

  // Show pinned apps + open apps (real OS behavior) - NO LIMIT
  const displayApps = useMemo(() => {
    const pinned = apps.filter((app) => pinnedAppIds.includes(app.id));
    const openNotPinned = apps.filter(
      (app) => isAppOpen(app.id) && !pinnedAppIds.includes(app.id)
    );
    const combined = [...pinned, ...openNotPinned];
    if (isMobile) return combined.slice(0, 5);
    return combined;
  }, [apps, isMobile, openWindows, pinnedAppIds]);

  const handleAppClick = (app: AppConfig) => {
    const isOpen = isAppOpen(app.id);
    const isActive = activeWindowId === app.id;
    if (isOpen && isActive) minimizeWindow(app.id);
    else { launchApp(app.id); trackRecentApp(app.id); }
  };

  const allWindowsMinimized = useMemo(
    () => openWindows.length > 0 && openWindows.every((w) => w.minimized),
    [openWindows]
  );

  useEffect(() => {
    if (behavior === "always-show") {
      setIsVisible(!hasOpenWindows || allWindowsMinimized);
    } else if (behavior === "always-hide") {
      setIsVisible(false);
    } else if (behavior === "auto-hide") {
      setIsVisible(isHovering);
    }
  }, [behavior, hasOpenWindows, allWindowsMinimized, isHovering, setIsVisible]);

  if (isMobile) return null;

  const shouldShow =
    behavior === "auto-hide" ? isVisible || isHovering : isVisible;

  return (
    <>
      {/* Start Menu Overlay — renders into body portal, properly centered */}
      <StartMenu
        apps={apps}
        open={startOpen}
        onClose={() => setStartOpen(false)}
        launchApp={(id) => { launchApp(id); trackRecentApp(id); }}
        recentApps={recentApps}
      />

      {/* Hover trigger for auto-hide */}
      {behavior === "auto-hide" && (
        <div
          className="fixed bottom-0 left-0 right-0 h-4 z-40"
          onMouseEnter={() => setIsHovering(true)}
        />
      )}

      <div
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto transition-all duration-300",
          shouldShow
            ? "translate-y-0 opacity-100"
            : "translate-y-24 opacity-0 pointer-events-none"
        )}
        onMouseEnter={() => behavior === "auto-hide" && setIsHovering(true)}
        onMouseLeave={() => behavior === "auto-hide" && setIsHovering(false)}
      >
        <div className="bg-background/95 border shadow-lg px-2 py-2 rounded-xl flex items-center gap-2 transition-all duration-300">
          {/* Start Button */}
          <button
            onClick={() => setStartOpen((v) => !v)}
            className={cn(
              "relative w-14 h-14 flex items-center justify-center rounded-lg transition-all duration-200 group mr-2 cursor-pointer",
              startOpen
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-foreground"
            )}
          >
            {/* Windows-style grid icon */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="currentColor"
              className="transition-transform group-hover:scale-110"
            >
              <rect x="0" y="0" width="10" height="10" rx="2" />
              <rect x="12" y="0" width="10" height="10" rx="2" />
              <rect x="0" y="12" width="10" height="10" rx="2" />
              <rect x="12" y="12" width="10" height="10" rx="2" />
            </svg>
          </button>

          {/* Separator */}
          <div className="w-px h-8 bg-border mx-1" />

          {/* App Icons */}
          <TooltipProvider>
            {displayApps.map((app) => {
              const isOpen = isAppOpen(app.id);
              const isActive = activeWindowId === app.id;
              const windowState = openWindows.find((w) => w.id === app.id);
              const isMinimized = windowState?.minimized || false;
              const showPreview = hoveredApp === app.id && isOpen;

              return (
                <div key={app.id} className="relative">
                  {/* Window Preview on Hover */}
                  {showPreview && (
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[60] cursor-pointer"
                      style={{ animation: "fadeIn 0.2s ease-out" }}
                      onMouseEnter={() => {
                        if (hoverTimeout) clearTimeout(hoverTimeout);
                        setHoveredApp(app.id);
                      }}
                      onMouseLeave={() => {
                        const t = setTimeout(() => setHoveredApp(null), 300);
                        setHoverTimeout(t);
                      }}
                      onClick={() => {
                        handleAppClick(app);
                        setHoveredApp(null);
                        if (hoverTimeout) clearTimeout(hoverTimeout);
                      }}
                    >
                      <div
                        className="bg-background/98 backdrop-blur-xl border-2 shadow-2xl rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-200 hover:scale-105"
                        style={{ width: "320px" }}
                      >
                        <div className="bg-muted/30 border-b px-3 py-2 flex items-center gap-2">
                          <div className="w-5 h-5 flex items-center justify-center text-primary">
                            {app.icon}
                          </div>
                          <span className="font-semibold text-sm flex-1">
                            {app.title}
                          </span>
                          <div
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              isMinimized
                                ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                                : "bg-green-500/20 text-green-600 dark:text-green-400"
                            )}
                          >
                            {isMinimized ? "Minimized" : "Active"}
                          </div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-muted/20 to-muted/5">
                          <div className="w-full aspect-video bg-background/80 rounded-lg border-2 shadow-inner overflow-hidden relative">
                            <div
                              className="absolute inset-0 scale-[0.25] origin-top-left pointer-events-none"
                              style={{ width: "400%", height: "400%" }}
                            >
                              <div className="w-full h-full p-8 overflow-hidden">
                                {app.component}
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                          </div>
                        </div>
                        <div className="px-3 py-2 bg-muted/20 border-t text-center">
                          <p className="text-xs text-muted-foreground font-medium">
                            Click to {isActive ? "minimize" : "restore"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="relative group">
                    <button
                      onClick={() => handleAppClick(app)}
                      onMouseEnter={() => {
                        if (hoverTimeout) clearTimeout(hoverTimeout);
                        setHoveredApp(app.id);
                      }}
                      onMouseLeave={() => {
                        const t = setTimeout(() => setHoveredApp(null), 300);
                        setHoverTimeout(t);
                      }}
                      className={cn(
                        "relative w-14 h-14 flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div className="w-8 h-8 transition-transform group-hover:scale-110 group-active:scale-95">
                        {app.icon}
                      </div>
                      {isOpen && (
                        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                      )}
                    </button>

                    {/* Tooltip — only when app is NOT open */}
                    {!isOpen && (
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-50">
                        <div
                          className="relative whitespace-nowrap px-3 py-1.5 rounded-lg text-[11px] font-medium text-white/90 shadow-xl"
                          style={{
                            background: "rgba(15,20,35,0.95)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            backdropFilter: "blur(12px)",
                          }}
                        >
                          {app.title}
                          <div
                            className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 -mt-1"
                            style={{
                              background: "rgba(15,20,35,0.95)",
                              borderRight: "1px solid rgba(255,255,255,0.1)",
                              borderBottom: "1px solid rgba(255,255,255,0.1)",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}
