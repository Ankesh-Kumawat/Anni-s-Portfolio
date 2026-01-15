import { Sparkles, Check, Info } from "lucide-react";
import type { StepProps } from "../../types";
import TerminalSettings from "./TerminalSettings";
import DatabaseSettings from "./DatabaseSettings";
import SettingsApp from "./SettingsApp";
import AdvancedStats from "./AdvancedStats";
import { calculateStep6Completion } from "../../lib/completionCalculator";

export default function Step6Advanced({ data }: StepProps) {
    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Header Section */}
            <div className="mb-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-2">Advanced Settings</h2>
                        <p className="text-muted-foreground text-lg">Auto-generated configurations for Terminal, Database & Settings apps</p>
                    </div>
                    <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border-2 border">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Completion</div>
                            <div className="text-2xl font-bold text-primary">
                                {calculateStep6Completion(data)}%
                            </div>
                        </div>
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                </div>
            </div>

            {/* Auto-fill Notice */}
            <div className="mb-8 p-6 bg-card border-2 border-primary/30 rounded-2xl flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                    <p className="text-base font-bold text-foreground">All Settings Auto-Generated</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        These configurations are automatically created from your personal info. No manual editing needed!
                    </p>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-[1fr_380px] gap-8">
                {/* Left Column - Settings */}
                <div className="space-y-6">
                    <TerminalSettings data={data} />
                    <DatabaseSettings data={data} />
                    <SettingsApp data={data} />
                </div>

                {/* Right Column - Info */}
                <div className="space-y-6">
                    <AdvancedStats data={data} />

                    {/* Info Card */}
                    <div className="bg-card rounded-2xl p-6 border-2 border">
                        <div className="flex items-center gap-2 mb-4">
                            <Info className="w-5 h-5 text-primary" />
                            <h4 className="font-bold text-foreground">About This Step</h4>
                        </div>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>All settings are automatically generated from your personal information</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Terminal uses your name and skills</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Database creates user profile & projects table</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Projects synced from Step 4</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Settings app uses your account info</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>No manual editing required!</span>
                            </li>
                        </ul>
                    </div>

                    {/* Help Card */}
                    <div className="bg-card rounded-2xl p-6 border-2 border">
                        <h4 className="font-bold text-foreground mb-3">✨ Smart Features</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">✓</span>
                                <span>Username auto-generated from name</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">✓</span>
                                <span>Skills synced from Step 1</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">✓</span>
                                <span>Email synced from Step 2</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">✓</span>
                                <span>Projects synced from Step 4</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">✓</span>
                                <span>Avatar synced from Step 1</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
