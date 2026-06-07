import {
    FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaYoutube,
    FaDribbble, FaBehance, FaMedium, FaStackOverflow, FaCodepen,
    FaFigma, FaDiscord, FaTwitch, FaTiktok, FaReddit, FaProductHunt,
    FaTelegram, FaWhatsapp, FaSnapchat, FaSpotify, FaPinterest, FaSlack,
    FaGlobe, FaEnvelope, FaBriefcase
} from "react-icons/fa";
import { SiDevdotto, SiFiverr, SiUpwork, SiFreelancer } from "react-icons/si";

export const POPULAR_PLATFORMS = [
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
    { value: "fiverr", label: "Fiverr", icon: SiFiverr, color: "bg-[#1DBF73]", placeholder: "https://fiverr.com/username" },
    { value: "upwork", label: "Upwork", icon: SiUpwork, color: "bg-[#6FDA44]", placeholder: "https://upwork.com/freelancers/~..." },
    { value: "freelancer", label: "Freelancer", icon: SiFreelancer, color: "bg-[#29B2FE]", placeholder: "https://freelancer.com/u/username" },
    { value: "toptal", label: "Toptal", icon: FaBriefcase, color: "bg-[#3863A0]", placeholder: "https://toptal.com/resume/..." },
    { value: "website", label: "Website", icon: FaGlobe, color: "bg-[#3B82F6]", placeholder: "https://yourwebsite.com" },
    { value: "email", label: "Email", icon: FaEnvelope, color: "bg-[#6B7280]", placeholder: "mailto:your@email.com" },
];

export function getPlatformInfo(platformValue: string) {
    return POPULAR_PLATFORMS.find(p => p.value === platformValue) || POPULAR_PLATFORMS[POPULAR_PLATFORMS.length - 1];
}
