import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { VS_CODE_THEMES, VSCodeTheme } from "../themes";

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    themeId: string;
    theme: VSCodeTheme;
    onThemeChange: (themeId: string) => void;
}

export function SettingsPanel({ isOpen, onClose, themeId, theme, onThemeChange }: SettingsPanelProps) {
    if (!isOpen) return null;

    return (
        <div
            className="absolute inset-0 z-50 flex flex-col"
            style={{ background: theme.colors.background }}
        >
            {/* Header */}
            <div
                className="h-9 flex items-center justify-between px-4"
                style={{
                    background: theme.colors.tabBar,
                    borderBottom: `1px solid ${theme.colors.border}`,
                    color: theme.colors.foreground,
                }}
            >
                <span className="text-[13px] font-medium">Settings</span>
                <button
                    onClick={onClose}
                    className="p-1 rounded transition-colors"
                    style={{ color: theme.colors.foreground }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.hover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-2xl space-y-6">
                    <div>
                        <h2
                            className="text-lg font-semibold mb-1"
                            style={{ color: theme.colors.foreground }}
                        >
                            Color Theme
                        </h2>
                        <p
                            className="text-sm mb-4"
                            style={{ color: theme.colors.foreground, opacity: 0.6 }}
                        >
                            Select your preferred color theme for the editor
                        </p>

                        <RadioGroup value={themeId} onValueChange={onThemeChange}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {VS_CODE_THEMES.map((t) => (
                                    <div
                                        key={t.id}
                                        onClick={() => onThemeChange(t.id)}
                                        className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all border-2"
                                        style={{
                                            backgroundColor: themeId === t.id ? theme.colors.selection : 'transparent',
                                            borderColor: themeId === t.id ? theme.colors.statusBar : 'transparent',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (themeId !== t.id) {
                                                e.currentTarget.style.backgroundColor = theme.colors.hover;
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (themeId !== t.id) {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }
                                        }}
                                    >
                                        <RadioGroupItem value={t.id} id={t.id} />
                                        <div className="flex items-center gap-3 flex-1">
                                            <div
                                                className="w-8 h-8 rounded border-2 shadow-sm"
                                                style={{
                                                    background: t.colors.background,
                                                    borderColor: t.colors.statusBar,
                                                }}
                                            />
                                            <Label
                                                htmlFor={t.id}
                                                className="cursor-pointer font-medium text-sm"
                                                style={{ color: theme.colors.foreground }}
                                            >
                                                {t.name}
                                            </Label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    </div>

                    <div
                        className="pt-6"
                        style={{ borderTop: `1px solid ${theme.colors.border}` }}
                    >
                        <h2
                            className="text-lg font-semibold mb-1"
                            style={{ color: theme.colors.foreground }}
                        >
                            Editor Settings
                        </h2>
                        <p
                            className="text-sm"
                            style={{ color: theme.colors.foreground, opacity: 0.6 }}
                        >
                            Font Size: 13px (default)
                        </p>
                        <p
                            className="text-sm"
                            style={{ color: theme.colors.foreground, opacity: 0.6 }}
                        >
                            Font Family: 'Consolas', 'Courier New', monospace
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
