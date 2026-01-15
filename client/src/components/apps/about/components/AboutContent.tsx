import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, Building2, Sparkles } from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestoreData";

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
    const { data, loading } = useFirestoreData<AboutData>("about");

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="flex-1 p-4 md:p-6 lg:p-8 md:overflow-y-auto no-scrollbar bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-4xl space-y-6 md:space-y-8 mx-auto">
                {/* About Me Section */}
                <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-primary to-purple-500 rounded-full"></div>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">About Me</h2>
                    </div>
                    <div className="bg-card border rounded-xl p-4 md:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                            {data.personal.bio}
                        </p>
                    </div>
                </div>

                {/* Experience Section */}
                {data.experience && data.experience.length > 0 && (
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-primary to-purple-500 rounded-full"></div>
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">Experience</h3>
                        </div>
                        <div className="space-y-3 md:space-y-4">
                            {data.experience.map((exp, index) => (
                                <div
                                    key={exp.id}
                                    className="bg-card border rounded-xl p-4 md:p-6 lg:p-8 shadow-sm hover:shadow-md transition-all hover:border-primary/50 group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-3 mb-3 md:mb-4">
                                        <div className="space-y-1 md:space-y-2 flex-1">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                                <h4 className="text-base md:text-lg lg:text-xl font-semibold group-hover:text-primary transition-colors">
                                                    {exp.title}
                                                </h4>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Building2 className="w-3 h-3 md:w-4 md:h-4" />
                                                <span className="font-medium text-xs md:text-sm lg:text-base">{exp.company}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground bg-muted/50 px-2 md:px-3 py-1 md:py-1.5 rounded-full">
                                            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                            <span>{exp.period}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs md:text-sm lg:text-base text-muted-foreground leading-relaxed">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills Section */}
                {data.skills && data.skills.length > 0 && (
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-primary to-purple-500 rounded-full"></div>
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">Technical Skills</h3>
                        </div>
                        <div className="bg-card border rounded-xl p-4 md:p-6 lg:p-8 shadow-sm">
                            <div className="flex flex-wrap gap-2 md:gap-2.5">
                                {data.skills.map((skill, index) => (
                                    <Badge
                                        key={skill}
                                        variant="secondary"
                                        className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm lg:text-base font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                                        style={{
                                            animationDelay: `${index * 50}ms`
                                        }}
                                    >
                                        <Sparkles className="w-3 h-3 mr-1 md:mr-1.5" />
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
