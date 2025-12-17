import { useState, useEffect } from "react";
import { Mail, MapPin } from "lucide-react";

interface ContactData {
    email: string;
    location: string;
    message: string;
    copyright: string;
}

export function ContactSidebar() {
    const [data, setData] = useState<ContactData | null>(null);

    useEffect(() => {
        fetch(`/data/contact.json?t=${Date.now()}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(setData)
            .catch(console.error);
    }, []);

    if (!data) return null;

    return (
        <div className="w-full md:w-1/3 bg-primary text-primary-foreground p-6 md:p-8 flex flex-col justify-between shrink-0">
            <div>
                <h2 className="text-2xl font-bold mb-4 md:mb-6">Get in Touch</h2>
                <p className="mb-6 md:mb-8 opacity-90 leading-relaxed text-sm md:text-base">
                    {data.message}
                </p>

                <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-full shrink-0">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs opacity-70 uppercase tracking-wider">Email Me</p>
                            <p className="font-medium truncate">{data.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-full shrink-0">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs opacity-70 uppercase tracking-wider">Address</p>
                            <p className="font-medium">{data.location}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 opacity-60 text-sm hidden md:block">
                {data.copyright}
            </div>
        </div>
    );
}
