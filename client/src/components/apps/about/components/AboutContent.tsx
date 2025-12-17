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
        <div className="flex-1 p-4 md:p-8 lg:p-12 xl:p-16 md:overflow-y-auto no-scrollbar bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-5xl space-y-8 md:space-y-10 lg:space-y-12 mx-auto">
                {/* About Me Section */}
                <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-1 md:w-1.5 h-8 md:h-10 bg-gradient-to-b from-primary to-purple-500 rounded-full"></div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">About Me</h2>
                    </div>
                    <div className="bg-card border rounded-xl p-6 md:p-8 lg:p-10 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed whitespace-pre-line">
                            {data.personal.bio}
                        </p>
                    </div>
                </div>

                {/* Experience Section */}
                {data.experience && data.experience.length > 0 && (
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-1 md:w-1.5 h-8 md:h-10 bg-gradient-to-b from-primary to-purple-500 rounded-full"></div>
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">Experience</h3>
                        </div>
                        <div className="space-y-4 md:space-y-6">
                            {data.experience.map((exp, index) => (
                                <div
                                    key={exp.id}
                                    className="bg-card border rounded-xl p-6 md:p-8 lg:p-10 shadow-sm hover:shadow-md transition-all hover:border-primary/50 group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
                                        <div className="space-y-2 md:space-y-3 flex-1">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                                                <h4 className="text-lg md:text-xl lg:text-2xl font-semibold group-hover:text-primary transition-colors">
                                                    {exp.title}
                                                </h4>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-3 text-muted-foreground">
                                                <Building2 className="w-4 h-4 md:w-5 md:h-5" />
                                                <span className="font-medium text-sm md:text-base lg:text-lg">{exp.company}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground bg-muted/50 px-3 md:px-4 py-1.5 md:py-2 rounded-full">
                                            <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                                            <span>{exp.period}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills Section */}
                {data.skills && data.skills.length > 0 && (
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-1 md:w-1.5 h-8 md:h-10 bg-gradient-to-b from-primary to-purple-500 rounded-full"></div>
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">Technical Skills</h3>
                        </div>
                        <div className="bg-card border rounded-xl p-6 md:p-8 lg:p-10 shadow-sm">
                            <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4">
                                {data.skills.map((skill, index) => (
                                    <Badge
                                        key={skill}
                                        variant="secondary"
                                        className="px-4 py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 text-sm md:text-base lg:text-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                                        style={{
                                            animationDelay: `${index * 50}ms`
                                        }}
                                    >
                                        <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
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
