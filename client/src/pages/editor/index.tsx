import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
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

    const progress = (currentStep / STEPS.length) * 100;
    const CurrentStepComponent = STEPS[currentStep - 1].component;

    const handleNext = () => {
        if (currentStep < STEPS.length) {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

            {/* Step Indicators */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between overflow-x-auto pb-2">
                    {STEPS.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <button
                                onClick={() => setCurrentStep(step.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${currentStep === step.id
                                        ? "bg-blue-600 text-white"
                                        : currentStep > step.id
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                <span className="font-semibold">{step.id}</span>
                                <span className="text-sm whitespace-nowrap hidden sm:inline">
                                    {step.title}
                                </span>
                            </button>
                            {index < STEPS.length - 1 && (
                                <div className="w-8 h-0.5 bg-gray-300 mx-1" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8">
                    <CurrentStepComponent data={data} setData={setData} />
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
    );
}
