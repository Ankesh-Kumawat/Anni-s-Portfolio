import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";
import { useOS } from "@/lib/os-context";

export function ContactForm() {
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
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus({
                    type: "success",
                    message: data.message || "Message sent successfully!"
                });

                // Show OS notification in System Status widget
                addNotification(
                    "✉️ Email Sent Successfully!",
                    `Message from ${formData.name} has been delivered to your inbox.`
                );

                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                setSubmitStatus({
                    type: "error",
                    message: data.message || "Failed to send message"
                });

                addNotification(
                    "❌ Email Failed",
                    data.message || "Failed to send message. Please try again."
                );
            }
        } catch (error) {
            setSubmitStatus({
                type: "error",
                message: "Network error. Please try again later."
            });

            addNotification(
                "❌ Network Error",
                "Please check your connection and try again."
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
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm md:text-base">Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                className="h-11 md:h-12 text-sm md:text-base"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm md:text-base">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className="h-11 md:h-12 text-sm md:text-base"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm md:text-base">Subject *</Label>
                        <Input
                            id="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="What's this about?"
                            className="h-11 md:h-12 text-sm md:text-base"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm md:text-base">Message *</Label>
                        <Textarea
                            id="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell me about your project, ideas, or just say hi..."
                            className="min-h-[150px] md:min-h-[180px] lg:min-h-[200px] text-sm md:text-base resize-none no-scrollbar"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full md:w-auto md:px-12 h-12 md:h-14 text-base md:text-lg font-semibold"
                        size="lg"
                        disabled={isSubmitting}
                    >
                        <Send className="w-5 h-5 mr-2" />
                        {isSubmitting ? "Sending..." : "Send Message"}
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
