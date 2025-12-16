import { Info } from "lucide-react";

export function PlaceholderSettings() {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Info className="w-12 h-12 opacity-20 mb-4" />
            <p>This settings panel is under development.</p>
        </div>
    );
}
