import { useOS, AppConfig } from "@/lib/os-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Grid, Search, Power, Settings as SettingsIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useMemo, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTaskbar } from "@/lib/taskbar-context";

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
  const [hoveredApp, setHoveredApp] = useState<AppConfig['id'] | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // Pinned apps (always show these in taskbar)
  const pinnedAppIds: AppConfig['id'][] = ['about', 'projects', 'terminal', 'notepad', 'browser', 'gallery'];

  // Show pinned apps + open apps (real OS behavior) - NO LIMIT
  const displayApps = useMemo(() => {
    // Get pinned apps
    const pinned = apps.filter(app => pinnedAppIds.includes(app.id));

    // Get open apps that are not pinned
    const openNotPinned = apps.filter(app =>
      isAppOpen(app.id) && !pinnedAppIds.includes(app.id)
    );

    // Combine: pinned first, then open apps (unlimited)
    const combined = [...pinned, ...openNotPinned];

    if (isMobile) {
      return combined.slice(0, 5);
    }
    return combined; // No limit on desktop
  }, [apps, isMobile, openWindows, pinnedAppIds]);

  const handleAppClick = (app: AppConfig) => {
    const isOpen = isAppOpen(app.id);
    const isActive = activeWindowId === app.id;

    if (isOpen && isActive) {
      minimizeWindow(app.id);
    } else {
      launchApp(app.id);
    }
  };

  // Check if all windows are minimized
  const allWindowsMinimized = useMemo(() => {
    return openWindows.length > 0 && openWindows.every(w => w.minimized);
  }, [openWindows]);

  // Handle taskbar visibility based on behavior
  useEffect(() => {
    if (behavior === "always-show") {
      // Show taskbar when: no apps open OR all apps minimized
      setIsVisible(!hasOpenWindows || allWindowsMinimized);
    } else if (behavior === "always-hide") {
      setIsVisible(false);
    } else if (behavior === "auto-hide") {
      setIsVisible(isHovering);
    }
  }, [behavior, hasOpenWindows, allWindowsMinimized, isHovering, setIsVisible]);

  // Don't render on mobile
  if (isMobile) return null;

  const shouldShow = behavior === "auto-hide" ? (isVisible || isHovering) : isVisible;

  return (
    <>
      {/* Hover trigger area for auto-hide */}
      {behavior === "auto-hide" && (
        <div
          className="fixed bottom-0 left-0 right-0 h-4 z-40"
          onMouseEnter={() => setIsHovering(true)}
        />
      )}

      <div
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto transition-all duration-300",
          shouldShow ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
        )}
        onMouseEnter={() => behavior === "auto-hide" && setIsHovering(true)}
        onMouseLeave={() => behavior === "auto-hide" && setIsHovering(false)}
      >
        <div className="bg-background/95 border shadow-lg px-2 py-2 rounded-xl flex items-center gap-2 transition-all duration-300">

          {/* Start Menu Button Integrated into Taskbar */}
          <Popover open={startOpen} onOpenChange={setStartOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "relative w-14 h-14 flex items-center justify-center rounded-lg transition-all duration-200 group mr-2",
                  startOpen ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                )}
              >
                <Grid className="w-6 h-6 transition-transform group-hover:scale-110" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0 mb-4 bg-background/95 backdrop-blur-xl border shadow-2xl rounded-xl overflow-hidden"
              side="top"
              align="start"
              sideOffset={16}
            >
              <Command className="rounded-xl border-none">
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandInput placeholder="Type to search apps..." className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
                <CommandList className="max-h-[400px] overflow-y-auto p-2 no-scrollbar">
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Applications">
                    {apps.map((app) => (
                      <CommandItem
                        key={app.id}
                        onSelect={() => {
                          launchApp(app.id);
                          setStartOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg hover:bg-accent aria-selected:bg-accent transition-colors"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-md bg-muted/50">
                          {app.icon}
                        </div>
                        <span className="font-medium">{app.title}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="System">
                    <CommandItem onSelect={() => { launchApp('settings'); setStartOpen(false); }} className="flex items-center gap-2 cursor-pointer">
                      <SettingsIcon className="w-4 h-4" />
                      <span>Settings</span>
                    </CommandItem>
                    <CommandItem
                      onSelect={() => {
                        setStartOpen(false);
                        // Trigger restart with boot screen
                        window.dispatchEvent(new Event('os-restart'));
                      }}
                      className="flex items-center gap-2 cursor-pointer text-orange-500 focus:text-orange-500"
                    >
                      <Power className="w-4 h-4" />
                      <span>Restart</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Separator */}
          <div className="w-px h-8 bg-border mx-1" />

          <TooltipProvider>
            {displayApps.map((app) => {
              const isOpen = isAppOpen(app.id);
              const isActive = activeWindowId === app.id;
              const windowState = openWindows.find(w => w.id === app.id);
              const isMinimized = windowState?.minimized || false;
              const showPreview = hoveredApp === app.id && isOpen;

              return (
                <div key={app.id} className="relative">
                  {/* Advanced Window Preview on Hover */}
                  {showPreview && (
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[60] cursor-pointer"
                      style={{ animation: "fadeIn 0.2s ease-out" }}
                      onMouseEnter={() => {
                        // Clear timeout when hovering preview
                        if (hoverTimeout) {
                          clearTimeout(hoverTimeout);
                        }
                        setHoveredApp(app.id);
                      }}
                      onMouseLeave={() => {
                        // Delay hiding preview by 300ms
                        const timeout = setTimeout(() => {
                          setHoveredApp(null);
                        }, 300);
                        setHoverTimeout(timeout);
                      }}
                      onClick={() => {
                        handleAppClick(app);
                        setHoveredApp(null);
                        if (hoverTimeout) {
                          clearTimeout(hoverTimeout);
                        }
                      }}
                    >
                      <div className="bg-background/98 backdrop-blur-xl border-2 shadow-2xl rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-200 hover:scale-105" style={{ width: '320px' }}>
                        {/* Preview Header */}
                        <div className="bg-muted/30 border-b px-3 py-2 flex items-center gap-2">
                          <div className="w-5 h-5 flex items-center justify-center text-primary">
                            {app.icon}
                          </div>
                          <span className="font-semibold text-sm flex-1">{app.title}</span>
                          <div className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            isMinimized ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" : "bg-green-500/20 text-green-600 dark:text-green-400"
                          )}>
                            {isMinimized ? "Minimized" : "Active"}
                          </div>
                        </div>

                        {/* Preview Content - Scaled Window */}
                        <div className="p-3 bg-gradient-to-br from-muted/20 to-muted/5">
                          <div className="w-full aspect-video bg-background/80 rounded-lg border-2 shadow-inner overflow-hidden relative">
                            {/* Mini window content preview */}
                            <div className="absolute inset-0 scale-[0.25] origin-top-left pointer-events-none" style={{ width: '400%', height: '400%' }}>
                              <div className="w-full h-full p-8 overflow-hidden">
                                {app.component}
                              </div>
                            </div>
                            {/* Overlay to block interaction with content */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                          </div>
                        </div>

                        {/* Preview Footer */}
                        <div className="px-3 py-2 bg-muted/20 border-t text-center">
                          <p className="text-xs text-muted-foreground font-medium">
                            Click to {isActive ? "minimize" : "restore"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleAppClick(app)}
                        onMouseEnter={() => {
                          // Clear any existing timeout
                          if (hoverTimeout) {
                            clearTimeout(hoverTimeout);
                          }
                          // Set hover immediately
                          setHoveredApp(app.id);
                        }}
                        onMouseLeave={() => {
                          // Delay hiding preview by 300ms
                          const timeout = setTimeout(() => {
                            setHoveredApp(null);
                          }, 300);
                          setHoverTimeout(timeout);
                        }}
                        className={cn(
                          "relative w-14 h-14 flex items-center justify-center rounded-lg transition-all duration-200 group",
                          isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <div className="w-8 h-8 transition-transform group-hover:scale-110 group-active:scale-95">
                          {app.icon}
                        </div>
                        {isOpen && (
                          <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="mb-2">
                      <p>{app.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            })}
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}
