import { Menu, X, File } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs, dracula, nord, oneDark, nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { VSCodeTheme } from "../themes";

interface EditorAreaProps {
    isMobile: boolean;
    openTabs: string[];
    activeTab: string;
    theme: VSCodeTheme;
    onToggleSidebar: () => void;
    onTabChange: (tab: string) => void;
    onTabClose: (tab: string, e: React.MouseEvent) => void;
    getFileContent: (fileName: string) => string;
}

export function EditorArea({
    isMobile,
    openTabs,
    activeTab,
    theme,
    onToggleSidebar,
    onTabChange,
    onTabClose,
    getFileContent,
}: EditorAreaProps) {
    const getLanguage = (fileName: string) => {
        if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) return 'tsx';
        if (fileName.endsWith('.ts')) return 'typescript';
        if (fileName.endsWith('.js')) return 'javascript';
        if (fileName.endsWith('.css')) return 'css';
        if (fileName.endsWith('.json')) return 'json';
        if (fileName.endsWith('.md')) return 'markdown';
        if (fileName.endsWith('.html')) return 'html';
        return 'typescript';
    };

    const getSyntaxTheme = () => {
        switch (theme.id) {
            case "light-plus":
            case "github-light":
                return vs;
            case "dracula":
                return dracula;
            case "nord":
                return nord;
            case "one-dark-pro":
                return oneDark;
            case "night-owl":
                return nightOwl;
            default:
                return vscDarkPlus;
        }
    };

    return (
        <div className="flex-1 flex flex-col min-w-0" style={{ background: theme.colors.editor }}>
            {/* Top Bar with Menu Toggle */}
            <div
                className="h-9 flex items-center px-2 gap-2 shrink-0"
                style={{
                    background: theme.colors.tabBar,
                    borderBottom: `1px solid ${theme.colors.border}`,
                }}
            >
                {isMobile && (
                    <button
                        onClick={onToggleSidebar}
                        className="p-1 rounded transition-colors"
                        style={{ color: theme.colors.foreground }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.hover}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <Menu className="w-4 h-4" />
                    </button>
                )}

                {/* Tabs */}
                <div className="flex-1 overflow-x-auto">
                    <div className="flex">
                        {openTabs.map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <div
                                    key={tab}
                                    onClick={() => onTabChange(tab)}
                                    className="flex items-center gap-2 px-3 h-9 text-[13px] cursor-pointer min-w-[120px] group transition-colors"
                                    style={{
                                        background: isActive ? theme.colors.tabActive : theme.colors.tabInactive,
                                        color: isActive ? theme.colors.editorForeground : `${theme.colors.foreground}88`,
                                        borderRight: `1px solid ${theme.colors.border}`,
                                        borderTop: isActive ? `2px solid ${theme.colors.statusBar}` : 'none',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) e.currentTarget.style.backgroundColor = theme.colors.hover;
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) e.currentTarget.style.backgroundColor = theme.colors.tabInactive;
                                    }}
                                >
                                    <span className="truncate flex-1">{tab}</span>
                                    <button
                                        onClick={(e) => onTabClose(tab, e)}
                                        className="rounded p-0.5 transition-opacity"
                                        style={{
                                            opacity: isActive ? 1 : 0,
                                            color: theme.colors.foreground,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = theme.colors.selection;
                                            e.currentTarget.style.opacity = '1';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            if (!isActive) e.currentTarget.style.opacity = '0';
                                        }}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Code Editor */}
            <ScrollArea className="flex-1">
                {openTabs.length > 0 ? (
                    <SyntaxHighlighter
                        language={getLanguage(activeTab)}
                        style={getSyntaxTheme()}
                        showLineNumbers={true}
                        customStyle={{
                            margin: 0,
                            padding: '16px',
                            background: theme.colors.editor,
                            fontSize: '13px',
                            lineHeight: '1.6',
                        }}
                        lineNumberStyle={{
                            minWidth: '3em',
                            paddingRight: '1em',
                            color: theme.type === 'dark' ? '#858585' : '#999999',
                            userSelect: 'none',
                        }}
                    >
                        {getFileContent(activeTab)}
                    </SyntaxHighlighter>
                ) : (
                    <div
                        className="flex items-center justify-center h-full"
                        style={{ color: `${theme.colors.foreground}88` }}
                    >
                        <div className="text-center">
                            <File className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>No file open</p>
                            <p className="text-[11px] mt-2">Select a file from the explorer</p>
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
