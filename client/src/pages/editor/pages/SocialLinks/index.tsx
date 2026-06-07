import type { StepProps } from "../../types";
import PlatformSelector from "./PlatformSelector";
import LinksList from "./LinksList";
import SocialStats from "./SocialStats";
import SocialPreview from "./SocialPreview";
import { POPULAR_PLATFORMS } from "./platforms";
import SectionCard from "../../components/SectionCard";

export default function SocialLinksPage({ data, setData }: StepProps) {
    const togglePlatform = (platformValue: string) => {
        const existingIndex = data.social.links.findIndex(link => link.platform === platformValue);
        if (existingIndex >= 0) {
            setData((prev) => ({ ...prev, social: { links: prev.social.links.filter((_, i) => i !== existingIndex) } }));
        } else {
            const platform = POPULAR_PLATFORMS.find((p: any) => p.value === platformValue);
            const newLink: any = { name: platform?.label || "", url: "", platform: platformValue };
            if (platformValue === "whatsapp") {
                newLink.whatsapp = { contactNumber: "", groupLink: "", channelLink: "" };
            }
            setData((prev) => ({ ...prev, social: { links: [...prev.social.links, newLink] } }));
        }
    };

    const updateLink = (index: number, field: string, value: string) => {
        setData((prev) => ({
            ...prev,
            social: {
                links: prev.social.links.map((link, i) => {
                    if (i !== index) return link;
                    if (field.startsWith("whatsapp.")) {
                        const whatsappField = field.split(".")[1];
                        return { ...link, whatsapp: { ...link.whatsapp, [whatsappField]: value } };
                    }
                    return { ...link, [field]: value };
                }),
            },
        }));
    };

    const removeLink = (index: number) => {
        setData((prev) => ({ ...prev, social: { links: prev.social.links.filter((_, i) => i !== index) } }));
    };

    const isPlatformAdded = (platformValue: string) => data.social.links.some(link => link.platform === platformValue);

    return (
        <div className="editor-page-grid two">
            <div className="editor-page-main">
                <SectionCard
                    title="Platform Picker"
                    eyebrow="Channels"
                    description="Choose the public links that should appear in the OS."
                >
                    <PlatformSelector isPlatformAdded={isPlatformAdded} togglePlatform={togglePlatform} />
                </SectionCard>
                <SectionCard
                    title="Link Editor"
                    eyebrow={`${data.social.links.length} selected`}
                    description="Fill URLs and WhatsApp-specific fields."
                >
                    {data.social.links.length > 0 ? (
                        <LinksList links={data.social.links} updateLink={updateLink} removeLink={removeLink} />
                    ) : (
                        <div className="editor-empty-state min-h-[180px]">
                            <h4>No platforms selected</h4>
                            <p>Select a channel above to start editing link details.</p>
                        </div>
                    )}
                </SectionCard>
            </div>
            <div className="editor-page-side">
                <SectionCard title="Summary" eyebrow="Inspector">
                    <SocialStats links={data.social.links} />
                </SectionCard>
                {data.social.links.length > 0 && (
                    <SectionCard title="Preview" eyebrow="Output">
                        <SocialPreview links={data.social.links} />
                    </SectionCard>
                )}
            </div>
        </div>
    );
}
