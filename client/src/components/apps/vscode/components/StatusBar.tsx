import { GitBranch } from "lucide-react";
import { VSCodeTheme } from "../themes";

interface StatusBarProps {
    theme: VSCodeTheme;
}

export function StatusBar({ theme }: StatusBarProps) {
    return (
        <div
            className="h-6 flex items-center justify-between px-3 text-[11px] shrink-0"
            style={{
                background: theme.colors.statusBar,
                color: theme.colors.statusBarForeground,
            }}
        >
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <GitBranch className="w-3 h-3" />
                    <span>main</span>
                </div>
                <div>✓ No Issues</div>
            </div>
            <div className="flex items-center gap-4">
                <div>Ln 1, Col 1</div>
                <div>UTF-8</div>
                <div>TypeScript React</div>
            </div>
        </div>
    );
}
