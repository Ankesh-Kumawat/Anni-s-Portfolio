import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Settings, Image, Video, Upload, Monitor, Smartphone, Trash2, Check } from "lucide-react";
import type { StepProps } from "../../types";
import { uploadImageToCloudinary, uploadVideoToCloudinary } from "@/lib/cloudinary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DeviceType = "desktop" | "mobile";

export default function Step10Preferences({ data, setData }: StepProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [activeDevice, setActiveDevice] = useState<DeviceType>("desktop");
    const [filterDevice, setFilterDevice] = useState<"desktop" | "mobile">("desktop");

    const addWallpaper = (type: "image" | "video", url: string, device: DeviceType) => {
        const newWallpaper = {
            id: `wallpaper_${Date.now()}`,
            type,
            url,
            device,
            uploadedAt: new Date().toISOString(),
        };

        setData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                wallpapers: [...(prev.preferences?.wallpapers || []), newWallpaper],
            }
        }));
    };

    const removeWallpaper = (id: string) => {
        setData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                wallpapers: (prev.preferences?.wallpapers || []).filter(w => w.id !== id),
                activeWallpaper: {
                    desktop: prev.preferences?.activeWallpaper?.desktop === id ? "" : (prev.preferences?.activeWallpaper?.desktop || ""),
                    mobile: prev.preferences?.activeWallpaper?.mobile === id ? "" : (prev.preferences?.activeWallpaper?.mobile || ""),
                }
            }
        }));
    };

    const setActiveWallpaper = (id: string, device: "desktop" | "mobile") => {
        setData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                activeWallpaper: {
                    ...(prev.preferences?.activeWallpaper || { desktop: "", mobile: "" }),
                    [device]: id,
                }
            }
        }));
    };

    const updateEffects = (device: "desktop" | "mobile", field: "blur" | "opacity", value: number) => {
        setData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                wallpaperEffects: {
                    ...(prev.preferences?.wallpaperEffects || { desktop: { blur: 0, opacity: 100 }, mobile: { blur: 0, opacity: 100 } }),
                    [device]: {
                        ...(prev.preferences?.wallpaperEffects?.[device] || { blur: 0, opacity: 100 }),
                        [field]: value,
                    }
                }
            }
        }));
    };

    const handleFileUpload = async (file: File, type: "image" | "video", device: DeviceType) => {
        try {
            setUploading(true);
            setUploadProgress(0);
            
            let url: string;
            if (type === "image") {
                url = await uploadImageToCloudinary(file, (progress) => {
                    setUploadProgress(progress);
                });
            } else {
                url = await uploadVideoToCloudinary(file, (progress) => {
                    setUploadProgress(progress);
                });
            }
            
            addWallpaper(type, url, device);
        } catch (error) {
            console.error("Error uploading wallpaper:", error);
            alert(error instanceof Error ? error.message : "Failed to upload wallpaper");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const filteredWallpapers = (data.preferences?.wallpapers || []).filter(w => {
        return w.device === filterDevice;
    });

    const currentEffects = data.preferences?.wallpaperEffects?.[activeDevice] || { blur: 0, opacity: 100 };

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-2">Preferences</h2>
                        <p className="text-muted-foreground text-lg">Upload and manage wallpapers for your OS</p>
                    </div>
                    <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border-2">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Wallpapers</div>
                            <div className="text-2xl font-bold text-primary">{data.preferences?.wallpapers?.length || 0}</div>
                        </div>
                        <Settings className="w-6 h-6 text-primary" />
                    </div>
                </div>
            </div>

            {/* Upload Section */}
            <div className="mb-8 bg-card rounded-2xl p-6 border-2 shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Upload New Wallpaper
                </h3>

                {/* Device Selection for Upload */}
                <div className="mb-4">
                    <Label className="mb-2 block">Target Device</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setActiveDevice("desktop")}
                            className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                                activeDevice === "desktop"
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                            }`}
                        >
                            <Monitor className="w-4 h-4" />
                            <span className="text-sm font-medium">Desktop</span>
                        </button>
                        <button
                            onClick={() => setActiveDevice("mobile")}
                            className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                                activeDevice === "mobile"
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                            }`}
                        >
                            <Smartphone className="w-4 h-4" />
                            <span className="text-sm font-medium">Mobile</span>
                        </button>
                    </div>
                </div>

                {/* Upload Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, "image", activeDevice);
                            }}
                            disabled={uploading}
                            className="hidden"
                        />
                        <Button type="button" className="w-full gap-2" disabled={uploading} asChild>
                            <span>
                                <Image className="w-4 h-4" />
                                {uploading ? `Uploading... ${uploadProgress}%` : "Upload Image"}
                            </span>
                        </Button>
                    </label>

                    <label className="block">
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, "video", activeDevice);
                            }}
                            disabled={uploading}
                            className="hidden"
                        />
                        <Button type="button" className="w-full gap-2" disabled={uploading} asChild>
                            <span>
                                <Video className="w-4 h-4" />
                                {uploading ? `Uploading... ${uploadProgress}%` : "Upload Video"}
                            </span>
                        </Button>
                    </label>
                </div>

                {/* Upload Progress Bar */}
                {uploading && (
                    <div className="mt-4 space-y-2">
                        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                            <div 
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 transition-all duration-300 rounded-full"
                                style={{ width: `${uploadProgress}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                            </div>
                        </div>
                        <p className="text-xs text-center text-muted-foreground font-medium">
                            {uploadProgress}% uploaded
                        </p>
                    </div>
                )}
            </div>

            {/* Wallpapers Grid */}
            <div className="bg-card rounded-2xl p-6 border-2 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Image className="w-5 h-5 text-primary" />
                        Uploaded Wallpapers
                    </h3>

                    {/* Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterDevice("desktop")}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                                filterDevice === "desktop"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted hover:bg-muted/80"
                            }`}
                        >
                            <Monitor className="w-3 h-3" />
                            Desktop
                        </button>
                        <button
                            onClick={() => setFilterDevice("mobile")}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                                filterDevice === "mobile"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted hover:bg-muted/80"
                            }`}
                        >
                            <Smartphone className="w-3 h-3" />
                            Mobile
                        </button>
                    </div>
                </div>

                {filteredWallpapers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No wallpapers uploaded yet</p>
                        <p className="text-sm mt-1">Upload images or videos to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredWallpapers.map((wallpaper) => (
                            <div
                                key={wallpaper.id}
                                className="relative group rounded-xl overflow-hidden border-2 border-border hover:border-primary/50 transition-all"
                            >
                                {/* Wallpaper Preview */}
                                <div className="aspect-video relative">
                                    {wallpaper.type === "video" ? (
                                        <video src={wallpaper.url} className="w-full h-full object-cover" muted />
                                    ) : (
                                        <img src={wallpaper.url} alt="Wallpaper" className="w-full h-full object-cover" />
                                    )}

                                    {/* Type Badge */}
                                    <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                        {wallpaper.type === "video" ? <Video className="w-3 h-3" /> : <Image className="w-3 h-3" />}
                                        {wallpaper.type}
                                    </div>

                                    {/* Device Badge */}
                                    <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                        {wallpaper.device === "desktop" ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                                        {wallpaper.device === "desktop" ? "Desktop" : "Mobile"}
                                    </div>

                                    {/* Active Badges */}
                                    {data.preferences?.activeWallpaper?.desktop === wallpaper.id && (
                                        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs flex items-center gap-1">
                                            <Check className="w-3 h-3" />
                                            Desktop Active
                                        </div>
                                    )}
                                    {data.preferences?.activeWallpaper?.mobile === wallpaper.id && (
                                        <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs flex items-center gap-1">
                                            <Check className="w-3 h-3" />
                                            Mobile Active
                                        </div>
                                    )}

                                    {/* Hover Actions */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => setActiveWallpaper(wallpaper.id, wallpaper.device)}
                                            className="gap-1"
                                        >
                                            {wallpaper.device === "desktop" ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                                            Set Active
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => removeWallpaper(wallpaper.id)}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Effects Section */}
            <div className="mt-8 bg-card rounded-2xl p-6 border-2 shadow-md space-y-6">
                <h3 className="text-xl font-bold">Wallpaper Effects</h3>

                <Tabs value={activeDevice === "both" ? "desktop" : activeDevice} onValueChange={(v) => setActiveDevice(v as DeviceType)}>
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="desktop" className="gap-2">
                            <Monitor className="w-4 h-4" />
                            Desktop
                        </TabsTrigger>
                        <TabsTrigger value="mobile" className="gap-2">
                            <Smartphone className="w-4 h-4" />
                            Mobile
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="desktop" className="space-y-6 mt-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>Blur Amount</Label>
                                <span className="text-sm font-medium">{data.preferences?.wallpaperEffects?.desktop?.blur || 0}px</span>
                            </div>
                            <Slider
                                value={[data.preferences?.wallpaperEffects?.desktop?.blur || 0]}
                                onValueChange={(v) => updateEffects("desktop", "blur", v[0])}
                                max={20}
                                step={1}
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>Opacity</Label>
                                <span className="text-sm font-medium">{data.preferences?.wallpaperEffects?.desktop?.opacity || 100}%</span>
                            </div>
                            <Slider
                                value={[data.preferences?.wallpaperEffects?.desktop?.opacity || 100]}
                                onValueChange={(v) => updateEffects("desktop", "opacity", v[0])}
                                max={100}
                                step={1}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="mobile" className="space-y-6 mt-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>Blur Amount</Label>
                                <span className="text-sm font-medium">{data.preferences?.wallpaperEffects?.mobile?.blur || 0}px</span>
                            </div>
                            <Slider
                                value={[data.preferences?.wallpaperEffects?.mobile?.blur || 0]}
                                onValueChange={(v) => updateEffects("mobile", "blur", v[0])}
                                max={20}
                                step={1}
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>Opacity</Label>
                                <span className="text-sm font-medium">{data.preferences?.wallpaperEffects?.mobile?.opacity || 100}%</span>
                            </div>
                            <Slider
                                value={[data.preferences?.wallpaperEffects?.mobile?.opacity || 100]}
                                onValueChange={(v) => updateEffects("mobile", "opacity", v[0])}
                                max={100}
                                step={1}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
