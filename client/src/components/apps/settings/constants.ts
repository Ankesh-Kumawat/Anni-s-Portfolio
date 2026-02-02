import { Monitor, Volume2, Wifi, User, LayoutDashboard, Grid3x3 } from "lucide-react";

export const TABS = [
    { id: "display", label: "Display", icon: Monitor },
    { id: "apps", label: "Apps", icon: Grid3x3 },
    { id: "taskbar", label: "Taskbar", icon: LayoutDashboard },
    { id: "sound", label: "Sound", icon: Volume2 },
    { id: "network", label: "Network", icon: Wifi },
    { id: "account", label: "Account", icon: User },
];
