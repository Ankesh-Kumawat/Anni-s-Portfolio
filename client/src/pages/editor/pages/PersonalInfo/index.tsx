import type { StepProps } from "../../types";
import AvatarUpload from "./AvatarUpload";
import BasicInfo from "./BasicInfo";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";
import SectionCard from "../../components/SectionCard";
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
        <div className="editor-page-grid">
            <SectionCard
                title="Profile Identity"
                eyebrow="Required"
                description="Photo, name, role, location, start date, and bio in one place."
            >
                <div className="editor-profile-identity">
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
            </SectionCard>

            <div className="editor-page-grid equal">
                <SectionCard
                    title="Skills Library"
                    eyebrow="Capabilities"
                    description="Pick skills from the managed tech-stack catalog."
                >
                    <SkillsSection data={data} setData={setData} techStacks={techStacks} loading={techStacksLoading} />
                </SectionCard>
                <SectionCard
                    title="Experience"
                    eyebrow="Timeline"
                    description="Add work history for the About and database apps."
                >
                    <ExperienceSection data={data} setData={setData} />
                </SectionCard>
            </div>
        </div>
    );
}
