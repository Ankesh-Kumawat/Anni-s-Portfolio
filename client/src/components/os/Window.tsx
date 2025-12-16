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
  const isMobile = useIsMobile();
  
  // Center window on mount
  const defaultX = typeof window !== 'undefined' ? (window.innerWidth - defaultWidth) / 2 : 50;
  const defaultY = typeof window !== 'undefined' ? (window.innerHeight - defaultHeight) / 2 : 50;
  
  // Ensure it doesn't go under the top bar (40px)
  const safeY = Math.max(defaultY, 60);

  // Auto-maximize on mobile
  useEffect(() => {
    if (isMobile) {
      setIsMaximized(true);
      setSize({ width: window.innerWidth, height: window.innerHeight - 80 }); // Leave space for taskbar
    }
  }, [isMobile]);

  // Handle maximizing
  const toggleMaximize = () => {
    if (isMobile) return; // Don't allow toggling on mobile

    if (isMaximized) {
      setSize(prevSize);
    } else {
      setPrevSize(size);
      setSize({ width: window.innerWidth, height: window.innerHeight - 40 }); // Subtract top bar height
    }
    setIsMaximized(!isMaximized);
    focusWindow(id);
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
      bounds={{ top: 40, left: 0, right: window.innerWidth - 100, bottom: window.innerHeight - 100 }}
      position={isMaximized || isMobile ? { x: 0, y: 40 } : undefined}
      defaultPosition={isMaximized || isMobile ? undefined : { x: defaultX, y: safeY }}
      disabled={isMaximized || isMobile}
    >
      <div
        ref={nodeRef}
        className={cn(
          "absolute", 
          (isMaximized || isMobile) && "!transform-none !w-full !h-[calc(100vh-40px)] !top-10 !left-0"
        )}
        style={{ zIndex }}
      >
        <ResizableBox
          width={(isMaximized || isMobile) ? window.innerWidth : size.width}
          height={(isMaximized || isMobile) ? window.innerHeight - 40 : size.height}
          onResize={onResize}
          minConstraints={[300, 200]}
          maxConstraints={[window.innerWidth, window.innerHeight - 40]}
          resizeHandles={(isMaximized || isMobile) ? [] : ['se', 's', 'e']} // Disable resize when maximized
          className={cn(
             "relative flex flex-col overflow-hidden rounded-lg border bg-background shadow-xl transition-shadow duration-200",
             isActive ? "shadow-2xl ring-1 ring-ring" : "shadow-md opacity-95",
             (isMaximized || isMobile) ? "rounded-none border-none w-full h-full shadow-none" : ""
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
