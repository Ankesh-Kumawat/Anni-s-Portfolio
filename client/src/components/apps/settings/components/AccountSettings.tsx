import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter, Mail, Download, Code2, Briefcase } from "lucide-react";
import { useOS } from "@/lib/os-context";
import { useFirestoreData } from "@/hooks/useFirestoreData";

interface SettingsData {
    account: {
        name: string;
        role: string;
        avatar: string;
    };
}

const skills = [
    { name: "Flutter", level: 90 },
    { name: "React", level: 75 },
    { name: "TypeScript", level: 80 },
    { name: "Node.js", level: 70 },
];

const socialLinks = [
    { icon: Github, label: "GitHub", href: "#", color: "text-gray-700 dark:text-gray-300" },
    { icon: Linkedin, label: "LinkedIn", href: "#", color: "text-blue-600" },
    { icon: Twitter, label: "Twitter", href: "#", color: "text-sky-500" },
    { icon: Mail, label: "Email", href: "#", color: "text-red-500" },
];

export function AccountSettings() {
    const { data: settingsData } = useFirestoreData<SettingsData>("settings");
    const { launchApp } = useOS();

    const data = settingsData?.account;

    const handleDownloadResume = () => {
        const link = document.createElement('a');
        link.href = '/assets/resume/resume.pdf';
        link.download = 'Ankesh_Kumawat_Resume.pdf';
        link.click();
    };

    const handleViewProjects = () => {
        launchApp('projects');
    };

    if (!data) return null;

    return (
        <>
            <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-1">Profile</h2>
                <p className="text-muted-foreground">Developer profile and contact information.</p>
            </div>

            {/* Profile Card */}
            <div className="p-6 rounded-xl border bg-card">
                <div className="flex items-start gap-6">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={data.avatar} />
                        <AvatarFallback>AK</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                        <div>
                            <h3 className="text-2xl font-semibold">{data.name}</h3>
                            <p className="text-muted-foreground mt-1">{data.role}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="default" size="sm" className="gap-2 cursor-pointer" onClick={handleDownloadResume}>
                                <Download className="w-4 h-4" />
                                Download Resume
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 cursor-pointer" onClick={handleViewProjects}>
                                <Briefcase className="w-4 h-4" />
                                View Projects
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills Section */}
            <div className="p-6 rounded-xl border bg-card space-y-4">
                <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">Technical Skills</h4>
                </div>
                <div className="space-y-3">
                    {skills.map((skill) => (
                        <div key={skill.name}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">{skill.name}</span>
                                <span className="text-muted-foreground">{skill.level}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${skill.level}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Social Links */}
            <div className="p-6 rounded-xl border bg-card space-y-4">
                <h4 className="font-semibold">Connect</h4>
                <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                        >
                            <link.icon className={`w-5 h-5 ${link.color}`} />
                            <span className="text-sm font-medium">{link.label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
}
