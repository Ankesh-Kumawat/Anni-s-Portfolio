import React, { useRef, useState, useEffect, useCallback } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
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
  defaultWidth = 840,
  defaultHeight = 620,
  zIndex,
}: WindowProps) {
  const { closeWindow, minimizeWindow, focusWindow, activeWindowId, openWindows } =
    useOS();
  const nodeRef = useRef(null);
  const isActive = activeWindowId === id;
  const [isMaximized, setIsMaximized] = useState(false);
  const [size, setSize] = useState({
    width: defaultWidth,
    height: defaultHeight,
  });
  const [prevSize, setPrevSize] = useState({
    width: defaultWidth,
    height: defaultHeight,
  });
  const isMobile = useIsMobile();
  const [snapHint, setSnapHint] = useState(false);

  // Center window calculation
  const defaultX =
    typeof window !== "undefined"
      ? (window.innerWidth - defaultWidth) / 2
      : 50;
  const defaultY =
    typeof window !== "undefined"
      ? (window.innerHeight - defaultHeight) / 2
      : 50;
  const safeY = Math.max(defaultY, 50);

  const [position, setPosition] = useState({ x: defaultX, y: safeY });
  const [prevPosition, setPrevPosition] = useState({ x: defaultX, y: safeY });

  // Animation states
  const [isOpening, setIsOpening] = useState(true);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const windowState = openWindows.find((w) => w.id === id);
  const isMinimized = windowState?.minimized || false;

  // Opening animation
  useEffect(() => {
    setIsOpening(true);
    const timer = setTimeout(() => setIsOpening(false), 350);
    return () => clearTimeout(timer);
  }, []);

  // Handle minimize/restore animations
  useEffect(() => {
    if (isMinimized) {
      setIsMinimizing(true);
      const timer = setTimeout(() => setIsMinimizing(false), 250);
      return () => clearTimeout(timer);
    } else if (windowState && !isOpening) {
      setIsRestoring(true);
      const timer = setTimeout(() => setIsRestoring(false), 350);
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
        <div className="absolute inset-x-2 top-11 bottom-16 z-[9998] rounded-3xl border-2 border-indigo-500/50 bg-indigo-500/10 backdrop-blur-xs transition-all duration-200 pointer-events-none" />
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
            "absolute flex flex-col",
            (isMaximized || isMobile) &&
            "!inset-0 !transform-none !w-full !h-full transition-all duration-300 ease-in-out",
            isOpening && "animate-window-open",
            isMinimizing && "animate-window-minimize",
            isRestoring && "animate-window-restore"
          )}
          style={{
            zIndex: isMaximized ? 9999 : zIndex,
            ...(isMaximized || isMobile
              ? {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                height: "100%",
                transform: "none",
              }
              : {}),
            ...(isMinimized && !isMinimizing
              ? {
                opacity: 0,
                pointerEvents: "none",
                transform: "scale(0.3) translateY(100vh)",
              }
              : {}),
          }}
        >
          {/* 🖼️ Window Body Card */}
          <ResizableBox
            width={isMaximized || isMobile ? 9999 : size.width}
            height={isMaximized || isMobile ? 9999 : size.height}
            onResize={onResize}
            minConstraints={[340, 240]}
            maxConstraints={[2400, 1800]}
            resizeHandles={isMaximized || isMobile ? [] : ["se", "s", "e"]}
            className={cn(
              "relative flex flex-col bg-white/98 dark:bg-zinc-950/98 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl transition-shadow duration-200 w-full h-full",
              isActive
                ? "ring-2 ring-indigo-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.4)]"
                : "opacity-[0.96] shadow-[0_12px_30px_rgba(0,0,0,0.25)]",
              isMaximized || isMobile
                ? "!rounded-none !border-none !w-full !h-full"
                : ""
            )}
          >
            {/* Integrated Title Bar — window ke andar, real OS style */}
            <div
              className={cn(
                "window-header relative z-20 shrink-0 h-10 flex items-center justify-between pl-3 pr-2 select-none cursor-grab active:cursor-grabbing bg-gradient-to-b from-zinc-50 to-zinc-100/90 dark:from-zinc-900 dark:to-zinc-950",
                isMaximized || isMobile ? "" : "rounded-t-[22px]",
                isActive
                  ? "border-b border-indigo-500/25 dark:border-indigo-400/15"
                  : "border-b border-zinc-200 dark:border-zinc-800"
              )}
              onDoubleClick={toggleMaximize}
            >
              {/* Left: App Identity */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500/25 to-violet-500/25 ring-1 ring-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  {icon ? (
                    <div className="w-3.5 h-3.5 flex items-center justify-center">
                      {icon}
                    </div>
                  ) : (
                    <span className="text-[9px] font-bold">OS</span>
                  )}
                </div>
                <span className="text-xs font-semibold tracking-tight truncate">
                  {title}
                </span>
                <span className="relative flex w-1.5 h-1.5 shrink-0">
                  {isActive && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                  )}
                  <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                </span>
              </div>

              {/* Right: Always-visible Traffic Lights */}
              <div className="relative flex items-center gap-2 shrink-0">
                {/* Minimize — amber */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    minimizeWindow(id);
                  }}
                  onDoubleClick={(e) => e.stopPropagation()}
                  title="Minimize"
                  className="group/min relative w-[19px] h-[19px] rounded-full bg-amber-400 hover:bg-amber-300 text-black/60 hover:!scale-110 flex items-center justify-center transition-all duration-150 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(251,191,36,0.6)] active:!scale-90"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="w-[11px] h-[11px] transition-transform group-hover/min:translate-y-[1px]"
                  >
                    <line x1="6" y1="12" x2="18" y2="12" />
                  </svg>
                </button>

                {/* Maximize — emerald, hosts Snap Layouts flyout */}
                <div className="relative">
                  {!isMobile && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMaximize();
                      }}
                      onDoubleClick={(e) => e.stopPropagation()}
                      title={isMaximized ? "Restore" : "Maximize"}
                      className="group/max relative w-[19px] h-[19px] rounded-full bg-emerald-500 hover:bg-emerald-400 text-white hover:!scale-110 flex items-center justify-center transition-all duration-150 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(16,185,129,0.6)] active:!scale-90"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-[11px] h-[11px]"
                      >
                        {isMaximized ? (
                          <g>
                            <rect x="4" y="9" width="11" height="11" rx="2" />
                            <path d="M9 5h10v10" />
                          </g>
                        ) : (
                          <path d="M9 5H5v4M15 19h4v-4M5 5l6 6M19 19l-6-6" />
                        )}
                      </svg>
                    </button>
                  )}
                </div>

                {/* Close — rose */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeWindow(id);
                  }}
                  onDoubleClick={(e) => e.stopPropagation()}
                  title="Close"
                  className="group/x relative w-[19px] h-[19px] rounded-full bg-rose-500 hover:bg-rose-400 text-white hover:!scale-110 flex items-center justify-center transition-all duration-150 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(244,63,94,0.65)] active:!scale-90"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="w-[11px] h-[11px] -rotate-90 group-hover/x:rotate-0 transition-transform duration-200"
                  >
                    <path d="M7 7l10 10M17 7L7 17" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 min-h-0 overflow-auto rounded-b-3xl bg-white dark:bg-zinc-950 p-0 text-zinc-900 dark:text-zinc-100 cursor-auto relative custom-scrollbar w-full">
              {children}
            </div>
          </ResizableBox>
        </div>
      </Draggable>
    </>
  );
}
