import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, Check } from "lucide-react";
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

    return (
        <div className="space-y-6 sm:space-y-8">
            <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
                <p className="text-sm sm:text-base text-gray-600">Tell us about yourself</p>
            </div>

            {/* Avatar Upload */}
            <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {avatarPreview && (
                        <img
                            src={avatarPreview}
                            alt="Avatar preview"
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                    )}
                    <label className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            <Upload className="w-4 h-4" />
                            Upload Image
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
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
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
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
                        placeholder="Full Stack Developer"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
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
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">Bio *</Label>
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
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="resize-none"
                />
                <p className="text-xs sm:text-sm text-gray-500">{data.about.personal.bio.length} characters</p>
            </div>

            {/* Skills - Category Based */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <Label>Skills</Label>
                    <p className="text-xs sm:text-sm text-gray-500">{data.about.skills.length} selected</p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2">
                    {Object.keys(SKILL_CATEGORIES).map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Skill Chips for Selected Category */}
                <div className="border rounded-lg p-4 bg-gray-50 min-h-[120px]">
                    <div className="flex flex-wrap gap-2">
                        {SKILL_CATEGORIES[selectedCategory as keyof typeof SKILL_CATEGORIES].map((skill) => {
                            const isSelected = data.about.skills.includes(skill);
                            return (
                                <button
                                    key={skill}
                                    onClick={() => toggleSkill(skill)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${isSelected
                                            ? "bg-green-600 text-white"
                                            : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500"
                                        }`}
                                >
                                    {isSelected && <Check className="w-3 h-3" />}
                                    {skill}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Custom Skill Input */}
                <div className="space-y-2">
                    <Label className="text-sm">Add Custom Skill</Label>
                    <div className="flex gap-2">
                        <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
                            placeholder="e.g., Photoshop, Blender..."
                            className="flex-1"
                        />
                        <Button onClick={addCustomSkill} type="button" size="sm">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Selected Skills Display */}
                {data.about.skills.length > 0 && (
                    <div className="space-y-2">
                        <Label className="text-sm">Your Selected Skills</Label>
                        <div className="flex flex-wrap gap-2">
                            {data.about.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="gap-1.5 px-3 py-1">
                                    {skill}
                                    <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-600">
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Experience - Optional */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <Label>Work Experience (Optional)</Label>
                        <p className="text-xs text-gray-500 mt-1">Add your professional experience</p>
                    </div>
                    <Button onClick={addExperience} type="button" variant="outline" size="sm" className="w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Experience
                    </Button>
                </div>
                {data.about.experience.map((exp, index) => (
                    <div key={exp.id} className="border rounded-lg p-4 space-y-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-sm sm:text-base">Experience {index + 1}</h4>
                            <Button
                                onClick={() => removeExperience(index)}
                                variant="ghost"
                                size="sm"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                value={exp.title}
                                onChange={(e) => updateExperience(index, "title", e.target.value)}
                                placeholder="Job Title"
                            />
                            <Input
                                value={exp.company}
                                onChange={(e) => updateExperience(index, "company", e.target.value)}
                                placeholder="Company Name"
                            />
                        </div>
                        <Input
                            value={exp.period}
                            onChange={(e) => updateExperience(index, "period", e.target.value)}
                            placeholder="Period (e.g., 2020 - Present)"
                        />
                        <Textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(index, "description", e.target.value)}
                            placeholder="Job description..."
                            rows={3}
                            className="resize-none"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
