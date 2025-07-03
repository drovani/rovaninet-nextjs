import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import remarkEmoji from 'remark-emoji';
import rehypeKatex from 'rehype-katex';
import CodeBlock from './CodeBlock';
import MathBlock from './MathBlock';
import MermaidDiagram from './MermaidDiagram';
import 'katex/dist/katex.min.css';

interface SafeMarkdownProps {
  content: string;
  className?: string;
  includeDirectives?: boolean;
  enableMath?: boolean;
  enableMermaid?: boolean;
  enableEmoji?: boolean;
}

const SafeMarkdown: React.FC<SafeMarkdownProps> = ({ 
  content, 
  className = "", 
  includeDirectives = false,
  enableMath = true,
  enableMermaid = true,
  enableEmoji = true
}) => {
  const remarkPlugins: any[] = [remarkGfm];
  const rehypePlugins: any[] = [];
  
  if (includeDirectives) {
    remarkPlugins.push(remarkDirective);
  }
  
  if (enableMath) {
    remarkPlugins.push(remarkMath);
    rehypePlugins.push(rehypeKatex);
  }
  
  if (enableEmoji) {
    remarkPlugins.push(remarkEmoji);
  }

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          // Enhanced paragraph with better spacing
          p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
          
          // Enhanced links with better styling
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          
          // Enhanced headings with better hierarchy
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-6 mt-8 text-gray-900 border-b border-gray-200 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-4 mt-6 text-gray-900">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-medium mb-3 mt-5 text-gray-900">
              {children}
            </h3>
          ),
          
          // Enhanced lists with better spacing
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 leading-relaxed">
              {children}
            </li>
          ),
          
          // Enhanced blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 italic text-gray-700">
              {children}
            </blockquote>
          ),
          
          // Enhanced tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-gray-300">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2 text-gray-700">
              {children}
            </td>
          ),
          
          // Task lists with interactive checkboxes
          input: ({ type, checked, disabled }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  readOnly
                />
              );
            }
            return <input type={type} checked={checked} disabled={disabled} />;
          },
          
          // Code blocks with syntax highlighting
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const code = String(children).replace(/\n$/, '');
            
            // Handle Mermaid diagrams
            if (enableMermaid && language === 'mermaid') {
              return <MermaidDiagram chart={code} />;
            }
            
            // Check if this is inline code by looking at the element
            const isInline = !className || !className.includes('language-');
            
            // Handle inline code
            if (isInline) {
              return (
                <code 
                  className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            
            // Handle code blocks
            return (
              <CodeBlock
                code={code}
                language={language || 'text'}
                showLineNumbers={code.split('\n').length > 3}
              />
            );
          },
          
          // Math blocks
          div: ({ className, children }) => {
            if (className === 'math math-display') {
              return <MathBlock math={String(children)} displayMode={true} />;
            }
            return <div className={className}>{children}</div>;
          },
          
          // Inline math
          span: ({ className, children }) => {
            if (className === 'math math-inline') {
              return <MathBlock math={String(children)} displayMode={false} />;
            }
            return <span className={className}>{children}</span>;
          },
          
          // Horizontal rules
          hr: () => (
            <hr className="my-8 border-t border-gray-300" />
          ),
          
          // Enhanced images
          img: ({ src, alt, title }) => (
            <figure className="my-6 text-center">
              <img 
                src={src} 
                alt={alt} 
                title={title}
                className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                loading="lazy"
              />
              {alt && (
                <figcaption className="mt-2 text-sm text-gray-600 italic">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default SafeMarkdown;