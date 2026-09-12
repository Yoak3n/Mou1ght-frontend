import type { FC } from 'react';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/common';
import { slugify } from '@/lib/markdown';
import 'highlight.js/styles/github-dark.css';
import './index.css';

const renderer = new marked.Renderer();
// @ts-ignore
renderer.heading = function({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const plainText = text.replace(/<[^>]+>/g, '');
  const id = slugify(plainText);
  return `<h${depth} id="${id}">${text}</h${depth}>`;
};

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
}));

marked.setOptions({
    renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
});

const Markdown: FC<{ content: string }> = ({ content }) => {
  const html = marked.parse(content);
  return (
    <div className="markdown-content text-lg text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: html }}>
    </div>
  );
};

export default Markdown;
