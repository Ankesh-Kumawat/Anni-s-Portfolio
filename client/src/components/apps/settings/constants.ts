import { Monitor, Volume2, Wifi, User, LayoutDashboard } from "lucide-react";

export const TABS = [
    { id: "display", label: "Display", icon: Monitor },
    { id: "taskbar", label: "Taskbar", icon: LayoutDashboard },
    { id: "sound", label: "Sound", icon: Volume2 },
    { id: "network", label: "Network", icon: Wifi },
    { id: "account", label: "Account", icon: User },
];
