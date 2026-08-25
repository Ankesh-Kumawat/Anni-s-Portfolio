import { useOS, AppConfig } from "@/lib/os-context";
import { useEffect, useState } from "react";
import { getPreferencesData } from "@/lib/firebase-service";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DesktopIconProps {
  app: AppConfig;
}

export function DesktopIcon({ app }: DesktopIconProps) {
  const { launchApp, isAppOpen } = useOS();
  const [preferences, setPreferences] = useState<any>(null);
  const isOpen = isAppOpen(app.id);

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

  const nameColor = preferences?.apps?.globalNameColor || "#ffffff";
  const showLabels = preferences?.apps?.showLabels ?? true;
  const activeIconPack = preferences?.activeIconPack;
  const customIcon =
    activeIconPack &&
    preferences?.iconPacks?.find((p: any) => p.id === activeIconPack)?.icons?.[
      app.id
    ];

  return (
    <motion.button
      data-app-icon={app.id}
      whileHover={{ y: -4, scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => launchApp(app.id)}
      className="group flex flex-col items-center gap-1.5 md:gap-2 p-2 md:p-2.5 rounded-2xl transition-colors w-full md:w-24 cursor-pointer relative select-none"
    >
      {/* Icon Container */}
      <div
        className={cn(
          "relative w-12 h-12 md:w-14 md:h-14 p-2.5 md:p-3 rounded-2xl transition-all duration-300 flex items-center justify-center",
          "bg-white/10 dark:bg-zinc-900/60 backdrop-blur-md border border-white/20 dark:border-zinc-700/50 shadow-lg",
          "group-hover:bg-white/20 dark:group-hover:bg-zinc-800/80 group-hover:border-white/40 dark:group-hover:border-indigo-500/40 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]"
        )}
      >
        {customIcon ? (
          <img
            src={customIcon}
            alt={app.title}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full transition-transform duration-300 group-hover:scale-110 drop-shadow-md flex items-center justify-center">
            {app.icon}
          </div>
        )}

        {/* Running app indicator dot on desktop icon */}
        {isOpen && (
          <span className="absolute -bottom-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-zinc-950 shadow-xs shadow-emerald-400/50" />
        )}
      </div>

      {/* App Label */}
      {showLabels && (
        <span
          className="text-[11px] md:text-xs font-semibold text-center line-clamp-2 select-none font-sans leading-tight transition-all duration-200 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] group-hover:text-white"
          style={{
            color: nameColor,
            textShadow:
              "0 1px 4px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          {app.title}
        </span>
      )}
    </motion.button>
  );
}
