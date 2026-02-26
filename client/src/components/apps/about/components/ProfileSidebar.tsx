import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Users, Radio, Download } from "lucide-react";
import {
    FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaYoutube,
    FaDribbble, FaBehance, FaMedium, FaDev, FaStackOverflow, FaCodepen,
    FaFigma, FaDiscord, FaTwitch, FaTiktok, FaReddit, FaProductHunt,
    FaTelegram, FaWhatsapp, FaSnapchat, FaSpotify, FaPinterest, FaSlack,
    FaGlobe, FaEnvelope, FaBriefcase
} from "react-icons/fa";
import { SiDevdotto, SiFiverr, SiUpwork, SiFreelancer } from "react-icons/si";
import { useFirestoreData } from "@/hooks/useFirestoreData";

interface AboutData {
    personal: {
        name: string;
        title: string;
        location: string;
        avatar: string;
    };
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
    "dev.to": SiDevdotto,
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
    website: FaGlobe,
    email: FaEnvelope,
};

const platformColors: Record<string, string> = {
    github: "bg-[#181717]",
    linkedin: "bg-[#0A66C2]",
    twitter: "bg-[#1DA1F2]",
    instagram: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
    facebook: "bg-[#1877F2]",
    youtube: "bg-[#FF0000]",
    dribbble: "bg-[#EA4C89]",
    behance: "bg-[#1769FF]",
    medium: "bg-[#000000]",
    "dev.to": "bg-[#0A0A0A]",
    stackoverflow: "bg-[#F58025]",
    codepen: "bg-[#000000]",
    figma: "bg-[#F24E1E]",
    discord: "bg-[#5865F2]",
    twitch: "bg-[#9146FF]",
    tiktok: "bg-[#000000]",
    reddit: "bg-[#FF4500]",
    producthunt: "bg-[#DA552F]",
    telegram: "bg-[#26A5E4]",
    whatsapp: "bg-[#25D366]",
    snapchat: "bg-[#FFFC00]",
    spotify: "bg-[#1DB954]",
    pinterest: "bg-[#E60023]",
    slack: "bg-[#4A154B]",
    fiverr: "bg-[#1DBF73]",
    upwork: "bg-[#6FDA44]",
    freelancer: "bg-[#29B2FE]",
    toptal: "bg-[#3863A0]",
    website: "bg-[#3B82F6]",
    email: "bg-[#6B7280]",
};

export function ProfileSidebar() {
    const { data: aboutData, loading: loadingAbout } = useFirestoreData<AboutData>("about");
    const { data: socialData } = useFirestoreData<SocialData>("social");
    const [whatsappMenuOpen, setWhatsappMenuOpen] = useState<string | null>(null);

    if (loadingAbout) {
        return (
            <div className="w-full md:w-48 xl:w-[480px] p-6 border-b md:border-b-0 md:border-r flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!aboutData) return null;

    return (
        <div className="w-full md:w-48 xl:w-[380px] bg-gradient-to-b from-muted/30 to-background p-6 md:p-4 xl:p-8 border-b md:border-b-0 md:border-r flex flex-col items-center text-center gap-6 md:gap-4 xl:gap-8 shrink-0 md:overflow-y-auto no-scrollbar">
            {/* Avatar with gradient ring */}
            <div className="relative mt-4 md:mt-2 xl:mt-4 group cursor-pointer">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-in animate-spin-slow"></div>
                <Avatar className="relative w-32 h-32 md:w-24 md:h-24 xl:w-36 xl:h-36 border-4 border-background shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                    <AvatarImage src={aboutData.personal.avatar} className="object-cover" />
                    <AvatarFallback className="text-2xl md:text-3xl font-bold">
                        {aboutData.personal.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Name and Title */}
            <div className="space-y-4 md:space-y-3 xl:space-y-4 w-full">
                <h1 className="text-xl md:text-sm xl:text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {aboutData.personal.name}
                </h1>
                <div className="flex justify-center w-full min-h-[1.5rem] px-1 md:px-2">
                    <p className="text-sm md:text-xs xl:text-base text-primary font-medium leading-tight text-center line-clamp-2">
                        {aboutData.personal.title}
                    </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm md:text-xs xl:text-sm drop-shadow-sm">
                    <MapPin className="w-4 h-4 md:w-3 md:h-3 xl:w-4 xl:h-4 text-primary animate-bounce" />
                    <span className="text-xs md:text-[10px] xl:text-sm font-medium">{aboutData.personal.location}</span>
                </div>

                {/* Premium Download Resume Button */}
                <div className="pt-2 flex justify-center w-full">
                    <div className="relative group/btn cursor-pointer inline-block">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-purple-500 to-indigo-500 rounded-lg blur opacity-60 group-hover/btn:opacity-100 transition duration-300"></div>
                        <Button
                            variant="default"
                            className="relative flex items-center gap-2 bg-background/90 hover:bg-background text-foreground border border-white/10 rounded-lg px-6 md:px-4 py-5 md:py-4 xl:px-6 xl:py-5 font-semibold active:scale-95 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = '/assets/resume/resume.pdf';
                                link.download = 'Resume.pdf';
                                link.click();
                            }}
                        >
                            <Download className="w-4 h-4 text-primary group-hover/btn:-translate-y-1 transition-transform" />
                            <span>Download Resume</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Social Links */}
            {socialData && socialData.links.length > 0 && (
                <div className="w-full pt-4 md:pt-3 xl:pt-4 border-t">
                    <p className="text-xs md:text-[10px] xl:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 md:mb-3 xl:mb-4">
                        Connect
                    </p>
                    <div className="flex gap-3 md:gap-2 xl:gap-3 justify-center flex-wrap">
                        {socialData.links.map((link, index) => {
                            const Icon = platformIcons[link.platform.toLowerCase()] || FaGlobe;
                            const bgColor = platformColors[link.platform.toLowerCase()] || "bg-[#3B82F6]";
                            
                            // Special handling for WhatsApp - Show popup with options
                            if (link.platform.toLowerCase() === 'whatsapp' && link.whatsapp) {
                                const { contactNumber, groupLink, channelLink } = link.whatsapp;
                                const hasMultipleOptions = [contactNumber, groupLink, channelLink].filter(Boolean).length > 1;
                                
                                return (
                                    <div
                                        key={link.name}
                                        className="group relative"
                                        style={{
                                            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                        }}
                                    >
                                        <div className={`absolute inset-0 ${bgColor} rounded-xl blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300`}></div>
                                        <button
                                            onClick={() => setWhatsappMenuOpen(whatsappMenuOpen === link.name ? null : link.name)}
                                            className={`relative flex items-center justify-center w-12 h-12 md:w-9 md:h-9 xl:w-12 xl:h-12 rounded-xl ${bgColor} text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl`}
                                        >
                                            <Icon className="w-6 h-6 md:w-4 md:h-4 xl:w-6 xl:h-6 transition-transform group-hover:scale-110" />
                                            {hasMultipleOptions && (
                                                <span className="absolute -top-1 -right-1 w-4 h-4 md:w-3 md:h-3 xl:w-4 xl:h-4 bg-red-500 rounded-full text-[10px] md:text-[8px] xl:text-[10px] flex items-center justify-center font-bold">
                                                    {[contactNumber, groupLink, channelLink].filter(Boolean).length}
                                                </span>
                                            )}
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
                                                <div className="absolute left-0 top-full mt-2 z-50 bg-card border-2 border-primary rounded-xl shadow-2xl p-3 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
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
                                                                    <div className="text-[10px] text-muted-foreground truncate">{contactNumber}</div>
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
                                                                    <div className="text-[10px] text-muted-foreground">Join WhatsApp Group</div>
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
                                                                    <div className="text-[10px] text-muted-foreground">Follow Channel</div>
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
                                <div
                                    key={link.name}
                                    className="group relative"
                                    style={{
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    <div className={`absolute inset-0 ${bgColor} rounded-xl blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300`}></div>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={link.name}
                                        className={`relative flex items-center justify-center w-12 h-12 md:w-9 md:h-9 xl:w-12 xl:h-12 rounded-xl ${bgColor} text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl`}
                                    >
                                        <Icon className="w-6 h-6 md:w-4 md:h-4 xl:w-6 xl:h-6 transition-transform group-hover:scale-110" />
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}</style>
        </div>
    );
}
