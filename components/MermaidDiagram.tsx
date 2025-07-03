import React from 'react';

interface MermaidDiagramProps {
  chart: string;
  id?: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, id }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [svgContent, setSvgContent] = React.useState<string>('');
  const diagramId = id || `mermaid-${Math.random().toString(36).substr(2, 9)}`;

  React.useEffect(() => {
    const renderDiagram = async () => {
      try {
        const mermaid = await import('mermaid');
        
        mermaid.default.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'strict',
          themeVariables: {
            primaryColor: '#4f46e5',
            primaryTextColor: '#1f2937',
            primaryBorderColor: '#e5e7eb',
            lineColor: '#6b7280',
            sectionBkgColor: '#f3f4f6',
            altSectionBkgColor: '#ffffff',
            gridColor: '#e5e7eb',
            secondaryColor: '#e5e7eb',
            tertiaryColor: '#f9fafb'
          }
        });

        const { svg } = await mermaid.default.render(diagramId, chart);
        setSvgContent(svg);
        setError(null);
      } catch (err) {
        console.error('Error rendering Mermaid diagram:', err);
        setError('Failed to render diagram');
      } finally {
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [chart, diagramId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg animate-pulse">
        <div className="text-center">
          <div className="h-8 w-8 bg-gray-200 rounded-full mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
        <div className="flex items-center">
          <div className="text-red-600 mr-2">⚠️</div>
          <div>
            <h4 className="text-red-800 font-medium">Diagram Error</h4>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <details className="mt-2">
              <summary className="text-red-600 text-sm cursor-pointer">Show diagram source</summary>
              <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto">
                {chart}
              </pre>
            </details>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mermaid-diagram my-6 text-center">
      <div 
        className="inline-block"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
};

export default MermaidDiagram;