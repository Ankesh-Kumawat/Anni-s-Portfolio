import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Link2, Sparkles, Check, ExternalLink } from "lucide-react";
import {
    FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaYoutube,
    FaDribbble, FaBehance, FaMedium, FaDev, FaStackOverflow, FaCodepen,
    FaFigma, FaDiscord, FaTwitch, FaTiktok, FaReddit, FaProductHunt,
    FaTelegram, FaWhatsapp, FaSnapchat, FaSpotify, FaPinterest, FaSlack,
    FaGlobe, FaEnvelope
} from "react-icons/fa";
import { SiDevdotto } from "react-icons/si";
import type { StepProps } from "../types";

const POPULAR_PLATFORMS = [
    { value: "github", label: "GitHub", icon: FaGithub, color: "bg-[#181717]", placeholder: "https://github.com/username" },
    { value: "linkedin", label: "LinkedIn", icon: FaLinkedin, color: "bg-[#0A66C2]", placeholder: "https://linkedin.com/in/username" },
    { value: "twitter", label: "Twitter / X", icon: FaTwitter, color: "bg-[#1DA1F2]", placeholder: "https://twitter.com/username" },
    { value: "instagram", label: "Instagram", icon: FaInstagram, color: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]", placeholder: "https://instagram.com/username" },
    { value: "facebook", label: "Facebook", icon: FaFacebook, color: "bg-[#1877F2]", placeholder: "https://facebook.com/username" },
    { value: "youtube", label: "YouTube", icon: FaYoutube, color: "bg-[#FF0000]", placeholder: "https://youtube.com/@username" },
    { value: "dribbble", label: "Dribbble", icon: FaDribbble, color: "bg-[#EA4C89]", placeholder: "https://dribbble.com/username" },
    { value: "behance", label: "Behance", icon: FaBehance, color: "bg-[#1769FF]", placeholder: "https://behance.net/username" },
    { value: "medium", label: "Medium", icon: FaMedium, color: "bg-[#000000]", placeholder: "https://medium.com/@username" },
    { value: "dev.to", label: "Dev.to", icon: SiDevdotto, color: "bg-[#0A0A0A]", placeholder: "https://dev.to/username" },
    { value: "stackoverflow", label: "Stack Overflow", icon: FaStackOverflow, color: "bg-[#F58025]", placeholder: "https://stackoverflow.com/users/..." },
    { value: "codepen", label: "CodePen", icon: FaCodepen, color: "bg-[#000000]", placeholder: "https://codepen.io/username" },
    { value: "figma", label: "Figma", icon: FaFigma, color: "bg-[#F24E1E]", placeholder: "https://figma.com/@username" },
    { value: "discord", label: "Discord", icon: FaDiscord, color: "bg-[#5865F2]", placeholder: "https://discord.gg/..." },
    { value: "twitch", label: "Twitch", icon: FaTwitch, color: "bg-[#9146FF]", placeholder: "https://twitch.tv/username" },
    { value: "tiktok", label: "TikTok", icon: FaTiktok, color: "bg-[#000000]", placeholder: "https://tiktok.com/@username" },
    { value: "reddit", label: "Reddit", icon: FaReddit, color: "bg-[#FF4500]", placeholder: "https://reddit.com/u/username" },
    { value: "producthunt", label: "Product Hunt", icon: FaProductHunt, color: "bg-[#DA552F]", placeholder: "https://producthunt.com/@username" },
    { value: "telegram", label: "Telegram", icon: FaTelegram, color: "bg-[#26A5E4]", placeholder: "https://t.me/username" },
    { value: "whatsapp", label: "WhatsApp", icon: FaWhatsapp, color: "bg-[#25D366]", placeholder: "https://wa.me/..." },
    { value: "snapchat", label: "Snapchat", icon: FaSnapchat, color: "bg-[#FFFC00]", placeholder: "https://snapchat.com/add/username" },
    { value: "spotify", label: "Spotify", icon: FaSpotify, color: "bg-[#1DB954]", placeholder: "https://open.spotify.com/user/..." },
    { value: "pinterest", label: "Pinterest", icon: FaPinterest, color: "bg-[#E60023]", placeholder: "https://pinterest.com/username" },
    { value: "slack", label: "Slack", icon: FaSlack, color: "bg-[#4A154B]", placeholder: "https://slack.com/..." },
    { value: "website", label: "Website", icon: FaGlobe, color: "bg-[#3B82F6]", placeholder: "https://yourwebsite.com" },
    { value: "email", label: "Email", icon: FaEnvelope, color: "bg-[#6B7280]", placeholder: "mailto:your@email.com" },
];

export default function Step3Social({ data, setData }: StepProps) {
    const togglePlatform = (platformValue: string) => {
        const existingIndex = data.social.links.findIndex(link => link.platform === platformValue);

        if (existingIndex >= 0) {
            // Remove if exists
            setData((prev) => ({
                ...prev,
                social: {
                    links: prev.social.links.filter((_, i) => i !== existingIndex),
                },
            }));
        } else {
            // Add new
            const platform = POPULAR_PLATFORMS.find(p => p.value === platformValue);
            setData((prev) => ({
                ...prev,
                social: {
                    links: [
                        ...prev.social.links,
                        {
                            name: platform?.label || "",
                            url: "",
                            platform: platformValue
                        },
                    ],
                },
            }));
        }
    };

    const updateLink = (index: number, field: string, value: string) => {
        setData((prev) => ({
            ...prev,
            social: {
                links: prev.social.links.map((link, i) =>
                    i === index ? { ...link, [field]: value } : link
                ),
            },
        }));
    };

    const removeLink = (index: number) => {
        setData((prev) => ({
            ...prev,
            social: {
                links: prev.social.links.filter((_, i) => i !== index),
            },
        }));
    };

    const getPlatformInfo = (platformValue: string) => {
        return POPULAR_PLATFORMS.find(p => p.value === platformValue) || POPULAR_PLATFORMS[POPULAR_PLATFORMS.length - 1];
    };

    const isPlatformAdded = (platformValue: string) => {
        return data.social.links.some(link => link.platform === platformValue);
    };

    const completionPercentage = () => {
        if (data.social.links.length === 0) return 0;
        const filledLinks = data.social.links.filter(link => link.url).length;
        return Math.round((filledLinks / data.social.links.length) * 100);
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Header Section */}
            <div className="mb-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-2">Social Links</h2>
                        <p className="text-muted-foreground text-lg">Select platforms and add your profile links</p>
                    </div>
                    <div className="flex items-center gap-3 bg-gradient-to-r from-primary/10 to-purple-500/10 px-6 py-4 rounded-2xl border border-primary/30">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Completion</div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                {completionPercentage()}%
                            </div>
                        </div>
                        <Sparkles className="w-6 h-6 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Info Notice */}
            <div className="mb-8 p-6 bg-card border-2 border-primary/30 rounded-2xl flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <Link2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                    <p className="text-base font-bold text-foreground">Optional Section - Click to Add</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Click on any platform below to add it. You can add as many or as few as you like. All fields are optional.
                    </p>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-[1fr_380px] gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Platform Selection Grid */}
                    <div className="bg-card rounded-2xl p-8 border-2 border shadow-md">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Select Platforms</h3>
                                <p className="text-sm text-muted-foreground">Click to add or remove platforms</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-5 gap-3">
                            {POPULAR_PLATFORMS.map((platform) => {
                                const Icon = platform.icon;
                                const isAdded = isPlatformAdded(platform.value);
                                return (
                                    <button
                                        key={platform.value}
                                        onClick={() => togglePlatform(platform.value)}
                                        className={`relative p-3 rounded-xl border-2 transition-all text-center group ${isAdded
                                            ? "border-green-500 bg-green-50 shadow-lg scale-105"
                                            : "border bg-card hover:border-blue-400 hover:shadow-md hover:scale-105"
                                            }`}
                                    >
                                        {isAdded && (
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center shadow-lg z-10">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                        <div className={`w-14 h-14 rounded-xl ${platform.color} flex items-center justify-center mx-auto mb-2 shadow-md`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <p className={`text-[10px] font-bold leading-tight ${isAdded ? "text-green-700 dark:text-green-400" : "text-foreground"}`}>
                                            {platform.label}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Added Links Form */}
                    {data.social.links.length > 0 && (
                        <div className="bg-card rounded-2xl p-8 border-2 border shadow-md">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <Link2 className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Your Links</h3>
                                    <p className="text-sm text-muted-foreground">{data.social.links.length} platform{data.social.links.length !== 1 ? 's' : ''} selected</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {data.social.links.map((link, index) => {
                                    const platformInfo = getPlatformInfo(link.platform);
                                    const PlatformIcon = platformInfo.icon;
                                    const isComplete = !!link.url;

                                    return (
                                        <div key={index} className="p-5 bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl border-2 border">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl ${platformInfo.color} flex items-center justify-center`}>
                                                        <PlatformIcon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-foreground">{platformInfo.label}</h4>
                                                        {isComplete && (
                                                            <Badge className="bg-green-100 text-green-700 border-green-500/30 mt-1">
                                                                <Check className="w-3 h-3 mr-1" />
                                                                Complete
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => removeLink(index)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-foreground">Display Name (Optional)</Label>
                                                    <Input
                                                        value={link.name}
                                                        onChange={(e) => updateLink(index, "name", e.target.value)}
                                                        placeholder={platformInfo.label}
                                                        className="h-11 text-base bg-card"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-foreground">Profile URL (Optional)</Label>
                                                    <Input
                                                        value={link.url}
                                                        onChange={(e) => updateLink(index, "url", e.target.value)}
                                                        placeholder={platformInfo.placeholder}
                                                        className="h-11 text-base bg-card"
                                                    />
                                                </div>

                                                {link.url && (
                                                    <a
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-primary font-medium"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        Test Link
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Stats & Preview */}
                <div className="space-y-6">
                    {/* Stats Card */}
                    <div className="bg-card rounded-2xl p-6 border-2 border shadow-md">
                        <div className="flex items-center gap-2 mb-5">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            <h4 className="font-bold text-foreground">Statistics</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/30">
                                <span className="text-sm font-medium text-primary">Selected</span>
                                <span className="text-2xl font-bold text-blue-600">{data.social.links.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-500/30">
                                <span className="text-sm font-medium text-green-700 dark:text-green-400">With URL</span>
                                <span className="text-2xl font-bold text-green-600">
                                    {data.social.links.filter(link => link.url).length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
                                <span className="text-sm font-medium text-purple-900">Available</span>
                                <span className="text-2xl font-bold text-purple-600">{POPULAR_PLATFORMS.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Preview Card */}
                    {data.social.links.length > 0 && (
                        <div className="bg-gradient-to-br from-muted/30 to-muted/50 rounded-2xl p-6 border-2 border shadow-md">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                                    <Link2 className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-bold text-foreground">Live Preview</h4>
                            </div>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide">
                                {data.social.links.map((link, index) => {
                                    const platformInfo = getPlatformInfo(link.platform);
                                    const PlatformIcon = platformInfo.icon;
                                    return (
                                        <div key={index} className="bg-card rounded-xl p-4 border border">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg ${platformInfo.color} flex items-center justify-center flex-shrink-0`}>
                                                    <PlatformIcon className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-foreground truncate">
                                                        {link.name || platformInfo.label}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {link.url || <span className="text-muted-foreground/60 italic">No URL added</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Help Card */}
                    <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl p-6 border-2 border-primary/30">
                        <h4 className="font-bold text-foreground mb-3">💡 Quick Tips</h4>
                        <ul className="space-y-2 text-sm text-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Click any platform to add it</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>All fields are optional</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Add as many or few as you like</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Test links before moving on</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}









