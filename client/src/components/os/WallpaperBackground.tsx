import { useEffect, useState } from "react";
import { getPreferencesData } from "@/lib/firebase-service";
import { useIsMobile } from "@/hooks/use-mobile";

export function WallpaperBackground() {
  const isMobile = useIsMobile();
  const [wallpaper, setWallpaper] = useState<any>(null);
  const [effects, setEffects] = useState<any>({ blur: 0, opacity: 100 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWallpaper() {
      try {
        const preferences = await getPreferencesData();
        if (preferences) {
          const device = isMobile ? "mobile" : "desktop";
          const wallpaperId = preferences.activeWallpaper?.[device];
          
          if (wallpaperId && preferences.wallpapers) {
            const selectedWallpaper = preferences.wallpapers.find((w: any) => w.id === wallpaperId);
            if (selectedWallpaper) {
              setWallpaper(selectedWallpaper);
            }
          }
          
          if (preferences.wallpaperEffects?.[device]) {
            setEffects(preferences.wallpaperEffects[device]);
          }
        }
      } catch (error) {
        console.error("Error loading wallpaper:", error);
      } finally {
        setLoading(false);
      }
    }
    loadWallpaper();
  }, [isMobile]);

  if (loading || !wallpaper) {
    return null;
  }

  const style: React.CSSProperties = {
    filter: `blur(${effects.blur}px)`,
    opacity: effects.opacity / 100,
  };

  return (
    <>
      {wallpaper.type === "video" && wallpaper.url ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={style}
        >
          <source src={wallpaper.url} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            ...style,
            backgroundImage: `url(${wallpaper.url})`,
          }}
        />
      )}
    </>
  );
}
