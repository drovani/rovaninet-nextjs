import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import heavy components to improve initial bundle size
const SafeMarkdown = dynamic(() => import('./SafeMarkdown'), {
  loading: () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  ),
  ssr: true
});

const CodeBlock = dynamic(() => import('./CodeBlock'), {
  loading: () => (
    <div className="bg-gray-100 p-4 rounded-lg animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  ),
  ssr: false
});

const MathBlock = dynamic(() => import('./MathBlock'), {
  loading: () => (
    <div className="animate-pulse bg-gray-100 rounded p-2">
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </div>
  ),
  ssr: false
});

const MermaidDiagram = dynamic(() => import('./MermaidDiagram'), {
  loading: () => (
    <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg animate-pulse">
      <div className="text-center">
        <div className="h-8 w-8 bg-gray-200 rounded-full mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  ),
  ssr: false
});

interface DynamicMarkdownProps {
  content: string;
  className?: string;
  includeDirectives?: boolean;
  enableMath?: boolean;
  enableMermaid?: boolean;
  enableEmoji?: boolean;
}

const DynamicMarkdown: React.FC<DynamicMarkdownProps> = (props) => {
  return <SafeMarkdown {...props} />;
};

export default DynamicMarkdown;
export { CodeBlock, MathBlock, MermaidDiagram };