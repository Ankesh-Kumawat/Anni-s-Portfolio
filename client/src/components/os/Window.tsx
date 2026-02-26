import React, { useRef, useState, useEffect, useCallback } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { useOS, AppId } from "@/lib/os-context";
import { cn } from "@/lib/utils";
import "react-resizable/css/styles.css";
import { useIsMobile } from "@/hooks/use-mobile";

interface WindowProps {
  id: AppId;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  zIndex: number;
}

export function Window({
  id,
  title,
  icon,
  children,
  defaultWidth = 800,
  defaultHeight = 600,
  zIndex,
}: WindowProps) {
  const { closeWindow, minimizeWindow, focusWindow, activeWindowId, openWindows } = useOS();
  const nodeRef = useRef(null);
  const isActive = activeWindowId === id;
  const [isMaximized, setIsMaximized] = useState(false);
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const [prevSize, setPrevSize] = useState({ width: defaultWidth, height: defaultHeight });
  const isMobile = useIsMobile();
  const [snapHint, setSnapHint] = useState(false);

  // Center window calculation
  const defaultX = typeof window !== 'undefined' ? (window.innerWidth - defaultWidth) / 2 : 50;
  const defaultY = typeof window !== 'undefined' ? (window.innerHeight - defaultHeight) / 2 : 50;
  const safeY = Math.max(defaultY, 60);

  const [position, setPosition] = useState({ x: defaultX, y: safeY });
  const [prevPosition, setPrevPosition] = useState({ x: defaultX, y: safeY });

  // Animation states
  const [isOpening, setIsOpening] = useState(true);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const windowState = openWindows.find(w => w.id === id);
  const isMinimized = windowState?.minimized || false;

  // Opening animation
  useEffect(() => {
    setIsOpening(true);
    const timer = setTimeout(() => setIsOpening(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Handle minimize/restore animations
  useEffect(() => {
    if (isMinimized) {
      setIsMinimizing(true);
      const timer = setTimeout(() => setIsMinimizing(false), 300);
      return () => clearTimeout(timer);
    } else if (windowState && !isOpening) {
      setIsRestoring(true);
      const timer = setTimeout(() => setIsRestoring(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isMinimized]);

  // Auto-maximize on mobile
  useEffect(() => {
    if (isMobile) setIsMaximized(true);
  }, [isMobile]);

  const toggleMaximize = () => {
    if (isMobile) return;
    if (isMaximized) {
      setSize(prevSize);
      setPosition(prevPosition);
    } else {
      setPrevSize(size);
      setPrevPosition(position);
    }
    setIsMaximized(!isMaximized);
    focusWindow(id);
  };

  // Snap to top edge: detect during drag using MOUSE position
  const handleDrag = useCallback((e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });

    const mouseEvent = e as MouseEvent;
    const my = mouseEvent.clientY;

    if (my <= 10) {
      setSnapHint(true);
    } else {
      setSnapHint(false);
    }
  }, []);

  // Snap on drag stop
  const handleDragStop = useCallback(() => {
    if (snapHint) {
      setPrevSize(size);
      setPrevPosition(position);
      setIsMaximized(true);
    }
    setSnapHint(false);
  }, [snapHint, size, position]);

  const onResize = (event: any, { size }: any) => {
    setSize({ width: size.width, height: size.height });
  };

  return (
    <>
      {/* Snap preview hint */}
      {snapHint && (
        <div
          className="absolute inset-0 z-[9998] rounded-xl border-2 border-blue-400/40 transition-all duration-200 pointer-events-none"
          style={{
            background: "rgba(59,130,246,0.08)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      <Draggable
        handle=".window-header"
        nodeRef={nodeRef}
        onMouseDown={() => focusWindow(id)}
        onDrag={handleDrag}
        onStop={handleDragStop}
        bounds="parent"
        position={isMaximized || isMobile ? { x: 0, y: 0 } : position}
        disabled={isMaximized || isMobile || isOpening}
      >
        <div
          ref={nodeRef}
          className={cn(
            "absolute",
            (isMaximized || isMobile) && "!inset-0 !transform-none !w-full !h-full transition-all duration-300 ease-in-out",
            isOpening && "animate-window-open",
            isMinimizing && "animate-window-minimize",
            isRestoring && "animate-window-restore"
          )}
          style={{
            zIndex: isMaximized ? 9999 : zIndex,
            ...(isMaximized || isMobile ? {
              top: 0, left: 0, right: 0, bottom: 0,
              width: '100%', height: '100%', transform: 'none'
            } : {}),
            ...(isMinimized && !isMinimizing ? {
              opacity: 0, pointerEvents: 'none',
              transform: 'scale(0.3) translateY(100vh)'
            } : {})
          }}
        >
          <ResizableBox
            width={isMaximized || isMobile ? 9999 : size.width}
            height={isMaximized || isMobile ? 9999 : size.height}
            onResize={onResize}
            minConstraints={[300, 200]}
            maxConstraints={[2000, 2000]}
            resizeHandles={isMaximized || isMobile ? [] : ['se', 's', 'e']}
            className={cn(
              "relative flex flex-col overflow-hidden rounded-xl border bg-background",
              isActive
                ? "ring-1 ring-white/10"
                : "opacity-[0.97]",
              (isMaximized || isMobile) ? "!rounded-none !border-none !w-full !h-full transition-all duration-300" : ""
            )}
            style={{
              boxShadow: isMaximized || isMobile
                ? "none"
                : isActive
                  ? "0 25px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(255,255,255,0.06)"
                  : "0 10px 30px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(255,255,255,0.04)",
            }}
          >
            {/* Window Header */}
            <div
              className={cn(
                "window-header h-11 border-b flex items-center justify-between px-3 cursor-grab active:cursor-grabbing select-none shrink-0 transition-colors duration-200",
                isActive ? "bg-muted/60" : "bg-muted/30"
              )}
              onDoubleClick={toggleMaximize}
            >
              <div className="flex items-center gap-2.5">
                {/* App icon in title bar */}
                {icon && (
                  <div className="w-4 h-4 flex-shrink-0 opacity-70">
                    {icon}
                  </div>
                )}
                <span className="text-[13px] font-medium tracking-tight text-foreground/80 font-sans">
                  {title}
                </span>
              </div>

              <div className="flex items-center gap-0.5">
                <button
                  onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
                  className="h-7 w-7 rounded-md hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                {!isMobile && (
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}
                    className="h-7 w-7 rounded-md hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
                  >
                    {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
                  className="h-7 w-7 rounded-md hover:bg-red-500/90 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-auto bg-background p-0 text-foreground cursor-auto relative no-scrollbar w-full h-full">
              {children}
            </div>
          </ResizableBox>
        </div>
      </Draggable>
    </>
  );
}
