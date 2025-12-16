import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Volume2, Monitor } from "lucide-react";

export function SoundSettings() {
    const [volume, setVolume] = useState([75]);

    return (
        <>
            <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-1">Sound</h2>
                <p className="text-muted-foreground">Adjust volume and sound settings.</p>
            </div>
            <div className="p-6 rounded-xl border bg-card space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Label>Output Volume</Label>
                        <span className="text-sm text-muted-foreground">{volume}%</span>
                    </div>
                    <Slider value={volume} onValueChange={setVolume} max={100} step={1} />
                </div>
                <div className="space-y-2">
                    <Label>Output Device</Label>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-primary/20">
                            <div className="flex items-center gap-3">
                                <Volume2 className="w-4 h-4" />
                                <span className="text-sm font-medium">MacBook Pro Speakers</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Monitor className="w-4 h-4" />
                                <span className="text-sm">External Monitor</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
