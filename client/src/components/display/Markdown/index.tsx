import type { FC } from 'react';
import { marked } from 'marked';
import { slugify } from '@/lib/markdown';
import './index.css';

const renderer = new marked.Renderer();
// @ts-ignore
renderer.heading = function({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const plainText = text.replace(/<[^>]+>/g, '');
  const id = slugify(plainText);
  return `<h${depth} id="${id}">${text}</h${depth}>`;
};

marked.setOptions({
    renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
});
const Markdown: FC<{ content: string }> = ({ content }) => {
  const html = marked.parse(content);
  console.log(html)
  return (
    <div className="markdown-content text-lg text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: html }}>  
    </div>
  );
};

export default Markdown;