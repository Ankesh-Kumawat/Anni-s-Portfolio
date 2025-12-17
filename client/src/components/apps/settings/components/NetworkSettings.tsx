import { Wifi } from "lucide-react";

export function NetworkSettings() {
    return (
        <>
            <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-1">Network & Internet</h2>
                <p className="text-muted-foreground">Manage network connections and settings.</p>
            </div>

            <div className="flex flex-col items-center justify-center py-16 px-6 rounded-xl border bg-card">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Wifi className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground text-center max-w-md">
                    Network settings and WiFi management features are currently under development.
                </p>
            </div>
        </>
    );
}
