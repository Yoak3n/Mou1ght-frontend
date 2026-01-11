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
    <nav className="text-sm text-gray-700">
      <ul className="space-y-1">
        {headings.map((heading, index) => (
          <li 
            key={index} 
            className={`transition-colors duration-200`}
            style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
          >
             <a 
               href={`#${heading.id}`} 
               className="text-gray-600 hover:text-blue-600 hover:underline block truncate py-1"
               title={heading.text}
             >
               {heading.text}
             </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
