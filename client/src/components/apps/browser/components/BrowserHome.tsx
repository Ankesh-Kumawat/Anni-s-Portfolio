import React from "react";
import { Globe, ExternalLink, User, Briefcase, Mail, Terminal as TerminalIcon, Code, FileText, Image, Database as DatabaseIcon, Settings as SettingsIcon, Music, Video, Palette, Github, Linkedin, Instagram, Twitter, Youtube, BookOpen, PenTool } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface BrowserHomeProps {
    onNavigate: (url: string) => void;
    onOpenApp?: (appId: string) => void;
}

const iconMap: Record<string, LucideIcon> = {
    portfolio: Palette,
    github: Github,
    linkedin: Linkedin,
    instagram: Instagram,
    twitter: Twitter,
    youtube: Youtube,
    devto: BookOpen,
    medium: PenTool,
};

const colorMap: Record<string, string> = {
    portfolio: "text-purple-500",
    github: "text-gray-800",
    linkedin: "text-blue-600",
    instagram: "text-pink-500",
    twitter: "text-sky-500",
    youtube: "text-red-600",
    devto: "text-gray-700",
    medium: "text-gray-900",
};

const OS_APPS: Array<{ id: string; name: string; icon: LucideIcon; color: string }> = [
    { id: "about", name: "About Me", icon: User, color: "text-blue-500" },
    { id: "projects", name: "Projects", icon: Briefcase, color: "text-purple-500" },
    { id: "contact", name: "Contact", icon: Mail, color: "text-red-500" },
    { id: "terminal", name: "Terminal", icon: TerminalIcon, color: "text-zinc-800" },
    { id: "vscode", name: "VS Code", icon: Code, color: "text-blue-600" },
    { id: "notepad", name: "Notepad", icon: FileText, color: "text-orange-500" },
    { id: "gallery", name: "Gallery", icon: Image, color: "text-pink-500" },
    { id: "db", name: "Database", icon: DatabaseIcon, color: "text-blue-400" },
    { id: "settings", name: "Settings", icon: SettingsIcon, color: "text-gray-500" },
    { id: "spotify", name: "DevTunes", icon: Music, color: "text-green-600" },
    { id: "youtube", name: "YouTube", icon: Video, color: "text-red-600" },
];

export function BrowserHome({ onNavigate, onOpenApp }: BrowserHomeProps) {
    const [socialLinks, setSocialLinks] = React.useState<Array<{ name: string; url: string; platform: string }>>([]);

    React.useEffect(() => {
        fetch(`/data/social.json?t=${Date.now()}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => setSocialLinks(data.links))
            .catch(console.error);
    }, []);

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md">
                        <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Browser Home
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Quick access to apps and links
                        </p>
                    </div>
                </div>

                {/* OS Apps */}
                {onOpenApp && (
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <span className="text-purple-500">🖥️</span>
                            OS Apps
                        </h2>
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                            {OS_APPS.map((app) => {
                                const IconComponent = app.icon;
                                return (
                                    <button
                                        key={app.id}
                                        onClick={() => onOpenApp(app.id)}
                                        className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer active:scale-95 duration-100"
                                    >
                                        <div className="w-14 h-14 p-3 bg-background border shadow-sm rounded-xl group-hover:shadow-md transition-all duration-200 flex items-center justify-center">
                                            <IconComponent className={`w-full h-full ${app.color}`} />
                                        </div>
                                        <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground text-center line-clamp-2 select-none leading-tight">
                                            {app.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Social Media & Links */}
                <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <ExternalLink className="w-5 h-5 text-blue-500" />
                        Social Media & Links
                    </h2>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {socialLinks.map((link) => {
                            const IconComponent = iconMap[link.platform] || Globe;
                            const color = colorMap[link.platform] || "text-gray-500";
                            return (
                                <button
                                    key={link.url}
                                    onClick={() => onNavigate(link.url)}
                                    className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer active:scale-95 duration-100"
                                >
                                    <div className="w-14 h-14 p-3 bg-background border shadow-sm rounded-xl group-hover:shadow-md transition-all duration-200 flex items-center justify-center">
                                        <IconComponent className={`w-full h-full ${color}`} />
                                    </div>
                                    <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground text-center line-clamp-2 select-none leading-tight">
                                        {link.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>💡 Type URLs that support iframe embedding (most sites open externally)</p>
                </div>
            </div>
        </div>
    );
}
