import React from 'react';
import { marked, Tokens } from 'marked';
import { slugify } from '@/lib/markdown';

interface TOCProps {
  content: string;
}

const TableOfContents: React.FC<TOCProps> = ({ content }) => {
  const tokens = marked.lexer(content);
  const headings = tokens
    .filter((token): token is Tokens.Heading => token.type === 'heading' && token.depth <= 3)
    .map((token) => {
        const html = marked.parseInline(token.text);
        const plainText = typeof html === 'string' ? html.replace(/<[^>]+>/g, '') : token.text;
        return {
            level: token.depth,
            text: plainText,
            id: slugify(plainText),
        };
    });

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="text-sm text-gray-700 mb-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
      <div className="text-lg font-bold mb-2 text-gray-900">目录</div>
      <ul className="space-y-1">
        {headings.map((heading, index) => (
          <li 
            key={index} 
            className={`transition-colors duration-200`}
            style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
          >
             <a 
               href={`#${heading.id}`} 
               className="text-gray-600 hover:text-amber-600 hover:underline block truncate"
               title={heading.text}
             >
               {heading.text}
             </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
