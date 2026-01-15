import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Info, Save, Loader2 } from "lucide-react";

interface EmailFieldProps {
    email: string;
    onEmailChange: (value: string) => void;
    onSave: (field: string) => void;
    savingField: string | null;
}

export default function EmailField({ email, onEmailChange, onSave, savingField }: EmailFieldProps) {
    return (
        <div className="bg-card rounded-2xl p-8 border-2 border shadow-md">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground">Email Address</h3>
                    <p className="text-sm text-muted-foreground">Primary contact method</p>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                </Label>
                <div className="flex gap-2">
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        placeholder="your.email@example.com"
                        className="h-12 text-base flex-1"
                    />
                    <Button
                        onClick={() => onSave("Email")}
                        disabled={savingField === "Email" || !email}
                        size="lg"
                        className="gap-2"
                    >
                        {savingField === "Email" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                    </Button>
                </div>
                <div className="flex items-start gap-2 mt-2">
                    <Info className="w-4 h-4 text-muted-foreground/60 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">This will be used for contact forms and displayed on your portfolio</p>
                </div>
            </div>
        </div>
    );
}
