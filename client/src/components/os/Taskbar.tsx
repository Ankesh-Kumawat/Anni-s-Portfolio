import { useOS, AppConfig } from "@/lib/os-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Grid, Search, Power, Settings as SettingsIcon, User } from "lucide-react";
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
  const { launchApp, isAppOpen, activeWindowId, minimizeWindow } = useOS();
  const [startOpen, setStartOpen] = useState(false);
  const isMobile = useIsMobile();
  const { behavior, isVisible, setIsVisible } = useTaskbar();
  const [isHovering, setIsHovering] = useState(false);

  // On mobile, only show first 5 apps + Start menu
  const displayApps = useMemo(() => {
    if (isMobile) {
      return apps.slice(0, 5);
    }
    return apps;
  }, [apps, isMobile]);

  const handleAppClick = (app: AppConfig) => {
    const isOpen = isAppOpen(app.id);
    const isActive = activeWindowId === app.id;

    if (isOpen && isActive) {
      minimizeWindow(app.id);
    } else {
      launchApp(app.id);
    }
  };

  // Handle taskbar visibility based on behavior
  useEffect(() => {
    if (behavior === "always-show") {
      // Hide taskbar when any app is open
      setIsVisible(!hasOpenWindows);
    } else if (behavior === "always-hide") {
      setIsVisible(false);
    } else if (behavior === "auto-hide") {
      setIsVisible(isHovering);
    }
  }, [behavior, hasOpenWindows, isHovering, setIsVisible]);

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
                    <CommandItem className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>Log Out...</span>
                    </CommandItem>
                    <CommandItem className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                      <Power className="w-4 h-4" />
                      <span>Shut Down</span>
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

              return (
                <Tooltip key={app.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleAppClick(app)}
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
              );
            })}
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}
