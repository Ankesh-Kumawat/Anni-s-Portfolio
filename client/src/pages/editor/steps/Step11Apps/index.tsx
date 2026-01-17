import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Settings, Upload, Trash2, Check, Image as ImageIcon } from "lucide-react";
import type { StepProps } from "../../types";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { APPS } from "@/components/apps";

export default function Step11Apps({ data, setData }: StepProps) {
    const [uploading, setUploading] = useState<string>("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [activeIconPack, setActiveIconPack] = useState<string>("");

    const updateGlobalColor = (color: string) => {
        setData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                apps: {
                    ...(prev.preferences?.apps || { globalNameColor: "#ffffff", showLabels: true }),
                    globalNameColor: color,
                }
            }
        }));
    };

    const updateShowLabels = (show: boolean) => {
        setData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                apps: {
                    ...(prev.preferences?.apps || { globalNameColor: "#ffffff", showLabels: true }),
                    showLabels: show,
                }
            }
        }));
    };

    const createIconPack = () => {
        const packName = prompt("Enter icon pack name:");
        if (!packName) return;

        const newPack = {
            id: `iconpack_${Date.now()}`,
            name: packName,
            icons: {},
            uploadedAt: new Date().toISOString(),
        };

        setData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                iconPacks: [...(prev.preferences?.iconPacks || []), newPack],
            }
        }));

        setActiveIconPack(newPack.id);
    };

    const deleteIconPack = (packId: string) => {
        setData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                iconPacks: (prev.preferences?.iconPacks || []).filter(p => p.id !== packId),
                activeIconPack: prev.preferences?.activeIconPack === packId ? "" : (prev.preferences?.activeIconPack || ""),
            }
        }));
    };

    const uploadIconForApp = async (packId: string, appId: string, file: File) => {
        try {
            setUploading(appId);
            setUploadProgress(0);

            const url = await uploadImageToCloudinary(file, (progress) => {
                setUploadProgress(progress);
            });

            setData(prev => ({
                ...prev,
                preferences: {
                    ...prev.preferences,
                    iconPacks: (prev.preferences?.iconPacks || []).map(pack =>
                        pack.id === packId
                            ? { ...pack, icons: { ...pack.icons, [appId]: url } }
                            : pack
                    ),
                }
            }));
        } catch (error) {
            console.error("Error uploading icon:", error);
            alert(error instanceof Error ? error.message : "Failed to upload icon");
        } finally {
            setUploading("");
            setUploadProgress(0);
        }
    };

    const currentIconPack = (data.preferences?.iconPacks || []).find(p => p.id === activeIconPack);

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-2">Apps Preferences</h2>
                        <p className="text-muted-foreground text-lg">Customize app appearance and icon packs</p>
                    </div>
                    <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border-2">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Icon Packs</div>
                            <div className="text-2xl font-bold text-primary">{data.preferences?.iconPacks?.length || 0}</div>
                        </div>
                        <Settings className="w-6 h-6 text-primary" />
                    </div>
                </div>
            </div>

            {/* Global App Settings */}
            <div className="mb-8 bg-card rounded-2xl p-6 border-2 shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Global App Settings
                </h3>

                <div className="space-y-6">
                    {/* Global Name Color */}
                    <div className="p-4 rounded-xl border-2 border-border">
                        <Label className="text-base mb-3 block">App Name Color (All Apps)</Label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={data.preferences?.apps?.globalNameColor || "#ffffff"}
                                onChange={(e) => updateGlobalColor(e.target.value)}
                                className="h-12 w-20 rounded cursor-pointer"
                            />
                            <Input
                                value={data.preferences?.apps?.globalNameColor || "#ffffff"}
                                onChange={(e) => updateGlobalColor(e.target.value)}
                                placeholder="#ffffff"
                                className="flex-1"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">This color will be applied to all app names</p>
                    </div>

                    {/* Show Labels */}
                    <div className="p-4 rounded-xl border-2 border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-base">Show App Labels</Label>
                                <p className="text-xs text-muted-foreground mt-1">Toggle visibility of app names below icons</p>
                            </div>
                            <Switch
                                checked={data.preferences?.apps?.showLabels ?? true}
                                onCheckedChange={updateShowLabels}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Icon Packs */}
            <div className="bg-card rounded-2xl p-6 border-2 shadow-md space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        Icon Packs
                    </h3>
                    <Button onClick={createIconPack} className="gap-2">
                        <Upload className="w-4 h-4" />
                        Create Icon Pack
                    </Button>
                </div>

                {(data.preferences?.iconPacks || []).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No icon packs created yet</p>
                        <p className="text-sm mt-1">Create an icon pack to customize app icons</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {(data.preferences?.iconPacks || []).map((pack) => (
                            <div key={pack.id} className="p-4 rounded-xl border-2 border-border">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="font-semibold text-lg">{pack.name}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            {Object.keys(pack.icons).length} / {APPS.length} icons uploaded
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant={activeIconPack === pack.id ? "default" : "outline"}
                                            onClick={() => setActiveIconPack(pack.id)}
                                        >
                                            {activeIconPack === pack.id ? "Editing" : "Edit"}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => deleteIconPack(pack.id)}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>

                                {activeIconPack === pack.id && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t">
                                        {APPS.map((app) => (
                                            <div key={app.id} className="relative group">
                                                <label className="block cursor-pointer">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) uploadIconForApp(pack.id, app.id, file);
                                                        }}
                                                        disabled={uploading === app.id}
                                                        className="hidden"
                                                    />
                                                    <div className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary transition-all flex flex-col items-center justify-center p-3 bg-muted/30">
                                                        {pack.icons[app.id] ? (
                                                            <>
                                                                <img src={pack.icons[app.id]} alt={app.title} className="w-12 h-12 object-contain mb-2" />
                                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                                                    <Check className="w-6 h-6 text-green-400" />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="w-12 h-12 mb-2 flex items-center justify-center">
                                                                    {app.icon}
                                                                </div>
                                                            </>
                                                        )}
                                                        <p className="text-xs font-medium text-center line-clamp-1">{app.title}</p>
                                                        {uploading === app.id && (
                                                            <div className="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center">
                                                                <div className="text-center">
                                                                    <div className="text-white text-xs font-bold">{uploadProgress}%</div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
