import { User, Mail, Link2, FolderKanban, FileText, Music, Youtube, Settings, Smartphone, Layers, Terminal, ChevronRight } from "lucide-react";

const NAV_ITEMS = [
    { id: "personal", label: "Profile", icon: User, tone: "coral" },
    { id: "contact", label: "Contact", icon: Mail, tone: "teal" },
    { id: "social", label: "Social Links", icon: Link2, tone: "violet" },
    { id: "projects", label: "Projects", icon: FolderKanban, tone: "amber" },
    { id: "notepad", label: "Notepad", icon: FileText, tone: "mint" },
    { id: "advanced", label: "Settings", icon: Terminal, tone: "ink" },
    { id: "music", label: "Music", icon: Music, tone: "rose" },
    { id: "youtube", label: "YouTube", icon: Youtube, tone: "red" },
    { id: "preferences", label: "Preferences", icon: Settings, tone: "blue" },
    { id: "apps", label: "Apps", icon: Smartphone, tone: "green" },
    { id: "techstacks", label: "Tech Stacks", icon: Layers, tone: "slate" },
];

interface SidebarProps {
    activeSection: string;
    onNavigate: (section: string) => void;
}

export default function Sidebar({ activeSection, onNavigate }: SidebarProps) {
    return (
        <div className="editor-nav-wrap">
            <p className="editor-nav-label">Sections</p>
            <nav className="editor-nav">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = activeSection === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            data-active={active}
                            data-tone={item.tone}
                            className="editor-nav-item"
                        >
                            <span className="editor-nav-icon">
                                <Icon className="h-3.5 w-3.5" />
                            </span>
                            <span className="truncate">{item.label}</span>
                            <ChevronRight className="editor-nav-arrow" />
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
