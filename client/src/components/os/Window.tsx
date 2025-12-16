import React, { useRef, useState, useEffect } from "react";
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
  children: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  zIndex: number;
}

export function Window({
  id,
  title,
  children,
  defaultWidth = 800,
  defaultHeight = 600,
  zIndex,
}: WindowProps) {
  const { closeWindow, minimizeWindow, focusWindow, activeWindowId } = useOS();
  const nodeRef = useRef(null);
  const isActive = activeWindowId === id;
  const [isMaximized, setIsMaximized] = useState(false);
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const [prevSize, setPrevSize] = useState({ width: defaultWidth, height: defaultHeight });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();

  // Center window on mount
  const defaultX = typeof window !== 'undefined' ? (window.innerWidth - defaultWidth) / 2 : 50;
  const defaultY = typeof window !== 'undefined' ? (window.innerHeight - defaultHeight) / 2 : 50;

  const safeY = Math.max(defaultY, 60);

  // Initialize position on mount
  useEffect(() => {
    setPosition({ x: defaultX, y: safeY });
    setPrevPosition({ x: defaultX, y: safeY });
  }, []);

  // Auto-maximize on mobile
  useEffect(() => {
    if (isMobile) {
      setIsMaximized(true);
    }
  }, [isMobile]);

  // Handle maximizing - relative to desktop container
  const toggleMaximize = () => {
    if (isMobile) return;

    if (isMaximized) {
      // Restore previous size and position
      setSize(prevSize);
      setPosition(prevPosition);
    } else {
      // Save current size and position before maximizing
      setPrevSize(size);
      setPrevPosition(position);
    }
    setIsMaximized(!isMaximized);
    focusWindow(id);
  };

  // Track position changes when dragging
  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };

  // Handle Resize
  const onResize = (event: any, { size }: any) => {
    setSize({ width: size.width, height: size.height });
  };

  return (
    <Draggable
      handle=".window-header"
      nodeRef={nodeRef}
      onMouseDown={() => focusWindow(id)}
      onDrag={handleDrag}
      bounds="parent"
      position={isMaximized || isMobile ? { x: 0, y: 0 } : position}
      disabled={isMaximized || isMobile}
    >
      <div
        ref={nodeRef}
        className={cn(
          "absolute",
          (isMaximized || isMobile) && "!inset-0 !transform-none !w-full !h-full transition-all duration-300 ease-in-out"
        )}
        style={{
          zIndex,
          ...(isMaximized || isMobile ? {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            transform: 'none'
          } : {})
        }}
      >
        <ResizableBox
          width={isMaximized || isMobile ? 9999 : size.width}
          height={isMaximized || isMobile ? 9999 : size.height}
          onResize={onResize}
          minConstraints={[300, 200]}
          maxConstraints={[2000, 2000]}
          resizeHandles={[]}
          className={cn(
            "relative flex flex-col overflow-hidden rounded-lg border bg-background shadow-xl",
            isActive ? "shadow-2xl ring-1 ring-ring" : "shadow-md opacity-95",
            (isMaximized || isMobile) ? "!rounded-none !border-none !w-full !h-full !shadow-none transition-all duration-300" : ""
          )}
        >
          {/* Window Header */}
          <div
            className="window-header h-12 bg-muted/50 border-b flex items-center justify-between px-4 cursor-grab active:cursor-grabbing select-none shrink-0"
            onDoubleClick={toggleMaximize}
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold tracking-tight text-foreground/90 font-sans">
                {title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  minimizeWindow(id);
                }}
                className="h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              {!isMobile && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMaximize();
                  }}
                  className="h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeWindow(id);
                }}
                className="h-8 w-8 rounded-md hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
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
  );
}
