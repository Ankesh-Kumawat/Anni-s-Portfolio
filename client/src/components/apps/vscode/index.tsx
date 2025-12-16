import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ActivityBar } from "./components/ActivityBar";
import { Sidebar } from "./components/Sidebar";
import { EditorArea } from "./components/EditorArea";
import { StatusBar } from "./components/StatusBar";
import { SettingsPanel } from "./components/SettingsPanel";
import { FILE_TREE } from "./constants";
import { FileNode } from "./types";
import { getThemeById } from "./themes";

export default function VSCode() {
    const [activeTab, setActiveTab] = useState("App.tsx");
    const [openTabs, setOpenTabs] = useState(["App.tsx", "package.json", "index.css"]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["src", "components"]));
    const [activeView, setActiveView] = useState<"files" | "search" | "git" | "debug">("files");
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [themeId, setThemeId] = useState("dark-plus");
    const isMobile = useIsMobile();

    const toggleFolder = (folderName: string) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(folderName)) {
                next.delete(folderName);
            } else {
                next.add(folderName);
            }
            return next;
        });
    };

    const openFile = (fileName: string) => {
        if (!openTabs.includes(fileName)) {
            setOpenTabs([...openTabs, fileName]);
        }
        setActiveTab(fileName);
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const closeTab = (fileName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newTabs = openTabs.filter(tab => tab !== fileName);
        setOpenTabs(newTabs);
        if (activeTab === fileName && newTabs.length > 0) {
            setActiveTab(newTabs[newTabs.length - 1]);
        }
    };

    const getFileContent = (fileName: string): string => {
        const findFile = (nodes: FileNode[]): string | undefined => {
            for (const node of nodes) {
                if (node.name === fileName && node.type === "file") {
                    return node.content;
                }
                if (node.children) {
                    const found = findFile(node.children);
                    if (found) return found;
                }
            }
        };
        return findFile(FILE_TREE) || "// File content not available";
    };

    const currentTheme = getThemeById(themeId);

    return (
        <div
            className="flex flex-col h-full font-mono text-[13px] overflow-hidden relative"
            style={{
                background: currentTheme.colors.background,
                color: currentTheme.colors.foreground,
            }}
        >
            <div className="flex flex-1 overflow-hidden">
                <ActivityBar
                    activeView={activeView}
                    theme={currentTheme}
                    onViewChange={setActiveView}
                    onSidebarToggle={() => setSidebarOpen(true)}
                    onSettingsClick={() => setSettingsOpen(true)}
                />

                <Sidebar
                    isOpen={sidebarOpen}
                    isMobile={isMobile}
                    activeView={activeView}
                    fileTree={FILE_TREE}
                    expandedFolders={expandedFolders}
                    activeTab={activeTab}
                    theme={currentTheme}
                    onClose={() => setSidebarOpen(false)}
                    onToggleFolder={toggleFolder}
                    onOpenFile={openFile}
                />

                <EditorArea
                    isMobile={isMobile}
                    openTabs={openTabs}
                    activeTab={activeTab}
                    theme={currentTheme}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    onTabChange={setActiveTab}
                    onTabClose={closeTab}
                    getFileContent={getFileContent}
                />
            </div>

            <StatusBar theme={currentTheme} />

            <SettingsPanel
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                themeId={themeId}
                theme={currentTheme}
                onThemeChange={setThemeId}
            />
        </div>
    );
}
