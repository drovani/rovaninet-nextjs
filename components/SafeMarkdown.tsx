import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import remarkEmoji from 'remark-emoji';
import remarkFootnotes from 'remark-footnotes';
import rehypeKatex from 'rehype-katex';
import Image from 'next/image';
import CodeBlock from './CodeBlock';
import MathBlock from './MathBlock';
import MermaidDiagram from './MermaidDiagram';
import 'katex/dist/katex.min.css';

// Utility function to merge classNames
const cn = (...classes: (string | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

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
  const remarkPlugins: any[] = [remarkGfm, remarkFootnotes];
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
          p: ({ node, children, className, ...props }) => <p className={cn("mb-4 leading-relaxed", className)} {...props}>{children}</p>,
          
          // Enhanced links with better styling
          a: ({ node, href, children, className, ...props }) => (
            <a 
              href={href} 
              className={cn("text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors", className)}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            >
              {children}
            </a>
          ),
          
          // Enhanced headings with better hierarchy
          h1: ({ node, children, className, ...props }) => (
            <h1 className={cn("text-3xl font-bold mb-6 mt-8 text-gray-900 border-b border-gray-200 pb-2", className)} {...props}>
              {children}
            </h1>
          ),
          h2: ({ node, children, className, ...props }) => (
            <h2 className={cn("text-2xl font-semibold mb-4 mt-6 text-gray-900", className)} {...props}>
              {children}
            </h2>
          ),
          h3: ({ node, children, className, ...props }) => (
            <h3 className={cn("text-xl font-medium mb-3 mt-5 text-gray-900", className)} {...props}>
              {children}
            </h3>
          ),
          
          // Enhanced lists with better spacing
          ul: ({ node, children, className, ...props }) => (
            <ul className={cn("list-disc list-inside mb-4 space-y-2 ml-4", className)} {...props}>
              {children}
            </ul>
          ),
          ol: ({ node, children, className, ...props }) => (
            <ol className={cn("list-decimal list-inside mb-4 space-y-2 ml-4", className)} {...props}>
              {children}
            </ol>
          ),
          li: ({ node, children, className, ...props }) => (
            <li className={cn("text-gray-700 leading-relaxed", className)} {...props}>
              {children}
            </li>
          ),
          
          // Enhanced blockquotes
          blockquote: ({ node, children, className, ...props }) => (
            <blockquote className={cn("border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 italic text-gray-700", className)} {...props}>
              {children}
            </blockquote>
          ),
          
          // Enhanced tables
          table: ({ node, children, className, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className={cn("min-w-full border-collapse border border-gray-300", className)} {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ node, children, className, ...props }) => (
            <thead className={cn("bg-gray-50", className)} {...props}>
              {children}
            </thead>
          ),
          th: ({ node, children, className, ...props }) => (
            <th className={cn("border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900", className)} {...props}>
              {children}
            </th>
          ),
          td: ({ node, children, className, ...props }) => (
            <td className={cn("border border-gray-300 px-4 py-2 text-gray-700", className)} {...props}>
              {children}
            </td>
          ),
          
          // Task lists with interactive checkboxes
          input: ({ node, type, checked, disabled, className, ...props }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  className={cn("mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300", className)}
                  readOnly
                  {...props}
                />
              );
            }
            return <input type={type} checked={checked} disabled={disabled} className={className} {...props} />;
          },
          
          // Code blocks with syntax highlighting
          code: ({ className, children, ...props }) => {
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
          div: ({ node, className, children, ...props }) => {
            if (className === 'math math-display') {
              return <MathBlock math={String(children)} displayMode={true} />;
            }
            return <div className={className} {...props}>{children}</div>;
          },
          
          // Inline math
          span: ({ node, className, children, ...props }) => {
            if (className === 'math math-inline') {
              return <MathBlock math={String(children)} displayMode={false} />;
            }
            return <span className={className} {...props}>{children}</span>;
          },
          
          // Horizontal rules
          hr: ({ node, className, ...props }) => (
            <hr className={cn("my-8 border-t border-gray-300", className)} {...props} />
          ),
          
          // Enhanced images
          img: ({ src, alt, title, className }) => (
            <figure className="my-6 text-center">
              <Image 
                src={String(src || '')} 
                alt={String(alt || '')}
                title={String(title || '')}
                width={800}
                height={600}
                className={cn("max-w-full h-auto rounded-lg shadow-md mx-auto", className)}
                style={{ width: 'auto', height: 'auto' }}
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