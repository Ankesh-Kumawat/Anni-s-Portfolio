import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import type { EditorData } from "../../types";

interface ExperienceSectionProps {
    data: EditorData;
    setData: React.Dispatch<React.SetStateAction<EditorData>>;
}

export default function ExperienceSection({ data, setData }: ExperienceSectionProps) {
    const add = () => {
        setData((prev) => ({
            ...prev,
            about: { ...prev.about, experience: [...prev.about.experience, { id: `exp${Date.now()}`, title: "", company: "", period: "", description: "" }] },
        }));
    };

    const update = (i: number, field: string, value: string) => {
        setData((prev) => ({
            ...prev,
            about: { ...prev.about, experience: prev.about.experience.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)) },
        }));
    };

    const remove = (i: number) => {
        setData((prev) => ({
            ...prev,
            about: { ...prev.about, experience: prev.about.experience.filter((_, idx) => idx !== i) },
        }));
    };

    return (
        <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="text-sm font-semibold">Work Experience</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Your professional journey</p>
                </div>
                <Button onClick={add} variant="outline" size="sm" className="h-6 gap-1 text-[10px] px-2">
                    <Plus className="h-2.5 w-2.5" />
                    Add
                </Button>
            </div>

            {data.about.experience.length === 0 ? (
                <div className="text-center py-6 border border-dashed rounded-md bg-muted/30">
                    <p className="text-[11px] text-muted-foreground">No experience added yet</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">Click "Add" to get started</p>
                </div>
            ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {data.about.experience.map((exp, i) => (
                        <div key={exp.id} className="border rounded p-2.5 space-y-2 bg-muted/20">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-medium text-muted-foreground">#{i + 1}</span>
                                <button onClick={() => remove(i)} className="text-[10px] text-destructive hover:text-destructive/80 flex items-center gap-0.5">
                                    <X className="h-2.5 w-2.5" />
                                    Remove
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-0.5">
                                    <Label className="text-[10px]">Title</Label>
                                    <Input value={exp.title} onChange={(e) => update(i, "title", e.target.value)} placeholder="Developer" className="h-7 text-xs" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-[10px]">Company</Label>
                                    <Input value={exp.company} onChange={(e) => update(i, "company", e.target.value)} placeholder="Corp" className="h-7 text-xs" />
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <Label className="text-[10px]">Period</Label>
                                <Input value={exp.period} onChange={(e) => update(i, "period", e.target.value)} placeholder="2020 - Present" className="h-7 text-xs" />
                            </div>
                            <div className="space-y-0.5">
                                <Label className="text-[10px]">Description</Label>
                                <Textarea value={exp.description} onChange={(e) => update(i, "description", e.target.value)} placeholder="Role details..." rows={2} className="resize-none text-xs" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
