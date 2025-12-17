import { ContactSidebar } from "./components/ContactSidebar";
import { ContactForm } from "./components/ContactForm";

export default function Contact() {
    return (
        <div className="h-full bg-background flex flex-col md:flex-row overflow-y-auto md:overflow-hidden no-scrollbar">
            <ContactSidebar />
            <ContactForm />
        </div>
    );
}
