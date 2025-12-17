import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
        <div className="flex-1 p-6 md:p-12 overflow-y-auto no-scrollbar">
            <div className="max-w-3xl space-y-8 mx-auto">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">About Me</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {data.personal.bio}
                    </p>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold tracking-tight">Experience</h3>
                    <div className="space-y-6">
                        {data.experience.map((exp) => (
                            <div key={exp.id} className="space-y-1">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                    <h4 className="font-medium">{exp.title}</h4>
                                    <span className="text-sm text-muted-foreground">{exp.period}</span>
                                </div>
                                <p className="text-sm text-muted-foreground font-medium">{exp.company}</p>
                                <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold tracking-tight">Technical Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
