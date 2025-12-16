import { Mail, Phone, MapPin } from "lucide-react";

export function ContactSidebar() {
    return (
        <div className="w-full md:w-1/3 bg-primary text-primary-foreground p-6 md:p-8 flex flex-col justify-between shrink-0">
            <div>
                <h2 className="text-2xl font-bold mb-4 md:mb-6">Get in Touch</h2>
                <p className="mb-6 md:mb-8 opacity-90 leading-relaxed text-sm md:text-base">
                    I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                </p>

                <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-full shrink-0">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs opacity-70 uppercase tracking-wider">Email Me</p>
                            <p className="font-medium truncate">hello@example.com</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-full shrink-0">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs opacity-70 uppercase tracking-wider">Call Me</p>
                            <p className="font-medium truncate">+1 (555) 000-0000</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-full shrink-0">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs opacity-70 uppercase tracking-wider">Location</p>
                            <p className="font-medium truncate">San Francisco, CA</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 opacity-60 text-sm hidden md:block">
                © 2025 Portfolio OS
            </div>
        </div>
    );
}
