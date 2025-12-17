import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Download, Check } from "lucide-react";
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

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleDownload = async () => {
        await generateZip(data);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Portfolio Editor</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
                            </p>
                        </div>
                        <Button
                            onClick={handleDownload}
                            disabled={currentStep !== STEPS.length}
                            className="gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download ZIP
                        </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <Progress value={progress} className="h-2" />
                    </div>
                </div>
            </div>

            {/* Main Layout - Side by Side */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
                    {/* Left Sidebar - Step Navigation */}
                    <div className="lg:sticky lg:top-24 lg:h-fit">
                        <div className="bg-white rounded-xl shadow-sm border p-4 space-y-2">
                            <h3 className="font-semibold text-gray-900 mb-4">Steps</h3>
                            {STEPS.map((step) => (
                                <button
                                    key={step.id}
                                    onClick={() => {
                                        setCurrentStep(step.id);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${currentStep === step.id
                                            ? "bg-blue-600 text-white shadow-md"
                                            : currentStep > step.id
                                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-semibold ${currentStep === step.id
                                            ? "bg-white text-blue-600"
                                            : currentStep > step.id
                                                ? "bg-green-600 text-white"
                                                : "bg-gray-200 text-gray-600"
                                        }`}>
                                        {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">{step.title}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Form */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <CurrentStepComponent data={data} setData={setData} />
                        </div>

                        {/* Navigation Buttons - Inside Form */}
                        <div className="border-t bg-gray-50 px-6 sm:px-8 py-4">
                            <div className="flex items-center justify-between">
                                <Button
                                    onClick={handlePrev}
                                    disabled={currentStep === 1}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>
                                <div className="text-sm text-gray-600">
                                    Step {currentStep} of {STEPS.length}
                                </div>
                                <Button
                                    onClick={handleNext}
                                    disabled={currentStep === STEPS.length}
                                    className="gap-2"
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
    );
}
