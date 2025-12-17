import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, Check, User, Briefcase, MapPin, FileText, Award, Sparkles } from "lucide-react";
import { useState } from "react";
import type { StepProps } from "../types";

const SKILL_CATEGORIES = {
    "Frontend": ["React", "Vue", "Angular", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "TailwindCSS", "Sass", "Redux", "Zustand"],
    "Backend": ["Node.js", "Python", "Java", "PHP", "Ruby", "Go", "Express", "Django", "Spring Boot", "Laravel", "FastAPI"],
    "Mobile": ["React Native", "Flutter", "Swift", "Kotlin", "Android", "iOS", "Expo"],
    "Database": ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase", "Supabase", "SQLite", "DynamoDB"],
    "DevOps": ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Jenkins", "GitHub Actions", "Vercel", "Netlify"],
    "Tools": ["Git", "VS Code", "Figma", "Postman", "Jira", "Webpack", "Vite", "npm", "yarn"],
    "Other": ["GraphQL", "REST API", "WebSocket", "Testing", "Jest", "Agile", "Scrum", "Three.js", "WebGL"]
};

export default function Step1Personal({ data, setData }: StepProps) {
    const [newSkill, setNewSkill] = useState("");
    const [avatarPreview, setAvatarPreview] = useState(data.about.personal.avatar);
    const [selectedCategory, setSelectedCategory] = useState<string>("Frontend");

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const preview = reader.result as string;
                setAvatarPreview(preview);
                setData((prev) => ({
                    ...prev,
                    about: {
                        ...prev.about,
                        personal: {
                            ...prev.about.personal,
                            avatar: preview,
                        },
                    },
                    assets: {
                        ...prev.assets,
                        images: [
                            ...prev.assets.images,
                            {
                                file,
                                path: `personal/avatar.${file.name.split(".").pop()}`,
                                preview,
                            },
                        ],
                    },
                }));
            };
            reader.readAsDataURL(file);
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

    const addCustomSkill = () => {
        if (newSkill.trim() && !data.about.skills.includes(newSkill.trim())) {
            setData((prev) => ({
                ...prev,
                about: {
                    ...prev.about,
                    skills: [...prev.about.skills, newSkill.trim()],
                },
            }));
            setNewSkill("");
        }
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

    const completionPercentage = () => {
        let completed = 0;
        if (data.about.personal.name) completed += 25;
        if (data.about.personal.title) completed += 10; // Optional, less weight
        if (data.about.personal.location) completed += 20;
        if (data.about.personal.bio) completed += 25;
        if (data.about.personal.avatar) completed += 15;
        if (data.about.skills.length > 0) completed += 5;
        return completed;
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
                    <div className="flex items-center gap-3 bg-primary/10 px-6 py-4 rounded-2xl border">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Completion</div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                {completionPercentage()}%
                            </div>
                        </div>
                        <Sparkles className="w-6 h-6 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-[380px_1fr] gap-8">
                {/* Left Column - Avatar & Quick Info */}
                <div className="space-y-6">
                    {/* Avatar Upload Card */}
                    <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-3xl p-8 border-2 border-blue-100 shadow-lg">
                        <div className="text-center space-y-6">
                            <div className="relative inline-block">
                                {avatarPreview ? (
                                    <div className="relative group">
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar"
                                            className="w-48 h-48 rounded-3xl object-cover border-4 border-white shadow-2xl"
                                        />
                                        <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Upload className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 border-white shadow-2xl">
                                        <User className="w-20 h-20 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <label className="cursor-pointer block">
                                <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold">
                                    {avatarPreview ? "Change Photo" : "Upload Photo"}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                />
                            </label>
                            <p className="text-xs text-muted-foreground">Recommended: Square image, min 400x400px</p>
                        </div>
                    </div>

                    {/* Profile Checklist Card */}
                    <div className="bg-card rounded-2xl p-6 border-2 border shadow-md">
                        <div className="flex items-center gap-2 mb-5">
                            <Award className="w-5 h-5 text-blue-600" />
                            <h4 className="font-bold text-foreground">Profile Checklist</h4>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: "Profile Photo", value: data.about.personal.avatar, icon: User, required: true },
                                { label: "Full Name", value: data.about.personal.name, icon: User, required: true },
                                { label: "Job Title", value: data.about.personal.title, icon: Briefcase, required: false },
                                { label: "Location", value: data.about.personal.location, icon: MapPin, required: true },
                                { label: "Bio", value: data.about.personal.bio, icon: FileText, required: true },
                                { label: "Skills", value: data.about.skills.length > 0, icon: Award, required: false },
                            ].map((item, idx) => {
                                const Icon = item.icon;
                                const isComplete = !!item.value;
                                return (
                                    <div
                                        key={idx}
                                        className={`flex items-center justify-between p-3 rounded-xl transition-all ${isComplete ? "bg-green-50 border border-green-200" : "bg-muted border border"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-4 h-4 ${isComplete ? "text-green-600" : "text-gray-400"}`} />
                                            <span className={`text-sm font-medium ${isComplete ? "text-green-900" : "text-muted-foreground"}`}>
                                                {item.label}
                                                {!item.required && <span className="text-xs text-gray-400 ml-1">(Optional)</span>}
                                            </span>
                                        </div>
                                        {isComplete ? (
                                            <Check className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column - Forms */}
                <div className="space-y-8">
                    {/* Basic Information Card */}
                    <div className="bg-card rounded-2xl p-8 border-2 border shadow-md">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Basic Information</h3>
                                <p className="text-sm text-muted-foreground">Your core professional details</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Full Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.about.personal.name}
                                        onChange={(e) =>
                                            setData((prev) => ({
                                                ...prev,
                                                about: {
                                                    ...prev.about,
                                                    personal: { ...prev.about.personal, name: e.target.value },
                                                },
                                            }))
                                        }
                                        placeholder="John Doe"
                                        className="h-12 text-base"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        Job Title
                                        <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        value={data.about.personal.title}
                                        onChange={(e) =>
                                            setData((prev) => ({
                                                ...prev,
                                                about: {
                                                    ...prev.about,
                                                    personal: { ...prev.about.personal, title: e.target.value },
                                                },
                                            }))
                                        }
                                        placeholder="Full Stack Developer, Student, Freelancer, etc."
                                        className="h-12 text-base"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Location *
                                </Label>
                                <Input
                                    id="location"
                                    value={data.about.personal.location}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            about: {
                                                ...prev.about,
                                                personal: { ...prev.about.personal, location: e.target.value },
                                            },
                                        }))
                                    }
                                    placeholder="San Francisco, CA"
                                    className="h-12 text-base"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio" className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Professional Bio *
                                </Label>
                                <Textarea
                                    id="bio"
                                    value={data.about.personal.bio}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            about: {
                                                ...prev.about,
                                                personal: { ...prev.about.personal, bio: e.target.value },
                                            },
                                        }))
                                    }
                                    placeholder="Write a compelling introduction about yourself, your expertise, and what drives you professionally..."
                                    rows={6}
                                    className="resize-none text-base"
                                />
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-muted-foreground">{data.about.personal.bio.length} characters</p>
                                    <p className="text-xs text-gray-400">Recommended: 150-300 characters</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skills Section Card */}
                    <div className="bg-card rounded-2xl p-8 border-2 border shadow-md">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <Award className="w-5 h-5 text-purple-600" />
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
                            {Object.keys(SKILL_CATEGORIES).map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedCategory === category
                                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30"
                                        : "bg-muted text-foreground hover:bg-muted border border"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Skill Chips */}
                        <div className="border-2 border rounded-2xl p-6 bg-muted min-h-[180px] mb-5">
                            <div className="flex flex-wrap gap-3">
                                {SKILL_CATEGORIES[selectedCategory as keyof typeof SKILL_CATEGORIES].map((skill) => {
                                    const isSelected = data.about.skills.includes(skill);
                                    return (
                                        <button
                                            key={skill}
                                            onClick={() => toggleSkill(skill)}
                                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${isSelected
                                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                                                : "bg-card text-foreground border-2 border hover:border-purple-500 hover:shadow-md"
                                                }`}
                                        >
                                            {isSelected && <Check className="w-4 h-4" />}
                                            {skill}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Custom Skill Input */}
                        <div className="flex gap-3 mb-5">
                            <Input
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
                                placeholder="Add custom skill (e.g., Photoshop, Blender)"
                                className="flex-1 h-12 text-base"
                            />
                            <Button onClick={addCustomSkill} type="button" size="lg" className="px-6">
                                <Plus className="w-4 h-4 mr-2" />
                                Add
                            </Button>
                        </div>

                        {/* Selected Skills Display */}
                        {data.about.skills.length > 0 && (
                            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                                <Label className="text-sm font-bold text-green-900 mb-3 block flex items-center gap-2">
                                    <Check className="w-4 h-4" />
                                    Selected Skills ({data.about.skills.length})
                                </Label>
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

                    {/* Experience Section Card */}
                    <div className="bg-card rounded-2xl p-8 border-2 border shadow-md">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-orange-600" />
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
                                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-muted-foreground font-medium">No experience added yet</p>
                                <p className="text-sm text-muted-foreground mt-1">Click "Add Experience" to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {data.about.experience.map((exp, index) => (
                                    <div key={exp.id} className="border-2 border rounded-2xl p-6 space-y-5 bg-gradient-to-br from-muted/30 to-muted/50">
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
                </div>
            </div>
        </div>
    );
}



