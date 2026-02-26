import { Mail, MapPin, Phone, Users, Radio, Send } from "lucide-react";
import {
    FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaYoutube,
    FaDribbble, FaBehance, FaMedium, FaStackOverflow, FaCodepen,
    FaFigma, FaDiscord, FaTwitch, FaTiktok, FaReddit, FaProductHunt,
    FaTelegram, FaWhatsapp, FaSnapchat, FaSpotify, FaPinterest, FaSlack,
    FaGlobe, FaEnvelope, FaBriefcase
} from "react-icons/fa";
import { SiDevdotto, SiFiverr, SiUpwork, SiFreelancer } from "react-icons/si";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ContactData {
    email: string;
    location: string;
    message: string;
    copyright: string;
}

interface AboutData {
    personal: {
        name: string;
        title: string;
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

interface ContactSidebarProps {
    onSendMessage: () => void;
    showButton: boolean;
    isLargeScreen?: boolean;
}

export function ContactSidebar({ onSendMessage, showButton, isLargeScreen = false }: ContactSidebarProps) {
    const { data: contactData } = useFirestoreData<ContactData>("contact");
    const { data: aboutData } = useFirestoreData<AboutData>("about");
    const { data: socialData } = useFirestoreData<SocialData>("social");
    const [whatsappMenuOpen, setWhatsappMenuOpen] = useState<string | null>(null);

    if (!contactData || !aboutData) return null;

    return (
        <div className={`${isLargeScreen ? 'w-[480px]' : 'w-full'} bg-gradient-to-br from-muted/30 to-background p-6 md:p-8 lg:p-10 flex flex-col justify-between shrink-0 overflow-y-auto no-scrollbar border-b md:border-b-0 md:border-r`}>
            <div className="space-y-6 md:space-y-8">
                {/* Profile Section */}
                <div className="flex items-center gap-4 pb-6 border-b">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-md opacity-50"></div>
                        <img
                            src={aboutData.personal.avatar}
                            alt={aboutData.personal.name}
                            className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-background object-cover shadow-xl"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg md:text-xl font-bold">{aboutData.personal.name}</h3>
                        <p className="text-sm text-muted-foreground">{aboutData.personal.title}</p>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <div className="w-1 h-8 bg-gradient-to-b from-primary to-purple-500 rounded-full"></div>
                        <h2 className="text-2xl md:text-3xl font-bold">Get in Touch</h2>
                    </div>
                    <p className="mb-6 md:mb-8 text-muted-foreground leading-relaxed text-sm md:text-base whitespace-pre-line">
                        {contactData.message}
                    </p>
                    
                    {/* Send Message Button - Conditionally shown */}
                    {showButton && (
                        <Button
                            onClick={onSendMessage}
                            size="lg"
                            className="w-full mb-6 md:mb-8 h-12 md:h-14 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                        </Button>
                    )}
                </div>

                <div className="space-y-4 md:space-y-5">
                    <div className="flex items-center gap-4 p-4 bg-card border rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-3 md:p-3.5 bg-primary/10 rounded-xl shrink-0">
                            <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                            <a 
                                href={`mailto:${contactData.email}`}
                                className="font-medium text-sm md:text-base truncate hover:text-primary transition-colors"
                            >
                                {contactData.email}
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-card border rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-3 md:p-3.5 bg-primary/10 rounded-xl shrink-0">
                            <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Location</p>
                            <p className="font-medium text-sm md:text-base">{contactData.location}</p>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                {socialData && socialData.links.length > 0 && (
                    <div className="pt-6 border-t">
                        <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                            Connect With Me
                        </p>
                        <div className="flex gap-3 flex-wrap">
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
                                                className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl ${bgColor} text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl`}
                                            >
                                                <Icon className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:scale-110" />
                                                {hasMultipleOptions && (
                                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">
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
                                                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors group/item"
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
                                                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors group/item"
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
                                                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors group/item"
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
                                            className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl ${bgColor} text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl`}
                                        >
                                            <Icon className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:scale-110" />
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-6 md:pt-8 text-muted-foreground text-xs md:text-sm border-t mt-6">
                {contactData.copyright}
            </div>
            
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
