interface SectionCardProps {
    id: string;
    title: string;
    children: React.ReactNode;
}

export default function SectionCard({ id, title, children }: SectionCardProps) {
    return (
        <section id={id} className="mb-5">
            <h2 className="text-sm font-semibold mb-3">{title}</h2>
            {children}
        </section>
    );
}
