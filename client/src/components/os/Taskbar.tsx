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

import { motion, AnimatePresence } from "framer-motion";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: aboutData } = useFirestoreData<AboutData>("about");
  const avatarUrl = aboutData?.personal?.avatar;
  const displayName = aboutData?.personal?.name ?? "Ankesh Kumawat";

  // Focus search on open
  useEffect(() => {
    if (open) {
      setSearchQuery("");
      setSelectedCategory("all");
      setTimeout(() => inputRef.current?.focus(), 80);
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

  // Categories mapping
  const categoryMap: Record<string, string[]> = {
    all: apps.map((a) => a.id),
    dev: ["terminal", "vscode", "db"],
    media: ["spotify", "youtube", "gallery"],
    system: ["settings", "browser", "notepad"],
    portfolio: ["about", "projects", "contact"],
  };

  const filtered = apps.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || categoryMap[selectedCategory]?.includes(a.id);
    return matchesSearch && matchesCategory;
  });

  const menu = (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — click outside to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] bg-black/20 dark:bg-black/40 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Start Menu Panel — Centered with rich spring physics */}
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.92 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                damping: 24,
                stiffness: 320,
              },
            }}
            exit={{
              opacity: 0,
              y: 25,
              scale: 0.95,
              transition: { duration: 0.18, ease: "easeOut" },
            }}
            className="fixed z-[100] left-1/2 -translate-x-1/2 bottom-[74px] flex flex-col overflow-hidden bg-white/98 dark:bg-zinc-950/98 text-zinc-900 dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-800/90 rounded-[28px] shadow-2xl"
            style={{
              width: "clamp(540px, 48vw, 660px)",
              maxHeight: "calc(100vh - 110px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 🔍 Search Bar & Quick Category Filters */}
            <div className="p-5 pb-3 shrink-0 space-y-3 border-b border-zinc-100 dark:border-zinc-900">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search apps, files, or settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 rounded-2xl pl-11 pr-12 text-xs font-medium bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-xs"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 px-1.5 py-0.5 rounded-md bg-zinc-200/60 dark:bg-zinc-800/80 border border-zinc-300/40 dark:border-zinc-700/40">
                  ESC
                </span>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                {[
                  { id: "all", label: "All Apps" },
                  { id: "portfolio", label: "Portfolio" },
                  { id: "dev", label: "Dev Tools" },
                  { id: "media", label: "Media & Audio" },
                  { id: "system", label: "System" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "px-3 py-1 rounded-full text-[11px] font-semibold tracking-tight transition-all duration-200 cursor-pointer shrink-0",
                      selectedCategory === cat.id
                        ? "bg-indigo-600 text-white shadow-xs shadow-indigo-500/30"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 📱 Scrollable Applications & Recent Sections */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
              {searchQuery ? (
                // ── Live Search Results ──
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 px-1">
                    Matching Results ({filtered.length})
                  </p>
                  {filtered.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                        No apps found matching "{searchQuery}"
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                        Try checking your spelling or searching for a different keyword.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {filtered.map((app, idx) => (
                        <motion.div
                          key={app.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.03 } }}
                          onClick={() => {
                            launchApp(app.id);
                            onClose();
                          }}
                          className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all bg-zinc-50 hover:bg-zinc-100/90 border border-zinc-200/70 hover:border-indigo-500/40 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 dark:border-zinc-800/70 shadow-xs hover:shadow-sm group"
                        >
                          <div className="w-9 h-9 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                            {app.icon}
                          </div>
                          <div className="flex flex-col flex-1 overflow-hidden">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                              {app.title}
                            </span>
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                              Launch application
                            </span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // ── Default Pinned + Recent Grid View ──
                <div className="space-y-6">
                  {/* Pinned Applications */}
                  <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                        Applications
                      </span>
                      <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                        {filtered.length} total
                      </span>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                      {filtered.map((app, idx) => (
                        <motion.div
                          key={app.id}
                          initial={{ opacity: 0, scale: 0.85, y: 12 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: {
                              type: "spring",
                              damping: 18,
                              stiffness: 280,
                              delay: idx * 0.025,
                            },
                          }}
                          whileHover={{ y: -4, scale: 1.06 }}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => {
                            launchApp(app.id);
                            onClose();
                          }}
                          className="flex flex-col items-center gap-2 p-2.5 pt-3 pb-2.5 rounded-2xl cursor-pointer transition-colors hover:bg-zinc-100/90 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 group select-none shadow-xs hover:shadow-md"
                        >
                          <div className="w-10 h-10 flex items-center justify-center">
                            {app.icon}
                          </div>
                          <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 text-center leading-tight truncate w-full group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
                            {app.title}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="h-px bg-zinc-200/80 dark:bg-zinc-800/80" />

                  {/* Recent Activity / Recommendations */}
                  <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                        Recent Activity
                      </span>
                    </div>
                    {recentApps.length === 0 ? (
                      <div className="text-center py-6 bg-zinc-50/80 dark:bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800/80">
                        <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                          No recently opened apps yet
                        </p>
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                          Apps you launch will appear here for fast access
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2.5">
                        {recentApps.slice(0, 4).map((recent, idx) => {
                          const app = apps.find((a) => a.id === recent.id);
                          if (!app) return null;
                          return (
                            <motion.div
                              key={recent.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.04 } }}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => {
                                launchApp(app.id);
                                onClose();
                              }}
                              className="flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all bg-zinc-50 hover:bg-zinc-100/90 border border-zinc-200/70 hover:border-indigo-500/40 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 dark:border-zinc-800/70 shadow-xs"
                            >
                              <div className="w-7 h-7 shrink-0 flex items-center justify-center">
                                {app.icon}
                              </div>
                              <div className="flex flex-col flex-1 overflow-hidden">
                                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                                  {app.title}
                                </span>
                                <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 truncate">
                                  Opened {timeAgo(recent.timestamp)}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 👑 Bottom User Profile & Power Actions */}
            <div className="shrink-0 px-5 py-3 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/90 border-t border-zinc-200/80 dark:border-zinc-800/80">
              <button
                onClick={() => {
                  launchApp("about");
                  onClose();
                }}
                className="flex items-center gap-3 px-2 py-1 rounded-2xl hover:bg-zinc-200/60 dark:hover:bg-zinc-800/80 transition-all cursor-pointer group text-left"
              >
                {/* Profile Avatar */}
                <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 ring-2 ring-indigo-500/40 shadow-xs">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        (
                          e.currentTarget.nextElementSibling as HTMLElement
                        )!.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center text-white font-bold text-xs"
                    style={{ display: avatarUrl ? "none" : "flex" }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    Developer • Portfolio OS
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  window.location.reload();
                }}
                title="Restart OS"
                className="w-9 h-9 flex items-center justify-center rounded-2xl bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Power className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
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
          "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-auto transition-all duration-300",
          shouldShow
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0 pointer-events-none"
        )}
        onMouseEnter={() => behavior === "auto-hide" && setIsHovering(true)}
        onMouseLeave={() => behavior === "auto-hide" && setIsHovering(false)}
      >
        <div className="bg-white/95 dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-800 shadow-2xl px-2 py-1.5 rounded-2xl flex items-center gap-1.5 transition-all duration-300">
          {/* Start Button */}
          <button
            onClick={() => setStartOpen((v) => !v)}
            title="Start Menu"
            className={cn(
              "relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 group cursor-pointer",
              startOpen
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
            )}
          >
            {/* Windows-style grid icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 22 22"
              fill="currentColor"
              className="transition-transform group-hover:scale-110 group-active:scale-90"
            >
              <rect x="0" y="0" width="10" height="10" rx="2" />
              <rect x="12" y="0" width="10" height="10" rx="2" />
              <rect x="0" y="12" width="10" height="10" rx="2" />
              <rect x="12" y="12" width="10" height="10" rx="2" />
            </svg>
          </button>

          {/* Separator */}
          <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

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
                        className="bg-white/98 dark:bg-zinc-950/98 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-200 hover:scale-102"
                        style={{ width: "280px" }}
                      >
                        <div className="bg-zinc-50 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 px-3 py-2 flex items-center gap-2">
                          <div className="w-4 h-4 flex items-center justify-center">
                            {app.icon}
                          </div>
                          <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 flex-1 truncate">
                            {app.title}
                          </span>
                          <div
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full font-medium",
                              isMinimized
                                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            )}
                          >
                            {isMinimized ? "Minimized" : "Active"}
                          </div>
                        </div>
                        <div className="p-2.5 bg-zinc-100/50 dark:bg-zinc-900/40">
                          <div className="w-full aspect-video bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-inner overflow-hidden relative">
                            <div
                              className="absolute inset-0 scale-[0.25] origin-top-left pointer-events-none"
                              style={{ width: "400%", height: "400%" }}
                            >
                              <div className="w-full h-full p-8 overflow-hidden">
                                {app.component}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-200 dark:border-zinc-800 text-center">
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
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
                        "relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:scale-105 active:scale-95",
                        isActive
                          ? "bg-zinc-100 dark:bg-zinc-800/90 shadow-2xs"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                      )}
                    >
                      <div className="w-6 h-6 flex items-center justify-center">
                        {app.icon}
                      </div>

                      {/* Running App Indicator Pill */}
                      {isOpen && (
                        <span
                          className={cn(
                            "absolute -bottom-0.5 rounded-full transition-all duration-200",
                            isActive
                              ? "w-4 h-1 bg-indigo-600 dark:bg-indigo-400 shadow-xs shadow-indigo-500/50"
                              : "w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500"
                          )}
                        />
                      )}
                    </button>

                    {/* Tooltip — only when app is NOT open */}
                    {!isOpen && (
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-50">
                        <div className="relative whitespace-nowrap px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xl border border-zinc-800 dark:border-zinc-200">
                          {app.title}
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
