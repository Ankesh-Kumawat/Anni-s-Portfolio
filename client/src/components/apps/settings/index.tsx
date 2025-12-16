import { useState } from "react";
import { SettingsSidebar } from "./components/SettingsSidebar";
import { DisplaySettings } from "./components/DisplaySettings";
import { TaskbarSettings } from "./components/TaskbarSettings";
import { SoundSettings } from "./components/SoundSettings";
import { AccountSettings } from "./components/AccountSettings";
import { PlaceholderSettings } from "./components/PlaceholderSettings";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("display");

    return (
        <div className="h-full flex flex-col md:flex-row bg-muted/10 no-scrollbar overflow-hidden">
            <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="flex-1 p-6 md:p-8 overflow-y-auto no-scrollbar bg-background md:bg-transparent">
                <div className="max-w-2xl space-y-8 mx-auto">
                    {activeTab === "display" && <DisplaySettings />}
                    {activeTab === "taskbar" && <TaskbarSettings />}
                    {activeTab === "sound" && <SoundSettings />}
                    {activeTab === "account" && <AccountSettings />}
                    {["network", "notifications", "privacy", "about"].includes(activeTab) && (
                        <PlaceholderSettings />
                    )}
                </div>
            </div>
        </div>
    );
}
