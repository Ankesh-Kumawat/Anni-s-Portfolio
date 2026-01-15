import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check, Award, Loader2, Save } from "lucide-react";
import { useState } from "react";
import type { EditorData } from "../../types";
import { useToast } from "@/hooks/use-toast";
import { saveAboutData } from "@/lib/firebase-service";

interface SkillsSectionProps {
    data: EditorData;
    setData: React.Dispatch<React.SetStateAction<EditorData>>;
    techStacks: { [key: string]: string[] };
    loading: boolean;
}

export default function SkillsSection({ data, setData, techStacks, loading }: SkillsSectionProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("Frontend");
    const [savingField, setSavingField] = useState<string | null>(null);
    const { toast } = useToast();

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

    const toggleSkill = (skill: string) => {
        setData((prev) => {
            const isSelected = prev.about.skills.includes(skill);
            return {
                ...prev,
                about: {
                    ...prev.about,
                    skills: isSelected
                        ? prev.about.skills.filter((s) => s !== skill)
                        : [...prev.about.skills, skill],
                },
            };
        });
    };

    const removeSkill = (skill: string) => {
        setData((prev) => ({
            ...prev,
            about: {
                ...prev.about,
                skills: prev.about.skills.filter((s) => s !== skill),
            },
        }));
    };

    return (
        <div className="bg-card rounded-2xl p-8 border-2 border shadow-md">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground">Skills & Technologies</h3>
                        <p className="text-sm text-muted-foreground">Select your technical expertise</p>
                    </div>
                </div>
                <Badge variant="secondary" className="text-base px-4 py-2">
                    {data.about.skills.length} selected
                </Badge>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {loading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Loading categories...</span>
                    </div>
                ) : (
                    Object.keys(techStacks).map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            selectedCategory === category
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-muted text-foreground hover:bg-muted/80 border border"
                        }`}
                    >
                        {category}
                    </button>
                ))
                )}
            </div>

            {/* Skill Chips */}
            <div className="border-2 border rounded-2xl p-6 bg-muted min-h-[180px] mb-5">
                {Object.keys(techStacks).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="text-lg font-semibold mb-2">No Tech Stacks Available</p>
                        <p className="text-sm">Please upload tech stacks using the "Tech Stacks" button in the header</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {techStacks[selectedCategory]?.map((skill) => {
                            const isSelected = data.about.skills.includes(skill);
                            return (
                                <button
                                    key={skill}
                                    onClick={() => toggleSkill(skill)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                                        isSelected
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : "bg-card text-foreground border-2 border hover:border-primary hover:shadow-md"
                                    }`}
                                >
                                    {isSelected && <Check className="w-4 h-4" />}
                                    {skill}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Selected Skills Display */}
            {data.about.skills.length > 0 && (
                <div className="p-6 bg-primary/10 rounded-2xl border-2 border-primary">
                    <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-bold text-primary flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            Selected Skills ({data.about.skills.length})
                        </Label>
                        <Button
                            onClick={() => saveField("Skills")}
                            disabled={savingField === "Skills"}
                            size="sm"
                            className="gap-2"
                        >
                            {savingField === "Skills" ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-3 h-3" />
                                    Save Skills
                                </>
                            )}
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {data.about.skills.map((skill) => (
                            <Badge key={skill} className="gap-2 px-4 py-2 bg-card text-foreground border-2 border text-sm">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="hover:text-red-600 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
