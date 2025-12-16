import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TABS } from "../constants";

interface SettingsSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
    return (
        <div className="w-full md:w-64 bg-background border-b md:border-b-0 md:border-r p-2 md:p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-hidden no-scrollbar shrink-0">
            {TABS.map((tab) => (
                <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "secondary" : "ghost"}
                    className={cn(
                        "justify-start gap-3 whitespace-nowrap",
                        activeTab === tab.id ? "bg-accent" : ""
                    )}
                    onClick={() => onTabChange(tab.id)}
                >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                </Button>
            ))}
        </div>
    );
}
