import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useBrightness } from "@/lib/brightness-context";
import { cn } from "@/lib/utils";

interface ThemeCardProps {
    theme: string;
    currentTheme: string;
    setTheme: (theme: any) => void;
    name: string;
    color: string;
    bg: string;
}

function ThemeCard({ theme, currentTheme, setTheme, name, color, bg }: ThemeCardProps) {
    const isActive = currentTheme === theme;

    return (
        <div
            className={cn(
                "cursor-pointer border-2 rounded-lg p-2 hover:bg-accent/50 transition-all text-center space-y-2 relative",
                isActive ? "border-primary bg-accent/20" : "border-transparent"
            )}
            onClick={() => setTheme(theme)}
        >
            <div
                className="h-16 rounded border shadow-sm mx-auto w-full relative overflow-hidden"
                style={{ backgroundColor: bg }}
            >
                <div
                    className="absolute top-2 left-2 right-2 h-2 rounded-sm"
                    style={{ backgroundColor: color }}
                />
                {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Check className="w-6 h-6 text-white" />
                    </div>
                )}
            </div>
            <span className="text-xs font-medium">{name}</span>
        </div>
    );
}

export function DisplaySettings() {
    const { theme, setTheme } = useTheme();
    const { brightness, setBrightness } = useBrightness();

    return (
        <>
            <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-1">Display & Appearance</h2>
                <p className="text-muted-foreground">Customize your viewing experience.</p>
            </div>

            <div className="space-y-6">
                {/* Basic Themes */}
                <div className="p-6 rounded-xl border bg-card space-y-4">
                    <Label className="text-base">Basic Themes</Label>
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

                {/* Dark Themes */}
                <div className="p-6 rounded-xl border bg-card space-y-4">
                    <Label className="text-base">Dark Themes</Label>
                    <div className="grid grid-cols-3 gap-3">
                        <ThemeCard theme="soft-dark" currentTheme={theme} setTheme={setTheme} name="Soft Dark" color="#7c3aed" bg="#2b2d3a" />
                        <ThemeCard theme="forest-green" currentTheme={theme} setTheme={setTheme} name="Forest" color="#10b981" bg="#1a2f23" />
                        <ThemeCard theme="ocean-blue" currentTheme={theme} setTheme={setTheme} name="Ocean" color="#3b82f6" bg="#1a2332" />
                        <ThemeCard theme="sunset-orange" currentTheme={theme} setTheme={setTheme} name="Sunset" color="#f97316" bg="#2d1f1a" />
                        <ThemeCard theme="lavender-dream" currentTheme={theme} setTheme={setTheme} name="Lavender" color="#a855f7" bg="#2a2438" />
                    </div>
                </div>

                {/* Light Themes */}
                <div className="p-6 rounded-xl border bg-card space-y-4">
                    <Label className="text-base">Light Themes</Label>
                    <div className="grid grid-cols-3 gap-3">
                        <ThemeCard theme="cream-chocolate" currentTheme={theme} setTheme={setTheme} name="Cream" color="#8d6e63" bg="#faf8f3" />
                        <ThemeCard theme="rose-gold" currentTheme={theme} setTheme={setTheme} name="Rose Gold" color="#ec4899" bg="#fff5f7" />
                        <ThemeCard theme="mint-fresh" currentTheme={theme} setTheme={setTheme} name="Mint" color="#10b981" bg="#f0fdf4" />
                        <ThemeCard theme="peachy-keen" currentTheme={theme} setTheme={setTheme} name="Peachy" color="#f97316" bg="#fff7ed" />
                        <ThemeCard theme="sky-blue" currentTheme={theme} setTheme={setTheme} name="Sky" color="#0ea5e9" bg="#f0f9ff" />
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
