import { useState } from "react";
import { SettingsSidebar } from "./components/SettingsSidebar";
import { DisplaySettings } from "./components/DisplaySettings";
import { WallpaperSettings } from "./components/WallpaperSettings";
import { TaskbarSettings } from "./components/TaskbarSettings";
import { SoundSettings } from "./components/SoundSettings";
import { AccountSettings } from "./components/AccountSettings";
import { NetworkSettings } from "./components/NetworkSettings";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("display");

    return (
        <div className="h-full flex flex-col lg:flex-row bg-muted/10 no-scrollbar overflow-hidden">
            <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto no-scrollbar bg-background lg:bg-transparent flex justify-center">
                <div className="w-full max-w-5xl space-y-6 lg:space-y-8">
                    {activeTab === "display" && <DisplaySettings />}
                    {activeTab === "wallpaper" && <WallpaperSettings />}
                    {activeTab === "taskbar" && <TaskbarSettings />}
                    {activeTab === "sound" && <SoundSettings />}
                    {activeTab === "account" && <AccountSettings />}
                    {activeTab === "network" && <NetworkSettings />}
                </div>
            </div>
        </div>
    );
}
