import { Monitor, Volume2, Wifi, Bell, User, Lock, Info, LayoutDashboard } from "lucide-react";

export const TABS = [
    { id: "display", label: "Display", icon: Monitor },
    { id: "taskbar", label: "Taskbar", icon: LayoutDashboard },
    { id: "sound", label: "Sound", icon: Volume2 },
    { id: "network", label: "Network", icon: Wifi },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "account", label: "Account", icon: User },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "about", label: "About", icon: Info },
];
