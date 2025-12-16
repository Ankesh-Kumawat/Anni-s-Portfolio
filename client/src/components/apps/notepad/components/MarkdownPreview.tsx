import ReactMarkdown from 'react-markdown';

interface MarkdownPreviewProps {
    content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
    return (
        <div className="p-6 prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
                components={{
                    h1: ({ children }) => (
                        <h1 className="text-3xl font-bold mb-4 mt-6 text-foreground">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-2xl font-bold mb-3 mt-5 text-foreground">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-xl font-semibold mb-2 mt-4 text-foreground">{children}</h3>
                    ),
                    p: ({ children }) => (
                        <p className="mb-4 leading-relaxed text-foreground/90">{children}</p>
                    ),
                    ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-4 space-y-1 text-foreground/90">{children}</ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-4 space-y-1 text-foreground/90">{children}</ol>
                    ),
                    li: ({ children }) => (
                        <li className="ml-4">{children}</li>
                    ),
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 underline"
                        >
                            {children}
                        </a>
                    ),
                    strong: ({ children }) => (
                        <strong className="font-bold text-foreground">{children}</strong>
                    ),
                    em: ({ children }) => (
                        <em className="italic">{children}</em>
                    ),
                    code: ({ children }) => (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                            {children}
                        </code>
                    ),
                    pre: ({ children }) => (
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                            {children}
                        </pre>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                            {children}
                        </blockquote>
                    ),
                    hr: () => (
                        <hr className="my-6 border-border" />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
