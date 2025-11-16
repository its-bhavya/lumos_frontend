"use client";

import ReactMarkdown from 'react-markdown';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article className="prose dark:prose-invert prose-lg max-w-none 
                        prose-h1:font-headline prose-h1:text-primary 
                        prose-h2:font-headline prose-h2:text-primary/90 
                        prose-h3:font-headline prose-h3:text-primary/80
                        prose-p:text-foreground/80
                        prose-strong:text-primary
                        prose-a:text-accent-foreground prose-a:no-underline hover:prose-a:underline
                        prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
                        prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
                        prose-li:my-1
                        prose-code:rounded prose-code:bg-secondary prose-code:px-1.5 prose-code:py-1 prose-code:font-code prose-code:text-secondary-foreground
                        prose-pre:bg-secondary prose-pre:p-4 prose-pre:rounded-md">
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}
