import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, MapPin, Globe } from "lucide-react";

export function ProfileSidebar() {
    return (
        <div className="w-full md:w-80 bg-muted/30 p-8 border-b md:border-b-0 md:border-r flex flex-col items-center text-center gap-6 shrink-0 overflow-y-auto no-scrollbar">
            <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 border-background shadow-xl">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>DEV</AvatarFallback>
            </Avatar>

            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Design Engineer</h1>
                <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>San Francisco, CA</span>
                </div>
            </div>

            <div className="flex gap-2 w-full justify-center flex-wrap">
                <Button variant="outline" size="icon" className="rounded-full">
                    <Github className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                    <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                    <Mail className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                    <Globe className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
