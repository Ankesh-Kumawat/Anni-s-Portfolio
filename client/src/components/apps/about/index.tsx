import { ProfileSidebar } from "./components/ProfileSidebar";
import { AboutContent } from "./components/AboutContent";

export default function About() {
    return (
        <div className="h-full w-full flex flex-col md:flex-row no-scrollbar overflow-y-auto md:overflow-hidden bg-background">
            <ProfileSidebar />
            <AboutContent />
        </div>
    );
}
