import { Sparkles } from "lucide-react";
import { useState } from "react";
import type { StepProps } from "../../types";
import AvatarUpload from "./AvatarUpload";
import BasicInfo from "./BasicInfo";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";
import ProfileChecklist from "./ProfileChecklist";
import { saveAboutData } from "@/lib/firebase-service";
import { useToast } from "@/hooks/use-toast";
import { calculateStep1Completion } from "../../lib/completionCalculator";
import { useTechStacks } from "@/hooks/use-tech-stacks";

export default function Step1Personal({ data, setData }: StepProps) {
    const [savingField, setSavingField] = useState<string | null>(null);
    const { toast } = useToast();
    const { techStacks, loading: techStacksLoading } = useTechStacks();

    const saveField = async (fieldName: string) => {
        try {
            setSavingField(fieldName);
            await saveAboutData(data.about);
            toast({
                title: "Saved!",
                description: `${fieldName} has been saved to Firebase`,
            });
        } catch (error) {
            console.error("Save error:", error);
            toast({
                title: "Save Failed",
                description: "Could not save to Firebase. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSavingField(null);
        }
    };

    const handleAvatarChange = (url: string) => {
        setData((prev) => ({
            ...prev,
            about: {
                ...prev.about,
                personal: {
                    ...prev.about.personal,
                    avatar: url,
                },
            },
        }));
    };

    const handleNameChange = (value: string) => {
        setData((prev) => ({
            ...prev,
            about: {
                ...prev.about,
                personal: { ...prev.about.personal, name: value },
            },
        }));
    };

    const handleTitleChange = (value: string) => {
        setData((prev) => ({
            ...prev,
            about: {
                ...prev.about,
                personal: { ...prev.about.personal, title: value },
            },
        }));
    };

    const handleLocationChange = (value: string) => {
        setData((prev) => ({
            ...prev,
            about: {
                ...prev.about,
                personal: { ...prev.about.personal, location: value },
            },
        }));
    };

    const handleBioChange = (value: string) => {
        setData((prev) => ({
            ...prev,
            about: {
                ...prev.about,
                personal: { ...prev.about.personal, bio: value },
            },
        }));
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Header Section */}
            <div className="mb-10">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-4xl font-bold mb-2">Personal Information</h2>
                        <p className="text-muted-foreground text-lg">Build your professional profile with essential details</p>
                    </div>
                    <div className="flex items-center gap-3 bg-card px-6 py-4 rounded-2xl border-2 border">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Completion</div>
                            <div className="text-2xl font-bold text-primary">
                                {calculateStep1Completion(data)}%
                            </div>
                        </div>
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-[380px_1fr] gap-8">
                {/* Left Column - Avatar & Quick Info */}
                <div className="space-y-6">
                    <AvatarUpload 
                        avatar={data.about.personal.avatar}
                        onAvatarChange={handleAvatarChange}
                    />
                    <ProfileChecklist data={data} />
                </div>

                {/* Right Column - Forms */}
                <div className="space-y-8">
                    <BasicInfo 
                        name={data.about.personal.name}
                        title={data.about.personal.title}
                        location={data.about.personal.location}
                        bio={data.about.personal.bio}
                        onNameChange={handleNameChange}
                        onTitleChange={handleTitleChange}
                        onLocationChange={handleLocationChange}
                        onBioChange={handleBioChange}
                        onSave={saveField}
                        savingField={savingField}
                    />
                    <SkillsSection 
                        data={data} 
                        setData={setData} 
                        techStacks={techStacks}
                        loading={techStacksLoading}
                    />
                    <ExperienceSection data={data} setData={setData} />
                </div>
            </div>
        </div>
    );
}
