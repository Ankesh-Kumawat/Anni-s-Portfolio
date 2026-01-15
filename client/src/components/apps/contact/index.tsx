import { useState } from "react";
import { ContactSidebar } from "./components/ContactSidebar";
import { ContactForm } from "./components/ContactForm";

export default function Contact() {
    const [showMessageForm, setShowMessageForm] = useState(false);

    return (
        <>
            <div className="h-full bg-background overflow-y-auto no-scrollbar">
                <ContactSidebar onSendMessage={() => setShowMessageForm(true)} />
            </div>

            {/* Message Form Modal */}
            {showMessageForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border-2 border-primary/20 animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="ml-2 text-sm font-semibold">Send Message to Me</span>
                            </div>
                            <button
                                onClick={() => setShowMessageForm(false)}
                                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                            >
                                <span className="text-xl">×</span>
                            </button>
                        </div>
                        
                        {/* Form Content */}
                        <div className="overflow-y-auto max-h-[calc(90vh-60px)] no-scrollbar">
                            <ContactForm onClose={() => setShowMessageForm(false)} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
