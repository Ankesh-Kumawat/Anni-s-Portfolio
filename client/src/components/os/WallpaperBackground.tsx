import { useEffect, useState } from "react";
import { getPreferencesData } from "@/lib/firebase-service";
import { useIsMobile } from "@/hooks/use-mobile";

export function WallpaperBackground() {
  const isMobile = useIsMobile();
  const [wallpaper, setWallpaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWallpaper() {
      try {
        const preferences = await getPreferencesData();
        if (preferences?.wallpaper) {
          const deviceWallpaper = isMobile 
            ? preferences.wallpaper.mobile 
            : preferences.wallpaper.desktop;
          setWallpaper(deviceWallpaper);
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

  const getBackgroundStyle = () => {
    const baseStyle: React.CSSProperties = {
      filter: `blur(${wallpaper.blur}px)`,
      opacity: wallpaper.opacity / 100,
    };

    switch (wallpaper.type) {
      case "image":
        return {
          ...baseStyle,
          backgroundImage: `url(${wallpaper.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        };
      
      case "video":
        return baseStyle;
      
      case "gradient":
        return {
          ...baseStyle,
          background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
        };
      
      case "color":
        return {
          ...baseStyle,
          backgroundColor: wallpaper.color,
        };
      
      default:
        return baseStyle;
    }
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
          style={{
            filter: `blur(${wallpaper.blur}px)`,
            opacity: wallpaper.opacity / 100,
          }}
        >
          <source src={wallpaper.url} type="video/mp4" />
        </video>
      ) : wallpaper.type === "gradient" ? (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${wallpaper.gradient}`}
          style={{
            filter: `blur(${wallpaper.blur}px)`,
            opacity: wallpaper.opacity / 100,
          }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={getBackgroundStyle()}
        />
      )}
    </>
  );
}
