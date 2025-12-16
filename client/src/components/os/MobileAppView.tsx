import React from "react";
import { ArrowLeft } from "lucide-react";
import { useOS, AppId } from "@/lib/os-context";
import { cn } from "@/lib/utils";

interface MobileAppViewProps {
    id: AppId;
    title: string;
    children: React.ReactNode;
}

export function MobileAppView({ id, title, children }: MobileAppViewProps) {
    const { closeWindow } = useOS();

    return (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in slide-in-from-right duration-300">
            {/* Mobile Header/System Bar */}
            <div className="h-14 bg-muted/80 backdrop-blur-sm border-b flex items-center px-4 shrink-0 shadow-sm">
                <button
                    onClick={() => closeWindow(id)}
                    className="h-10 w-10 rounded-full hover:bg-accent active:scale-95 flex items-center justify-center transition-all -ml-2"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <span className="text-base font-semibold ml-2 text-foreground truncate">
                    {title}
                </span>
            </div>

            {/* App Content - Full screen with scroll */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
                {children}
            </div>
        </div>
    );
}
