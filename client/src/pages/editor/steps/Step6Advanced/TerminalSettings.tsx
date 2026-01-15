import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Terminal } from "lucide-react";
import type { EditorData } from "../../types";

interface TerminalSettingsProps {
    data: EditorData;
}

export default function TerminalSettings({ data }: TerminalSettingsProps) {
    return (
        <div className="bg-card rounded-2xl border-2 border shadow-md overflow-hidden">
            <div className="bg-muted p-6 border-b">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Terminal className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground">Terminal Settings</h3>
                        <p className="text-sm text-muted-foreground">Configuration for Terminal app</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="terminal-username" className="text-sm font-semibold text-foreground">
                            Username <span className="text-xs text-primary">(auto-generated)</span>
                        </Label>
                        <Input
                            id="terminal-username"
                            value={data.terminal.username}
                            disabled
                            className="bg-muted border h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="terminal-role" className="text-sm font-semibold text-foreground">
                            User Role <span className="text-xs text-primary">(auto-filled)</span>
                        </Label>
                        <Input
                            id="terminal-role"
                            value={data.terminal.userRole}
                            disabled
                            className="bg-muted border h-11"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">
                        Technical Skills <span className="text-xs text-primary">({data.terminal.skills.technical.length} from Step 1)</span>
                    </Label>
                    <div className="flex flex-wrap gap-2 p-4 bg-muted rounded-xl border-2 border min-h-[80px]">
                        {data.terminal.skills.technical.length > 0 ? (
                            data.terminal.skills.technical.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="px-3 py-1">
                                    {skill}
                                </Badge>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No skills added yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
