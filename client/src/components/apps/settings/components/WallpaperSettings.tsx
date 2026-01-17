import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Image, Video, Monitor, Smartphone, Loader2, Check, Eye } from "lucide-react";
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
    const [previewWallpaper, setPreviewWallpaper] = useState<string>("");
    const [preferences, setPreferences] = useState<any>({
        wallpapers: [],
        activeWallpaper: {
            desktop: "",
            mobile: "",
        },
        wallpaperEffects: {
            desktop: { blur: 0, opacity: 100 },
            mobile: { blur: 0, opacity: 100 },
        },
    });

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getPreferencesData();
                if (data) {
                    setPreferences(data);
                }
            } catch (error) {
                console.error("Error loading wallpaper:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const updateEffects = (device: DeviceType, field: "blur" | "opacity", value: number) => {
        setPreferences((prev: any) => ({
            ...prev,
            wallpaperEffects: {
                ...(prev.wallpaperEffects || { desktop: { blur: 0, opacity: 100 }, mobile: { blur: 0, opacity: 100 } }),
                [device]: {
                    ...(prev.wallpaperEffects?.[device] || { blur: 0, opacity: 100 }),
                    [field]: value,
                }
            }
        }));
    };

    const selectWallpaper = (wallpaperId: string) => {
        setPreferences((prev: any) => ({
            ...prev,
            activeWallpaper: {
                ...(prev.activeWallpaper || { desktop: "", mobile: "" }),
                [activeDevice]: wallpaperId,
            }
        }));
        setPreviewWallpaper(wallpaperId);
    };

    const removeWallpaper = () => {
        setPreferences((prev: any) => ({
            ...prev,
            activeWallpaper: {
                ...(prev.activeWallpaper || { desktop: "", mobile: "" }),
                [activeDevice]: "",
            }
        }));
        setPreviewWallpaper("");
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await savePreferencesData(preferences);
            toast({
                title: "Wallpaper Saved",
                description: "Your wallpaper settings have been saved. Refresh to see changes.",
            });
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

    const filteredWallpapers = (preferences.wallpapers || []).filter((w: any) => {
        return w.device === activeDevice;
    });

    const currentWallpaperId = previewWallpaper || preferences.activeWallpaper?.[activeDevice] || "";
    const currentWallpaper = (preferences.wallpapers || []).find((w: any) => w.id === currentWallpaperId);
    const currentEffects = preferences.wallpaperEffects?.[activeDevice] || { blur: 0, opacity: 100 };

    return (
        <>
            <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-1">Wallpaper</h2>
                <p className="text-muted-foreground">Select wallpaper for your desktop and mobile with live preview.</p>
            </div>

            <div className="space-y-6">
                {/* Device Tabs */}
                <div className="p-6 rounded-xl border bg-card space-y-4">
                    <Label className="text-base">Device</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => {
                                setActiveDevice("desktop");
                                setPreviewWallpaper("");
                            }}
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
                            onClick={() => {
                                setActiveDevice("mobile");
                                setPreviewWallpaper("");
                            }}
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

                {/* Live Preview */}
                {currentWallpaper && (
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base">
                                {previewWallpaper ? "Preview" : "Current Wallpaper"}
                            </Label>
                            {previewWallpaper && (
                                <div className="flex items-center gap-1 text-xs text-primary">
                                    <Eye className="w-3 h-3" />
                                    Live Preview
                                </div>
                            )}
                        </div>
                        <div className="relative aspect-video rounded-lg overflow-hidden border-2">
                            {currentWallpaper.type === "video" ? (
                                <video 
                                    src={currentWallpaper.url} 
                                    className="w-full h-full object-cover" 
                                    style={{
                                        filter: `blur(${currentEffects?.blur || 0}px)`,
                                        opacity: (currentEffects?.opacity || 100) / 100,
                                    }}
                                    muted 
                                    loop 
                                    autoPlay 
                                />
                            ) : (
                                <img 
                                    src={currentWallpaper.url} 
                                    alt="Wallpaper" 
                                    className="w-full h-full object-cover"
                                    style={{
                                        filter: `blur(${currentEffects?.blur || 0}px)`,
                                        opacity: (currentEffects?.opacity || 100) / 100,
                                    }}
                                />
                            )}
                            {!previewWallpaper && (
                                <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    Active
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Available Wallpapers */}
                <div className="p-6 rounded-xl border bg-card space-y-4">
                    <Label className="text-base">Available Wallpapers for {activeDevice === "desktop" ? "Desktop" : "Mobile"}</Label>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* No Wallpaper Option */}
                        <button
                            onClick={removeWallpaper}
                            onMouseEnter={() => setPreviewWallpaper("")}
                            onMouseLeave={() => setPreviewWallpaper("")}
                            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all group ${
                                !currentWallpaperId
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
                            {!currentWallpaperId && (
                                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                    <div className="bg-primary text-primary-foreground rounded-full p-2">
                                        <Check className="w-5 h-5" />
                                    </div>
                                </div>
                            )}
                        </button>
                        
                        {filteredWallpapers.map((wallpaper: any) => (
                            <button
                                key={wallpaper.id}
                                onClick={() => selectWallpaper(wallpaper.id)}
                                onMouseEnter={() => setPreviewWallpaper(wallpaper.id)}
                                onMouseLeave={() => setPreviewWallpaper("")}
                                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all group ${
                                    currentWallpaperId === wallpaper.id
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
                                
                                {/* Device Badge */}
                                <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                    {wallpaper.device === "desktop" ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                                    {wallpaper.device === "desktop" ? "Desktop" : "Mobile"}
                                </div>

                                {currentWallpaperId === wallpaper.id && !previewWallpaper && (
                                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                                            <Check className="w-5 h-5" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {filteredWallpapers.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No wallpapers uploaded for {activeDevice}. Upload from Editor.
                        </p>
                    )}
                </div>

                {/* Effects */}
                <div className="p-6 rounded-xl border bg-card space-y-6">
                    <Label className="text-base">Effects for {activeDevice === "desktop" ? "Desktop" : "Mobile"}</Label>
                    
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Blur Amount</Label>
                            <span className="text-sm font-medium">{currentEffects?.blur || 0}px</span>
                        </div>
                        <Slider
                            value={[currentEffects?.blur || 0]}
                            onValueChange={(v) => updateEffects(activeDevice, "blur", v[0])}
                            max={20}
                            step={1}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Opacity</Label>
                            <span className="text-sm font-medium">{currentEffects?.opacity || 100}%</span>
                        </div>
                        <Slider
                            value={[currentEffects?.opacity || 100]}
                            onValueChange={(v) => updateEffects(activeDevice, "opacity", v[0])}
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
