import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check, Monitor, Save, LogOut, Loader2, Settings } from "lucide-react";
import Step1Personal from "./steps/Step1Personal";
import Step2Contact from "./steps/Step2Contact";
import Step3Social from "./steps/Step3Social";
import Step4Projects from "./steps/Step4Projects";
import Step5Notepad from "./steps/Step5Notepad";
import Step6Advanced from "./steps/Step6Advanced";
import Step7Review from "./steps/Step7Review";
import Step8Music from "./steps/Step8Music";
import Step9YouTube from "./steps/Step9YouTube";
import Step10Preferences from "./steps/Step10Preferences";
import type { EditorData } from "./types";
import { saveAllData, getAllData } from "@/lib/firebase-service";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { calculateOverallCompletion } from "./lib/completionCalculator";
import { TechStackManager } from "./steps/TechStackManager";

// Mobile Detection Component
function MobileBlocker() {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
            <div className="text-center max-w-md">
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Monitor className="w-10 h-10 text-blue-400" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Desktop Only</h1>
                <p className="text-gray-300 text-lg mb-2">
                    Portfolio Editor is designed for desktop devices only.
                </p>
                <p className="text-gray-400 text-sm">
                    Please access this page from a computer with a larger screen for the best editing experience.
                </p>
                <div className="mt-8 pt-8 border-t border-gray-700">
                    <p className="text-xs text-gray-500">Minimum screen width: 1024px</p>
                </div>
            </div>
        </div>
    );
}

const STEPS = [
    { id: 1, title: "Personal Info", component: Step1Personal },
    { id: 2, title: "Contact", component: Step2Contact },
    { id: 3, title: "Social Links", component: Step3Social },
    { id: 4, title: "Projects & Gallery", component: Step4Projects },
    { id: 5, title: "Notepad", component: Step5Notepad },
    { id: 6, title: "Advanced", component: Step6Advanced },
    { id: 7, title: "Music Library", component: Step8Music },
    { id: 8, title: "YouTube Channel", component: Step9YouTube },
    { id: 9, title: "Preferences", component: Step10Preferences },
    { id: 10, title: "Review & Download", component: Step7Review },
];

export default function Editor() {
    const [isMobile, setIsMobile] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showTechStackManager, setShowTechStackManager] = useState(false);
    const { logout } = useAuth();
    const { toast } = useToast();
    const [, setLocation] = useLocation();
    const [data, setData] = useState<EditorData>({
        about: {
            personal: {
                name: "",
                title: "",
                location: "",
                avatar: "",
                bio: "",
            },
            skills: [],
            experience: [],
        },
        contact: {
            email: "",
            location: "",
            message: "",
            copyright: "",
        },
        social: {
            links: [],
        },
        projects: {
            projects: [],
        },
        gallery: {
            coverImages: {},
            platformImages: {},
        },
        notepad: {
            defaultNotes: [],
        },
        terminal: {
            username: "",
            userRole: "",
            about: "",
            contact: { email: "", location: "" },
            skills: { technical: [], soft: [] },
        },
        database: {
            user: {
                user_id: "",
                name: "",
                nickname: "",
                email: "",
                role: "",
                department: "",
                status: "",
                joined_date: "",
                last_active: "",
            },
            projects: [],
        },
        settings: {
            account: {
                name: "",
                role: "",
                avatar: "",
            },
        },
        assets: {
            images: [],
            music: [],
        },
        browser: {
            bookmarks: [],
            history: [],
            quickLinks: [],
        },
        music: {
            songs: [],
        },
        youtube: {
            apiKey: "",
            channelId: "",
            channelName: "",
            channelLogo: "",
        },
        preferences: {
            wallpaper: {
                desktop: {
                    type: "gradient",
                    url: "",
                    blur: 0,
                    opacity: 100,
                    gradient: "from-slate-900 via-purple-900 to-slate-900",
                    color: "#1e293b",
                },
                mobile: {
                    type: "gradient",
                    url: "",
                    blur: 0,
                    opacity: 100,
                    gradient: "from-slate-900 via-purple-900 to-slate-900",
                    color: "#1e293b",
                },
            },
            theme: "dark",
        },
    });

    // Load data from Firebase on mount
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
                        preferences: firebaseData.preferences as typeof prev.preferences || prev.preferences,
                    }));
                    toast({
                        title: "Data Loaded",
                        description: "Your portfolio data has been loaded from Firebase",
                    });
                }
            } catch (error) {
                console.error("Error loading data:", error);
                toast({
                    title: "Load Failed",
                    description: "Could not load data from Firebase. Starting with empty data.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [toast]);

    // Check screen size
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Auto-sync data across steps
    useEffect(() => {
        setData((prev: EditorData) => {
            const updated = { ...prev };

            // Sync location from Step 1 to Step 2
            if (prev.about.personal.location && !prev.contact.location) {
                updated.contact.location = prev.about.personal.location;
            }

            // Sync Gallery with Projects - IMPORTANT!
            const galleryData = {
                coverImages: {} as { [projectId: string]: { [platform: string]: string } },
                platformImages: {} as { [projectId: string]: { [platform: string]: string[] } }
            };

            prev.projects.projects.forEach((project) => {
                // Copy cover images
                if (project.coverImages && Object.keys(project.coverImages).length > 0) {
                    galleryData.coverImages[project.id] = { ...project.coverImages };
                }

                // Copy platform images
                if (project.platformImages && Object.keys(project.platformImages).length > 0) {
                    galleryData.platformImages[project.id] = {};
                    Object.entries(project.platformImages).forEach(([platform, images]: [string, any]) => {
                        if (Array.isArray(images) && images.length > 0) {
                            galleryData.platformImages[project.id][platform] = [...images];
                        }
                    });
                }
            });

            updated.gallery = galleryData;

            // Sync to Terminal data
            updated.terminal = {
                username: prev.about.personal.name.toLowerCase().replace(/\s+/g, "_") || "",
                userRole: prev.about.personal.title || "",
                about: prev.about.personal.bio || "",
                contact: {
                    email: prev.contact.email || "",
                    location: prev.contact.location || prev.about.personal.location || "",
                },
                skills: {
                    technical: prev.about.skills || [],
                    soft: [],
                },
            };

            // Sync to Database data
            const now = new Date().toISOString().split("T")[0];
            updated.database = {
                user: {
                    user_id: prev.about.personal.name ? `user_${Date.now()}` : "",
                    name: prev.about.personal.name || "",
                    nickname: prev.about.personal.name.split(" ")[0] || "",
                    email: prev.contact.email || "",
                    role: prev.about.personal.title || "",
                    department: "Engineering",
                    status: "Active",
                    joined_date: now,
                    last_active: now,
                },
                projects: prev.projects.projects.map((project, index) => ({
                    project_id: `P-${String(index + 1).padStart(4, '0')}`,
                    name: project.name,
                    status: project.status,
                    platform: project.platform,
                    tech_stack: project.techStack.join(", "),
                    created_date: now,
                    last_updated: now,
                })),
            };

            // Sync to Settings data
            updated.settings = {
                account: {
                    name: prev.about.personal.name || "",
                    role: prev.about.personal.title || "",
                    avatar: prev.about.personal.avatar || "",
                },
            };

            // Auto-generate copyright if name exists
            if (prev.about.personal.name && !prev.contact.copyright) {
                updated.contact.copyright = `© ${new Date().getFullYear()} ${prev.about.personal.name}. All rights reserved.`;
            }

            return updated;
        });
    }, [data.about.personal, data.contact.email, data.projects.projects]);

    const progress = calculateOverallCompletion(data);
    const CurrentStepComponent = STEPS[currentStep - 1].component;

    // Save to Firebase
    const handleSave = async () => {
        try {
            setSaving(true);
            console.log("💾 Saving data to Firebase...");
            console.log("📊 Projects data:", data.projects);
            console.log("🖼️ Gallery data:", data.gallery);
            await saveAllData(data);
            toast({
                title: "Saved Successfully!",
                description: "Your portfolio data has been saved to Firebase",
            });
        } catch (error) {
            console.error("Error saving data:", error);
            toast({
                title: "Save Failed",
                description: "Could not save data to Firebase. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    // Logout
    const handleLogout = async () => {
        try {
            await logout();
            setLocation("/admin-login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    // Validation for each step
    const isStepValid = (step: number): boolean => {
        switch (step) {
            case 1: // Personal Info
                return !!(
                    data.about.personal.name &&
                    data.about.personal.location &&
                    data.about.personal.bio &&
                    data.about.personal.avatar
                );
            case 2: // Contact
                return !!(
                    data.contact.email &&
                    data.contact.location
                );
            case 3: // Social Links - Optional
                return true;
            case 4: // Projects & Gallery - Optional
                return true;
            case 5: // Notepad - Optional
                return true;
            case 6: // Advanced - Optional
                return true;
            case 7: // Review
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (currentStep < STEPS.length && isStepValid(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleDownload = async () => {
        // Download functionality removed - all data is saved to Firebase
    };

    // Mobile blocker temporarily disabled for testing
    // if (isMobile) {
    //     return <MobileBlocker />;
    // }

    // Show loading state
    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                    <p className="text-sm font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-background via-muted/30 to-background">
            {/* Compact Header */}
            <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur-md shadow-sm">
                <div className="max-w-full mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                    Portfolio Editor
                                </h1>
                                <p className="text-xs text-muted-foreground font-medium">
                                    {STEPS[currentStep - 1].title}
                                </p>
                            </div>
                            <div className="h-8 w-px bg-border" />
                            <div className="flex items-center gap-2">
                                <div className="text-xs text-muted-foreground">Step {currentStep}/{STEPS.length}</div>
                                <div className="w-24">
                                    <Progress value={progress} className="h-1.5" />
                                </div>
                                <div className="text-xs font-bold text-primary">{Math.round(progress)}%</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                size="sm"
                                className="gap-2 h-8"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-3 h-3" />
                                        Save
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={() => setShowTechStackManager(true)}
                                variant="outline"
                                size="sm"
                                className="gap-2 h-8"
                            >
                                <Settings className="w-3 h-3" />
                                Tech Stacks
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                size="sm"
                                className="gap-2 h-8"
                            >
                                <LogOut className="w-3 h-3" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Compact Main Content */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <div className="h-full max-w-full mx-auto px-4 py-4">
                    <div className="h-full grid grid-cols-[240px_1fr] gap-4">
                        {/* Compact Left Sidebar */}
                        <div className="h-full overflow-y-auto scrollbar-hide">
                            <div className="bg-card rounded-xl shadow-md border p-4 space-y-2">
                                <div className="mb-3">
                                    <h3 className="font-bold text-sm">Steps</h3>
                                    <p className="text-xs text-muted-foreground">Jump to any step</p>
                                </div>
                                {STEPS.map((step) => (
                                    <button
                                        key={step.id}
                                        onClick={() => setCurrentStep(step.id)}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left group ${currentStep === step.id
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : currentStep > step.id
                                                ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                                                : "bg-muted hover:bg-muted/80 border"
                                            }`}
                                    >
                                        <div className={`flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold ${currentStep === step.id
                                            ? "bg-primary-foreground text-primary"
                                            : currentStep > step.id
                                                ? "bg-green-600 text-white"
                                                : "bg-background"
                                            }`}>
                                            {currentStep > step.id ? <Check className="w-3 h-3" /> : step.id}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-xs leading-tight">{step.title}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Compact Right Content */}
                        <div className="h-full flex flex-col bg-card rounded-xl shadow-md border overflow-hidden">
                            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide p-6">
                                <CurrentStepComponent
                                    data={data}
                                    setData={setData}
                                />
                            </div>

                            {/* Compact Navigation */}
                            <div className="flex-shrink-0 border-t bg-muted/30 px-6 py-3">
                                {!isStepValid(currentStep) && currentStep < STEPS.length && (
                                    <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        <p className="text-xs text-amber-800 font-medium">
                                            Please fill required fields
                                        </p>
                                    </div>
                                )}
                                <div className={`flex items-center ${currentStep === STEPS.length ? 'justify-start' : 'justify-between'}`}>
                                    <Button
                                        onClick={handlePrev}
                                        disabled={currentStep === 1}
                                        variant="outline"
                                        size="sm"
                                        className="gap-1 px-4 h-8"
                                    >
                                        <ChevronLeft className="w-3 h-3" />
                                        Previous
                                    </Button>
                                    {currentStep < STEPS.length && (
                                        <>
                                            <div className="text-xs font-medium text-gray-500">
                                                {currentStep}/{STEPS.length}
                                            </div>
                                            <Button
                                                onClick={handleNext}
                                                disabled={!isStepValid(currentStep)}
                                                size="sm"
                                                className="gap-1 px-4 h-8"
                                                title={!isStepValid(currentStep) ? "Fill required fields" : ""}
                                            >
                                                Next
                                                <ChevronRight className="w-3 h-3" />
                                            </Button>
                                        </>
                                    )}
                                    {currentStep === STEPS.length && (
                                        <div className="ml-2 text-xs font-medium text-gray-500">
                                            Final Step
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tech Stack Manager Modal */}
            {showTechStackManager && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Tech Stack Manager</h2>
                            <Button
                                onClick={() => setShowTechStackManager(false)}
                                variant="ghost"
                                size="sm"
                            >
                                Close
                            </Button>
                        </div>
                        <TechStackManager />
                    </div>
                </div>
            )}
        </div>
    );
}
