import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

interface BasicInfoProps {
    name: string;
    title: string;
    location: string;
    bio: string;
    careerStartDate?: string;
    onNameChange: (v: string) => void;
    onTitleChange: (v: string) => void;
    onLocationChange: (v: string) => void;
    onCareerStartDateChange: (v: string) => void;
    onBioChange: (v: string) => void;
    onSave: (field: string) => void;
    savingField: string | null;
}

export default function BasicInfo({
    name, title, location, bio, careerStartDate,
    onNameChange, onTitleChange, onLocationChange, onCareerStartDateChange, onBioChange,
    onSave, savingField,
}: BasicInfoProps) {
    const parsed = careerStartDate ? new Date(careerStartDate) : undefined;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-medium">Full Name *</Label>
                    <Input id="name" value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="John Doe" className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-xs font-medium">Job Title</Label>
                    <Input id="title" value={title} onChange={(e) => onTitleChange(e.target.value)} placeholder="Developer" className="h-9 text-sm" />
                </div>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="location" className="text-xs font-medium">Location *</Label>
                <Input id="location" value={location} onChange={(e) => onLocationChange(e.target.value)} placeholder="City, Country" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs font-medium">Career Start Date</Label>
                <DatePicker
                    date={parsed}
                    setDate={(d) => {
                        if (d) {
                            const y = d.getFullYear();
                            const m = String(d.getMonth() + 1).padStart(2, "0");
                            const day = String(d.getDate()).padStart(2, "0");
                            onCareerStartDateChange(`${y}-${m}-${day}`);
                        } else {
                            onCareerStartDateChange("");
                        }
                    }}
                    className="h-9 w-full text-sm"
                    placeholder="Select date"
                />
            </div>
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <Label htmlFor="bio" className="text-xs font-medium">Bio *</Label>
                    <span className="text-[10px] text-muted-foreground">{bio.length} characters</span>
                </div>
                <Textarea id="bio" value={bio} onChange={(e) => onBioChange(e.target.value)} placeholder="Write a short bio about yourself..." rows={4} className="resize-none text-sm" />
            </div>
            <Button onClick={() => onSave("All Fields")} disabled={savingField === "All Fields"} size="sm" className="gap-1.5 h-8 text-xs">
                {savingField === "All Fields" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                Save Profile
            </Button>
        </div>
    );
}
