import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Terminal, Database, Settings, Plus, Trash2, Check } from "lucide-react";
import type { StepProps } from "../../types";
import SectionCard from "../../components/SectionCard";
import { getSkillColor } from "@/lib/skill-colors";

export default function AdvancedPage({ data, setData }: StepProps) {
    const currentLevels = data.terminal.skillLevels || [];

    const toggleSkill = (skillName: string) => {
        const isAdded = currentLevels.some((s) => s.name === skillName);
        setData((prev) => ({
            ...prev,
            terminal: {
                ...prev.terminal,
                skillLevels: isAdded
                    ? prev.terminal.skillLevels.filter((s) => s.name !== skillName)
                    : [...prev.terminal.skillLevels, { name: skillName, level: 75, color: getSkillColor(skillName) }],
            },
        }));
    };

    const updateSkillLevel = (index: number, value: number) => {
        setData((prev) => ({
            ...prev,
            terminal: {
                ...prev.terminal,
                skillLevels: prev.terminal.skillLevels.map((s, i) => (i === index ? { ...s, level: value } : s)),
            },
        }));
    };

    const removeSkillLevel = (index: number) => {
        setData((prev) => ({
            ...prev,
            terminal: {
                ...prev.terminal,
                skillLevels: prev.terminal.skillLevels.filter((_, i) => i !== index),
            },
        }));
    };

    return (
        <div className="editor-page-grid two editor-settings-page">
            <div className="editor-page-main">
                <SectionCard
                    title="Terminal Profile"
                    eyebrow="Terminal"
                    description="Skills and identity shown in the terminal app."
                    icon={Terminal}
                >
                    <div className="editor-settings-grid">
                        <ReadonlyField label="Username" value={data.terminal.username} />
                        <ReadonlyField label="Role" value={data.terminal.userRole} />
                    </div>

                    <div className="editor-settings-block">
                        <div className="editor-field-head">
                            <Label>Technical Skills</Label>
                            <span>{data.terminal.skills.technical.length}</span>
                        </div>
                        <div className="editor-chip-cloud">
                            {data.terminal.skills.technical.length > 0 ? (
                                data.terminal.skills.technical.map((skill, index) => {
                                    const active = currentLevels.some((s) => s.name === skill);
                                    return (
                                        <button key={`${skill}-${index}`} type="button" data-active={active} onClick={() => toggleSkill(skill)}>
                                            {skill}
                                            {active ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                        </button>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-muted-foreground">No skills yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="editor-settings-block">
                        <div className="editor-field-head">
                            <Label>Skill Levels</Label>
                            <span>{currentLevels.length}</span>
                        </div>
                        <div className="editor-level-list">
                            {currentLevels.length > 0 ? (
                                currentLevels.map((skill, index) => {
                                    const color = getSkillColor(skill.name);
                                    return (
                                        <div key={skill.name} className="editor-level-row">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="editor-skill-dot" style={{ backgroundColor: color }} />
                                                <strong>{skill.name}</strong>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={skill.level}
                                                onChange={(e) => updateSkillLevel(index, parseInt(e.target.value))}
                                                style={{ accentColor: color }}
                                            />
                                            <span>{skill.level}%</span>
                                            <button type="button" onClick={() => removeSkillLevel(index)}>
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="editor-empty-state min-h-[120px]">
                                    <h4>No terminal skills selected</h4>
                                    <p>Pick skills above to display them with levels.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    title="Database Snapshot"
                    eyebrow="Database"
                    description="The database app mirrors profile and project records."
                    icon={Database}
                    aside={<Badge variant="outline">{data.database.projects.length} projects</Badge>}
                >
                    <div className="editor-settings-grid">
                        <ReadonlyField label="Name" value={data.database.user.name} />
                        <ReadonlyField label="Email" value={data.database.user.email} />
                        <ReadonlyField label="Role" value={data.database.user.role} />
                        <ReadonlyField label="Status" value={data.database.user.status} />
                    </div>
                    <div className="editor-mini-table">
                        {data.database.projects.slice(0, 6).map((project) => (
                            <div key={project.project_id}>
                                <span>{project.project_id}</span>
                                <strong>{project.name || "Untitled project"}</strong>
                                <em>{project.status}</em>
                            </div>
                        ))}
                        {data.database.projects.length === 0 && <p>No projects synced yet.</p>}
                    </div>
                </SectionCard>
            </div>

            <div className="editor-page-side">
                <SectionCard title="Account" eyebrow="Settings App" icon={Settings}>
                    <div className="editor-account-card">
                        {data.settings.account.avatar ? (
                            <img src={data.settings.account.avatar} alt="Avatar" />
                        ) : (
                            <div className="editor-avatar-empty" />
                        )}
                        <div>
                            <h4>{data.settings.account.name || "No name"}</h4>
                            <p>{data.settings.account.role || "No role"}</p>
                        </div>
                    </div>
                    <div className="editor-settings-stack">
                        <ReadonlyField label="Account Name" value={data.settings.account.name} />
                        <ReadonlyField label="Account Role" value={data.settings.account.role} />
                    </div>
                </SectionCard>
            </div>
        </div>
    );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
    return (
        <div className="editor-field">
            <div className="editor-field-head">
                <Label>{label}</Label>
                <span>Auto</span>
            </div>
            <Input value={value || ""} disabled className="editor-compact-input" />
        </div>
    );
}
