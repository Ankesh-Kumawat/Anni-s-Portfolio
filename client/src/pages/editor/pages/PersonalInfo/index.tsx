import type { StepProps } from "../../types";
import AvatarUpload from "./AvatarUpload";
import BasicInfo from "./BasicInfo";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";
import { saveAboutData } from "@/lib/firebase-service";
import { useToast } from "@/hooks/use-toast";
import { useTechStacks } from "@/hooks/use-tech-stacks";
import { useState } from "react";

export default function PersonalInfo({ data, setData }: StepProps) {
    const [savingField, setSavingField] = useState<string | null>(null);
    const { toast } = useToast();
    const { techStacks, loading: techStacksLoading } = useTechStacks();

    const saveField = async (fieldName: string) => {
        try {
            setSavingField(fieldName);
            await saveAboutData(data.about);
            toast({ title: "Saved!", description: `${fieldName} saved` });
        } catch {
            toast({ title: "Failed", variant: "destructive" });
        } finally {
            setSavingField(null);
        }
    };

    const update = (field: string, value: string) => {
        setData((prev) => ({
            ...prev,
            about: { ...prev.about, personal: { ...prev.about.personal, [field]: value } },
        }));
    };

    return (
        <div className="space-y-5">
            {/* Row 1: Avatar + Basic Info */}
            <div className="grid grid-cols-[160px_1fr] gap-5">
                <AvatarUpload avatar={data.about.personal.avatar} onAvatarChange={(url) => update("avatar", url)} />
                <BasicInfo
                    name={data.about.personal.name}
                    title={data.about.personal.title}
                    location={data.about.personal.location}
                    bio={data.about.personal.bio}
                    careerStartDate={data.about.personal.careerStartDate}
                    onNameChange={(v) => update("name", v)}
                    onTitleChange={(v) => update("title", v)}
                    onLocationChange={(v) => update("location", v)}
                    onCareerStartDateChange={(v) => update("careerStartDate", v)}
                    onBioChange={(v) => update("bio", v)}
                    onSave={saveField}
                    savingField={savingField}
                />
            </div>

            {/* Row 2: Skills + Experience side by side */}
            <div className="grid grid-cols-2 gap-5">
                <SkillsSection data={data} setData={setData} techStacks={techStacks} loading={techStacksLoading} />
                <ExperienceSection data={data} setData={setData} />
            </div>
        </div>
    );
}
