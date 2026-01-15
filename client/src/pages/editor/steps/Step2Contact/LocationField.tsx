import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Info, Save, Loader2, Sparkles } from "lucide-react";

interface LocationFieldProps {
    location: string;
    onLocationChange: (value: string) => void;
    onSave: (field: string) => void;
    savingField: string | null;
    isAutoFilled: boolean;
}

export default function LocationField({ location, onLocationChange, onSave, savingField, isAutoFilled }: LocationFieldProps) {
    return (
        <div className="bg-card rounded-2xl p-8 border-2 border shadow-md">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">Location</h3>
                    <p className="text-sm text-muted-foreground">Where you're based</p>
                </div>
                {isAutoFilled && (
                    <Badge variant="secondary" className="text-xs gap-1 px-3 py-1">
                        <Sparkles className="w-3 h-3" />
                        Auto-filled
                    </Badge>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="contact-location" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location *
                </Label>
                <div className="flex gap-2">
                    <Input
                        id="contact-location"
                        value={location}
                        onChange={(e) => onLocationChange(e.target.value)}
                        placeholder="San Francisco, CA"
                        className="h-12 text-base flex-1"
                    />
                    <Button
                        onClick={() => onSave("Location")}
                        disabled={savingField === "Location" || !location}
                        size="lg"
                        className="gap-2"
                    >
                        {savingField === "Location" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                    </Button>
                </div>
                <div className="flex items-start gap-2 mt-2">
                    <Info className="w-4 h-4 text-muted-foreground/60 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">Your current city and country</p>
                </div>
            </div>
        </div>
    );
}
