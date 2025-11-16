"use client";

import ReactMarkdown from 'react-markdown';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article className="prose prose-lg max-w-none prose-h1:font-headline prose-h1:text-primary prose-h2:text-primary/90 prose-h3:text-primary/80 prose-strong:text-primary prose-a:text-accent-foreground prose-blockquote:border-accent">
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}
