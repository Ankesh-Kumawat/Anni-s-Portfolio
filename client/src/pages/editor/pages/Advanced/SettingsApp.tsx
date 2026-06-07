import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import type { EditorData } from "../../types";

interface SettingsAppProps {
    data: EditorData;
}

export default function SettingsApp({ data }: SettingsAppProps) {
    return (
        <div className="bg-card rounded-2xl border-2 border shadow-md overflow-hidden">
            <div className="bg-muted p-6 border-b">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Settings className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground">Settings App</h3>
                        <p className="text-sm text-muted-foreground">Account settings configuration</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="settings-name" className="text-sm font-semibold text-foreground">
                            Account Name <span className="text-xs text-green-600">(auto-filled)</span>
                        </Label>
                        <Input
                            id="settings-name"
                            value={data.settings.account.name}
                            disabled
                            className="bg-muted border h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="settings-role" className="text-sm font-semibold text-foreground">
                            Account Role <span className="text-xs text-green-600">(auto-filled)</span>
                        </Label>
                        <Input
                            id="settings-role"
                            value={data.settings.account.role}
                            disabled
                            className="bg-muted border h-11"
                        />
                    </div>
                </div>

                {data.settings.account.avatar && (
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Avatar Preview</Label>
                        <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-xl border-2 border-primary">
                            <img
                                src={data.settings.account.avatar}
                                alt="Avatar"
                                className="w-20 h-20 rounded-full object-cover border-4 border-background shadow-lg"
                            />
                            <div>
                                <p className="font-semibold text-foreground">{data.settings.account.name}</p>
                                <p className="text-sm text-muted-foreground">{data.settings.account.role}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
