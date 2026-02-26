import { useState, useEffect, useCallback } from "react";
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

export function Desktop() {
  const { openWindows, addNotification, launchApp, closeWindow, minimizeWindow, activeWindowId } = useOS();
  const isMobile = useIsMobile();
  const spotifyContext = useSpotify();
  const [isBooting, setIsBooting] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showAboutOS, setShowAboutOS] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable) return;

      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case "t": e.preventDefault(); launchApp("terminal"); break;
          case "p": e.preventDefault(); launchApp("projects"); break;
          case "a": e.preventDefault(); launchApp("about"); break;
          case "s": e.preventDefault(); launchApp("settings"); break;
          case "b": e.preventDefault(); launchApp("browser"); break;
          case "c": e.preventDefault(); launchApp("contact"); break;
          case "w":
            e.preventDefault();
            if (activeWindowId) closeWindow(activeWindowId);
            break;
          case "m":
            e.preventDefault();
            if (activeWindowId) minimizeWindow(activeWindowId);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [launchApp, closeWindow, minimizeWindow, activeWindowId]);

  // Right-click context menu handler
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // Only show on desktop background area, not on icons/windows/widgets
    const target = e.target as HTMLElement;
    const isDesktopBg = target.closest('[data-desktop-bg]') !== null;
    if (!isDesktopBg) return;

    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  // Welcome notification for first-time visitors
  useEffect(() => {
    const hasVisited = localStorage.getItem("portfolio-os-welcomed");
    if (hasVisited) return;

    // Mark as visited immediately so it never shows again
    localStorage.setItem("portfolio-os-welcomed", "true");

    // First notification — Welcome
    const welcomeTimer = setTimeout(() => {
      addNotification(
        "Welcome to Portfolio OS!",
        "Hey there! I'm Anni. Explore my portfolio by clicking any app on the desktop. Enjoy!"
      );
    }, 2500);

    // Second notification — Terminal tip
    const tipTimer = setTimeout(() => {
      addNotification(
        "Pro Tip",
        "Try opening the Terminal and type 'help' to discover all commands!"
      );
    }, 8000);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(tipTimer);
    };
  }, []);

  // Log screen size on mount and resize
  useEffect(() => {
    const logScreenSize = () => {
      console.log('📱 Screen Info:', {
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768,
        devicePixelRatio: window.devicePixelRatio,
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      });
    };

    // Log on mount
    logScreenSize();

    // Log on resize
    window.addEventListener('resize', logScreenSize);
    return () => window.removeEventListener('resize', logScreenSize);
  }, []);

  // Listen for restart event
  useEffect(() => {
    const handleRestart = () => {
      setIsBooting(true);
    };

    window.addEventListener('os-restart', handleRestart);
    return () => window.removeEventListener('os-restart', handleRestart);
  }, []);

  const handleBootComplete = () => {
    setIsBooting(false);
    window.location.reload();
  };

  if (isBooting) {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  // On mobile, check if any app is open to show full-screen view
  const mobileActiveApp = isMobile && openWindows.length > 0 && !openWindows[0].minimized
    ? APPS.find((a) => a.id === openWindows[0].id)
    : null;

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-background select-none touch-none flex flex-col"
      onContextMenu={!isMobile ? handleContextMenu : undefined}
    >
      {/* Wallpaper Background */}
      <WallpaperBackground />

      {/* Right-Click Context Menu */}
      {contextMenu && (
        <DesktopContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onAboutOS={() => setShowAboutOS(true)}
        />
      )}

      {/* About OS Dialog */}
      {showAboutOS && (
        <AboutOSDialog onClose={() => setShowAboutOS(false)} />
      )}

      {/* Subtle Dot Grid Background Pattern */}
      <div className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(#a1a1aa 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Mobile Full-Screen App View - Completely replaces desktop UI */}
      {isMobile && mobileActiveApp ? (
        <MobileAppView
          id={mobileActiveApp.id}
          title={mobileActiveApp.title}
        >
          {mobileActiveApp.component}
        </MobileAppView>
      ) : null}

      {/* Desktop/Home Screen - Hidden when mobile app is open */}
      {(!isMobile || !mobileActiveApp) && (
        <>
          {/* System Tray - Fixed at top, not overlay */}
          <div className="relative z-50 shrink-0">
            <SystemTray />
          </div>

          {/* Main Desktop Area - Fills remaining space */}
          <div className="relative flex-1 w-full overflow-hidden" data-desktop-bg>

            {/* Desktop Grid - Responsive Layout */}
            <div className="absolute inset-0 p-6 pt-8 grid grid-cols-4 md:grid-flow-col md:grid-rows-[repeat(auto-fill,minmax(110px,1fr))] gap-x-4 gap-y-6 content-start items-start w-full md:w-fit pointer-events-none [&>*]:pointer-events-auto overflow-y-auto md:overflow-visible h-full pb-20">
              {APPS.map((app) => (
                <DesktopIcon key={app.id} app={app} />
              ))}
            </div>

            {/* Widgets Panel - Desktop only */}
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

            {/* Windows Area - Desktop only */}
            {!isMobile && (
              <div className="absolute inset-0 pointer-events-none [&>*]:pointer-events-auto z-20">
                {openWindows.map((windowState) => {
                  const app = APPS.find((a) => a.id === windowState.id);
                  if (!app) return null;

                  // Render all windows (including minimized) so audio/video continues
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

          {/* Taskbar contains the start menu now */}
          <Taskbar apps={APPS} hasOpenWindows={openWindows.length > 0} />
        </>
      )}
    </div>
  );
}
