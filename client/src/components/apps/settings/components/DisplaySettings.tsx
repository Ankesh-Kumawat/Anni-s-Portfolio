import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function DisplaySettings() {
    const { theme, setTheme } = useTheme();
    const [brightness, setBrightness] = useState([100]);

    return (
        <>
            <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-1">Display & Appearance</h2>
                <p className="text-muted-foreground">Customize your viewing experience.</p>
            </div>

            <div className="space-y-6">
                <div className="p-6 rounded-xl border bg-card space-y-4">
                    <Label className="text-base">Appearance</Label>
                    <div className="grid grid-cols-3 gap-4">
                        <div
                            className={cn(
                                "cursor-pointer border-2 rounded-lg p-2 hover:bg-accent/50 transition-all text-center space-y-2",
                                theme === 'light' ? "border-primary bg-accent/20" : "border-transparent"
                            )}
                            onClick={() => setTheme('light')}
                        >
                            <div className="h-16 bg-[#f0f0f0] rounded border shadow-sm mx-auto w-full relative overflow-hidden">
                                <div className="absolute top-2 left-2 w-full h-2 bg-white rounded-sm shadow-sm" />
                                <Sun className="absolute bottom-2 right-2 w-4 h-4 text-orange-500" />
                            </div>
                            <span className="text-xs font-medium">Light</span>
                        </div>
                        <div
                            className={cn(
                                "cursor-pointer border-2 rounded-lg p-2 hover:bg-accent/50 transition-all text-center space-y-2",
                                theme === 'dark' ? "border-primary bg-accent/20" : "border-transparent"
                            )}
                            onClick={() => setTheme('dark')}
                        >
                            <div className="h-16 bg-[#1a1a1a] rounded border border-gray-700 shadow-sm mx-auto w-full relative overflow-hidden">
                                <div className="absolute top-2 left-2 w-full h-2 bg-gray-800 rounded-sm" />
                                <Moon className="absolute bottom-2 right-2 w-4 h-4 text-blue-400" />
                            </div>
                            <span className="text-xs font-medium">Dark</span>
                        </div>
                        <div
                            className={cn(
                                "cursor-pointer border-2 rounded-lg p-2 hover:bg-accent/50 transition-all text-center space-y-2",
                                theme === 'system' ? "border-primary bg-accent/20" : "border-transparent"
                            )}
                            onClick={() => setTheme('system')}
                        >
                            <div className="h-16 bg-gradient-to-br from-[#f0f0f0] to-[#1a1a1a] rounded border shadow-sm mx-auto w-full relative overflow-hidden">
                                <Laptop className="absolute bottom-2 right-2 w-4 h-4 text-foreground" />
                            </div>
                            <span className="text-xs font-medium">Auto</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl border bg-card space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Label>Brightness</Label>
                            <span className="text-sm text-muted-foreground">{brightness}%</span>
                        </div>
                        <Slider value={brightness} onValueChange={setBrightness} max={100} step={1} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Night Shift</Label>
                            <p className="text-sm text-muted-foreground">Warmer colors after sunset</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </div>
            </div>
        </>
    );
}
