import { X, ChevronDown, ChevronRight, GitBranch, Play } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FileNode } from "../types";
import { VSCodeTheme } from "../themes";

interface SidebarProps {
    isOpen: boolean;
    isMobile: boolean;
    activeView: "files" | "search" | "git" | "debug";
    fileTree: FileNode[];
    expandedFolders: Set<string>;
    activeTab: string;
    theme: VSCodeTheme;
    onClose: () => void;
    onToggleFolder: (folderName: string) => void;
    onOpenFile: (fileName: string) => void;
}

export function Sidebar({
    isOpen,
    isMobile,
    activeView,
    fileTree,
    expandedFolders,
    activeTab,
    theme,
    onClose,
    onToggleFolder,
    onOpenFile,
}: SidebarProps) {
    const getFileIcon = (icon?: string) => {
        const colors: Record<string, string> = {
            tsx: "text-[#3178c6]",
            ts: "text-[#3178c6]",
            jsx: "text-[#61dafb]",
            js: "text-[#f7df1e]",
            css: "text-[#264de4]",
            json: "text-[#f7df1e]",
            md: "text-[#519aba]",
            ico: "text-[#858585]",
            png: "text-[#858585]",
        };
        return colors[icon || ""] || "text-[#858585]";
    };

    const renderFileTree = (nodes: FileNode[], depth = 0): React.ReactNode => {
        return nodes.map((node) => {
            const isExpanded = expandedFolders.has(node.name);
            const isActive = activeTab === node.name;

            return (
                <div key={node.name}>
                    <div
                        className="flex items-center gap-1.5 py-1 px-2 cursor-pointer text-[13px] transition-colors"
                        style={{
                            paddingLeft: `${depth * 12 + 8}px`,
                            backgroundColor: isActive ? theme.colors.selection : 'transparent',
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = theme.colors.hover;
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onClick={() => node.type === "folder" ? onToggleFolder(node.name) : onOpenFile(node.name)}
                    >
                        {node.type === "folder" ? (
                            <>
                                {isExpanded ? (
                                    <ChevronDown className="w-3 h-3" style={{ color: theme.colors.sidebarForeground }} />
                                ) : (
                                    <ChevronRight className="w-3 h-3" style={{ color: theme.colors.sidebarForeground }} />
                                )}
                                <span style={{ color: theme.colors.sidebarForeground }}>{node.name}</span>
                            </>
                        ) : (
                            <>
                                <span className={cn("text-[10px] font-bold", getFileIcon(node.icon))}>
                                    {node.icon?.toUpperCase() || "FILE"}
                                </span>
                                <span style={{ color: theme.colors.sidebarForeground }}>{node.name}</span>
                            </>
                        )}
                    </div>
                    {node.type === "folder" && isExpanded && node.children && (
                        <div>{renderFileTree(node.children, depth + 1)}</div>
                    )}
                </div>
            );
        });
    };

    if (!isOpen) return null;

    return (
        <div
            className={cn(
                "flex flex-col shrink-0",
                isMobile ? "absolute left-12 top-0 bottom-0 z-10 w-64 shadow-2xl" : "w-64"
            )}
            style={{
                background: theme.colors.sidebar,
                borderRight: `1px solid ${theme.colors.border}`,
            }}
        >
            <div
                className="h-9 px-3 flex items-center justify-between text-[11px] font-semibold tracking-wide uppercase"
                style={{
                    color: theme.colors.sidebarForeground,
                    borderBottom: `1px solid ${theme.colors.border}`,
                    opacity: 0.7,
                }}
            >
                <span>
                    {activeView === "files" && "Explorer"}
                    {activeView === "search" && "Search"}
                    {activeView === "git" && "Source Control"}
                    {activeView === "debug" && "Run and Debug"}
                </span>
                {isMobile && (
                    <button
                        onClick={onClose}
                        className="p-1 rounded transition-colors"
                        style={{ color: theme.colors.sidebarForeground }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.hover}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            <ScrollArea className="flex-1">
                {activeView === "files" && (
                    <div className="py-2">
                        <div
                            className="flex items-center gap-1 py-1 px-2 text-[11px] font-bold tracking-wide uppercase"
                            style={{ color: theme.colors.sidebarForeground, opacity: 0.7 }}
                        >
                            <ChevronDown className="w-3 h-3" />
                            <span>PORTFOLIO</span>
                        </div>
                        <div className="mt-1">
                            {renderFileTree(fileTree)}
                        </div>
                    </div>
                )}

                {activeView === "search" && (
                    <div className="p-3 space-y-3">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full outline-none px-2 py-1 text-[13px] rounded transition-colors"
                            style={{
                                background: theme.colors.hover,
                                border: `1px solid ${theme.colors.border}`,
                                color: theme.colors.sidebarForeground,
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Replace"
                            className="w-full outline-none px-2 py-1 text-[13px] rounded transition-colors"
                            style={{
                                background: theme.colors.hover,
                                border: `1px solid ${theme.colors.border}`,
                                color: theme.colors.sidebarForeground,
                            }}
                        />
                        <div className="text-[11px] pt-2" style={{ color: theme.colors.sidebarForeground, opacity: 0.6 }}>
                            No results found
                        </div>
                    </div>
                )}

                {activeView === "git" && (
                    <div className="p-3">
                        <div className="text-[13px] mb-3" style={{ color: theme.colors.sidebarForeground }}>
                            <div className="flex items-center gap-2 mb-2">
                                <GitBranch className="w-4 h-4" />
                                <span>main</span>
                            </div>
                            <div className="text-[11px]" style={{ opacity: 0.6 }}>
                                No changes detected
                            </div>
                        </div>
                    </div>
                )}

                {activeView === "debug" && (
                    <div className="p-3">
                        <button
                            className="w-full text-white px-3 py-2 rounded text-[13px] flex items-center justify-center gap-2 transition-colors"
                            style={{ background: theme.colors.statusBar }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            <Play className="w-4 h-4" />
                            Run and Debug
                        </button>
                        <div className="text-[11px] mt-3" style={{ color: theme.colors.sidebarForeground, opacity: 0.6 }}>
                            To customize Run and Debug, create a launch.json file.
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
