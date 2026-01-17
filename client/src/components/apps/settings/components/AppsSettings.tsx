import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2, Check, Image as ImageIcon } from "lucide-react";
import { getPreferencesData, savePreferencesData } from "@/lib/firebase-service";
import { useToast } from "@/hooks/use-toast";
import { APPS } from "@/components/apps";

export function AppsSettings() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preferences, setPreferences] = useState<any>({
        iconPacks: [],
        activeIconPack: "",
        apps: {
            globalNameColor: "#ffffff",
            showLabels: true,
        },
    });

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getPreferencesData();
                if (data) {
                    setPreferences({
                        iconPacks: data.iconPacks || [],
                        activeIconPack: data.activeIconPack || "",
                        apps: data.apps || { globalNameColor: "#ffffff", showLabels: true },
                    });
                }
            } catch (error) {
                console.error("Error loading preferences:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const updateGlobalColor = (color: string) => {
        setPreferences((prev: any) => ({
            ...prev,
            apps: {
                ...(prev.apps || { globalNameColor: "#ffffff", showLabels: true }),
                globalNameColor: color,
            }
        }));
    };

    const updateShowLabels = (show: boolean) => {
        setPreferences((prev: any) => ({
            ...prev,
            apps: {
                ...(prev.apps || { globalNameColor: "#ffffff", showLabels: true }),
                showLabels: show,
            }
        }));
    };

    const setActiveIconPack = (packId: string) => {
        setPreferences((prev: any) => ({
            ...prev,
            activeIconPack: packId,
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await savePreferencesData(preferences);
            toast({
                title: "Settings Saved",
                description: "Your app settings have been saved. Refresh to see changes.",
            });
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            console.error("Error saving settings:", error);
            toast({
                title: "Save Failed",
                description: "Could not save settings",
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

    return (
        <>
            <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-1">Apps</h2>
                <p className="text-muted-foreground">Customize app appearance and icon packs.</p>
            </div>

            <div className="space-y-6">
                {/* Icon Packs */}
                {preferences.iconPacks.length > 0 && (
                    <div className="p-6 rounded-xl border bg-card space-y-4">
                        <Label className="text-base">Icon Pack</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Default Icons */}
                            <button
                                onClick={() => setActiveIconPack("")}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                    !preferences.activeIconPack
                                        ? "border-primary bg-primary/10"
                                        : "border-border hover:border-primary/50"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <ImageIcon className="w-5 h-5" />
                                    <div className="text-left flex-1">
                                        <p className="font-semibold">Default Icons</p>
                                        <p className="text-xs text-muted-foreground">Original app icons</p>
                                    </div>
                                    {!preferences.activeIconPack && <Check className="w-5 h-5 text-primary" />}
                                </div>
                            </button>

                            {/* Custom Icon Packs */}
                            {preferences.iconPacks.map((pack: any) => (
                                <button
                                    key={pack.id}
                                    onClick={() => setActiveIconPack(pack.id)}
                                    className={`p-4 rounded-xl border-2 transition-all ${
                                        preferences.activeIconPack === pack.id
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:border-primary/50"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <ImageIcon className="w-5 h-5" />
                                        <div className="text-left flex-1">
                                            <p className="font-semibold">{pack.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {Object.keys(pack.icons).length} icons
                                            </p>
                                        </div>
                                        {preferences.activeIconPack === pack.id && <Check className="w-5 h-5 text-primary" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Global App Settings */}
                <div className="p-6 rounded-xl border bg-card space-y-6">
                    <Label className="text-base">Global App Settings</Label>
                    
                    {/* Global Name Color */}
                    <div className="space-y-3">
                        <Label className="text-sm">App Name Color (All Apps)</Label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={preferences.apps?.globalNameColor || "#ffffff"}
                                onChange={(e) => updateGlobalColor(e.target.value)}
                                className="h-12 w-20 rounded cursor-pointer"
                            />
                            <Input
                                value={preferences.apps?.globalNameColor || "#ffffff"}
                                onChange={(e) => updateGlobalColor(e.target.value)}
                                placeholder="#ffffff"
                                className="flex-1"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">This color will be applied to all app names</p>
                    </div>

                    {/* Show Labels */}
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-sm">Show App Labels</Label>
                            <p className="text-xs text-muted-foreground">Toggle visibility of app names below icons</p>
                        </div>
                        <Switch
                            checked={preferences.apps?.showLabels ?? true}
                            onCheckedChange={updateShowLabels}
                        />
                    </div>
                </div>

                {/* App Customization */}
                <div className="p-6 rounded-xl border bg-card space-y-4">
                    <Label className="text-base">Preview</Label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {APPS.slice(0, 6).map((app) => (
                            <div key={app.id} className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 flex items-center justify-center">
                                    {app.icon}
                                </div>
                                {preferences.apps?.showLabels && (
                                    <p 
                                        className="text-xs font-medium text-center line-clamp-1"
                                        style={{ color: preferences.apps?.globalNameColor || "#ffffff" }}
                                    >
                                        {app.title}
                                    </p>
                                )}
                            </div>
                        ))}
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
                                Save App Settings
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
