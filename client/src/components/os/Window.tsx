import React, { useRef, useState, useEffect, useCallback } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import { useOS, AppId } from "@/lib/os-context";
import {
  SNAP_TEMPLATES,
  getTemplate,
  zoneToRect,
  zoneGridStyle,
} from "@/lib/snapLayouts";
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
  const {
    closeWindow,
    minimizeWindow,
    focusWindow,
    activeWindowId,
    openWindows,
    snapLayoutId,
    snapAssignments,
    assignSnapZone,
    clearWindowSnap,
  } = useOS();
  const nodeRef = useRef(null);
  const isActive = activeWindowId === id;

  // Fixed per-app size — chhoti screen pe viewport me fit ho jaye
  const initW =
    typeof window !== "undefined"
      ? Math.min(defaultWidth, window.innerWidth - 24)
      : defaultWidth;
  const initH =
    typeof window !== "undefined"
      ? Math.min(defaultHeight, window.innerHeight - 96)
      : defaultHeight;

  const [isMaximized, setIsMaximized] = useState(false);
  const [size, setSize] = useState({
    width: initW,
    height: initH,
  });
  const [prevSize, setPrevSize] = useState({
    width: initW,
    height: initH,
  });
  const isMobile = useIsMobile();

  // Snap system state
  const [parentSize, setParentSize] = useState({ w: 0, h: 0 });
  const [snapMenuOpen, setSnapMenuOpen] = useState(false);
  const snapMenuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDraggingRef = useRef(false);
  const dragHitRef = useRef<{ templateId: string; zoneIndex: number } | null>(
    null
  );
  const [dragPreview, setDragPreview] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const [showLayoutsPicker, setShowLayoutsPicker] = useState(false);
  const showRef = useRef(false);
  const pickerZoneRef = useRef<{
    templateId: string;
    zoneIndex: number;
  } | null>(null);

  // Serpentine cascade — pehli app top-left se khulti hai, har window
  // right khisakte waqt SAATH me niche bhi khisakti hai (proper diagonal).
  // Chhoti screens par bhi diagonal dikhaye rakhta hai (MAX_DESCENT tak).
  const CASCADE_X = 64;
  const CASCADE_Y = 40;
  const MAX_DESCENT = 240;
  const SERPENTINE = 8; // 4 step right, phir 4 step wapas left
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const siblingIndex = Math.max(0, openWindows.length - 1);
  const slackX = Math.max(0, vw - defaultWidth - 32);
  const slackY = Math.max(0, vh - initH - 96);
  const phase = siblingIndex % SERPENTINE;
  const wave = phase < SERPENTINE / 2 ? phase : SERPENTINE - 1 - phase;
  const cascadeX = Math.min(wave * CASCADE_X, slackX);
  const cascadeY = Math.min(
    siblingIndex * CASCADE_Y,
    Math.max(slackY, MAX_DESCENT)
  );
  const safeY = 52;
  const defaultX = 40 + cascadeX;
  const defaultY = safeY + cascadeY;

  const [position, setPosition] = useState({ x: defaultX, y: safeY });
  const [prevPosition, setPrevPosition] = useState({ x: defaultX, y: safeY });

  // Animation states
  const [isOpening, setIsOpening] = useState(true);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const windowState = openWindows.find((w) => w.id === id);
  const isMinimized = windowState?.minimized || false;

  // My snap assignment from the active layout
  const myAssignment =
    snapLayoutId != null ? snapAssignments[id] : undefined;
  const activeTemplate = getTemplate(snapLayoutId);

  // Measure the desktop workspace so zones can be converted to pixels
  useEffect(() => {
    const parent = (nodeRef.current as unknown as HTMLElement | null)
      ?.offsetParent as HTMLElement | null;
    if (!parent) return;
    const update = () =>
      setParentSize({ w: parent.clientWidth, h: parent.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(parent);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Apply my assigned zone whenever layout/assignments/workspace changes
  useEffect(() => {
    if (isMobile || myAssignment == null || !activeTemplate) return;
    if (!parentSize.w || !parentSize.h) return;
    if (isDraggingRef.current) return;
    const zone = activeTemplate.zones[myAssignment];
    if (!zone) return;
    const rect = zoneToRect(zone, parentSize);
    setIsMaximized(false);
    setSize({ width: Math.round(rect.w), height: Math.round(rect.h) });
    setPosition({ x: Math.round(rect.x), y: Math.round(rect.y) });
  }, [myAssignment, snapLayoutId, parentSize.w, parentSize.h, isMobile]);

  // Cleanup snap-menu timer
  useEffect(() => {
    return () => {
      if (snapMenuTimer.current) clearTimeout(snapMenuTimer.current);
    };
  }, []);

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
    clearWindowSnap(id);
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

  // Apply a zone picked from the Snap Layouts flyout
  const applyZone = (templateId: string, zoneIndex: number) => {
    setSnapMenuOpen(false);
    focusWindow(id);
    if (templateId === "full") {
      clearWindowSnap(id);
      if (!isMaximized) toggleMaximize();
      return;
    }
    setIsMaximized(false);
    assignSnapZone(templateId, zoneIndex, id);
  };

  // Detect edge / corner snap targets during drag (mouse position based).
  // Top band pe Snap Layouts picker khulta hai (Windows 11 style).
  const handleDrag = useCallback((e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });

    const mouseEvent = e as MouseEvent;
    const parent = (nodeRef.current as unknown as HTMLElement | null)
      ?.offsetParent as HTMLElement | null;
    if (!parent) return;

    const pr = parent.getBoundingClientRect();
    const mx = mouseEvent.clientX - pr.left;
    const my = mouseEvent.clientY - pr.top;
    const W = pr.width;
    const H = pr.height;

    const CORNER = 30; // corner hot-zone
    const EDGE = 26; // side edge hot-zone
    const TOP_TRIGGER = 36; // picker open
    const TOP_RELEASE = 12; // raw top edge = maximize on release
    const TOP_EXIT = 96; // picker close

    let hit: { templateId: string; zoneIndex: number } | null = null;
    let pickerJustOpened = false;

    if (showRef.current) {
      if (my > TOP_EXIT) {
        showRef.current = false;
        setShowLayoutsPicker(false);
        pickerZoneRef.current = null;
        setDragPreview(null);
      } else if (my <= TOP_RELEASE) {
        hit = { templateId: "full", zoneIndex: 0 };
      }
    } else if (my <= TOP_TRIGGER) {
      showRef.current = true;
      pickerJustOpened = true;
      setShowLayoutsPicker(true);
      hit = { templateId: "full", zoneIndex: 0 };
    }

    if (!showRef.current && !pickerJustOpened && !hit) {
      if (mx <= CORNER && my <= CORNER)
        hit = { templateId: "grid-4", zoneIndex: 0 };
      else if (mx >= W - CORNER && my <= CORNER)
        hit = { templateId: "grid-4", zoneIndex: 1 };
      else if (mx <= CORNER && my >= H - CORNER)
        hit = { templateId: "grid-4", zoneIndex: 2 };
      else if (mx >= W - CORNER && my >= H - CORNER)
        hit = { templateId: "grid-4", zoneIndex: 3 };
      else if (mx <= EDGE) hit = { templateId: "halves", zoneIndex: 0 };
      else if (mx >= W - EDGE) hit = { templateId: "halves", zoneIndex: 1 };
    }

    dragHitRef.current = hit;
    if (hit) {
      const t = getTemplate(hit.templateId)!;
      setDragPreview(zoneToRect(t.zones[hit.zoneIndex], { w: W, h: H }));
    } else if (!showRef.current) {
      setDragPreview(null);
    }
  }, []);

  // Apply the pending snap / picked zone on drop
  const handleDragStop = useCallback(() => {
    const picked = pickerZoneRef.current;
    const hit = dragHitRef.current;
    isDraggingRef.current = false;

    if (picked) {
      assignSnapZone(picked.templateId, picked.zoneIndex, id);
      focusWindow(id);
    } else if (hit) {
      if (hit.templateId === "full") {
        setPrevSize(size);
        setPrevPosition(position);
        setIsMaximized(true);
        clearWindowSnap(id);
      } else {
        assignSnapZone(hit.templateId, hit.zoneIndex, id);
      }
      focusWindow(id);
    }

    dragHitRef.current = null;
    pickerZoneRef.current = null;
    showRef.current = false;
    setDragPreview(null);
    setShowLayoutsPicker(false);
  }, [size, position, id, assignSnapZone, clearWindowSnap, focusWindow]);

  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true;
    clearWindowSnap(id);
  }, [id, clearWindowSnap]);

  return (
    <>
      {/* Live snap-zone preview while dragging */}
      {dragPreview && (
        <div
          className="absolute z-[9998] rounded-2xl border-2 border-indigo-500/60 bg-indigo-500/15 shadow-[0_0_40px_rgba(99,102,241,0.25)] backdrop-blur-[2px] pointer-events-none transition-all duration-100 ease-out"
          style={{
            left: dragPreview.x,
            top: dragPreview.y,
            width: dragPreview.w,
            height: dragPreview.h,
          }}
        />
      )}

      {/* Snap Layouts Picker — window ko top pe le jao, wahi 5 templates milte hain */}
      {showLayoutsPicker && (
        <div className="absolute left-1/2 -translate-x-1/2 top-4 z-[9999] pointer-events-auto">
          <div className="flex items-end gap-3 p-3 rounded-2xl bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-700/80 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
            {SNAP_TEMPLATES.map((t) => (
              <div key={t.id} className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "grid p-[4px] rounded-xl border bg-zinc-50 dark:bg-zinc-800/60 transition-colors",
                    snapLayoutId === t.id && myAssignment != null
                      ? "border-indigo-400 dark:border-indigo-500"
                      : "border-zinc-200 dark:border-zinc-700"
                  )}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${t.cols}, 1fr)`,
                    gridTemplateRows: `repeat(${t.rows}, 1fr)`,
                    gap: 3,
                    width: t.cols * 38,
                    height:
                      t.rows === t.cols ? t.rows * 28 : Math.max(48, t.rows * 28),
                  }}
                >
                  {t.zones.map((z, i) => {
                    const isMine =
                      snapLayoutId === t.id && myAssignment === i;
                    return (
                      <button
                        key={i}
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          pickerZoneRef.current = {
                            templateId: t.id,
                            zoneIndex: i,
                          };
                          setDragPreview(zoneToRect(z, parentSize));
                        }}
                        onMouseLeave={() => {
                          const pz = pickerZoneRef.current;
                          if (
                            pz &&
                            pz.templateId === t.id &&
                            pz.zoneIndex === i
                          ) {
                            pickerZoneRef.current = null;
                            setDragPreview(null);
                          }
                        }}
                        title={`${t.name} — zone ${i + 1}`}
                        className={cn(
                          "rounded-md min-h-[10px] transition-colors cursor-pointer",
                          isMine
                            ? "bg-indigo-500 ring-1 ring-indigo-300 dark:ring-indigo-600"
                            : "bg-zinc-300 dark:bg-zinc-600 hover:bg-indigo-400 dark:hover:bg-indigo-400"
                        )}
                        style={zoneGridStyle(z, t.cols, t.rows)}
                      />
                    );
                  })}
                </div>
                <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                  {t.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Draggable
        handle=".window-header"
        nodeRef={nodeRef}
        onMouseDown={() => focusWindow(id)}
        onStart={handleDragStart}
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
          {/* 🖼️ Window Body Card — fixed size, sirf maximize/snap se size badalta hai */}
          <ResizableBox
            width={isMaximized || isMobile ? 9999 : size.width}
            height={isMaximized || isMobile ? 9999 : size.height}
            resizeHandles={[]}
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
                <div
                  className="relative"
                  onMouseEnter={() => {
                    if (isMobile) return;
                    if (snapMenuTimer.current)
                      clearTimeout(snapMenuTimer.current);
                    if (!snapMenuOpen) {
                      snapMenuTimer.current = setTimeout(
                        () => setSnapMenuOpen(true),
                        300
                      );
                    }
                  }}
                  onMouseLeave={() => {
                    if (snapMenuTimer.current)
                      clearTimeout(snapMenuTimer.current);
                    snapMenuTimer.current = setTimeout(
                      () => setSnapMenuOpen(false),
                      200
                    );
                  }}
                >
                  {!isMobile && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMaximize();
                        setSnapMenuOpen(false);
                      }}
                      onDoubleClick={(e) => e.stopPropagation()}
                      title={isMaximized ? "Restore" : "Maximize — hover for Snap Layouts"}
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

                  {/* Snap Layouts Flyout — pick a template, pick a zone */}
                  {snapMenuOpen && !isMobile && (
                    <div
                      onMouseDown={(e) => e.stopPropagation()}
                      onDoubleClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-full mt-2 z-50 p-2 rounded-xl bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-700/80 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 origin-top-right"
                    >
                      <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5 px-0.5">
                        Snap Layouts
                      </div>
                      <div className="flex gap-1.5">
                        {SNAP_TEMPLATES.map((t) => (
                          <div
                            key={t.id}
                            title={t.name}
                            className={cn(
                              "grid content-start p-[3px] rounded-lg border bg-zinc-50 dark:bg-zinc-800/60 transition-colors",
                              snapLayoutId === t.id && myAssignment != null
                                ? "border-indigo-400 dark:border-indigo-500"
                                : "border-zinc-200 dark:border-zinc-700"
                            )}
                            style={{
                              display: "grid",
                              gridTemplateColumns: `repeat(${t.cols}, 1fr)`,
                              gridTemplateRows: `repeat(${t.rows}, 1fr)`,
                              gap: 2,
                              width: t.cols * 20,
                              height: t.rows === t.cols ? t.rows * 15 : Math.max(26, t.rows * 15),
                            }}
                          >
                            {t.zones.map((z, i) => {
                              const isMine =
                                snapLayoutId === t.id && myAssignment === i;
                              return (
                                <button
                                  key={i}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    applyZone(t.id, i);
                                  }}
                                  title={`${t.name} — zone ${i + 1}`}
                                  className={cn(
                                    "rounded-[3px] min-h-[7px] transition-colors cursor-pointer",
                                    isMine
                                      ? "bg-indigo-500 ring-1 ring-indigo-300 dark:ring-indigo-600"
                                      : "bg-zinc-300 dark:bg-zinc-600 hover:bg-indigo-400 dark:hover:bg-indigo-400"
                                  )}
                                  style={zoneGridStyle(z, t.cols, t.rows)}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>
                      <div className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-1.5 px-0.5">
                        Click a zone · other apps auto-fill
                      </div>
                    </div>
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
