import { Badge } from "@/components/ui/badge";
import { Sparkles, Check } from "lucide-react";
import type { EditorData } from "../../types";

interface AdvancedStatsProps {
    data: EditorData;
}

export default function AdvancedStats({ data }: AdvancedStatsProps) {
    const isTerminalReady = !!(data.terminal.username && data.terminal.userRole);
    const isDatabaseReady = !!(data.database.user.name && data.database.user.email);
    const isSettingsReady = !!(data.settings.account.name && data.settings.account.role);

    return (
        <div className="bg-card rounded-2xl p-6 border-2 border shadow-md">
            <div className="flex items-center gap-2 mb-5">
                <Sparkles className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-foreground">Auto-Generated Data</h4>
            </div>
            <div className="space-y-4">
                <div className={`flex items-center justify-between p-4 rounded-xl border ${isTerminalReady ? 'bg-primary/10 border-primary' : 'bg-muted border'}`}>
                    <span className={`text-sm font-medium ${isTerminalReady ? 'text-primary' : 'text-foreground'}`}>Terminal</span>
                    <Badge className={isTerminalReady ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}>
                        {isTerminalReady && <Check className="w-3 h-3 mr-1" />}
                        {isTerminalReady ? 'Ready' : 'Waiting'}
                    </Badge>
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl border ${isDatabaseReady ? 'bg-primary/10 border-primary' : 'bg-muted border'}`}>
                    <span className={`text-sm font-medium ${isDatabaseReady ? 'text-primary' : 'text-foreground'}`}>Database</span>
                    <Badge className={isDatabaseReady ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}>
                        {isDatabaseReady && <Check className="w-3 h-3 mr-1" />}
                        {isDatabaseReady ? 'Ready' : 'Waiting'}
                    </Badge>
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl border ${isSettingsReady ? 'bg-primary/10 border-primary' : 'bg-muted border'}`}>
                    <span className={`text-sm font-medium ${isSettingsReady ? 'text-primary' : 'text-foreground'}`}>Settings</span>
                    <Badge className={isSettingsReady ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}>
                        {isSettingsReady && <Check className="w-3 h-3 mr-1" />}
                        {isSettingsReady ? 'Ready' : 'Waiting'}
                    </Badge>
                </div>
            </div>
        </div>
    );
}
