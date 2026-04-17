import { useState, useEffect, useCallback, useRef } from "react";
import { useOS } from "@/lib/os-context";
import { useSpotify } from "@/lib/spotify-context";
import { Window } from "./Window";
import { MobileAppView } from "./MobileAppView";
import { DesktopIcon } from "./DesktopIcon";
import { Taskbar } from "./Taskbar";
import { SystemTray } from "./SystemTray";
import { WidgetsPanel } from "./widgets/WidgetsPanel";
import { BootScreen } from "./BootScreen";
import { WallpaperBackground } from "./WallpaperBackground";
import { DesktopContextMenu } from "./DesktopContextMenu";
import { AboutOSDialog } from "./AboutOSDialog";
import { APPS } from "../apps";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppConfig, AppId } from "@/lib/os-context";
import { cn } from "@/lib/utils";

const GRID_KEY = "portfolio-os-desktop-grid";
const GRID_COLS = 12; // Max columns on desktop
const GRID_ROWS = 8;  // Max rows on desktop
const TOTAL_SLOTS = GRID_COLS * GRID_ROWS;

// Load grid as a sequence of AppIds or nulls
function loadDesktopGrid(): (AppId | null)[] {
  try {
    const saved = localStorage.getItem(GRID_KEY);
    if (!saved) return generateDefaultGrid();
    const parsed = JSON.parse(saved) as (AppId | null)[];
    
    // Ensure all current APPS are in the grid exactly once
    const currentAppIds = APPS.map(a => a.id);
    const existingIds = parsed.filter((id): id is AppId => id !== null);
    
    // Remove apps that no longer exist
    const cleanedGrid = parsed.map(id => (id && currentAppIds.includes(id) ? id : null));
    
    // Add new apps to the first available slots
    const missingApps = currentAppIds.filter(id => !existingIds.includes(id));
    missingApps.forEach(id => {
      const firstEmpty = cleanedGrid.indexOf(null);
      if (firstEmpty !== -1) cleanedGrid[firstEmpty] = id;
    });
    
    return cleanedGrid;
  } catch {
    return generateDefaultGrid();
  }
}

function generateDefaultGrid(): (AppId | null)[] {
  const grid = new Array(TOTAL_SLOTS).fill(null);
  APPS.forEach((app, i) => {
    if (i < TOTAL_SLOTS) grid[i] = app.id;
  });
  return grid;
}

function saveDesktopGrid(grid: (AppId | null)[]) {
  localStorage.setItem(GRID_KEY, JSON.stringify(grid));
}

export function Desktop() {
  const { openWindows, addNotification, launchApp, closeWindow, minimizeWindow, activeWindowId } = useOS();
  const isMobile = useIsMobile();
  const spotifyContext = useSpotify();
  const [isBooting, setIsBooting] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showAboutOS, setShowAboutOS] = useState(false);

  // Responsive grid slots state
  const [grid, setGrid] = useState<(AppId | null)[]>(() => loadDesktopGrid());

  // Drag state
  const [draggedId, setDraggedId] = useState<AppId | null>(null);
  const [draggedFromIdx, setDraggedFromIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = (appId: AppId, index: number) => {
    setDraggedId(appId);
    setDraggedFromIdx(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIdx(index);
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedFromIdx === null || draggedId === null) return;

    const newGrid = [...grid];
    const sourceApp = newGrid[draggedFromIdx];
    const targetApp = newGrid[targetIdx];

    // Swap or Move
    newGrid[targetIdx] = sourceApp;
    newGrid[draggedFromIdx] = targetApp;

    setGrid(newGrid);
    saveDesktopGrid(newGrid);
    
    setDraggedId(null);
    setDraggedFromIdx(null);
    setDragOverIdx(null);
  };

  const handleAutoArrange = useCallback(() => {
    const newGrid = generateDefaultGrid();
    setGrid(newGrid);
    saveDesktopGrid(newGrid);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContextMenu(null);
      if (e.altKey) {
        const key = e.key.toLowerCase();
        if (key === "t") launchApp("terminal");
        if (key === "p") launchApp("projects");
        if (key === "a") launchApp("about");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [launchApp]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-desktop-bg]")) {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  }, []);

  if (isBooting) return <BootScreen onComplete={() => { setIsBooting(false); window.location.reload(); }} />;

  const mobileActiveApp = isMobile && openWindows.length > 0 && !openWindows[0].minimized
    ? APPS.find((a) => a.id === openWindows[0].id)
    : null;

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-background select-none touch-none flex flex-col"
      onContextMenu={!isMobile ? handleContextMenu : undefined}
      data-desktop-bg
    >
      <WallpaperBackground />

      {contextMenu && (
        <DesktopContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onAboutOS={() => setShowAboutOS(true)}
          onAutoArrange={handleAutoArrange}
        />
      )}

      {showAboutOS && <AboutOSDialog onClose={() => setShowAboutOS(false)} />}

      {/* Re-added Dot Grid */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#a1a1aa 0.5px, transparent 0.5px)",
          backgroundSize: "40px 40px",
        }}
      />

      {isMobile && mobileActiveApp ? (
        <MobileAppView id={mobileActiveApp.id} title={mobileActiveApp.title}>
          {mobileActiveApp.component}
        </MobileAppView>
      ) : null}

      {(!isMobile || !mobileActiveApp) && (
        <>
          <div className="relative z-50 shrink-0">
            <SystemTray />
          </div>

          <div className="relative flex-1 w-full overflow-hidden" data-desktop-bg>
            
            {/* Real Sparse Desktop Grid */}
            <div 
              className="absolute inset-0 p-4 md:p-8 grid grid-flow-col gap-2 md:gap-4 content-start items-start justify-start w-full overflow-hidden"
              style={{
                gridTemplateColumns: `repeat(${GRID_COLS}, minmax(80px, 100px))`,
                gridTemplateRows: `repeat(${GRID_ROWS}, minmax(100px, 120px))`,
              }}
            >
              {grid.map((appId, idx) => {
                const app = appId ? APPS.find(a => a.id === appId) : null;
                return (
                  <div
                    key={idx}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    className={cn(
                      "group relative w-full h-full rounded-xl transition-all duration-300",
                      dragOverIdx === idx && "bg-white/5 ring-2 ring-primary/40 scale-105 z-10",
                      !app && "hover:bg-white/[0.02]"
                    )}
                  >
                    {app ? (
                      <div
                        draggable
                        onDragStart={() => handleDragStart(app.id, idx)}
                        onDragEnd={() => { setDraggedId(null); setDragOverIdx(null); }}
                        className={cn(
                          "w-full h-full transition-all duration-200",
                          draggedId === app.id && "opacity-20 scale-90"
                        )}
                      >
                        <DesktopIcon app={app} />
                      </div>
                    ) : (
                      // Empty slot target
                      <div className="w-full h-full" />
                    )}
                  </div>
                );
              })}
            </div>

            {!isMobile && (
              <WidgetsPanel
                spotifyData={{
                  currentSong: spotifyContext.currentSong,
                  isPlaying: spotifyContext.isPlaying,
                  onTogglePlay: spotifyContext.togglePlay,
                  onNext: spotifyContext.nextSong,
                  onPrevious: spotifyContext.previousSong,
                }}
              />
            )}

            {!isMobile && (
              <div className="absolute inset-0 pointer-events-none [&>*]:pointer-events-auto z-20">
                {openWindows.map((windowState) => {
                  const app = APPS.find((a) => a.id === windowState.id);
                  if (!app) return null;
                  return (
                    <Window
                      key={windowState.id}
                      id={windowState.id}
                      title={app.title}
                      icon={app.icon}
                      defaultWidth={app.width}
                      defaultHeight={app.height}
                      zIndex={windowState.zIndex}
                    >
                      {app.component}
                    </Window>
                  );
                })}
              </div>
            )}
          </div>

          <Taskbar apps={APPS} hasOpenWindows={openWindows.length > 0} />
        </>
      )}
    </div>
  );
}
