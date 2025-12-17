import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, Building2, Sparkles } from "lucide-react";

interface AboutData {
    personal: {
        bio: string;
    };
    skills: string[];
    experience: Array<{
        id: string;
        title: string;
        company: string;
        period: string;
        description: string;
    }>;
}

export function AboutContent() {
    const [data, setData] = useState<AboutData | null>(null);

    useEffect(() => {
        fetch(`/data/about.json?t=${Date.now()}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(setData)
            .catch(console.error);
    }, []);

    if (!data) return null;

    return (
        <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto no-scrollbar bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-4xl space-y-8 md:space-y-12 mx-auto">
                {/* About Me Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-primary to-purple-500 rounded-full"></div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">About Me</h2>
                    </div>
                    <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                            {data.personal.bio}
                        </p>
                    </div>
                </div>

                {/* Experience Section */}
                {data.experience && data.experience.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-primary to-purple-500 rounded-full"></div>
                            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Experience</h3>
                        </div>
                        <div className="space-y-4">
                            {data.experience.map((exp, index) => (
                                <div
                                    key={exp.id}
                                    className="bg-card border rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all hover:border-primary/50 group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-5 h-5 text-primary" />
                                                <h4 className="text-lg md:text-xl font-semibold group-hover:text-primary transition-colors">
                                                    {exp.title}
                                                </h4>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Building2 className="w-4 h-4" />
                                                <span className="font-medium">{exp.company}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                                            <Calendar className="w-4 h-4" />
                                            <span>{exp.period}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills Section */}
                {data.skills && data.skills.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-primary to-purple-500 rounded-full"></div>
                            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Technical Skills</h3>
                        </div>
                        <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {data.skills.map((skill, index) => (
                                    <Badge
                                        key={skill}
                                        variant="secondary"
                                        className="px-4 py-2 text-sm md:text-base font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                                        style={{
                                            animationDelay: `${index * 50}ms`
                                        }}
                                    >
                                        <Sparkles className="w-3 h-3 mr-1.5" />
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
