interface SectionCardProps {
    id?: string;
    eyebrow?: string;
    title: string;
    description?: string;
    icon?: React.ComponentType<{ className?: string }>;
    aside?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

export default function SectionCard({ id, eyebrow, title, description, icon: Icon, aside, className = "", children }: SectionCardProps) {
    return (
        <section id={id} className={`editor-panel ${className}`}>
            <div className="editor-panel-header">
                <div className="flex items-start gap-3 min-w-0">
                    {Icon && (
                        <div className="editor-panel-icon">
                            <Icon className="h-4 w-4" />
                        </div>
                    )}
                    <div className="min-w-0">
                        {eyebrow && <p className="editor-panel-eyebrow">{eyebrow}</p>}
                        <h3>{title}</h3>
                        {description && <p>{description}</p>}
                    </div>
                </div>
                {aside && <div className="editor-panel-aside">{aside}</div>}
            </div>
            <div className="editor-panel-body">{children}</div>
        </section>
    );
}
