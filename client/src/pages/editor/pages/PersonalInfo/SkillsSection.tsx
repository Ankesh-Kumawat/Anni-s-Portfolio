import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check, Loader2, Save } from "lucide-react";
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
    const [selectedCategory, setSelectedCategory] = useState("Frontend");
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const saveSkills = async () => {
        try {
            setSaving(true);
            await saveAboutData(data.about);
            toast({ title: "Saved!" });
        } catch {
            toast({ title: "Failed", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const toggleSkill = (skill: string) => {
        setData((prev) => {
            const has = prev.about.skills.includes(skill);
            return {
                ...prev,
                about: { ...prev.about, skills: has ? prev.about.skills.filter((s) => s !== skill) : [...prev.about.skills, skill] },
            };
        });
    };

    const removeSkill = (skill: string) => {
        setData((prev) => ({ ...prev, about: { ...prev.about, skills: prev.about.skills.filter((s) => s !== skill) } }));
    };

    const categories = Object.keys(techStacks);

    return (
        <div className="border rounded-lg p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="text-sm font-semibold">Skills</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Technical expertise</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{data.about.skills.length}</Badge>
                    {data.about.skills.length > 0 && (
                        <Button onClick={saveSkills} disabled={saving} variant="outline" size="sm" className="h-5 text-[10px] px-1.5 gap-0.5">
                            {saving ? <Loader2 className="h-2 w-2 animate-spin" /> : <Save className="h-2 w-2" />}
                            Save
                        </Button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center gap-1 text-muted-foreground text-xs py-3">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Loading...
                </div>
            ) : categories.length === 0 ? (
                <p className="text-[11px] text-muted-foreground py-3 text-center">No tech stacks available.</p>
            ) : (
                <>
                    <div className="flex flex-wrap gap-1 mb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors border ${
                                    selectedCategory === cat
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background text-muted-foreground border-border hover:border-primary/40"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-1 p-2 bg-muted/40 rounded min-h-[50px] flex-1">
                        {techStacks[selectedCategory]?.map((skill) => {
                            const active = data.about.skills.includes(skill);
                            return (
                                <button
                                    key={skill}
                                    onClick={() => toggleSkill(skill)}
                                    className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                                        active
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-background border text-foreground hover:border-primary/50"
                                    }`}
                                >
                                    {active && <Check className="h-2.5 w-2.5" />}
                                    {skill}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}

            {data.about.skills.length > 0 && (
                <div className="mt-2 pt-2 border-t">
                    <div className="flex flex-wrap gap-1">
                        {data.about.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="gap-0.5 text-[10px] py-0 px-1.5 h-4">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="hover:text-destructive">
                                    <X className="h-2.5 w-2.5" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
