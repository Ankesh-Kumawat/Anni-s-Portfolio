import { File, Search, GitBranch, Bug, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { VSCodeTheme } from "../themes";

interface ActivityBarProps {
    activeView: "files" | "search" | "git" | "debug";
    theme: VSCodeTheme;
    onViewChange: (view: "files" | "search" | "git" | "debug") => void;
    onSidebarToggle: () => void;
    onSettingsClick: () => void;
}

export function ActivityBar({ activeView, theme, onViewChange, onSidebarToggle, onSettingsClick }: ActivityBarProps) {
    return (
        <div
            className="w-12 flex flex-col items-center py-4 gap-6 shrink-0"
            style={{
                background: theme.colors.activityBar,
                borderRight: `1px solid ${theme.colors.border}`,
            }}
        >
            <button
                onClick={() => { onViewChange("files"); onSidebarToggle(); }}
                className="w-8 h-8 flex items-center justify-center transition-colors"
                style={{
                    color: activeView === "files" ? theme.colors.activityBarForeground : `${theme.colors.activityBarForeground}88`,
                }}
            >
                <File className="w-5 h-5" />
            </button>
            <button
                onClick={() => { onViewChange("search"); onSidebarToggle(); }}
                className="w-8 h-8 flex items-center justify-center transition-colors"
                style={{
                    color: activeView === "search" ? theme.colors.activityBarForeground : `${theme.colors.activityBarForeground}88`,
                }}
            >
                <Search className="w-5 h-5" />
            </button>
            <button
                onClick={() => { onViewChange("git"); onSidebarToggle(); }}
                className="w-8 h-8 flex items-center justify-center transition-colors"
                style={{
                    color: activeView === "git" ? theme.colors.activityBarForeground : `${theme.colors.activityBarForeground}88`,
                }}
            >
                <GitBranch className="w-5 h-5" />
            </button>
            <button
                onClick={() => { onViewChange("debug"); onSidebarToggle(); }}
                className="w-8 h-8 flex items-center justify-center transition-colors"
                style={{
                    color: activeView === "debug" ? theme.colors.activityBarForeground : `${theme.colors.activityBarForeground}88`,
                }}
            >
                <Bug className="w-5 h-5" />
            </button>
            <div className="flex-1" />
            <button
                onClick={onSettingsClick}
                className="w-8 h-8 flex items-center justify-center transition-colors"
                style={{
                    color: `${theme.colors.activityBarForeground}88`,
                }}
            >
                <Settings className="w-5 h-5" />
            </button>
        </div>
    );
}
