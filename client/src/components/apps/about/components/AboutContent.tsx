import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const SKILLS = ["React", "TypeScript", "Next.js", "Node.js", "WebGL", "Three.js", "TailwindCSS", "PostgreSQL", "GraphQL", "AWS", "Figma", "Motion"];

export function AboutContent() {
    return (
        <div className="flex-1 p-6 md:p-12 overflow-y-auto no-scrollbar">
            <div className="max-w-3xl space-y-8 mx-auto">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">About Me</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        I build digital experiences that live on the web. I'm passionate about creative coding,
                        interactive design, and building tools that help others create. Currently exploring
                        the intersection of design systems and AI to create more intuitive interfaces.
                    </p>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold tracking-tight">Experience</h3>
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <h4 className="font-medium">Senior Frontend Engineer</h4>
                                <span className="text-sm text-muted-foreground">2023 - Present</span>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">TechCorp Inc.</p>
                            <p className="text-sm text-muted-foreground mt-2">Leading the design system team and rebuilding the core product dashboard.</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <h4 className="font-medium">UI Developer</h4>
                                <span className="text-sm text-muted-foreground">2021 - 2023</span>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Creative Studio</p>
                            <p className="text-sm text-muted-foreground mt-2">Built award-winning marketing sites and interactive campaigns.</p>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold tracking-tight">Technical Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {SKILLS.map((skill) => (
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
