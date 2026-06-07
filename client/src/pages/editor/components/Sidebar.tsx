import { User, Mail, Link2, FolderKanban, FileText, Music, Youtube, Settings, Smartphone, Download, Terminal } from "lucide-react";

const NAV_ITEMS = [
    { id: "personal", label: "Profile", icon: User },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "social", label: "Social Links", icon: Link2 },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "notepad", label: "Notepad", icon: FileText },
    { id: "advanced", label: "Settings", icon: Terminal },
    { id: "music", label: "Music", icon: Music },
    { id: "youtube", label: "YouTube", icon: Youtube },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "apps", label: "Apps", icon: Smartphone },
    { id: "review", label: "Review", icon: Download },
];

interface SidebarProps {
    activeSection: string;
    onNavigate: (section: string) => void;
}

export default function Sidebar({ activeSection, onNavigate }: SidebarProps) {
    return (
        <div className="py-3 px-2">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">Sections</p>
            <nav className="space-y-0.5">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = activeSection === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-2 px-2.5 py-[6px] rounded-md text-left text-[13px] transition-all ${
                                active
                                    ? "bg-primary text-primary-foreground font-medium shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                        >
                            <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
