import React, { useState } from "react";
import { Globe, ExternalLink, User, Briefcase, Mail, Terminal as TerminalIcon, Code, FileText, Image, Database as DatabaseIcon, Settings as SettingsIcon, Music, Video, Bookmark, Clock, Zap, Loader2, Phone, Users, Radio } from "lucide-react";
import { LucideIcon } from "lucide-react";
import {
    FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaYoutube,
    FaDribbble, FaBehance, FaMedium, FaDev, FaStackOverflow, FaCodepen,
    FaFigma, FaDiscord, FaTwitch, FaTiktok, FaReddit, FaProductHunt,
    FaTelegram, FaWhatsapp, FaSnapchat, FaSpotify, FaPinterest, FaSlack,
    FaGlobe, FaEnvelope, FaBriefcase
} from "react-icons/fa";
import { SiDevdotto, SiFiverr, SiUpwork, SiFreelancer } from "react-icons/si";
import { useFirestoreData } from "@/hooks/useFirestoreData";

interface BrowserData {
    bookmarks: Array<{
        id: string;
        name: string;
        url: string;
        icon?: string;
        category?: string;
    }>;
    history: Array<{
        url: string;
        title: string;
        timestamp: number;
    }>;
    quickLinks: Array<{
        name: string;
        url: string;
        icon?: string;
        color?: string;
    }>;
}

interface SocialData {
    links: Array<{
        name: string;
        url: string;
        platform: string;
        whatsapp?: {
            contactNumber?: string;
            groupLink?: string;
            channelLink?: string;
        };
    }>;
}

interface BrowserHomeProps {
    onNavigate: (url: string) => void;
    onOpenApp?: (appId: string) => void;
    browserData?: BrowserData | null;
    dataLoading?: boolean;
}

const platformIcons: Record<string, any> = {
    github: FaGithub,
    linkedin: FaLinkedin,
    twitter: FaTwitter,
    instagram: FaInstagram,
    facebook: FaFacebook,
    youtube: FaYoutube,
    dribbble: FaDribbble,
    behance: FaBehance,
    medium: FaMedium,
    devto: FaDev,
    dev: SiDevdotto,
    stackoverflow: FaStackOverflow,
    codepen: FaCodepen,
    figma: FaFigma,
    discord: FaDiscord,
    twitch: FaTwitch,
    tiktok: FaTiktok,
    reddit: FaReddit,
    producthunt: FaProductHunt,
    telegram: FaTelegram,
    whatsapp: FaWhatsapp,
    snapchat: FaSnapchat,
    spotify: FaSpotify,
    pinterest: FaPinterest,
    slack: FaSlack,
    fiverr: SiFiverr,
    upwork: SiUpwork,
    freelancer: SiFreelancer,
    toptal: FaBriefcase,
    portfolio: FaGlobe,
    website: FaGlobe,
    email: FaEnvelope,
};

const platformColors: Record<string, string> = {
    github: "text-gray-800 dark:text-gray-200",
    linkedin: "text-blue-600",
    twitter: "text-sky-500",
    instagram: "text-pink-500",
    facebook: "text-blue-700",
    youtube: "text-red-600",
    dribbble: "text-pink-400",
    behance: "text-blue-500",
    medium: "text-gray-900 dark:text-gray-100",
    devto: "text-gray-700 dark:text-gray-300",
    dev: "text-gray-700 dark:text-gray-300",
    stackoverflow: "text-orange-500",
    codepen: "text-gray-900 dark:text-gray-100",
    figma: "text-purple-500",
    discord: "text-indigo-500",
    twitch: "text-purple-600",
    tiktok: "text-gray-900 dark:text-gray-100",
    reddit: "text-orange-600",
    producthunt: "text-orange-500",
    telegram: "text-blue-500",
    whatsapp: "text-green-500",
    snapchat: "text-yellow-400",
    spotify: "text-green-600",
    pinterest: "text-red-600",
    slack: "text-purple-600",
    fiverr: "text-green-500",
    upwork: "text-green-600",
    freelancer: "text-blue-500",
    toptal: "text-blue-700",
    portfolio: "text-purple-500",
    website: "text-blue-500",
    email: "text-red-500",
};

const OS_APPS: Array<{ id: string; name: string; icon: LucideIcon; color: string }> = [
    { id: "about", name: "About Me", icon: User, color: "text-blue-500" },
    { id: "projects", name: "Projects", icon: Briefcase, color: "text-purple-500" },
    { id: "contact", name: "Contact", icon: Mail, color: "text-red-500" },
    { id: "terminal", name: "Terminal", icon: TerminalIcon, color: "text-emerald-500" },
    { id: "vscode", name: "VS Code", icon: Code, color: "text-blue-600" },
    { id: "notepad", name: "Notepad", icon: FileText, color: "text-orange-500" },
    { id: "gallery", name: "Gallery", icon: Image, color: "text-pink-500" },
    { id: "db", name: "Database", icon: DatabaseIcon, color: "text-blue-400" },
    { id: "settings", name: "Settings", icon: SettingsIcon, color: "text-slate-600" },
    { id: "spotify", name: "X-Audio", icon: Music, color: "text-green-600" },
    { id: "youtube", name: "YouTube", icon: Video, color: "text-red-600" },
];

export function BrowserHome({ onNavigate, onOpenApp, browserData, dataLoading }: BrowserHomeProps) {
    const { data: socialData, loading: socialLoading } = useFirestoreData<SocialData>("social");
    const [whatsappMenuOpen, setWhatsappMenuOpen] = useState<string | null>(null);

    if (dataLoading || socialLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Loading browser data...</p>
                </div>
            </div>
        );
    }

    const socialLinks = socialData?.links || [];

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gradient-to-br from-background via-background to-muted/20">
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

                {/* Quick Links from Firebase */}
                {browserData?.quickLinks && browserData.quickLinks.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            Quick Links
                        </h2>
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-9 gap-3">
                            {browserData.quickLinks.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => onNavigate(link.url)}
                                    className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer active:scale-95 duration-100"
                                >
                                    <div className="w-14 h-14 p-3 bg-background border shadow-sm rounded-xl group-hover:shadow-md transition-all duration-200 flex items-center justify-center">
                                        <Globe className={`w-full h-full ${link.color || 'text-blue-500'}`} />
                                    </div>
                                    <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground text-center line-clamp-2 select-none leading-tight">
                                        {link.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* OS Apps */}
                {onOpenApp && (
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <span className="text-purple-500">🖥️</span>
                            OS Apps
                        </h2>
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-9 gap-3">
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

                {/* Bookmarks from Firebase */}
                {browserData?.bookmarks && browserData.bookmarks.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Bookmark className="w-5 h-5 text-amber-500" />
                            Bookmarks
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {browserData.bookmarks.map((bookmark) => (
                                <button
                                    key={bookmark.id}
                                    onClick={() => onNavigate(bookmark.url)}
                                    className="group flex items-center gap-3 p-3 rounded-xl bg-background border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer active:scale-[0.98] duration-100"
                                >
                                    <div className="w-10 h-10 p-2 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-full h-full text-primary" />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="text-sm font-medium truncate">{bookmark.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{bookmark.url}</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent History from Firebase */}
                {browserData?.history && browserData.history.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            Recent History
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {browserData.history.slice(0, 6).map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => onNavigate(item.url)}
                                    className="group flex items-center gap-3 p-3 rounded-xl bg-background border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer active:scale-[0.98] duration-100"
                                >
                                    <div className="w-10 h-10 p-2 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-full h-full text-blue-500" />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="text-sm font-medium truncate">{item.title}</p>
                                        <p className="text-xs text-muted-foreground truncate">{item.url}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Social Media & Links */}
                <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <ExternalLink className="w-5 h-5 text-blue-500" />
                        Social Media & Links
                    </h2>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-9 gap-3">
                        {socialLinks.map((link) => {
                            const IconComponent = platformIcons[link.platform.toLowerCase()] || FaGlobe;
                            const color = platformColors[link.platform.toLowerCase()] || "text-gray-500";
                            
                            // Special handling for WhatsApp - Show popup with options
                            if (link.platform.toLowerCase() === 'whatsapp' && link.whatsapp) {
                                const { contactNumber, groupLink, channelLink } = link.whatsapp;
                                const hasMultipleOptions = [contactNumber, groupLink, channelLink].filter(Boolean).length > 1;
                                
                                return (
                                    <div key={link.url} className="relative">
                                        <button
                                            onClick={() => setWhatsappMenuOpen(whatsappMenuOpen === link.name ? null : link.name)}
                                            className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer active:scale-95 duration-100 w-full"
                                        >
                                            <div className="w-14 h-14 p-3 bg-background border shadow-sm rounded-xl group-hover:shadow-md transition-all duration-200 flex items-center justify-center relative">
                                                <IconComponent className={`w-full h-full ${color}`} />
                                                {hasMultipleOptions && (
                                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold text-white">
                                                        {[contactNumber, groupLink, channelLink].filter(Boolean).length}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground text-center line-clamp-2 select-none leading-tight">
                                                {link.name}
                                            </span>
                                        </button>
                                        
                                        {/* WhatsApp Options Popup */}
                                        {whatsappMenuOpen === link.name && (
                                            <>
                                                {/* Backdrop */}
                                                <div 
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setWhatsappMenuOpen(null)}
                                                />
                                                
                                                {/* Popup Menu */}
                                                <div className="absolute left-0 top-full mt-2 z-50 bg-card border-2 border-primary rounded-xl shadow-2xl p-3 min-w-[220px] animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <div className="text-xs font-bold text-primary mb-2 px-2">WhatsApp Options</div>
                                                    <div className="space-y-1">
                                                        {contactNumber && (
                                                            <a
                                                                href={`https://wa.me/${contactNumber.replace(/[^0-9]/g, '')}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                                                                onClick={() => setWhatsappMenuOpen(null)}
                                                            >
                                                                <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center shrink-0 relative">
                                                                    <Phone className="w-4 h-4 text-white" />
                                                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white rounded-full text-[8px] flex items-center justify-center font-bold text-green-600 border border-green-500">1</span>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-xs font-semibold text-foreground">Contact</div>
                                                                    <div className="text-[10px] text-muted-foreground">Direct message</div>
                                                                </div>
                                                            </a>
                                                        )}
                                                        {groupLink && (
                                                            <a
                                                                href={groupLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                                                                onClick={() => setWhatsappMenuOpen(null)}
                                                            >
                                                                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0 relative">
                                                                    <Users className="w-4 h-4 text-white" />
                                                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white rounded-full text-[8px] flex items-center justify-center font-bold text-blue-600 border border-blue-500">G</span>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-xs font-semibold text-foreground">Group</div>
                                                                    <div className="text-[10px] text-muted-foreground">Join community</div>
                                                                </div>
                                                            </a>
                                                        )}
                                                        {channelLink && (
                                                            <a
                                                                href={channelLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                                                                onClick={() => setWhatsappMenuOpen(null)}
                                                            >
                                                                <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center shrink-0 relative">
                                                                    <Radio className="w-4 h-4 text-white" />
                                                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white rounded-full text-[8px] flex items-center justify-center font-bold text-purple-600 border border-purple-500">C</span>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-xs font-semibold text-foreground">Channel</div>
                                                                    <div className="text-[10px] text-muted-foreground">Follow updates</div>
                                                                </div>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            }
                            
                            // Regular social links
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
