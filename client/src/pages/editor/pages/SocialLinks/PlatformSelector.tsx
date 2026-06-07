import { Check, Sparkles } from "lucide-react";
import { POPULAR_PLATFORMS } from "./platforms";

interface PlatformSelectorProps {
    isPlatformAdded: (platformValue: string) => boolean;
    togglePlatform: (platformValue: string) => void;
}

export default function PlatformSelector({ isPlatformAdded, togglePlatform }: PlatformSelectorProps) {
    return (
        <div className="bg-card rounded-2xl p-8 border-2 border shadow-md">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground">Select Platforms</h3>
                    <p className="text-sm text-muted-foreground">Click to add or remove platforms</p>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
                {POPULAR_PLATFORMS.map((platform) => {
                    const Icon = platform.icon;
                    const isAdded = isPlatformAdded(platform.value);
                    return (
                        <button
                            key={platform.value}
                            onClick={() => togglePlatform(platform.value)}
                            className={`relative p-3 rounded-xl border-2 transition-all text-center group ${
                                isAdded
                                    ? "border-primary bg-primary/10 shadow-lg scale-105"
                                    : "border bg-card hover:border-primary hover:shadow-md hover:scale-105"
                            }`}
                        >
                            {isAdded && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg z-10">
                                    <Check className="w-4 h-4 text-primary-foreground" />
                                </div>
                            )}
                            <div className={`w-14 h-14 rounded-xl ${platform.color} flex items-center justify-center mx-auto mb-2 shadow-md`}>
                                <Icon className="w-8 h-8 text-white" />
                            </div>
                            <p className={`text-[10px] font-bold leading-tight ${isAdded ? "text-primary" : "text-foreground"}`}>
                                {platform.label}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
