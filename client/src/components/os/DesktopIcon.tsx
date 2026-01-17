import { useOS, AppConfig } from "@/lib/os-context";
import { useEffect, useState } from "react";
import { getPreferencesData } from "@/lib/firebase-service";

interface DesktopIconProps {
  app: AppConfig;
}

export function DesktopIcon({ app }: DesktopIconProps) {
  const { launchApp } = useOS();
  const [preferences, setPreferences] = useState<any>(null);

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
  const customIcon = activeIconPack && preferences?.iconPacks?.find((p: any) => p.id === activeIconPack)?.icons?.[app.id];

  return (
    <button
      onClick={() => launchApp(app.id)}
      className="group flex flex-col items-center gap-1.5 md:gap-2 p-2 md:p-3 rounded-xl hover:bg-accent/50 transition-colors w-full md:w-24 cursor-pointer active:scale-95 duration-100"
    >
      <div className="w-12 h-12 md:w-14 md:h-14 p-2.5 md:p-3 bg-card border-2 border-border shadow-lg rounded-xl group-hover:shadow-xl group-hover:scale-105 transition-all duration-200 flex items-center justify-center">
        {customIcon ? (
          <img src={customIcon} alt={app.title} className="w-full h-full object-contain" />
        ) : (
          app.icon
        )}
      </div>
      {showLabels && (
        <span 
          className="text-[10px] md:text-xs font-medium group-hover:opacity-100 text-center line-clamp-2 select-none font-sans leading-tight"
          style={{ color: nameColor }}
        >
          {app.title}
        </span>
      )}
    </button>
  );
}
