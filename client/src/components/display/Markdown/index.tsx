import type { FC } from 'react';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/common';
import { slugify } from '@/lib/markdown';
import 'highlight.js/styles/github-dark.css';
import './index.css';

const renderer = new marked.Renderer();
// @ts-ignore
renderer.heading = function ({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const plainText = text.replace(/<[^>]+>/g, '');
  const id = slugify(plainText);
  return `<h${depth} id="${id}">${text}</h${depth}>`;
};

const AUDIO_URL_RE = /\.(mp3|flac|wav|ogg|oga|m4a|aac)(\?|#|$)/i;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 音频链接（![](xxx.mp3) 或 [文字](xxx.mp3)）渲染为内嵌播放器卡片；
// 后台 bytemd 预览不识别此扩展，发布后前台正常显示。
function renderAudioBlock(href: string, label: string): string {
  const name = label.trim() || decodeURIComponent(href.split('/').pop() || '音频');
  return [
    `<div class="markdown-audio">`,
    `<audio controls preload="none" src="${escapeHtml(href)}"></audio>`,
    `<span class="markdown-audio__name">${escapeHtml(name)}</span>`,
    `</div>`,
  ].join('');
}

const CALLOUT_DEFAULT_TITLES: Record<string, string> = {
  note: 'Note',
  info: 'Info',
  tip: 'Tip',
  hint: 'Hint',
  important: 'Important',
  warning: 'Warning',
  caution: 'Caution',
  danger: 'Danger',
  error: 'Error',
  bug: 'Bug',
  example: 'Example',
  quote: 'Quote',
  success: 'Success',
  question: 'Question',
};

// 支持 GitHub Alerts / Obsidian callout：
// > [!danger]
// > 正文...
// > [!warning] 自定义标题
// > 正文...
const calloutExtension = {
  name: 'callout',
  level: 'block' as const,
  start(src: string) {
    const match = /^[ \t]*>[ \t]*\[!([A-Za-z-]+)\]/.exec(src);
    return match ? match.index : undefined;
  },
  tokenizer(src: string) {
    const match = /^[ \t]*>[ \t]*\[!([A-Za-z-]+)\][ \t]*([^\n]*)\n((?:[ \t]*>[^\n]*(?:\n|$))*)/.exec(src);
    if (!match) return;

    const calloutType = match[1].toLowerCase();
    const title = (match[2] || '').trim();
    const bodyRaw = match[3]
      .split('\n')
      .map((line) => line.replace(/^[ \t]*>[ \t]?/, ''))
      .join('\n')
      .replace(/\n+$/, '');

    return {
      type: 'callout',
      raw: match[0],
      calloutType,
      title,
      text: bodyRaw,
      tokens: marked.lexer(bodyRaw),
    };
  },
  renderer(token: { calloutType: string; title: string; tokens: unknown }) {
    // @ts-expect-error marked extension this typing
    const bodyHtml: string = this.parser.parse(token.tokens as never);
    const type = token.calloutType;
    const title = token.title || CALLOUT_DEFAULT_TITLES[type] || type;
    return [
      `<div class="markdown-callout markdown-callout--${type}" data-callout="${type}">`,
      `<p class="markdown-callout__title">${title}</p>`,
      `<div class="markdown-callout__body">${bodyHtml}</div>`,
      `</div>\n`,
    ].join('');
  },
};

renderer.image = function ({ href, title, text }) {
  if (AUDIO_URL_RE.test(href)) return renderAudioBlock(href, text);
  return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}"${title ? ` title="${escapeHtml(title)}"` : ''}>`;
};
renderer.link = function ({ href, title, tokens }) {
  if (AUDIO_URL_RE.test(href)) return renderAudioBlock(href, this.parser.parseInline(tokens));
  const inner: string = this.parser.parseInline(tokens);
  return `<a href="${escapeHtml(href)}"${title ? ` title="${escapeHtml(title)}"` : ''}>${inner}</a>`;
};

marked.use({ extensions: [calloutExtension] });
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  })
);

marked.setOptions({
  renderer,
  gfm: true,
  breaks: false,
  pedantic: false,
});

const Markdown: FC<{ content: string }> = ({ content }) => {
  const html = marked.parse(content);
  return (
    <div
      className="markdown-content text-lg text-gray-700 mb-4"
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
};

export default Markdown;
