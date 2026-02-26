import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";
import { useOS } from "@/lib/os-context";

interface ContactFormProps {
    onClose?: () => void;
}

export function ContactForm({ onClose }: ContactFormProps) {
    const { addNotification } = useOS();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: "success" | "error" | null;
        message: string;
    }>({ type: null, message: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ type: null, message: "" });

        try {
            // Add timeout to prevent infinite loading
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus({
                    type: "success",
                    message: data.message || "Message sent successfully!"
                });

                // Show OS notification
                addNotification(
                    "✉️ Message Sent!",
                    `Thanks ${formData.name}! I'll get back to you soon.`
                );

                setFormData({ name: "", email: "", subject: "", message: "" });
                
                // Close modal after 2 seconds
                if (onClose) {
                    setTimeout(() => {
                        onClose();
                    }, 2000);
                }
            } else {
                setSubmitStatus({
                    type: "error",
                    message: data.message || "Failed to send message"
                });

                addNotification(
                    "❌ Failed to Send",
                    data.message || "Something went wrong. Please try again."
                );
            }
        } catch (error: any) {
            let errorMessage = "Network error. Please try again later.";
            
            if (error.name === 'AbortError') {
                errorMessage = "Request timeout. Please try again.";
            }
            
            setSubmitStatus({
                type: "error",
                message: errorMessage
            });

            addNotification(
                "❌ Connection Error",
                errorMessage
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    return (
        <div className="flex-1 p-6 md:p-8 lg:p-12 md:overflow-y-auto no-scrollbar bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 md:mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 md:w-1.5 h-10 md:h-12 bg-gradient-to-b from-primary to-purple-500 rounded-full"></div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">Send a Message</h2>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
                        Have a project in mind? Fill out the form below and I'll get back to you as soon as possible.
                    </p>
                </div>

                {submitStatus.type && (
                    <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${submitStatus.type === "success"
                        ? "bg-green-500/10 border border-green-500/20"
                        : "bg-red-500/10 border border-red-500/20"
                        }`}>
                        {submitStatus.type === "success" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                        )}
                        <p className={`text-sm ${submitStatus.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            }`}>
                            {submitStatus.message}
                        </p>
                    </div>
                )}

                <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                        <div className="relative">
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder=" "
                                className="h-11 md:h-12 text-sm md:text-base peer"
                                required
                                disabled={isSubmitting}
                            />
                            <Label 
                                htmlFor="name" 
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-sm md:text-base text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:left-2 peer-focus:text-xs peer-focus:bg-background peer-focus:px-1 peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-1"
                            >
                                Name *
                            </Label>
                        </div>

                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder=" "
                                className="h-11 md:h-12 text-sm md:text-base peer"
                                required
                                disabled={isSubmitting}
                            />
                            <Label 
                                htmlFor="email" 
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-sm md:text-base text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:left-2 peer-focus:text-xs peer-focus:bg-background peer-focus:px-1 peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-1"
                            >
                                Email *
                            </Label>
                        </div>
                    </div>

                    <div className="relative">
                        <Input
                            id="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder=" "
                            className="h-11 md:h-12 text-sm md:text-base peer"
                            required
                            disabled={isSubmitting}
                        />
                        <Label 
                            htmlFor="subject" 
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm md:text-base text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:left-2 peer-focus:text-xs peer-focus:bg-background peer-focus:px-1 peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-1"
                        >
                            Subject *
                        </Label>
                    </div>

                    <div className="relative">
                        <Textarea
                            id="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder=" "
                            className="min-h-[150px] md:min-h-[180px] lg:min-h-[200px] text-sm md:text-base resize-none no-scrollbar peer pt-4"
                            required
                            disabled={isSubmitting}
                        />
                        <Label 
                            htmlFor="message" 
                            className="absolute left-3 top-4 text-sm md:text-base text-muted-foreground transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:left-2 peer-focus:text-xs peer-focus:bg-background peer-focus:px-1 peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-1"
                        >
                            Message *
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full md:w-auto md:px-12 h-12 md:h-14 text-base md:text-lg font-semibold group relative overflow-hidden"
                        size="lg"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sending...
                            </>
                        ) : submitStatus.type === "success" ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 mr-2 animate-in zoom-in duration-300" />
                                Sent!
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                                Send Message
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-8 md:mt-10 p-4 md:p-6 bg-muted/50 rounded-xl border">
                    <div className="flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-primary mt-1 shrink-0" />
                        <div>
                            <h3 className="font-semibold text-sm md:text-base mb-1">Quick Response</h3>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                I typically respond within 24-48 hours. For urgent inquiries, feel free to reach out via email directly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
