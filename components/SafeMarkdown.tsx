import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';

interface SafeMarkdownProps {
  content: string;
  className?: string;
  includeDirectives?: boolean;
}

const SafeMarkdown: React.FC<SafeMarkdownProps> = ({ 
  content, 
  className = "", 
  includeDirectives = false 
}) => {
  const remarkPlugins = [remarkGfm];
  if (includeDirectives) {
    remarkPlugins.push(remarkDirective);
  }

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        components={{
          // Custom components for specific elements if needed
          p: ({ children }) => <p className="mb-4">{children}</p>,
          a: ({ href, children }) => (
            <a href={href} className="underline text-blue-600 hover:text-blue-800">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default SafeMarkdown;