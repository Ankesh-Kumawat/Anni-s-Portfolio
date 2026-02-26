import { useOS, AppConfig } from "@/lib/os-context";
import { useEffect, useState, useRef, useCallback } from "react";
import { getPreferencesData } from "@/lib/firebase-service";
import { cn } from "@/lib/utils";

interface DesktopIconProps {
  app: AppConfig;
}

export function DesktopIcon({ app }: DesktopIconProps) {
  const { launchApp } = useOS();
  const [preferences, setPreferences] = useState<any>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCountRef = useRef(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function loadPreferences() {
      try {
        const data = await getPreferencesData();
        if (data) {
          setPreferences(data);
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    }
    loadPreferences();
  }, []);

  // Deselect when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`[data-app-icon="${app.id}"]`)) {
        setIsSelected(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [app.id]);

  // Double-click to open, single click to select
  const handleClick = useCallback(() => {
    clickCountRef.current += 1;

    if (clickCountRef.current === 1) {
      // Single click — select + show hint
      setIsSelected(true);
      setShowTooltip(true);
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = setTimeout(() => setShowTooltip(false), 2000);

      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 350);
    } else if (clickCountRef.current === 2) {
      // Double click — open app
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      clickCountRef.current = 0;
      setShowTooltip(false);
      launchApp(app.id);
    }
  }, [app.id, launchApp]);

  const nameColor = preferences?.apps?.globalNameColor || "#ffffff";
  const showLabels = preferences?.apps?.showLabels ?? true;
  const activeIconPack = preferences?.activeIconPack;
  const customIcon = activeIconPack && preferences?.iconPacks?.find((p: any) => p.id === activeIconPack)?.icons?.[app.id];

  return (
    <button
      data-app-icon={app.id}
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={cn(
        "group flex flex-col items-center gap-1.5 md:gap-2 p-2 md:p-3 rounded-xl transition-all w-full md:w-24 cursor-pointer duration-300 relative",
        isSelected
          ? "bg-blue-500/20 ring-1 ring-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
          : "hover:bg-white/5",
      )}
      style={{
        transform: isPressed ? "scale(0.92)" : "scale(1)",
        transition: "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Double-click hint tooltip */}
      {showTooltip && (
        <div
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md text-[10px] font-medium text-white/90 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{
            background: "rgba(15,20,35,0.95)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
          }}
        >
          Double click to open
        </div>
      )}

      {/* Icon container */}
      <div
        className={cn(
          "relative w-12 h-12 md:w-14 md:h-14 p-2.5 md:p-3 rounded-xl transition-all duration-300 flex items-center justify-center",
          "bg-black/40 backdrop-blur-md border border-white/10 shadow-lg",
          "group-hover:bg-black/50 group-hover:border-white/20 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]",
          isSelected && "border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]",
        )}
        style={{
          transform: isPressed ? "scale(0.85)" : isSelected ? "scale(0.95)" : "scale(1)",
          transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {customIcon ? (
          <img src={customIcon} alt={app.title} className="w-full h-full object-contain" />
        ) : (
              <div className="w-full h-full transition-transform duration-300 group-hover:scale-110 drop-shadow-md">
                {app.icon}
              </div>
        )}

        {/* Subtle glow on hover */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Label */}
      {showLabels && (
        <span
          className={cn(
            "text-[10px] md:text-xs font-semibold text-center line-clamp-2 select-none font-sans leading-tight transition-all duration-200",
            isSelected ? "opacity-100" : "opacity-80 group-hover:opacity-100",
          )}
          style={{
            color: nameColor,
            textShadow: "0 1px 4px rgba(0,0,0,0.8), 0 1px 8px rgba(0,0,0,0.4)",
          }}
        >
          {app.title}
        </span>
      )}
    </button>
  );
}
