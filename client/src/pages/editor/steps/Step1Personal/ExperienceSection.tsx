import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, Briefcase } from "lucide-react";
import type { EditorData } from "../../types";

interface ExperienceSectionProps {
    data: EditorData;
    setData: React.Dispatch<React.SetStateAction<EditorData>>;
}

export default function ExperienceSection({ data, setData }: ExperienceSectionProps) {
    const addExperience = () => {
        setData((prev) => ({
            ...prev,
            about: {
                ...prev.about,
                experience: [
                    ...prev.about.experience,
                    {
                        id: `exp${Date.now()}`,
                        title: "",
                        company: "",
                        period: "",
                        description: "",
                    },
                ],
            },
        }));
    };

    const updateExperience = (index: number, field: string, value: string) => {
        setData((prev) => ({
            ...prev,
            about: {
                ...prev.about,
                experience: prev.about.experience.map((exp, i) =>
                    i === index ? { ...exp, [field]: value } : exp
                ),
            },
        }));
    };

    const removeExperience = (index: number) => {
        setData((prev) => ({
            ...prev,
            about: {
                ...prev.about,
                experience: prev.about.experience.filter((_, i) => i !== index),
            },
        }));
    };

    return (
        <div className="bg-card rounded-2xl p-8 border-2 border shadow-md">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground">Work Experience</h3>
                        <p className="text-sm text-muted-foreground">Optional - Add your professional journey</p>
                    </div>
                </div>
                <Button onClick={addExperience} type="button" variant="outline" size="lg" className="gap-2 px-6">
                    <Plus className="w-4 h-4" />
                    Add Experience
                </Button>
            </div>

            {data.about.experience.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border rounded-2xl bg-muted">
                    <Briefcase className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No experience added yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Click "Add Experience" to get started</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {data.about.experience.map((exp, index) => (
                        <div key={exp.id} className="border-2 border rounded-2xl p-6 space-y-5 bg-muted">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-lg text-foreground">Experience #{index + 1}</h4>
                                <Button
                                    onClick={() => removeExperience(index)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Remove
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-foreground">Job Title</Label>
                                    <Input
                                        value={exp.title}
                                        onChange={(e) => updateExperience(index, "title", e.target.value)}
                                        placeholder="Senior Developer"
                                        className="h-11 text-base"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-foreground">Company</Label>
                                    <Input
                                        value={exp.company}
                                        onChange={(e) => updateExperience(index, "company", e.target.value)}
                                        placeholder="Tech Corp Inc."
                                        className="h-11 text-base"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground">Period</Label>
                                <Input
                                    value={exp.period}
                                    onChange={(e) => updateExperience(index, "period", e.target.value)}
                                    placeholder="Jan 2020 - Present"
                                    className="h-11 text-base"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-foreground">Description</Label>
                                <Textarea
                                    value={exp.description}
                                    onChange={(e) => updateExperience(index, "description", e.target.value)}
                                    placeholder="Describe your role, responsibilities, and key achievements..."
                                    rows={4}
                                    className="resize-none text-base"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
