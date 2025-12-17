import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Download, Check, Monitor } from "lucide-react";
import Step1Personal from "./steps/Step1Personal";
import Step2Contact from "./steps/Step2Contact";
import Step3Social from "./steps/Step3Social";
import Step4Projects from "./steps/Step4Projects";
import Step5Gallery from "./steps/Step5Gallery";
import Step6Notepad from "./steps/Step6Notepad";
import Step7Advanced from "./steps/Step7Advanced";
import Step8Review from "./steps/Step8Review";
import { generateZip } from "./lib/generator";
import type { EditorData } from "./types";

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
    { id: 4, title: "Projects", component: Step4Projects },
    { id: 5, title: "Gallery", component: Step5Gallery },
    { id: 6, title: "Notepad", component: Step6Notepad },
    { id: 7, title: "Advanced", component: Step7Advanced },
    { id: 8, title: "Review & Download", component: Step8Review },
];

export default function Editor() {
    const [isMobile, setIsMobile] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
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
            folders: [],
            directImages: [],
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
    });

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
    }, [data.about.personal, data.contact.email]);

    const progress = (currentStep / STEPS.length) * 100;
    const CurrentStepComponent = STEPS[currentStep - 1].component;

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
            case 4: // Projects - Optional
                return true;
            case 5: // Gallery - Optional
                return true;
            case 6: // Notepad - Optional
                return true;
            case 7: // Advanced - Optional
                return true;
            case 8: // Review
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
        await generateZip(data);
    };

    // Show mobile blocker on small screens
    if (isMobile) {
        return <MobileBlocker />;
    }

    return (
        <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            {/* Header */}
            <div className="flex-shrink-0 border-b bg-white/90 backdrop-blur-md shadow-sm">
                <div className="max-w-[1800px] mx-auto px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Portfolio Editor
                                </h1>
                                <p className="text-sm text-gray-500 mt-1 font-medium">
                                    Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
                                </p>
                            </div>
                            <div className="h-12 w-px bg-gray-200" />
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">Progress</div>
                                    <div className="text-lg font-bold text-gray-900">{Math.round(progress)}%</div>
                                </div>
                                <div className="w-32">
                                    <Progress value={progress} className="h-2" />
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={handleDownload}
                            disabled={currentStep !== STEPS.length}
                            size="lg"
                            className="gap-2 px-6"
                        >
                            <Download className="w-4 h-4" />
                            Download ZIP
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <div className="h-full max-w-[1800px] mx-auto px-8 py-6">
                    <div className="h-full grid grid-cols-[320px_1fr] gap-6">
                        {/* Left Sidebar */}
                        <div className="h-full overflow-y-auto scrollbar-hide">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-3">
                                <div className="mb-6">
                                    <h3 className="font-bold text-gray-900 text-lg">Navigation</h3>
                                    <p className="text-xs text-gray-500 mt-1">Click to jump to any step</p>
                                </div>
                                {STEPS.map((step) => (
                                    <button
                                        key={step.id}
                                        onClick={() => setCurrentStep(step.id)}
                                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all text-left group ${currentStep === step.id
                                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                                            : currentStep > step.id
                                                ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:shadow-md border border-green-200"
                                                : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md border border-gray-200"
                                            }`}
                                    >
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentStep === step.id
                                            ? "bg-white text-blue-600 shadow-md"
                                            : currentStep > step.id
                                                ? "bg-green-600 text-white"
                                                : "bg-white text-gray-600 group-hover:bg-gray-200"
                                            }`}>
                                            {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-sm leading-tight">{step.title}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="h-full flex flex-col bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide p-10">
                                <CurrentStepComponent data={data} setData={setData} />
                            </div>

                            {/* Navigation */}
                            <div className="flex-shrink-0 border-t bg-gradient-to-r from-gray-50 to-slate-50 px-10 py-6">
                                {!isStepValid(currentStep) && currentStep < STEPS.length && (
                                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                                        <p className="text-sm text-amber-800 font-medium">
                                            Please fill all required fields to continue
                                        </p>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <Button
                                        onClick={handlePrev}
                                        disabled={currentStep === 1}
                                        variant="outline"
                                        size="lg"
                                        className="gap-2 px-6"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </Button>
                                    <div className="text-sm font-medium text-gray-500">
                                        Step {currentStep} of {STEPS.length}
                                    </div>
                                    <Button
                                        onClick={handleNext}
                                        disabled={currentStep === STEPS.length || !isStepValid(currentStep)}
                                        size="lg"
                                        className="gap-2 px-6"
                                        title={!isStepValid(currentStep) ? "Please fill all required fields" : ""}
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
