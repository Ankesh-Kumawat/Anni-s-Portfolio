import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Terminal, Plus, Trash2, Check } from "lucide-react";
import type { EditorData } from "../../types";
import { getSkillColor } from "@/lib/skill-colors";

interface TerminalSettingsProps {
    data: EditorData;
    setData: React.Dispatch<React.SetStateAction<EditorData>>;
}

export default function TerminalSettings({ data, setData }: TerminalSettingsProps) {
    const currentSkills = data.about.skills || [];
    const currentLevels = data.terminal.skillLevels || [];

    const toggleSkill = (skillName: string) => {
        const isAdded = currentLevels.some(s => s.name === skillName);
        if (isAdded) {
            setData(prev => ({
                ...prev,
                terminal: {
                    ...prev.terminal,
                    skillLevels: prev.terminal.skillLevels.filter(s => s.name !== skillName),
                },
            }));
        } else {
            setData(prev => ({
                ...prev,
                terminal: {
                    ...prev.terminal,
                    skillLevels: [
                        ...prev.terminal.skillLevels,
                        {
                            name: skillName,
                            level: 75,
                            color: getSkillColor(skillName),
                        },
                    ],
                },
            }));
        }
    };

    const updateSkillLevel = (index: number, value: number) => {
        setData(prev => ({
            ...prev,
            terminal: {
                ...prev.terminal,
                skillLevels: prev.terminal.skillLevels.map((s, i) =>
                    i === index ? { ...s, level: value } : s
                ),
            },
        }));
    };

    const removeSkillLevel = (index: number) => {
        setData(prev => ({
            ...prev,
            terminal: {
                ...prev.terminal,
                skillLevels: prev.terminal.skillLevels.filter((_, i) => i !== index),
            },
        }));
    };

    return (
        <div className="bg-card rounded-2xl border-2 border shadow-md overflow-hidden">
            <div className="bg-muted p-6 border-b">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Terminal className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground">Terminal Settings</h3>
                        <p className="text-sm text-muted-foreground">Configuration for Terminal app</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="terminal-username" className="text-sm font-semibold text-foreground">
                            Username <span className="text-xs text-primary">(auto-generated)</span>
                        </Label>
                        <Input
                            id="terminal-username"
                            value={data.terminal.username}
                            disabled
                            className="bg-muted border h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="terminal-role" className="text-sm font-semibold text-foreground">
                            User Role <span className="text-xs text-primary">(auto-filled)</span>
                        </Label>
                        <Input
                            id="terminal-role"
                            value={data.terminal.userRole}
                            disabled
                            className="bg-muted border h-11"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold text-foreground">
                            Technical Skills <span className="text-xs text-primary">({data.terminal.skills.technical.length} from Step 1)</span>
                        </Label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Click on a skill chip below to quickly add/remove it from the terminal display.
                    </p>
                    <div className="flex flex-wrap gap-2 p-4 bg-muted text-foreground rounded-xl border-2 border min-h-[60px]">
                        {data.terminal.skills.technical.length > 0 ? (
                            data.terminal.skills.technical.map((skill, index) => {
                                const isSelected = currentLevels.some(s => s.name === skill);
                                return (
                                    <Badge
                                        key={index}
                                        variant={isSelected ? "default" : "secondary"}
                                        className={`px-3 py-1 cursor-pointer transition-all ${isSelected ? 'shadow-sm' : 'opacity-60 hover:opacity-100 hover:bg-muted-foreground/10'}`}
                                        onClick={() => toggleSkill(skill)}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            {skill}
                                            {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                        </div>
                                    </Badge>
                                );
                            })
                        ) : (
                                <p className="text-sm text-muted-foreground">No skills added yet. Add skills in Step 1.</p>
                        )}
                    </div>
                </div>

                {/* Skill Levels — Manual selection from Step 1 skills */}
                <div className="space-y-4 pt-4 border-t">
                    <div>
                        <Label className="text-sm font-semibold text-foreground">
                            Displayed Terminal Skills
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Set the proficiency level for your selected skills below.
                        </p>
                    </div>

                    {(data.terminal.skillLevels || []).length === 0 ? (
                        <div className="p-6 bg-muted/50 rounded-xl border-2 border-dashed text-center">
                            <p className="text-sm text-muted-foreground">No terminal skills selected yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {data.terminal.skillLevels.map((skill, index) => {
                                const skillColor = getSkillColor(skill.name);
                                return (
                                    <div
                                        key={skill.name}
                                        className="p-4 bg-muted/40 rounded-xl border hover:border-primary/40 transition-colors group flex flex-col gap-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: skillColor }} />
                                                <span className="text-sm font-bold text-foreground">{skill.name}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-mono font-bold" style={{ color: skillColor }}>
                                                    {skill.level}%
                                                </span>
                                                <button
                                                    onClick={() => removeSkillLevel(index)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Remove Skill"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Level Slider */}
                                        <div className="px-1 relative">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={skill.level}
                                                onChange={e => updateSkillLevel(index, parseInt(e.target.value))}
                                                className="w-full h-2.5 rounded-full appearance-none cursor-pointer border"
                                                style={{
                                                    background: `linear-gradient(to right, ${skillColor} ${skill.level}%, rgba(128,128,128,0.2) ${skill.level}%)`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
