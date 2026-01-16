import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Settings, Image, Video, Upload, Monitor, Smartphone, Eye, EyeOff } from "lucide-react";
import type { StepProps } from "../../types";
import { uploadImageToCloudinary, uploadVideoToCloudinary } from "@/lib/cloudinary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DeviceType = "desktop" | "mobile";

export default function Step10Preferences({ data, setData }: StepProps) {
    const [uploading, setUploading] = useState<{ desktop: boolean; mobile: boolean }>({ desktop: false, mobile: false });
    const [uploadProgress, setUploadProgress] = useState<{ desktop: number; mobile: number }>({ desktop: 0, mobile: 0 });
    const [activeDevice, setActiveDevice] = useState<DeviceType>("desktop");

    const updateWallpaper = (device: DeviceType, field: string, value: any) => {
        setData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                wallpaper: {
                    ...prev.preferences.wallpaper,
                    [device]: {
                        ...prev.preferences.wallpaper[device],
                        [field]: value
                    }
                }
            }
        }));
    };

    const handleFileUpload = async (device: DeviceType, file: File, type: "image" | "video") => {
        try {
            setUploading(prev => ({ ...prev, [device]: true }));
            setUploadProgress(prev => ({ ...prev, [device]: 0 }));
            
            let url: string;
            if (type === "image") {
                url = await uploadImageToCloudinary(file, (progress) => {
                    setUploadProgress(prev => ({ ...prev, [device]: progress }));
                });
            } else {
                url = await uploadVideoToCloudinary(file, (progress) => {
                    setUploadProgress(prev => ({ ...prev, [device]: progress }));
                });
            }
            
            updateWallpaper(device, "type", type);
            updateWallpaper(device, "url", url);
        } catch (error) {
            console.error("Error uploading wallpaper:", error);
            alert(error instanceof Error ? error.message : "Failed to upload wallpaper");
        } finally {
            setUploading(prev => ({ ...prev, [device]: false }));
            setUploadProgress(prev => ({ ...prev, [device]: 0 }));
        }
    };

    const currentWallpaper = data.preferences.wallpaper[activeDevice];

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-2">Preferences</h2>
                        <p className="text-muted-foreground text-lg">Customize your OS appearance and wallpapers</p>
                    </div>
                    <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border-2">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Theme</div>
                            <div className="text-2xl font-bold text-primary capitalize">{data.preferences.theme}</div>
                        </div>
                        <Settings className="w-6 h-6 text-primary" />
                    </div>
                </div>
            </div>

            {/* Device Tabs */}
            <Tabs value={activeDevice} onValueChange={(v) => setActiveDevice(v as DeviceType)} className="mb-8">
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
            </Tabs>

            {/* Wallpaper Type Selection */}
            <div className="mb-8 bg-card rounded-2xl p-6 border-2 shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" />
                    Wallpaper Type - {activeDevice === "desktop" ? "Desktop" : "Mobile"}
                </h3>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                        onClick={() => updateWallpaper(activeDevice, "type", "image")}
                        className={`p-4 rounded-xl border-2 transition-all ${
                            currentWallpaper.type === "image"
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                        }`}
                    >
                        <Image className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm font-medium">Image</p>
                    </button>
                    
                    <button
                        onClick={() => updateWallpaper(activeDevice, "type", "video")}
                        className={`p-4 rounded-xl border-2 transition-all ${
                            currentWallpaper.type === "video"
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                        }`}
                    >
                        <Video className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm font-medium">Video</p>
                    </button>
                </div>

                {/* Image Upload */}
                {currentWallpaper.type === "image" && (
                    <div className="space-y-4">
                        <Label>Upload Image Wallpaper</Label>
                        <div className="flex gap-3">
                            <label className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(activeDevice, file, "image");
                                    }}
                                    disabled={uploading[activeDevice]}
                                    className="hidden"
                                />
                                <Button type="button" className="w-full gap-2" disabled={uploading[activeDevice]} asChild>
                                    <span>
                                        <Upload className="w-4 h-4" />
                                        {uploading[activeDevice] ? `Uploading... ${uploadProgress[activeDevice]}%` : "Upload Image"}
                                    </span>
                                </Button>
                            </label>
                        </div>
                        
                        {/* Upload Progress Bar */}
                        {uploading[activeDevice] && (
                            <div className="space-y-2">
                                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                                    <div 
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 transition-all duration-300 rounded-full"
                                        style={{ width: `${uploadProgress[activeDevice]}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                                    </div>
                                </div>
                                <p className="text-xs text-center text-muted-foreground font-medium">
                                    {uploadProgress[activeDevice]}% uploaded
                                </p>
                            </div>
                        )}
                        
                        {currentWallpaper.url && !uploading[activeDevice] && (
                            <div className="relative aspect-video rounded-lg overflow-hidden border-2">
                                <img src={currentWallpaper.url} alt="Wallpaper" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                )}

                {/* Video Upload */}
                {currentWallpaper.type === "video" && (
                    <div className="space-y-4">
                        <Label>Upload Video Wallpaper</Label>
                        <div className="flex gap-3">
                            <label className="flex-1">
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(activeDevice, file, "video");
                                    }}
                                    disabled={uploading[activeDevice]}
                                    className="hidden"
                                />
                                <Button type="button" className="w-full gap-2" disabled={uploading[activeDevice]} asChild>
                                    <span>
                                        <Upload className="w-4 h-4" />
                                        {uploading[activeDevice] ? `Uploading... ${uploadProgress[activeDevice]}%` : "Upload Video"}
                                    </span>
                                </Button>
                            </label>
                        </div>
                        
                        {/* Upload Progress Bar */}
                        {uploading[activeDevice] && (
                            <div className="space-y-2">
                                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                                    <div 
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 transition-all duration-300 rounded-full"
                                        style={{ width: `${uploadProgress[activeDevice]}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                                    </div>
                                </div>
                                <p className="text-xs text-center text-muted-foreground font-medium">
                                    {uploadProgress[activeDevice]}% uploaded
                                </p>
                            </div>
                        )}
                        
                        {currentWallpaper.url && !uploading[activeDevice] && (
                            <div className="relative aspect-video rounded-lg overflow-hidden border-2">
                                <video src={currentWallpaper.url} className="w-full h-full object-cover" muted loop autoPlay />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Effects */}
            <div className="bg-card rounded-2xl p-6 border-2 shadow-md space-y-6">
                <h3 className="text-xl font-bold">Wallpaper Effects</h3>

                {/* Blur */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                            <EyeOff className="w-4 h-4" />
                            Blur Amount
                        </Label>
                        <span className="text-sm font-medium">{currentWallpaper.blur}px</span>
                    </div>
                    <Slider
                        value={[currentWallpaper.blur]}
                        onValueChange={(v) => updateWallpaper(activeDevice, "blur", v[0])}
                        max={20}
                        step={1}
                    />
                </div>

                {/* Opacity */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Opacity
                        </Label>
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
        </div>
    );
}
