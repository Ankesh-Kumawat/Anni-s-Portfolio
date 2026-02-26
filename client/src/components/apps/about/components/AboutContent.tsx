import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, Building2, Sparkles, Code2, Users2, Trophy, Clock } from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { useEffect } from "react";

function StatCard({ label, value, icon: Icon, delay }: any) {
    const [count, setCount] = useState(0);
    const target = parseInt(value) || 0;
    const suffix = value.toString().replace(/[0-9]/g, '');

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.ceil(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [target]);

    return (
        <div
            className="flex flex-col items-center justify-center p-4 bg-card border border-white/5 rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] hover:border-primary/50 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-8 relative overflow-hidden"
            style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Icon className="w-6 h-6 text-primary mb-2 group-hover:scale-125 group-hover:-translate-y-1 transition-all duration-300 drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
            <div className="text-3xl font-extrabold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent drop-shadow-sm">
                {count}{suffix}
            </div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1 z-10">{label}</div>
        </div>
    );
}

interface AboutData {
    personal: {
        bio: string;
        careerStartDate?: string;
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
    const { data: projectsData } = useFirestoreData<any>("projects");

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

    const calculateTotalExperience = (startDateStr?: string) => {
        if (!startDateStr) return Math.max(1, data.experience?.length || 1);
        const start = new Date(startDateStr);
        if (isNaN(start.getTime())) return Math.max(1, data.experience?.length || 1);

        const now = new Date();
        let years = now.getFullYear() - start.getFullYear();
        if (now.getMonth() < start.getMonth() || (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())) {
            years--;
        }
        return Math.max(1, years);
    };

    const expYears = calculateTotalExperience(data.personal?.careerStartDate);
    const projectsCount = projectsData?.projects?.length || 0;

    return (
        <div className="flex-1 p-4 md:p-6 lg:p-8 md:overflow-y-auto no-scrollbar bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-4xl space-y-6 md:space-y-8 mx-auto pb-10">
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-2 pb-4">
                    <StatCard label="Experience" value={`${expYears}yr+`} icon={Clock} delay={100} />
                    <StatCard label="Projects" value={`${projectsCount}+`} icon={Briefcase} delay={200} />
                    <StatCard label="Skills" value={`${data.skills?.length || 0}+`} icon={Code2} delay={300} />
                </div>

                {/* About Me Section */}
                <div className="space-y-3 md:space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-mode-both">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-1.5 h-8 bg-gradient-to-b from-primary to-purple-500 rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
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
                                    className="bg-card border border-white/5 rounded-2xl p-5 md:p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/40 group relative overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                                    style={{ animationDelay: `${700 + index * 100}ms`, animationFillMode: 'both' }}
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors duration-500"></div>
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
                                        className="px-4 py-2 text-sm font-semibold rounded-xl bg-secondary/50 hover:bg-primary/20 hover:text-primary border border-transparent hover:border-primary/30 transition-all duration-300 cursor-default group/badge hover:scale-105 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(var(--primary-rgb),0.15)] animate-in fade-in zoom-in"
                                        style={{
                                            animationDelay: `${900 + index * 50}ms`,
                                            animationFillMode: 'both'
                                        }}
                                    >
                                        <Sparkles className="w-3.5 h-3.5 mr-2 text-primary/70 group-hover/badge:text-primary transition-colors" />
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
