import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, LogOut, Loader2, Settings, Layers } from "lucide-react";
import Sidebar from "./components/Sidebar";
import PersonalInfo from "./pages/PersonalInfo";
import ContactPage from "./pages/Contact";
import SocialLinksPage from "./pages/SocialLinks";
import ProjectsPage from "./pages/Projects";
import NotepadPage from "./pages/Notepad";
import AdvancedPage from "./pages/Advanced";
import MusicPage from "./pages/Music";
import YouTubePage from "./pages/YouTube";
import PreferencesPage from "./pages/Preferences";
import AppsPage from "./pages/Apps";
import ReviewPage from "./pages/Review";
import type { EditorData } from "./types";
import { saveAllData, getAllData } from "@/lib/firebase-service";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { calculateOverallCompletion } from "./lib/completionCalculator";
import { TechStackManager } from "./pages/TechStacks";

export default function Editor() {
    const [activeSection, setActiveSection] = useState("personal");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showTechStackManager, setShowTechStackManager] = useState(false);
    const { logout } = useAuth();
    const { toast } = useToast();
    const [, setLocation] = useLocation();
    const [data, setData] = useState<EditorData>({
        about: { personal: { name: "", title: "", location: "", avatar: "", bio: "" }, skills: [], experience: [] },
        contact: { email: "", location: "", message: "", copyright: "" },
        social: { links: [] },
        projects: { projects: [] },
        gallery: { coverImages: {}, platformImages: {} },
        notepad: { defaultNotes: [] },
        terminal: { username: "", userRole: "", about: "", contact: { email: "", location: "" }, skills: { technical: [], soft: [] }, skillLevels: [] },
        database: { user: { user_id: "", name: "", nickname: "", email: "", role: "", department: "", status: "", joined_date: "", last_active: "" }, projects: [] },
        settings: { account: { name: "", role: "", avatar: "" } },
        assets: { images: [], music: [] },
        browser: { bookmarks: [], history: [], quickLinks: [] },
        music: { songs: [] },
        youtube: { apiKey: "", channelId: "", channelName: "", channelLogo: "" },
        preferences: {
            wallpapers: [], activeWallpaper: { desktop: "", mobile: "" },
            wallpaperEffects: { desktop: { blur: 0, opacity: 100 }, mobile: { blur: 0, opacity: 100 } },
            iconPacks: [], activeIconPack: "",
            apps: { globalNameColor: "#ffffff", showLabels: true }, theme: "dark",
        },
    });

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const firebaseData = await getAllData();
                if (firebaseData && firebaseData.about) {
                    setData(prev => ({
                        ...prev,
                        about: firebaseData.about as typeof prev.about || prev.about,
                        projects: firebaseData.projects as typeof prev.projects || prev.projects,
                        contact: firebaseData.contact as typeof prev.contact || prev.contact,
                        social: firebaseData.social as typeof prev.social || prev.social,
                        gallery: firebaseData.gallery as typeof prev.gallery || prev.gallery,
                        notepad: firebaseData.notepad as typeof prev.notepad || prev.notepad,
                        terminal: firebaseData.terminal as typeof prev.terminal || prev.terminal,
                        database: firebaseData.database as typeof prev.database || prev.database,
                        settings: firebaseData.settings as typeof prev.settings || prev.settings,
                        browser: firebaseData.browser as typeof prev.browser || prev.browser,
                        music: firebaseData.music as typeof prev.music || prev.music,
                        youtube: firebaseData.youtube as typeof prev.youtube || prev.youtube,
                        preferences: firebaseData.preferences as typeof prev.preferences || prev.preferences,
                    }));
                    toast({ title: "Data Loaded", description: "Portfolio data loaded from Firebase" });
                }
            } catch (error) {
                toast({ title: "Load Failed", description: "Could not load data.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [toast]);

    useEffect(() => {
        setData((prev: EditorData) => {
            const u = { ...prev };
            if (prev.about.personal.location && !prev.contact.location) u.contact.location = prev.about.personal.location;
            const g = { coverImages: {} as any, platformImages: {} as any };
            prev.projects.projects.forEach((p) => {
                if (p.coverImages && Object.keys(p.coverImages).length > 0) g.coverImages[p.id] = { ...p.coverImages };
                if (p.platformImages && Object.keys(p.platformImages).length > 0) {
                    g.platformImages[p.id] = {};
                    Object.entries(p.platformImages).forEach(([pl, imgs]: [string, any]) => {
                        if (Array.isArray(imgs) && imgs.length > 0) g.platformImages[p.id][pl] = [...imgs];
                    });
                }
            });
            u.gallery = g;
            u.terminal = {
                username: prev.about.personal.name.toLowerCase().replace(/\s+/g, "_") || "",
                userRole: prev.about.personal.title || "", about: prev.about.personal.bio || "",
                contact: { email: prev.contact.email || "", location: prev.contact.location || prev.about.personal.location || "" },
                skills: { technical: prev.about.skills || [], soft: [] }, skillLevels: prev.terminal.skillLevels || [],
            };
            const now = new Date().toISOString().split("T")[0];
            u.database = {
                user: { user_id: prev.about.personal.name ? `user_${Date.now()}` : "", name: prev.about.personal.name || "", nickname: prev.about.personal.name.split(" ")[0] || "", email: prev.contact.email || "", role: prev.about.personal.title || "", department: "Engineering", status: "Active", joined_date: now, last_active: now },
                projects: prev.projects.projects.map((p, i) => ({ project_id: `P-${String(i + 1).padStart(4, "0")}`, name: p.name, status: p.status, platform: p.platform, tech_stack: p.techStack.join(", "), created_date: now, last_updated: now })),
            };
            u.settings = { account: { name: prev.about.personal.name || "", role: prev.about.personal.title || "", avatar: prev.about.personal.avatar || "" } };
            if (prev.about.personal.name && !prev.contact.copyright) u.contact.copyright = `\u00a9 ${new Date().getFullYear()} ${prev.about.personal.name}. All rights reserved.`;
            return u;
        });
    }, [data.about.personal, data.contact.email, data.projects.projects]);

    const handleSave = async () => {
        try { setSaving(true); await saveAllData(data); toast({ title: "Saved!", description: "Data saved to Firebase" }); }
        catch { toast({ title: "Save Failed", variant: "destructive" }); }
        finally { setSaving(false); }
    };

    const handleLogout = async () => { try { await logout(); setLocation("/admin-login"); } catch {} };

    if (loading) return (
        <div className="fixed inset-0 flex items-center justify-center bg-background">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
    );

    const progress = calculateOverallCompletion(data);
    const sectionTitle = {
        personal: "Profile",
        contact: "Contact",
        social: "Social Links",
        projects: "Projects",
        notepad: "Notepad",
        advanced: "System Settings",
        music: "Music Library",
        youtube: "YouTube",
        preferences: "Preferences",
        apps: "Apps",
        review: "Review",
    }[activeSection] || "Profile";

    const renderSection = () => {
        switch (activeSection) {
            case "personal": return <PersonalInfo data={data} setData={setData} />;
            case "contact": return <ContactPage data={data} setData={setData} />;
            case "social": return <SocialLinksPage data={data} setData={setData} />;
            case "projects": return <ProjectsPage data={data} setData={setData} />;
            case "notepad": return <NotepadPage data={data} setData={setData} />;
            case "advanced": return <AdvancedPage data={data} setData={setData} />;
            case "music": return <MusicPage data={data} setData={setData} />;
            case "youtube": return <YouTubePage data={data} setData={setData} />;
            case "preferences": return <PreferencesPage data={data} setData={setData} />;
            case "apps": return <AppsPage data={data} setData={setData} />;
            case "review": return <ReviewPage data={data} setData={setData} />;
            default: return <PersonalInfo data={data} setData={setData} />;
        }
    };

    return (
        <div className="editor-redesign h-screen flex bg-background text-foreground">
            <aside className="editor-sidebar w-[248px] flex-shrink-0">
                <div className="editor-brand">
                    <div className="editor-brand-mark">
                        <Layers className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="editor-kicker">PortfolioOS</p>
                        <h1>Editor Studio</h1>
                    </div>
                </div>

                <div className="editor-progress-panel">
                    <div className="flex items-center justify-between">
                        <span>Completion</span>
                        <Badge variant="outline">{Math.round(progress)}%</Badge>
                    </div>
                    <div className="editor-progress-track">
                        <div style={{ width: `${Math.min(100, Math.max(0, Math.round(progress)))}%` }} />
                    </div>
                </div>

                <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
            </aside>

            <div className="flex-1 min-w-0 flex flex-col">
                <header className="editor-topbar">
                    <div>
                        <p className="editor-kicker">Current section</p>
                        <h2>{sectionTitle}</h2>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <Button onClick={() => setShowTechStackManager(true)} variant="outline" size="sm" className="editor-action">
                            <Settings className="h-3.5 w-3.5" />
                            Tech Stacks
                        </Button>
                        <Button onClick={handleSave} disabled={saving} size="sm" className="editor-save">
                            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                            Save
                        </Button>
                        <Button onClick={handleLogout} variant="ghost" size="sm" className="editor-logout">
                            <LogOut className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </header>

                <main className="editor-content flex-1 min-h-0 overflow-y-auto">
                    <div className="editor-content-inner">
                        {renderSection()}
                    </div>
                </main>
            </div>

            {showTechStackManager && (
                <div className="editor-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="editor-modal max-w-4xl w-full max-h-[85vh] overflow-hidden">
                        <div className="editor-modal-header">
                            <h2>Tech Stack Manager</h2>
                            <Button onClick={() => setShowTechStackManager(false)} variant="ghost" size="sm">Close</Button>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(85vh-56px)]">
                            <TechStackManager />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
