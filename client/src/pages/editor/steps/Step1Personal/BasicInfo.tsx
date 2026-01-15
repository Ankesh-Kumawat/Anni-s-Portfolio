import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Briefcase, MapPin, FileText, Save, Loader2 } from "lucide-react";

interface BasicInfoProps {
    name: string;
    title: string;
    location: string;
    bio: string;
    onNameChange: (value: string) => void;
    onTitleChange: (value: string) => void;
    onLocationChange: (value: string) => void;
    onBioChange: (value: string) => void;
    onSave: (field: string) => void;
    savingField: string | null;
}

export default function BasicInfo({
    name,
    title,
    location,
    bio,
    onNameChange,
    onTitleChange,
    onLocationChange,
    onBioChange,
    onSave,
    savingField
}: BasicInfoProps) {
    return (
        <div className="bg-card rounded-xl p-6 border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                    <h3 className="text-base font-bold">Basic Information</h3>
                    <p className="text-xs text-muted-foreground">Your core details</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-semibold flex items-center gap-1.5">
                            <User className="w-3 h-3" />
                            Full Name *
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => onNameChange(e.target.value)}
                                placeholder="John Doe"
                                className="h-9 text-sm flex-1"
                            />
                            <Button
                                onClick={() => onSave("Name")}
                                disabled={savingField === "Name" || !name}
                                size="sm"
                                className="gap-1 h-9 px-3"
                            >
                                {savingField === "Name" ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    <Save className="w-3 h-3" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="title" className="text-xs font-semibold flex items-center gap-1.5">
                            <Briefcase className="w-3 h-3" />
                            Job Title
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => onTitleChange(e.target.value)}
                                placeholder="Developer"
                                className="h-9 text-sm flex-1"
                            />
                            <Button
                                onClick={() => onSave("Job Title")}
                                disabled={savingField === "Job Title"}
                                size="sm"
                                className="gap-1 h-9 px-3"
                            >
                                {savingField === "Job Title" ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    <Save className="w-3 h-3" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="location" className="text-xs font-semibold flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        Location *
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="location"
                            value={location}
                            onChange={(e) => onLocationChange(e.target.value)}
                            placeholder="San Francisco, CA"
                            className="h-9 text-sm flex-1"
                        />
                        <Button
                            onClick={() => onSave("Location")}
                            disabled={savingField === "Location" || !location}
                            size="sm"
                            className="gap-1 h-9 px-3"
                        >
                            {savingField === "Location" ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                <Save className="w-3 h-3" />
                            )}
                        </Button>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="bio" className="text-xs font-semibold flex items-center gap-1.5">
                        <FileText className="w-3 h-3" />
                        Bio *
                    </Label>
                    <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => onBioChange(e.target.value)}
                        placeholder="Write about yourself..."
                        rows={4}
                        className="resize-none text-sm"
                    />
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">{bio.length} chars</p>
                        <Button
                            onClick={() => onSave("Bio")}
                            disabled={savingField === "Bio" || !bio}
                            size="sm"
                            className="gap-1 h-7"
                        >
                            {savingField === "Bio" ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-3 h-3" />
                                    Save
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
