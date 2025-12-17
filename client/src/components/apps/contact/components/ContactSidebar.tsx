import { useState, useEffect } from "react";
import { Mail, MapPin, User } from "lucide-react";
import {
    FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaYoutube,
    FaGlobe, FaEnvelope
} from "react-icons/fa";

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
    }>;
}

const platformIcons: Record<string, any> = {
    github: FaGithub,
    linkedin: FaLinkedin,
    twitter: FaTwitter,
    instagram: FaInstagram,
    youtube: FaYoutube,
    website: FaGlobe,
    email: FaEnvelope,
};

const platformColors: Record<string, string> = {
    github: "hover:bg-[#181717]",
    linkedin: "hover:bg-[#0A66C2]",
    twitter: "hover:bg-[#1DA1F2]",
    instagram: "hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737]",
    youtube: "hover:bg-[#FF0000]",
    website: "hover:bg-[#3B82F6]",
    email: "hover:bg-[#6B7280]",
};

export function ContactSidebar() {
    const [contactData, setContactData] = useState<ContactData | null>(null);
    const [aboutData, setAboutData] = useState<AboutData | null>(null);
    const [socialData, setSocialData] = useState<SocialData | null>(null);

    useEffect(() => {
        Promise.all([
            fetch(`/data/contact.json?t=${Date.now()}`, { cache: 'no-store' }).then(res => res.json()),
            fetch(`/data/about.json?t=${Date.now()}`, { cache: 'no-store' }).then(res => res.json()),
            fetch(`/data/social.json?t=${Date.now()}`, { cache: 'no-store' }).then(res => res.json()).catch(() => ({ links: [] }))
        ]).then(([contact, about, social]) => {
            setContactData(contact);
            setAboutData(about);
            setSocialData(social);
        }).catch(console.error);
    }, []);

    if (!contactData || !aboutData) return null;

    return (
        <div className="w-full md:w-96 lg:w-[420px] bg-gradient-to-br from-muted/30 to-background p-6 md:p-8 lg:p-10 flex flex-col justify-between shrink-0 md:overflow-y-auto no-scrollbar border-b md:border-b-0 md:border-r">
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
                </div>

                <div className="space-y-4 md:space-y-5">
                    <div className="flex items-center gap-4 p-4 bg-card border rounded-xl hover:shadow-md transition-shadow">
                        <div className="p-3 md:p-3.5 bg-primary/10 rounded-xl shrink-0">
                            <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                            <p className="font-medium text-sm md:text-base truncate">{contactData.email}</p>
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
                            {socialData.links.map((link) => {
                                const Icon = platformIcons[link.platform.toLowerCase()] || FaGlobe;
                                const bgColor = platformColors[link.platform.toLowerCase()] || "hover:bg-[#3B82F6]";
                                return (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={link.name}
                                        className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-muted border hover:scale-110 hover:shadow-lg transition-all duration-300 ${bgColor}`}
                                    >
                                        <Icon className="w-6 h-6 md:w-7 md:h-7" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-6 md:pt-8 text-muted-foreground text-xs md:text-sm border-t mt-6">
                {contactData.copyright}
            </div>
        </div>
    );
}
