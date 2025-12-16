import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTaskbar } from "@/lib/taskbar-context";
import { cn } from "@/lib/utils";

export function TaskbarSettings() {
    const { behavior, setBehavior } = useTaskbar();

    const options = [
        {
            value: "always-show",
            label: "Always Show",
            description: "Taskbar is visible on desktop, hides when apps are open"
        },
        {
            value: "auto-hide",
            label: "Auto-hide",
            description: "Show taskbar when you hover near the bottom of the screen"
        },
        {
            value: "always-hide",
            label: "Always Hide",
            description: "Taskbar is always hidden (use Start menu from desktop icons)"
        }
    ];

    return (
        <>
            <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-1">Taskbar</h2>
                <p className="text-muted-foreground">Customize taskbar behavior and appearance.</p>
            </div>

            <div className="space-y-6">
                <div className="p-6 rounded-xl border bg-card space-y-3">
                    <Label className="text-base">Taskbar Behavior</Label>
                    <RadioGroup value={behavior} onValueChange={(value) => setBehavior(value as any)}>
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => setBehavior(option.value as any)}
                                className={cn(
                                    "flex items-start space-x-3 space-y-0 p-4 rounded-lg cursor-pointer transition-all border-2",
                                    behavior === option.value
                                        ? "bg-primary/10 border-primary"
                                        : "border-transparent hover:bg-accent/50"
                                )}
                            >
                                <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                                <div className="flex-1">
                                    <Label htmlFor={option.value} className="cursor-pointer font-medium">
                                        {option.label}
                                    </Label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {option.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border">
                    <p className="text-sm text-muted-foreground">
                        <strong>Tip:</strong> You can always access apps through desktop icons or the Start menu,
                        regardless of taskbar visibility settings.
                    </p>
                </div>
            </div>
        </>
    );
}
