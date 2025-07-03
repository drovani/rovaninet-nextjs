import React from 'react';
import 'katex/dist/katex.min.css';

interface MathBlockProps {
  math: string;
  displayMode?: boolean;
}

const MathBlock: React.FC<MathBlockProps> = ({ math, displayMode = false }) => {
  const [renderedMath, setRenderedMath] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const renderMath = async () => {
      try {
        const katex = await import('katex');
        const html = katex.renderToString(math, {
          displayMode,
          throwOnError: false,
          errorColor: '#cc0000',
          strict: 'warn',
          trust: false
        });
        setRenderedMath(html);
        setError(null);
      } catch (err) {
        console.error('Error rendering math:', err);
        setError('Failed to render math expression');
        setRenderedMath(math);
      } finally {
        setIsLoading(false);
      }
    };

    renderMath();
  }, [math, displayMode]);

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-100 rounded ${displayMode ? 'p-4 my-4' : 'px-2 py-1 inline-block'}`}>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded p-2 ${displayMode ? 'my-4' : 'inline-block'}`}>
        <span className="text-red-600 text-sm">Math Error: {math}</span>
      </div>
    );
  }

  return (
    <div
      className={displayMode ? 'my-4 text-center' : 'inline-block'}
      dangerouslySetInnerHTML={{ __html: renderedMath }}
    />
  );
};

export default MathBlock;