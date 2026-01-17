import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Image, Video, Monitor, Smartphone, Loader2, Check } from "lucide-react";
import { getPreferencesData, savePreferencesData } from "@/lib/firebase-service";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

type DeviceType = "desktop" | "mobile";

export function WallpaperSettings() {
    const isMobileDevice = useIsMobile();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeDevice, setActiveDevice] = useState<DeviceType>(isMobileDevice ? "mobile" : "desktop");
    const [wallpaperData, setWallpaperData] = useState<any>({
        desktop: {
            type: "image",
            url: "",
            blur: 0,
            opacity: 100,
        },
        mobile: {
            type: "image",
            url: "",
            blur: 0,
            opacity: 100,
        },
    });
    const [availableWallpapers, setAvailableWallpapers] = useState<any[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                const preferences = await getPreferencesData();
                if (preferences?.wallpaper) {
                    setWallpaperData(preferences.wallpaper);
                }
                
                // Load available wallpapers from preferences
                if (preferences?.wallpaper?.desktop?.url) {
                    const desktopWallpaper = {
                        type: preferences.wallpaper.desktop.type,
                        url: preferences.wallpaper.desktop.url,
                        device: "desktop"
                    };
                    setAvailableWallpapers(prev => {
                        const exists = prev.some(w => w.url === desktopWallpaper.url);
                        return exists ? prev : [...prev, desktopWallpaper];
                    });
                }
                
                if (preferences?.wallpaper?.mobile?.url) {
                    const mobileWallpaper = {
                        type: preferences.wallpaper.mobile.type,
                        url: preferences.wallpaper.mobile.url,
                        device: "mobile"
                    };
                    setAvailableWallpapers(prev => {
                        const exists = prev.some(w => w.url === mobileWallpaper.url);
                        return exists ? prev : [...prev, mobileWallpaper];
                    });
                }
            } catch (error) {
                console.error("Error loading wallpaper:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const updateWallpaper = (device: DeviceType, field: string, value: any) => {
        setWallpaperData((prev: any) => ({
            ...prev,
            [device]: {
                ...prev[device],
                [field]: value
            }
        }));
    };

    const selectWallpaper = (wallpaper: any) => {
        updateWallpaper(activeDevice, "type", wallpaper.type);
        updateWallpaper(activeDevice, "url", wallpaper.url);
    };

    const removeWallpaper = () => {
        updateWallpaper(activeDevice, "type", "image");
        updateWallpaper(activeDevice, "url", "");
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await savePreferencesData({ wallpaper: wallpaperData });
            toast({
                title: "Wallpaper Saved",
                description: "Your wallpaper settings have been saved. Refresh to see changes.",
            });
            // Trigger a refresh to apply wallpaper
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            console.error("Error saving wallpaper:", error);
            toast({
                title: "Save Failed",
                description: "Could not save wallpaper settings",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin" />
            </div>
        );
    }

    const currentWallpaper = wallpaperData[activeDevice];

    return (
        <>
            <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-1">Wallpaper</h2>
                <p className="text-muted-foreground">Select wallpaper for your desktop and mobile.</p>
            </div>

            <div className="space-y-6">
                {/* Device Tabs */}
                <div className="p-6 rounded-xl border bg-card space-y-4">
                    <Label className="text-base">Device</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setActiveDevice("desktop")}
                            className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                                activeDevice === "desktop"
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                            }`}
                        >
                            <Monitor className="w-5 h-5" />
                            <span className="font-medium">Desktop</span>
                        </button>
                        <button
                            onClick={() => setActiveDevice("mobile")}
                            className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                                activeDevice === "mobile"
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                            }`}
                        >
                            <Smartphone className="w-5 h-5" />
                            <span className="font-medium">Mobile</span>
                        </button>
                    </div>
                </div>

                {/* Current Wallpaper Preview */}
                {currentWallpaper.url && (
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <Label className="text-base">Current Wallpaper</Label>
                        <div className="relative aspect-video rounded-lg overflow-hidden border-2">
                            {currentWallpaper.type === "video" ? (
                                <video src={currentWallpaper.url} className="w-full h-full object-cover" muted loop autoPlay />
                            ) : (
                                <img src={currentWallpaper.url} alt="Current Wallpaper" className="w-full h-full object-cover" />
                            )}
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Active
                            </div>
                        </div>
                    </div>
                )}

                {/* Available Wallpapers */}
                {availableWallpapers.length > 0 && (
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <Label className="text-base">Available Wallpapers</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {/* No Wallpaper Option */}
                            <button
                                onClick={removeWallpaper}
                                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all group ${
                                    !currentWallpaper.url
                                        ? "border-primary ring-2 ring-primary"
                                        : "border-border hover:border-primary/50"
                                }`}
                            >
                                <div className="w-full h-full bg-gradient-to-br from-muted via-muted/50 to-muted flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-background flex items-center justify-center">
                                            <span className="text-2xl">🚫</span>
                                        </div>
                                        <p className="text-sm font-medium">No Wallpaper</p>
                                    </div>
                                </div>
                                {!currentWallpaper.url && (
                                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                                            <Check className="w-5 h-5" />
                                        </div>
                                    </div>
                                )}
                            </button>
                            
                            {availableWallpapers.map((wallpaper, index) => (
                                <button
                                    key={index}
                                    onClick={() => selectWallpaper(wallpaper)}
                                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all group ${
                                        currentWallpaper.url === wallpaper.url
                                            ? "border-primary ring-2 ring-primary"
                                            : "border-border hover:border-primary/50"
                                    }`}
                                >
                                    {wallpaper.type === "video" ? (
                                        <>
                                            <video src={wallpaper.url} className="w-full h-full object-cover" muted />
                                            <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                                <Video className="w-3 h-3" />
                                                Video
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <img src={wallpaper.url} alt="Wallpaper" className="w-full h-full object-cover" />
                                            <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                                <Image className="w-3 h-3" />
                                                Image
                                            </div>
                                        </>
                                    )}
                                    {currentWallpaper.url === wallpaper.url && (
                                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                            <div className="bg-primary text-primary-foreground rounded-full p-2">
                                                <Check className="w-5 h-5" />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Wallpapers Message */}
                {availableWallpapers.length === 0 && (
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <Label className="text-base">Available Wallpapers</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {/* No Wallpaper Option */}
                            <button
                                onClick={removeWallpaper}
                                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all group ${
                                    !currentWallpaper.url
                                        ? "border-primary ring-2 ring-primary"
                                        : "border-border hover:border-primary/50"
                                }`}
                            >
                                <div className="w-full h-full bg-gradient-to-br from-muted via-muted/50 to-muted flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-background flex items-center justify-center">
                                            <span className="text-2xl">🚫</span>
                                        </div>
                                        <p className="text-sm font-medium">No Wallpaper</p>
                                    </div>
                                </div>
                                {!currentWallpaper.url && (
                                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                                            <Check className="w-5 h-5" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-muted-foreground text-center mt-4">Upload wallpapers from the Editor to add more options.</p>
                    </div>
                )}

                {/* Effects */}
                <div className="p-6 rounded-xl border bg-card space-y-6">
                    <Label className="text-base">Effects</Label>
                    
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Blur Amount</Label>
                            <span className="text-sm font-medium">{currentWallpaper.blur}px</span>
                        </div>
                        <Slider
                            value={[currentWallpaper.blur]}
                            onValueChange={(v) => updateWallpaper(activeDevice, "blur", v[0])}
                            max={20}
                            step={1}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Opacity</Label>
                            <span className="text-sm font-medium">{currentWallpaper.opacity}%</span>
                        </div>
                        <Slider
                            value={[currentWallpaper.opacity]}
                            onValueChange={(v) => updateWallpaper(activeDevice, "opacity", v[0])}
                            max={100}
                            step={1}
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="p-6 rounded-xl border bg-card">
                    <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Save Wallpaper Settings
                            </>
                        )}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                        Page will refresh to apply changes
                    </p>
                </div>
            </div>
        </>
    );
}
