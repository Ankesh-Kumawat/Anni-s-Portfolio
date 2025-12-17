import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import {
    FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaYoutube,
    FaDribbble, FaBehance, FaMedium, FaDev, FaStackOverflow, FaCodepen,
    FaFigma, FaDiscord, FaTwitch, FaTiktok, FaReddit, FaProductHunt,
    FaTelegram, FaWhatsapp, FaSnapchat, FaSpotify, FaPinterest, FaSlack,
    FaGlobe, FaEnvelope
} from "react-icons/fa";
import { SiDevdotto } from "react-icons/si";

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
    website: "bg-[#3B82F6]",
    email: "bg-[#6B7280]",
};

export function ProfileSidebar() {
    const [aboutData, setAboutData] = useState<AboutData | null>(null);
    const [socialData, setSocialData] = useState<SocialData | null>(null);

    useEffect(() => {
        Promise.all([
            fetch(`/data/about.json?t=${Date.now()}`, { cache: 'no-store' }).then(res => res.json()),
            fetch(`/data/social.json?t=${Date.now()}`, { cache: 'no-store' }).then(res => res.json()).catch(() => ({ links: [] }))
        ]).then(([about, social]) => {
            setAboutData(about);
            setSocialData(social);
        }).catch(console.error);
    }, []);

    if (!aboutData) return null;

    return (
        <div className="w-full md:w-48 xl:w-[480px] bg-gradient-to-b from-muted/30 to-background p-6 md:p-4 xl:p-14 border-b md:border-b-0 md:border-r flex flex-col items-center text-center gap-6 md:gap-4 xl:gap-12 shrink-0 md:overflow-y-auto no-scrollbar">
            {/* Avatar with gradient ring */}
            <div className="relative mt-4 md:mt-2 xl:mt-4">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-md opacity-50"></div>
                <Avatar className="relative w-32 h-32 md:w-24 md:h-24 xl:w-48 xl:h-48 border-4 border-background shadow-2xl">
                    <AvatarImage src={aboutData.personal.avatar} className="object-cover" />
                    <AvatarFallback className="text-2xl md:text-3xl font-bold">
                        {aboutData.personal.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Name and Title */}
            <div className="space-y-3 md:space-y-2 xl:space-y-4 w-full">
                <h1 className="text-xl md:text-sm xl:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    {aboutData.personal.name}
                </h1>
                <p className="text-sm md:text-xs xl:text-lg text-muted-foreground font-medium leading-relaxed px-2">
                    {aboutData.personal.title}
                </p>
                <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm md:text-xs xl:text-base">
                    <MapPin className="w-4 h-4 md:w-3 md:h-3 xl:w-5 xl:h-5 text-primary" />
                    <span className="text-xs md:text-[10px] xl:text-base">{aboutData.personal.location}</span>
                </div>
            </div>

            {/* Social Links */}
            {socialData && socialData.links.length > 0 && (
                <div className="w-full pt-4 md:pt-3 xl:pt-6 border-t">
                    <p className="text-xs md:text-[10px] xl:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 md:mb-3 xl:mb-6">
                        Connect
                    </p>
                    <div className="flex gap-3 md:gap-2 xl:gap-4 justify-center flex-wrap">
                        {socialData.links.map((link, index) => {
                            const Icon = platformIcons[link.platform.toLowerCase()] || FaGlobe;
                            const bgColor = platformColors[link.platform.toLowerCase()] || "bg-[#3B82F6]";
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
                                        className={`relative flex items-center justify-center w-12 h-12 md:w-9 md:h-9 xl:w-16 xl:h-16 rounded-xl ${bgColor} text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl`}
                                    >
                                        <Icon className="w-6 h-6 md:w-4 md:h-4 xl:w-8 xl:h-8 transition-transform group-hover:scale-110" />
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
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
